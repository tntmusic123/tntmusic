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
  type Reservation,
  type SiteSettings,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

type Tab = "settings" | "reservations";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const [settings, setSettings] = useState<SiteSettings>({ heroImageUrl: "" });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(getSiteSettings());
    setReservations(getReservations());
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

  const saveSettings = () => {
    const updated = updateSiteSettings({ heroImageUrl: previewUrl || settings.heroImageUrl });
    setSettings(updated);
    toast.success("배경 이미지가 저장되었습니다.");
  };

  const clearHeroImage = () => {
    const updated = updateSiteSettings({ heroImageUrl: "" });
    setSettings(updated);
    setPreviewUrl("");
    toast.success("배경 이미지가 초기화되었습니다.");
  };

  // ---- Reservations ----
  const handleStatusChange = (id: string, status: Reservation["status"]) => {
    updateReservationStatus(id, status);
    setReservations(getReservations());
    toast.success(status === "confirmed" ? "예약이 승인되었습니다." : "예약이 취소되었습니다.");
  };

  const handleDelete = (id: string) => {
    deleteReservation(id);
    setReservations(getReservations());
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

  return (
    <section className="min-h-screen pt-28 pb-20 bg-background">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">관리자 패널</h1>
            <p className="text-sm text-muted-foreground">사이트 설정 및 예약 관리</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-3 w-3" /> 사이트로 돌아가기
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "settings" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" /> 사이트 설정
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "reservations" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="h-4 w-4" /> 예약 관리
            {reservations.filter((r) => r.status === "pending").length > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {reservations.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-5 w-5 text-primary" /> 메인 히어로 배경 이미지
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Preview */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">현재 배경</Label>
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

                {/* Upload */}
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground">이미지 업로드</Label>
                  <div className="flex gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" /> 파일 선택
                    </Button>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">또는 이미지 URL 입력</Label>
                  <Input
                    placeholder="https://example.com/background.jpg"
                    value={previewUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button onClick={saveSettings} className="btn-gold gap-2 rounded-full px-6">
                    저장하기
                  </Button>
                  <Button variant="outline" onClick={clearHeroImage} className="gap-2">
                    <Trash2 className="h-4 w-4" /> 초기화
                  </Button>
                  <Link href="/" target="_blank">
                    <Button variant="ghost" className="gap-2">
                      <Eye className="h-4 w-4" /> 미리보기
                    </Button>
                  </Link>
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
      </div>
    </section>
  );
}
