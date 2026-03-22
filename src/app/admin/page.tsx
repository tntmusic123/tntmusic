"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  getReservations,
  updateReservationStatus,
  deleteReservation,
  getSiteSettings,
  updateSiteSettings,
  getNotes,
  deleteNote,
  addNote,
  uploadStorageImage,
  getArtists,
  addArtist,
  deleteArtist,
  type Reservation,
  type SiteSettings,
  type Note,
  type Artist,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Image as ImageIcon,
  CalendarDays,
  Trash2,
  Check,
  X,
  ArrowLeft,
  Upload,
  Eye,
  Settings,
  MessageSquare,
  FileText,
  Users,
  Plus,
  LogOut,
  Phone,
} from "lucide-react";

type Tab = "settings" | "reservations" | "inquiries" | "notes" | "artists";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const [settings, setSettings] = useState<SiteSettings>({});
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  
  // Note Form State
  const [isComposingNote, setIsComposingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: "", category: "Notice", content: "", coverUrl: "" });
  const [isUploadingNoteImage, setIsUploadingNoteImage] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Hero Image State
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);

  // Artist Form State
  const [isComposingArtist, setIsComposingArtist] = useState(false);
  const [artistForm, setArtistForm] = useState({ name: "", role: "성악", bio: "", imageUrl: "" });
  const [isUploadingArtistImage, setIsUploadingArtistImage] = useState(false);
  const [isSubmittingArtist, setIsSubmittingArtist] = useState(false);
  
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const noteCoverInputRef = useRef<HTMLInputElement>(null);
  const noteBodyInputRef = useRef<HTMLInputElement>(null);
  const artistImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImagesInputRef = useRef<HTMLInputElement>(null);
  const studioImagesInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingAboutImages, setIsUploadingAboutImages] = useState(false);
  const [isUploadingStudioImages, setIsUploadingStudioImages] = useState(false);
  const [isUploadingNoteBodyImage, setIsUploadingNoteBodyImage] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [fetchedSettings, fetchedReservations, fetchedNotes, fetchedArtists, fetchedInquiries] = await Promise.all([
        getSiteSettings(),
        getReservations(),
        getNotes(),
        getArtists(),
        import("@/lib/store").then(m => m.getInquiries())
      ]);
      setSettings(fetchedSettings as SiteSettings);
      setReservations(fetchedReservations);
      setNotes(fetchedNotes);
      setArtists(fetchedArtists);
      setInquiries(fetchedInquiries);
    }
    loadData();
  }, []);

  // ---- Settings ----
  const handleImageUrlChange = (url: string) => {
    setPreviewUrl(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = async () => {
    await updateSiteSettings({ 
      heroImageUrl: previewUrl || settings.heroImageUrl || "",
      aboutImageUrl: settings.aboutImageUrl || "", // 백워드
      aboutImages: settings.aboutImages || [],
      studioImages: settings.studioImages || [],
      studioPriceWeekday: settings.studioPriceWeekday || "시간당 15,000원",
      studioPriceWeekend: settings.studioPriceWeekend || "시간당 18,000원",
      studioDescription: settings.studioDescription || "",
      contactPhone: settings.contactPhone || "",
      contactEmail: settings.contactEmail || "",
      contactAddress: settings.contactAddress || "",
      bankInfo: settings.bankInfo || "",
      siteTitle: settings.siteTitle || "",
      siteDescription: settings.siteDescription || "",
      siteKeywords: settings.siteKeywords || "",
      adminPath: settings.adminPath || "",
      adminPassword: settings.adminPassword || "",
      noteCategories: settings.noteCategories || [],
      artistFields: settings.artistFields || [],
    });
    const updatedSettings = await getSiteSettings();
    setSettings(updatedSettings as SiteSettings);
    toast.success("사이트 설정이 저장되었습니다.");
  };

  const handleSettingsImageUpload = async (field: "aboutImages" | "studioImages", e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (field === "aboutImages") setIsUploadingAboutImages(true);
    else setIsUploadingStudioImages(true);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadStorageImage(files[i]);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      const current = settings[field] || [];
      setSettings({ ...settings, [field]: [...current, ...uploadedUrls] });
      toast.success(`${uploadedUrls.length}개의 이미지가 추가되었습니다. 저장 버튼을 눌러 확정해주세요.`);
    }

    if (field === "aboutImages") setIsUploadingAboutImages(false);
    else setIsUploadingStudioImages(false);
  };

  const removeSettingsImage = (field: "aboutImages" | "studioImages", index: number) => {
    const current = [...(settings[field] || [])];
    current.splice(index, 1);
    setSettings({ ...settings, [field]: current });
  };

  const clearHeroImage = async () => {
    if (!confirm("히어로 이미지를 초기화하시겠습니까?")) return;
    await updateSiteSettings({ heroImageUrl: "" });
    const updatedSettings = await getSiteSettings();
    setSettings(updatedSettings as SiteSettings);
    setPreviewUrl("");
    toast.success("히어로 이미지가 초기화되었습니다.");
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeroImage(true);
    const url = await uploadStorageImage(file);
    if (url) {
      setPreviewUrl(url);
      setSettings(prev => ({ ...prev, heroImageUrl: url }));
      toast.success("히어로 이미지가 업로드되었습니다. 저장 버튼을 눌러 확정해주세요.");
    } else {
      toast.error("이미지 업로드에 실패했습니다.");
    }
    setIsUploadingHeroImage(false);
  };

  const handleLogout = async () => {
    const { logout } = await import("./logout-action");
    await logout();
  };

  // ---- Reservations ----
  const handleStatusChange = async (id: string, status: Reservation["status"]) => {
    await updateReservationStatus(id, status);
    const updated = await getReservations();
    setReservations(updated);
    toast.success(status === "confirmed" ? "예약이 승인되었습니다." : "예약이 취소되었습니다.");
  };

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
    const updated = await getReservations();
    setReservations(updated);
    toast.success("예약이 삭제되었습니다.");
  };

  const statusLabel = (s: Reservation["status"]) => {
    switch (s) {
      case "pending": return "대기";
      case "confirmed": return "승인";
      case "cancelled": return "취소";
    }
  };

  const statusColor = (s: Reservation["status"]) => {
    switch (s) {
      case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
      case "confirmed": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/30";
    }
  };

  // ---- Notes ----
  const handleNoteUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingNoteImage(true);
    const url = await uploadStorageImage(file);
    if (url) {
      setNoteForm(prev => ({ ...prev, coverUrl: url }));
      toast.success("대표 이미지가 업로드되었습니다.");
    } else {
      toast.error("이미지 업로드에 실패했습니다.");
    }
    setIsUploadingNoteImage(false);
  };

  const handleNoteBodyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingNoteBodyImage(true);
    const url = await uploadStorageImage(file);
    if (url) {
      const imageMarkdown = `\n![image](${url})\n`;
      setNoteForm(prev => ({ ...prev, content: prev.content + imageMarkdown }));
      toast.success("본문에 이미지가 삽입되었습니다.");
    } else {
      toast.error("이미지 업로드에 실패했습니다.");
    }
    setIsUploadingNoteBodyImage(false);
  };

  const submitNote = async () => {
    if (!noteForm.title || !noteForm.content) {
      toast.error("노트 제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmittingNote(true);
    await addNote({
      title: noteForm.title,
      category: noteForm.category,
      content: noteForm.content,
      coverImageUrl: noteForm.coverUrl
    });
    
    const updated = await getNotes();
    setNotes(updated);
    setIsSubmittingNote(false);
    setIsComposingNote(false);
    setNoteForm({ title: "", category: "Notice", content: "", coverUrl: "" });
    toast.success("새 노트가 작성되었습니다.");
  };

  const handleNoteDelete = async (id: string) => {
    if (!confirm("정말 이 노트를 삭제하시겠습니까?")) return;
    await deleteNote(id);
    const updated = await getNotes();
    setNotes(updated);
    toast.success("노트가 삭제되었습니다.");
  };

  // ---- Artists ----
  const handleArtistImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingArtistImage(true);
    const url = await uploadStorageImage(file);
    if (url) {
      setArtistForm(prev => ({ ...prev, imageUrl: url }));
      toast.success("아티스트 이미지가 업로드되었습니다.");
    } else {
      toast.error("이미지 업로드에 실패했습니다.");
    }
    setIsUploadingArtistImage(false);
  };

  const submitArtist = async () => {
    if (!artistForm.name) {
      toast.error("아티스트 이름을 입력해주세요.");
      return;
    }
    
    setIsSubmittingArtist(true);
    try {
      await addArtist({
        name: artistForm.name,
        role: artistForm.role,
        bio: artistForm.bio,
        imageUrl: artistForm.imageUrl
      });
      
      const updated = await getArtists();
      setArtists(updated);
      setIsSubmittingArtist(false);
      setIsComposingArtist(false);
      setArtistForm({ name: "", role: "성악", bio: "", imageUrl: "" });
      toast.success("새 아티스트가 등록되었습니다.");
    } catch (err: any) {
      console.error(err);
      toast.error(`저장 실패: ${err.message || "오류가 발생했습니다."}`);
      setIsSubmittingArtist(false);
    }
  };

  const handleArtistDelete = async (id: string) => {
    if (!confirm("정말 이 아티스트를 삭제하시겠습니까?")) return;
    await deleteArtist(id);
    const updated = await getArtists();
    setArtists(updated);
    toast.success("아티스트가 삭제되었습니다.");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-primary/30">
      {/* Sidebar - Premium Design */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col flex-shrink-0 z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <h1 className="text-xl font-bold tracking-wider text-white">TNT ADMIN</h1>
          <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/30">PRO</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: "settings", label: "사이트 설정", icon: <Settings className="h-4 w-4" /> },
            { id: "reservations", label: "예약 관리", icon: <CalendarDays className="h-4 w-4" />, count: reservations.filter((r) => r.status === "pending").length },
            { id: "inquiries", label: "문의 내역", icon: <MessageSquare className="h-4 w-4" /> },
            { id: "notes", label: "노트 (블로그)", icon: <FileText className="h-4 w-4" /> },
            { id: "artists", label: "아티스트", icon: <Users className="h-4 w-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(200,160,80,0.3)] border border-primary/50" 
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon} {tab.label}
              </div>
              {!!tab.count && (
                <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/50">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-transparent">
            <Eye className="h-4 w-4" /> 사이트 뷰어
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start px-4 py-3 h-auto text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent">
            <LogOut className="h-4 w-4 mr-3" /> 로그아웃
          </Button>
        </div>
      </aside>

      {/* Main Premium Dashboard Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-slate-950 to-slate-950 pointer-events-none" />
        
        <header className="px-6 py-4 md:px-8 md:py-6 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h2 className="text-xl md:text-2xl font-bold text-white capitalize flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full hidden md:block" />
              {activeTab === "settings" && "사이트 메뉴 및 설정"}
              {activeTab === "reservations" && "예약 통합 관리"}
              {activeTab === "inquiries" && "고객 문의 내역"}
              {activeTab === "notes" && "블로그 및 노트"}
              {activeTab === "artists" && "아티스트 DB"}
            </h2>
            <div className="md:hidden">
               <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-red-400 h-8">
                 <LogOut className="h-4 w-4" />
               </Button>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto select-none pb-1 no-scrollbar w-full">
             {[
               { id: "settings", label: "설정" },
               { id: "reservations", label: "예약" },
               { id: "inquiries", label: "문의" },
               { id: "notes", label: "노트" },
               { id: "artists", label: "아티스트" }
             ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as Tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                    activeTab === t.id ? "bg-primary border-primary text-black" : "bg-slate-800/50 border-slate-700 text-slate-300"
                  }`}
                >
                  {t.label} 
                  {t.id === "reservations" && reservations.filter(r => r.status === "pending").length > 0 && 
                    <span className="ml-1 text-[10px] text-red-400 font-bold">•</span>
                  }
                </button>
             ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          <div className="max-w-6xl mx-auto pb-32">

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-xl sticky top-20 z-20">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                  <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/30">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  웹사이트 전체 관리
                </h2>
                <p className="text-sm text-slate-400 mt-2 pl-14">웹사이트의 핵심 설정과 콘텐츠를 중앙에서 제어합니다.</p>
              </div>
              <Button onClick={saveSettings} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(200,160,80,0.4)] gap-2 h-12 px-8 rounded-xl font-bold transition-all hover:scale-105 text-base">
                <Check className="h-5 w-5" /> 전체 설정 저장하기
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="bg-slate-900/60 border-slate-800/80 shadow-xl backdrop-blur-xl">
                  <CardHeader className="border-b border-slate-800/50 pb-5">
                    <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
                      <span className="w-1.5 h-5 bg-primary rounded-full" /> 메인 히어로 배경 이미지
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div>
                      <div className="h-48 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950 relative shadow-inner group">
                        {(previewUrl || settings.heroImageUrl) ? (
                          <img
                            src={previewUrl || settings.heroImageUrl}
                            alt="Hero Background"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center gap-3">
                            <ImageIcon className="h-10 w-10 text-slate-700" />
                            <p className="text-slate-500 text-sm font-medium">배경 이미지가 설정되지 않았습니다</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-end bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                      <div className="flex-1 w-full space-y-2">
                        <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">이미지 URL 또는 직접 업로드</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/background.jpg"
                            value={previewUrl || settings.heroImageUrl || ""}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl"
                          />
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                          <Button 
                            variant="secondary" 
                            disabled={isUploadingHeroImage}
                            onClick={() => fileInputRef.current?.click()}
                            className="h-11 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white flex-shrink-0 text-slate-300"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" onClick={clearHeroImage} className="gap-2 h-11 rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full sm:w-auto">
                        <Trash2 className="h-4 w-4" /> 초기화
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/60 border-slate-800/80 shadow-xl backdrop-blur-xl">
                  <CardHeader className="border-b border-slate-800/50 pb-5">
                    <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
                      <span className="w-1.5 h-5 bg-primary rounded-full" /> 연락처 및 기본 정보 관리
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary"/> 대표 전화번호</Label>
                        <Input
                          placeholder="010-2561-8586"
                          value={settings.contactPhone || ""}
                          onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                          className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">대표 이메일</Label>
                        <Input
                          placeholder="tntmusic@kakao.com"
                          value={settings.contactEmail || ""}
                          onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                          className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">사업장 주소</Label>
                        <Input
                          placeholder="서울특별시 강남구 논현로12길 19-6 우도빌딩 B1"
                          value={settings.contactAddress || ""}
                          onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                          className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">입금 계좌 정보</Label>
                        <Input
                          placeholder="우리은행 1005-103-980558 (최찬양)"
                          value={settings.bankInfo || ""}
                          onChange={(e) => setSettings({ ...settings, bankInfo: e.target.value })}
                          className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/60 border-slate-800/80 shadow-xl backdrop-blur-xl shrink-0">
                  <CardHeader className="border-b border-slate-800/50 pb-5">
                    <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
                      <span className="w-1.5 h-5 bg-primary rounded-full" /> SEO (검색 엔진 최적화) 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">사이트 제목 (Title Tag)</Label>
                      <Input
                        placeholder="TNT Music | 성악·뮤지컬 전문 연습실"
                        value={settings.siteTitle || ""}
                        onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                        className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">사이트 설명 (Meta Description)</Label>
                      <Textarea
                        placeholder="검색 엔진에 노출될 사이트 설명을 입력하세요."
                        value={settings.siteDescription || ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({ ...settings, siteDescription: e.target.value })}
                        rows={3}
                        className="bg-slate-950/50 border-slate-700/50 text-white focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl custom-scrollbar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">검색 키워드 (쉼표로 구분)</Label>
                      <Input
                        placeholder="성악 연습실, 뮤지컬 연습실, 논현동 연습실"
                        value={settings.siteKeywords || ""}
                        onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                        className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8 flex flex-col">
                <Card className="bg-slate-900/60 border-slate-800/80 shadow-xl backdrop-blur-xl">
                  <CardHeader className="border-b border-slate-800/50 pb-5">
                    <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
                      <span className="w-1.5 h-5 bg-primary rounded-full" /> About 페이지 슬라이드 이미지
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-2">소개 페이지 상단에 롤링 페이퍼처럼 노출될 역동적인 이미지들입니다.</p>
                  </CardHeader>
                  <CardContent className="pt-6">
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                       {(settings.aboutImages || []).map((img, idx) => (
                         <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950 shadow-inner">
                            <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="About Slide" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button 
                              onClick={() => removeSettingsImage("aboutImages", idx)}
                              className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 backdrop-blur-md text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                         </div>
                       ))}
                       <button 
                        onClick={() => aboutImagesInputRef.current?.click()}
                        disabled={isUploadingAboutImages}
                        className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 hover:border-primary/50 bg-slate-950/30 hover:bg-slate-950 transition-all text-slate-500 hover:text-primary group"
                       >
                         <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                         <span className="text-xs font-medium">{isUploadingAboutImages ? "처리 중..." : "이미지 추가"}</span>
                       </button>
                       <input 
                        ref={aboutImagesInputRef}
                        type="file" multiple accept="image/*" className="hidden" 
                        onChange={(e) => handleSettingsImageUpload("aboutImages", e)}
                       />
                     </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/60 border-slate-800/80 shadow-xl backdrop-blur-xl">
                  <CardHeader className="border-b border-slate-800/50 pb-5">
                    <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
                      <span className="w-1.5 h-5 bg-primary rounded-full" /> 스튜디오 전경 슬라이드 이미지
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-2">연습실 페이지에 노출되어 시설의 분위기를 나타낼 사진들을 관리합니다.</p>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {(settings.studioImages || []).map((img, idx) => (
                          <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950 shadow-inner">
                             <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Studio Slide" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <button 
                               onClick={() => removeSettingsImage("studioImages", idx)}
                               className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 backdrop-blur-md text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100"
                             >
                               <X className="h-3 w-3" />
                             </button>
                          </div>
                        ))}
                        <button 
                         onClick={() => studioImagesInputRef.current?.click()}
                         disabled={isUploadingStudioImages}
                         className="aspect-video flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 hover:border-primary/50 bg-slate-950/30 hover:bg-slate-950 transition-all text-slate-500 hover:text-primary group"
                        >
                          <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium">{isUploadingStudioImages ? "처리 중..." : "이미지 추가"}</span>
                        </button>
                        <input 
                         ref={studioImagesInputRef}
                         type="file" multiple accept="image/*" className="hidden" 
                         onChange={(e) => handleSettingsImageUpload("studioImages", e)}
                        />
                      </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/60 border-slate-800/80 shadow-xl backdrop-blur-xl">
                  <CardHeader className="border-b border-slate-800/50 pb-5">
                    <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
                      <span className="w-1.5 h-5 bg-primary rounded-full" /> 스튜디오 상세 정보 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-slate-500"/> 평일 요금 텍스트</Label>
                        <Input
                          placeholder="예) 시간당 15,000원"
                          value={settings.studioPriceWeekday || ""}
                          onChange={(e) => setSettings({ ...settings, studioPriceWeekday: e.target.value })}
                          className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-primary"/> 주말 요금 텍스트</Label>
                        <Input
                          placeholder="예) 시간당 18,000원"
                          value={settings.studioPriceWeekend || ""}
                          onChange={(e) => setSettings({ ...settings, studioPriceWeekend: e.target.value })}
                          className="bg-slate-950/50 border-slate-700/50 text-white h-11 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">스튜디오 상세 설명</Label>
                        <Textarea
                          placeholder="스튜디오에 대한 자세한 설명을 자유롭게 입력하세요."
                          value={settings.studioDescription || ""}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({ ...settings, studioDescription: e.target.value })}
                          rows={4}
                          className="bg-slate-950/50 border-slate-700/50 text-white focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl custom-scrollbar leading-relaxed"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-slate-900/80 border-red-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
              <CardHeader className="border-b border-red-500/20 pb-5">
                <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
                  <span className="w-1.5 h-5 bg-red-500 rounded-full" /> 관리자 고급 설정 <span className="text-xs font-normal text-red-400 ml-2 px-2.5 py-1 bg-red-500/10 rounded-full border border-red-500/20">보안 및 시스템 구조 제어</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-300 font-bold uppercase tracking-wider flex justify-between items-center">
                        관리자 접속 고유 주소
                        <span className="text-[10px] text-primary lowercase">기본값: admin</span>
                      </Label>
                      <Input
                        placeholder="admin"
                        value={settings.adminPath || "admin"}
                        onChange={(e) => setSettings({ ...settings, adminPath: e.target.value })}
                        className="bg-slate-950/80 border-red-500/30 text-white h-12 focus-visible:ring-red-500/50 placeholder:text-slate-600 rounded-xl font-mono"
                      />
                      <p className="text-[11px] text-red-400 leading-tight">
                        ※ 보안을 위해 주소를 커스텀할 수 있습니다. 변경 후에는 반드시 새 주소(예: <span className="font-mono text-white">/{settings.adminPath || "admin"}</span>)로 접속해야 합니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-300 font-bold uppercase tracking-wider flex justify-between items-center">
                        관리자 마스터 비밀번호
                      </Label>
                      <Input
                        type="text"
                        placeholder="새 비밀번호 입력"
                        value={settings.adminPassword || "tntmusic123"}
                        onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                        className="bg-slate-950/80 border-slate-700/50 text-white h-12 focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-300 font-bold uppercase tracking-wider">노트(게시판) 카테고리 태그 모음</Label>
                      <Textarea
                        placeholder="Notice, 보이스 랩, 공연 리뷰"
                        value={settings.noteCategories ? settings.noteCategories.join(', ') : ""}
                        onChange={(e) => {
                          const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setSettings({ ...settings, noteCategories: arr });
                        }}
                        rows={2}
                        className="bg-slate-950/50 border-slate-700/50 text-white focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl custom-scrollbar"
                      />
                      <p className="text-[11px] text-slate-500">쉼표(,)로 구분하여 카테고리 항목을 엽니다. (예: 공지사항, 리뷰)</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-300 font-bold uppercase tracking-wider">아티스트 활동 분야 모음</Label>
                      <Textarea
                        placeholder="성악, 뮤지컬, 악기, 기타"
                        value={settings.artistFields ? settings.artistFields.join(', ') : ""}
                        onChange={(e) => {
                          const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setSettings({ ...settings, artistFields: arr });
                        }}
                        rows={2}
                        className="bg-slate-950/50 border-slate-700/50 text-white focus-visible:ring-primary/50 placeholder:text-slate-600 rounded-xl custom-scrollbar"
                      />
                      <p className="text-[11px] text-slate-500">쉼표(,)로 구분하여 아티스트 분야를 엽니다. (예: 성악, 뮤지컬배우)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {reservations.length === 0 ? (
              <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md">
                <CardContent className="py-32 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 shadow-inner border border-slate-700/50">
                    <CalendarDays className="h-10 w-10 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">접수된 예약이 없습니다</h3>
                  <p className="text-slate-400 max-w-sm">신규 예약이 들어오면 이곳에서 승인 또는 거절 처리를 할 수 있습니다.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/90 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-5 font-semibold tracking-wider">예약자 정보</th>
                        <th className="px-6 py-5 font-semibold tracking-wider">일정 및 시간</th>
                        <th className="px-6 py-5 font-semibold tracking-wider">상태</th>
                        <th className="px-6 py-5 font-semibold tracking-wider text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {reservations
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((r) => (
                          <tr key={r.id} className="hover:bg-slate-800/40 transition-colors group">
                            <td className="px-6 py-6 align-top">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-200 text-base tracking-tight">{r.name}</span>
                                <span className="text-slate-400 flex items-center gap-1.5 mt-1.5 text-xs font-medium">
                                  <Phone className="w-3 h-3 text-slate-500" /> {r.phone}
                                </span>
                                {r.message && (
                                  <div className="mt-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 text-slate-400 text-xs leading-relaxed max-w-xs group-hover:bg-slate-950 transition-colors">
                                    <span className="font-semibold text-primary/70 mr-1">요청사항:</span> {r.message}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-6 align-top">
                              <div className="flex flex-col gap-3">
                                <span className="font-semibold text-slate-200 flex items-center gap-2 bg-slate-800/50 w-max px-3 py-1.5 rounded-lg border border-slate-700/50">
                                  <CalendarDays className="w-4 h-4 text-primary" /> {r.date}
                                </span>
                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                  {r.timeSlots.map((slot) => (
                                    <span key={slot} className="text-[10px] font-medium px-2.5 py-1 bg-slate-950 text-slate-300 rounded-md border border-slate-800 shadow-sm">
                                      {slot}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6 align-top">
                              <span className={`text-[11px] px-3 py-1.5 rounded-full font-bold tracking-wide shadow-sm flex items-center w-max gap-2 ${
                                r.status === "pending" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                r.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}>
                                {r.status === "pending" && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_5px_rgba(250,204,21,0.8)]" />}
                                {r.status === "confirmed" && <Check className="w-3.5 h-3.5" />}
                                {r.status === "cancelled" && <X className="w-3.5 h-3.5" />}
                                {statusLabel(r.status)}
                              </span>
                            </td>
                            <td className="px-6 py-6 text-right align-top">
                              <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                {r.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusChange(r.id, "confirmed")}
                                      className="h-8 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50 rounded-lg shadow-none"
                                    >
                                      승인
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusChange(r.id, "cancelled")}
                                      className="h-8 bg-transparent hover:bg-slate-800 text-slate-400 border border-slate-700 rounded-lg shadow-none"
                                    >
                                      거절
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(r.id)}
                                  className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                고객 문의 통합 내역
              </h2>
            </div>

            {inquiries.length === 0 ? (
              <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md">
                <CardContent className="py-32 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 shadow-md border border-slate-700/50">
                    <MessageSquare className="h-10 w-10 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">접수된 문의가 없습니다</h3>
                  <p className="text-slate-400 max-w-sm">웹사이트의 상담 신청 폼을 통해 접수된 내역이 여기에 표시됩니다.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/90 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-5 font-semibold tracking-wider">고객 정보</th>
                        <th className="px-6 py-5 font-semibold tracking-wider">문의 내용</th>
                        <th className="px-6 py-5 font-semibold tracking-wider">접수일</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-800/40 transition-colors group">
                          <td className="px-6 py-6 align-top">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-200 text-base tracking-tight">{inq.name}</span>
                              <span className="text-slate-400 flex items-center gap-1.5 mt-1.5 text-xs">
                                <Phone className="w-3 h-3 text-slate-500" /> {inq.phone}
                              </span>
                              {inq.email && <span className="text-[11px] text-slate-500 mt-1">{inq.email}</span>}
                              <div className="mt-2 text-[10px] w-max px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{inq.type}</div>
                            </div>
                          </td>
                          <td className="px-6 py-6 align-top">
                            <div className="max-w-md">
                              {inq.message ? (
                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{inq.message}</p>
                              ) : (
                                <span className="text-slate-600 italic">내용 없음</span>
                              )}
                              {inq.sourceUrl && (
                                <p className="text-[10px] text-primary/50 mt-3 truncate">유입 경로: {inq.sourceUrl}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-6 align-top whitespace-nowrap text-slate-500 text-xs">
                            {new Date(inq.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                블로그 노트 관리
              </h2>
              {!isComposingNote && (
                <Button onClick={() => setIsComposingNote(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(200,160,80,0.4)] gap-2 h-10 px-5 rounded-xl font-bold transition-all hover:scale-105">
                  <Plus className="h-4 w-4" /> 새 노트 작성
                </Button>
              )}
            </div>

            {isComposingNote ? (
              <Card className="bg-slate-900/80 border-slate-800/80 shadow-2xl backdrop-blur-xl">
                <CardHeader className="border-b border-slate-800/50 pb-4">
                  <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-primary rounded-full" /> 새 노트 작성
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                       <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">제목</Label>
                       <Input 
                         placeholder="노트 제목을 입력하세요" 
                         value={noteForm.title}
                         onChange={(e) => setNoteForm(prev => ({...prev, title: e.target.value}))}
                         className="bg-slate-950/50 border-slate-700/50 text-white h-12 focus-visible:ring-primary/50 text-lg placeholder:text-slate-600 rounded-xl"
                       />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                       <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">카테고리</Label>
                       <select 
                         value={noteForm.category}
                         onChange={(e) => setNoteForm(prev => ({...prev, category: e.target.value}))}
                         className="flex h-12 w-full rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-2 text-white focus-visible:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-slate-900 appearance-none"
                       >
                         {(settings.noteCategories || ["Notice"]).map(cat => (
                           <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                         ))}
                       </select>
                    </div>
                  </div>

                  <div className="space-y-3 p-5 rounded-2xl bg-slate-950/30 border border-slate-800/50">
                    <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" /> 썸네일 (대표 이미지)
                    </Label>
                    <div className="flex items-center gap-6 mt-2">
                      {noteForm.coverUrl ? (
                         <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50 shadow-lg relative group">
                           <img src={noteForm.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Thumb" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-red-400" onClick={() => setNoteForm(prev => ({...prev, coverUrl: ""}))}><X className="h-4 w-4"/></Button>
                           </div>
                         </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center text-slate-500 gap-2">
                          <ImageIcon className="h-6 w-6 opacity-50" />
                        </div>
                      )}
                      <div>
                        <input
                          ref={noteCoverInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleNoteUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isUploadingNoteImage}
                          onClick={() => noteCoverInputRef.current?.click()}
                          className="gap-2 bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl"
                        >
                          <Upload className="h-4 w-4" /> {isUploadingNoteImage ? "업로드 중..." : "이미지 업로드"}
                        </Button>
                        <p className="text-[10px] text-slate-500 mt-2">권장 크기: 16:9 비율 (1200x675px)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">본문 내용 (마크다운 지원)</Label>
                      <div>
                        <input ref={noteBodyInputRef} type="file" accept="image/*" className="hidden" onChange={handleNoteBodyUpload} />
                        <Button 
                          type="button" 
                          variant="secondary" 
                          size="sm" 
                          className="h-8 gap-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs"
                          disabled={isUploadingNoteBodyImage}
                          onClick={() => noteBodyInputRef.current?.click()}
                        >
                          <ImageIcon className="h-3.5 w-3.5" /> {isUploadingNoteBodyImage ? "업로드 중..." : "본문에 이미지 삽입"}
                        </Button>
                      </div>
                    </div>
                    <textarea 
                      placeholder="노트 내용을 자유롭게 작성해주세요..." 
                      rows={14}
                      value={noteForm.content}
                      onChange={(e) => setNoteForm(prev => ({...prev, content: e.target.value}))}
                      className="flex w-full rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus-visible:outline-none focus:ring-2 focus:ring-primary/50 custom-scrollbar leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-6 border-t border-slate-800/50">
                     <Button variant="ghost" onClick={() => setIsComposingNote(false)} className="text-slate-400 hover:text-white px-6">취소</Button>
                     <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform" disabled={isSubmittingNote} onClick={submitNote}>
                       {isSubmittingNote ? "등록 중..." : "노트 발행하기"}
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {notes.length === 0 ? (
                  <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md">
                    <CardContent className="py-32 text-center flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 shadow-inner border border-slate-700/50">
                        <FileText className="h-10 w-10 text-slate-500" />
                      </div>
                      <p className="text-xl font-bold text-white mb-2 tracking-tight">작성된 노트가 없습니다</p>
                      <p className="text-slate-400 max-w-sm leading-relaxed">새로운 공지사항이나 블로그 포스트를 작성하여 고객들과 소통해보세요.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {notes.map(note => (
                      <Card key={note.id} className="overflow-hidden bg-slate-900/40 border-slate-800/80 hover:border-primary/50 transition-all duration-300 group shadow-lg flex flex-col rounded-2xl">
                        <div className="relative aspect-video bg-slate-950 overflow-hidden">
                          {note.coverImageUrl ? (
                            <img src={note.coverImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" alt={note.title} />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/80">
                              <ImageIcon className="h-10 w-10 text-slate-800 mb-2" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                             <span className="text-[10px] px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-medium border border-white/10 shadow-xl">{note.category}</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col justify-between bg-slate-900/60 relative backdrop-blur-md">
                          <div>
                            <span className="text-[10px] text-slate-500 mb-2 block font-medium tracking-wider">{new Date(note.createdAt).toLocaleDateString()}</span>
                            <h3 className="font-bold text-white text-lg leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">{note.title}</h3>
                            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{note.content}</p>
                          </div>
                          <div className="flex justify-end mt-6 pt-4 border-t border-slate-800/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                              onClick={() => handleNoteDelete(note.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> 삭제
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Artists Tab */}
        {activeTab === "artists" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                소속 아티스트 데이터베이스
              </h2>
              {!isComposingArtist && (
                <Button onClick={() => setIsComposingArtist(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(200,160,80,0.4)] gap-2 h-10 px-5 rounded-xl font-bold transition-all hover:scale-105">
                  <Plus className="h-4 w-4" /> 신규 아티스트 등록
                </Button>
              )}
            </div>

            {isComposingArtist ? (
              <Card className="bg-slate-900/80 border-slate-800/80 shadow-2xl backdrop-blur-xl">
                <CardHeader className="border-b border-slate-800/50 pb-4">
                  <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-primary rounded-full" /> 신규 아티스트 프로필 작성
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">아티스트 이름 <span className="text-red-400">*</span></Label>
                       <Input 
                         placeholder="이름 입력" 
                         value={artistForm.name}
                         onChange={(e) => setArtistForm(prev => ({...prev, name: e.target.value}))}
                         className="bg-slate-950/50 border-slate-700/50 text-white h-12 focus-visible:ring-primary/50 text-base placeholder:text-slate-600 rounded-xl"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">음악 분야 (카테고리)</Label>
                       <select 
                         value={artistForm.role}
                         onChange={(e) => setArtistForm(prev => ({...prev, role: e.target.value}))}
                         className="flex h-12 w-full rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-2 text-white focus-visible:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-slate-900 appearance-none"
                       >
                         {(settings.artistFields || ["성악", "뮤지컬", "기타"]).map(field => (
                           <option key={field} value={field} className="bg-slate-900 text-white">{field}</option>
                         ))}
                       </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">아티스트 소개 및 세부 포지션 (선택)</Label>
                       <Input 
                         placeholder="예: 소프라노, 테너, 피아니스트 등" 
                         value={artistForm.bio}
                         onChange={(e) => setArtistForm(prev => ({...prev, bio: e.target.value}))}
                         className="bg-slate-950/50 border-slate-700/50 text-white h-12 focus-visible:ring-primary/50 text-base placeholder:text-slate-600 rounded-xl"
                       />
                    </div>
                  </div>

                  <div className="space-y-3 p-5 rounded-2xl bg-slate-950/30 border border-slate-800/50">
                    <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" /> 공식 프로필 이미지
                    </Label>
                    <div className="flex items-center gap-6 mt-2">
                      {artistForm.imageUrl ? (
                         <div className="w-24 h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50 shadow-lg relative group">
                           <img src={artistForm.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Profile" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-red-400" onClick={() => setArtistForm(prev => ({...prev, imageUrl: ""}))}><X className="h-4 w-4"/></Button>
                           </div>
                         </div>
                      ) : (
                        <div className="w-24 h-32 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center text-slate-500 gap-2">
                          <Users className="h-8 w-8 opacity-50 mb-1" />
                          <span className="text-[10px] font-medium">3:4 비율</span>
                        </div>
                      )}
                      <div>
                        <input
                          ref={artistImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleArtistImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isUploadingArtistImage}
                          onClick={() => artistImageInputRef.current?.click()}
                          className="gap-2 bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl"
                        >
                          <Upload className="h-4 w-4" /> {isUploadingArtistImage ? "업로드 중..." : "고화질 사진 첨부"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-6 border-t border-slate-800/50">
                     <Button variant="ghost" onClick={() => setIsComposingArtist(false)} className="text-slate-400 hover:text-white px-6">등록 취소</Button>
                     <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform" disabled={isSubmittingArtist} onClick={submitArtist}>
                       {isSubmittingArtist ? "등록 중..." : "프로필 등록하기"}
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {artists.length === 0 ? (
                  <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md">
                    <CardContent className="py-32 text-center flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 shadow-inner border border-slate-700/50">
                        <Users className="h-10 w-10 text-slate-500" />
                      </div>
                      <p className="text-xl font-bold text-white mb-2 tracking-tight">등록된 아티스트가 없습니다</p>
                      <p className="text-slate-400 max-w-sm leading-relaxed">새로운 아티스트 프로필을 등록하여 포트폴리오를 채워보세요.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {artists.map(artist => (
                      <div key={artist.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(200,160,80,0.2)]">
                        {artist.imageUrl ? (
                          <img src={artist.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" alt={artist.name} />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800">
                            <span className="text-7xl font-bold text-slate-800/50 font-serif">{artist.name[0]}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                        
                        <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-primary uppercase w-max rounded-md border border-primary/30 px-2.5 py-1 bg-primary/10 backdrop-blur-md">{artist.role}</span>
                            <div>
                              <h3 className="font-bold text-xl text-white tracking-tight leading-tight">{artist.name}</h3>
                              {artist.bio && <span className="text-xs text-slate-300 font-medium block mt-1 line-clamp-2">{artist.bio}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-3 right-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                           <Button 
                             variant="destructive" 
                             size="icon" 
                             className="h-8 w-8 rounded-full bg-red-500/80 hover:bg-red-500 backdrop-blur-md shadow-xl border border-red-400/30"
                             onClick={() => handleArtistDelete(artist.id)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
          </div>
        </div>
      </main>
    </div>
  );
}
