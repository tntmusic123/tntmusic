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
  
  // Note Form State
  const [isComposingNote, setIsComposingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: "", category: "Notice", content: "", coverUrl: "" });
  const [isUploadingNoteImage, setIsUploadingNoteImage] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Artist Form State
  const [isComposingArtist, setIsComposingArtist] = useState(false);
  const [artistForm, setArtistForm] = useState({ name: "", voice: "", field: "성악", imageUrl: "" });
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
      const [fetchedSettings, fetchedReservations, fetchedNotes, fetchedArtists] = await Promise.all([
        getSiteSettings(),
        getReservations(),
        getNotes(),
        getArtists(),
      ]);
      setSettings(fetchedSettings as SiteSettings);
      setReservations(fetchedReservations);
      setNotes(fetchedNotes);
      setArtists(fetchedArtists);
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
      heroImageUrl: previewUrl || settings.heroImageUrl,
      aboutImageUrl: settings.aboutImageUrl || "", // 백워드
      aboutImages: settings.aboutImages || [],
      studioImages: settings.studioImages || [],
      studioPriceWeekday: settings.studioPriceWeekday || "시간당 15,000원",
      studioPriceWeekend: settings.studioPriceWeekend || "시간당 18,000원",
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
    await updateSiteSettings({ heroImageUrl: "" });
    const updatedSettings = await getSiteSettings();
    setSettings(updatedSettings as SiteSettings);
    setPreviewUrl("");
    toast.success("히어로 이미지가 초기화되었습니다.");
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
    await addArtist({
      name: artistForm.name,
      voice: artistForm.voice,
      field: artistForm.field,
      imageUrl: artistForm.imageUrl
    });
    
    const updated = await getArtists();
    setArtists(updated);
    setIsSubmittingArtist(false);
    setIsComposingArtist(false);
    setArtistForm({ name: "", voice: "", field: "성악", imageUrl: "" });
    toast.success("새 아티스트가 등록되었습니다.");
  };

  const handleArtistDelete = async (id: string) => {
    if (!confirm("정말 이 아티스트를 삭제하시겠습니까?")) return;
    await deleteArtist(id);
    const updated = await getArtists();
    setArtists(updated);
    toast.success("아티스트가 삭제되었습니다.");
  };

  return (
    <section className="min-h-screen pt-28 pb-20 bg-background">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">관리자 패널</h1>
            <p className="text-sm text-muted-foreground">사이트 설정 및 예약 관리</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-3 w-3" /> 사이트 보기
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="h-3 w-3" /> 로그아웃
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted rounded-lg p-1 overflow-x-auto select-none no-scrollbar">
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 flex min-w-[80px] flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2.5 rounded-md text-[10px] sm:text-sm font-medium transition-colors ${
              activeTab === "settings" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" /> <span className="hidden sm:inline">사이트 </span>설정
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`flex-1 flex min-w-[80px] flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2.5 rounded-md text-[10px] sm:text-sm font-medium transition-colors ${
              activeTab === "reservations" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="h-4 w-4" /> 예약<span className="hidden sm:inline"> 관리</span>
            {reservations.filter((r) => r.status === "pending").length > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                {reservations.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex-1 flex min-w-[80px] flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2.5 rounded-md text-[10px] sm:text-sm font-medium transition-colors ${
              activeTab === "inquiries" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> 문의<span className="hidden sm:inline"> 관리</span>
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 flex min-w-[80px] flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2.5 rounded-md text-[10px] sm:text-sm font-medium transition-colors ${
              activeTab === "notes" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" /> 노트<span className="hidden sm:inline"> 관리</span>
          </button>
          <button
            onClick={() => setActiveTab("artists")}
            className={`flex-1 flex min-w-[80px] flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2.5 rounded-md text-[10px] sm:text-sm font-medium transition-colors ${
              activeTab === "artists" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" /> 아티스트
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button onClick={saveSettings} className="btn-gold gap-2 rounded-full px-8 shadow-md">
                <Check className="h-4 w-4" /> 전체 설정 저장하기
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-5 w-5 text-primary" /> 메인 히어로 배경 이미지
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="h-48 rounded-xl overflow-hidden border border-border bg-navy relative">
                    {(previewUrl || settings.heroImageUrl) ? (
                      <img
                        src={previewUrl || settings.heroImageUrl}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-navy-dark to-navy flex items-center justify-center">
                        <p className="text-white/30 text-sm">기본 그라데이션 배경 (이미지 미설정)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs text-muted-foreground">이미지 URL 직접 입력</Label>
                    <Input
                      placeholder="https://example.com/background.jpg"
                      value={previewUrl || settings.heroImageUrl || ""}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={clearHeroImage} className="gap-2">
                    <Trash2 className="h-4 w-4" /> 초기화
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b border-border/50 mb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-5 w-5 text-primary" /> About 페이지 슬라이드 이미지
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">소개 페이지 상단에 노출될 여러 장의 이미지를 관리합니다.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                   {(settings.aboutImages || []).map((img, idx) => (
                     <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                        <img src={img} className="w-full h-full object-cover" alt="About Slide" />
                        <button 
                          onClick={() => removeSettingsImage("aboutImages", idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                     </div>
                   ))}
                   <button 
                    onClick={() => aboutImagesInputRef.current?.click()}
                    disabled={isUploadingAboutImages}
                    className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground"
                   >
                     <Plus className="h-6 w-6 mb-1" />
                     <span className="text-[10px]">{isUploadingAboutImages ? "업로드 중" : "추가하기"}</span>
                   </button>
                   <input 
                    ref={aboutImagesInputRef}
                    type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => handleSettingsImageUpload("aboutImages", e)}
                   />
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b border-border/50 mb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-5 w-5 text-primary" /> 스튜디오 슬라이드 이미지
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">연습실 페이지에 노출될 연습실 내부 사진들을 관리합니다.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                   {(settings.studioImages || []).map((img, idx) => (
                     <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                        <img src={img} className="w-full h-full object-cover" alt="Studio Slide" />
                        <button 
                          onClick={() => removeSettingsImage("studioImages", idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                     </div>
                   ))}
                   <button 
                    onClick={() => studioImagesInputRef.current?.click()}
                    disabled={isUploadingStudioImages}
                    className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground"
                   >
                     <Plus className="h-6 w-6 mb-1" />
                     <span className="text-[10px]">{isUploadingStudioImages ? "업로드 중" : "추가하기"}</span>
                   </button>
                   <input 
                    ref={studioImagesInputRef}
                    type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => handleSettingsImageUpload("studioImages", e)}
                   />
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="h-5 w-5 text-primary" /> 연락처 및 기본 정보 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">대표 전화번호</Label>
                    <Input
                      placeholder="010-2561-8586"
                      value={settings.contactPhone || ""}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">대표 이메일</Label>
                    <Input
                      placeholder="tntmusic@kakao.com"
                      value={settings.contactEmail || ""}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">사업장 주소</Label>
                    <Input
                      placeholder="서울특별시 강남구 논현로12길 19-6 우도빌딩 B1"
                      value={settings.contactAddress || ""}
                      onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">입금 계좌 정보</Label>
                    <Input
                      placeholder="우리은행 1005-103-980558 (최찬양)"
                      value={settings.bankInfo || ""}
                      onChange={(e) => setSettings({ ...settings, bankInfo: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-5 w-5 text-primary" /> 스튜디오 상세 정보 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">평일 요금 노출 텍스트</Label>
                    <Input
                      placeholder="예) 시간당 15,000원"
                      value={settings.studioPriceWeekday || ""}
                      onChange={(e) => setSettings({ ...settings, studioPriceWeekday: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">주말 요금 노출 텍스트</Label>
                    <Input
                      placeholder="예) 시간당 18,000원"
                      value={settings.studioPriceWeekend || ""}
                      onChange={(e) => setSettings({ ...settings, studioPriceWeekend: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">스튜디오 상세 설명</Label>
                    <Textarea
                      placeholder="스튜디오에 대한 자세한 설명을 입력하세요."
                      value={settings.studioDescription || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({ ...settings, studioDescription: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-5 w-5 text-primary" /> SEO (검색 엔진 최적화) 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">사이트 제목 (Title Tag)</Label>
                    <Input
                      placeholder="TNT Music | 성악·뮤지컬 전문 연습실"
                      value={settings.siteTitle || ""}
                      onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">사이트 설명 (Meta Description)</Label>
                    <Textarea
                      placeholder="검색 엔진에 노출될 사이트 설명을 입력하세요."
                      value={settings.siteDescription || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">키워드 (쉼표로 구분)</Label>
                    <Input
                      placeholder="성악 연습실, 뮤지컬 연습실, 논현동 연습실"
                      value={settings.siteKeywords || ""}
                      onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">아직 예약이 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              reservations
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((r) => (
                  <Card key={r.id} className="overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground">{r.name}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColor(r.status)}`}>
                              {statusLabel(r.status)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" /> {r.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" /> {r.phone}
                            </span>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {r.timeSlots.map((slot) => (
                              <span key={slot} className="text-[10px] px-2 py-0.5 bg-muted rounded-md text-muted-foreground">
                                {slot}
                              </span>
                            ))}
                          </div>
                          {r.message && <p className="text-xs text-muted-foreground mt-1">💬 {r.message}</p>}
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          {r.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(r.id, "confirmed")}
                                className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                <Check className="h-3 w-3" /> 승인
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(r.id, "cancelled")}
                                className="gap-1"
                              >
                                <X className="h-3 w-3" /> 거절
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(r.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> 모든 접수 문의
              </h2>
            </div>
            <Card>
              <CardContent className="py-16 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">현재 데이터베이스 연동 준비 중입니다.</p>
                <p className="text-xs text-muted-foreground mt-2">(Supabase 연결 후 실제 문의 폼 데이터가 노출됩니다.)</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> 블로그 노트 관리
              </h2>
              {!isComposingNote && (
                <Button onClick={() => setIsComposingNote(true)} className="btn-gold gap-2 h-9 text-sm">
                  <Plus className="h-4 w-4" /> 새 노트 작성
                </Button>
              )}
            </div>

            {isComposingNote ? (
              <Card className="border-primary/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">새 노트 작성</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                       <Label className="text-xs text-muted-foreground">제목</Label>
                       <Input 
                         placeholder="노트 제목을 입력하세요" 
                         value={noteForm.title}
                         onChange={(e) => setNoteForm(prev => ({...prev, title: e.target.value}))}
                       />
                    </div>
                    <div className="col-span-1 space-y-2">
                       <Label className="text-xs text-muted-foreground">카테고리</Label>
                       <select 
                         value={noteForm.category}
                         onChange={(e) => setNoteForm(prev => ({...prev, category: e.target.value}))}
                         className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                       >
                         <option value="Notice">Notice</option>
                         <option value="보이스 랩">보이스 랩</option>
                         <option value="오디션 인사이드">오디션 인사이드</option>
                         <option value="아티스트 인터뷰">아티스트 인터뷰</option>
                         <option value="공연 리뷰">공연 리뷰</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" /> 대표 이미지 (썸네일)
                    </Label>
                    <div className="flex items-center gap-4">
                      {noteForm.coverUrl && (
                         <div className="w-16 h-16 rounded-md overflow-hidden bg-muted border">
                           <img src={noteForm.coverUrl} className="w-full h-full object-cover" alt="Thumb" />
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
                          size="sm"
                          disabled={isUploadingNoteImage}
                          onClick={() => noteCoverInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" /> {isUploadingNoteImage ? "업로드 중..." : "이미지 추가"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">내용 (마크다운 지원)</Label>
                      <div>
                        <input ref={noteBodyInputRef} type="file" accept="image/*" className="hidden" onChange={handleNoteBodyUpload} />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-[10px] gap-1"
                          disabled={isUploadingNoteBodyImage}
                          onClick={() => noteBodyInputRef.current?.click()}
                        >
                          <ImageIcon className="h-3 w-3" /> {isUploadingNoteBodyImage ? "업로드 중..." : "본문에 이미지 추가"}
                        </Button>
                      </div>
                    </div>
                    <textarea 
                      placeholder="노트 내용을 작성해주세요. (상단 버튼으로 이미지 삽입 가능)" 
                      rows={12}
                      value={noteForm.content}
                      onChange={(e) => setNoteForm(prev => ({...prev, content: e.target.value}))}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                     <Button variant="outline" onClick={() => setIsComposingNote(false)}>취소</Button>
                     <Button className="btn-gold" disabled={isSubmittingNote} onClick={submitNote}>
                       {isSubmittingNote ? "등록 중..." : "등록하기"}
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {notes.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">아직 작성된 노트가 없습니다.</p>
                    </CardContent>
                  </Card>
                ) : (
                  notes.map(note => (
                    <Card key={note.id} className="overflow-hidden">
                      <CardContent className="p-0 flex flex-col sm:flex-row">
                        {note.coverImageUrl ? (
                          <div className="w-full sm:w-48 h-32 sm:h-auto bg-muted">
                            <img src={note.coverImageUrl} className="w-full h-full object-cover" alt={note.title} />
                          </div>
                        ) : (
                          <div className="w-full sm:w-48 h-32 sm:h-auto bg-navy flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-white/20" />
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{note.category}</span>
                              <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-foreground mb-2">{note.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => handleNoteDelete(note.id)}
                            >
                              <Trash2 className="h-4 w-4" /> 삭제
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Artists Tab */}
        {activeTab === "artists" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> 등록된 아티스트
              </h2>
              {!isComposingArtist && (
                <Button onClick={() => setIsComposingArtist(true)} className="btn-gold gap-2 h-9 text-sm">
                  <Plus className="h-4 w-4" /> 아티스트 등록
                </Button>
              )}
            </div>

            {isComposingArtist ? (
              <Card className="border-primary/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">아티스트 등록</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-xs text-muted-foreground">아티스트 이름*</Label>
                       <Input 
                         placeholder="이름 입력" 
                         value={artistForm.name}
                         onChange={(e) => setArtistForm(prev => ({...prev, name: e.target.value}))}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs text-muted-foreground">분야</Label>
                       <select 
                         value={artistForm.field}
                         onChange={(e) => setArtistForm(prev => ({...prev, field: e.target.value}))}
                         className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                       >
                         <option value="성악">성악</option>
                         <option value="뮤지컬">뮤지컬</option>
                         <option value="기타">기타</option>
                       </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                       <Label className="text-xs text-muted-foreground">세부 파트 (예: 소프라노, 테너, 뮤지컬 배우 등)</Label>
                       <Input 
                         placeholder="파트 입력" 
                         value={artistForm.voice}
                         onChange={(e) => setArtistForm(prev => ({...prev, voice: e.target.value}))}
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" /> 프로필 이미지
                    </Label>
                    <div className="flex items-center gap-4">
                      {artistForm.imageUrl && (
                         <div className="w-16 h-16 rounded-md overflow-hidden bg-muted border">
                           <img src={artistForm.imageUrl} className="w-full h-full object-cover" alt="Profile" />
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
                          size="sm"
                          disabled={isUploadingArtistImage}
                          onClick={() => artistImageInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" /> {isUploadingArtistImage ? "업로드 중..." : "이미지 추가"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                     <Button variant="outline" onClick={() => setIsComposingArtist(false)}>취소</Button>
                     <Button className="btn-gold" disabled={isSubmittingArtist} onClick={submitArtist}>
                       {isSubmittingArtist ? "등록 중..." : "등록하기"}
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {artists.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">아직 등록된 아티스트가 없습니다.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {artists.map(artist => (
                      <Card key={artist.id} className="overflow-hidden p-0">
                        <div className="aspect-[3/4] bg-muted relative">
                          {artist.imageUrl ? (
                            <img src={artist.imageUrl} className="w-full h-full object-cover" alt={artist.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-navy text-6xl font-bold text-white/5">
                              {artist.name[0]}
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-2 text-white">
                            <h3 className="font-bold text-lg">{artist.name}</h3>
                            <div className="flex gap-2 text-xs text-white/70">
                              <span>{artist.field}</span>
                              {artist.voice && <span>· {artist.voice}</span>}
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                             <Button 
                               variant="destructive" 
                               size="icon" 
                               className="h-7 w-7 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm"
                               onClick={() => handleArtistDelete(artist.id)}
                             >
                               <Trash2 className="h-3 w-3" />
                             </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
