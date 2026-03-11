"use client";

// ============================================
// TNT Music — 클라이언트 사이드 데이터 스토어
// Supabase 연동 전까지 localStorage로 데이터 관리
// ============================================

export interface Reservation {
  id: string;
  date: string; // yyyy-MM-dd
  timeSlots: string[];
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface SiteSettings {
  heroImageUrl: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

const RESERVATIONS_KEY = "tnt_reservations";
const SETTINGS_KEY = "tnt_site_settings";

// ---- Reservations ----

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(RESERVATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addReservation(
  reservation: Omit<Reservation, "id" | "status" | "createdAt">
): Reservation {
  const newReservation: Reservation = {
    ...reservation,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const reservations = getReservations();
  reservations.push(newReservation);
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  return newReservation;
}

export function updateReservationStatus(
  id: string,
  status: Reservation["status"]
) {
  const reservations = getReservations();
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx !== -1) {
    reservations[idx].status = status;
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  }
}

export function deleteReservation(id: string) {
  const reservations = getReservations().filter((r) => r.id !== id);
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

/** 특정 날짜에 이미 예약된 시간대 목록 반환 */
export function getBookedSlots(date: string): string[] {
  const reservations = getReservations();
  return reservations
    .filter(
      (r) => r.date === date && (r.status === "pending" || r.status === "confirmed")
    )
    .flatMap((r) => r.timeSlots);
}

// ---- Site Settings ----

const defaultSettings: SiteSettings = {
  heroImageUrl: "",
  heroTitle: "당신의 예술이 완성되는 공간",
  heroSubtitle:
    "성악과 뮤지컬 전문가를 위한 프리미엄 연습실, 그리고 아티스트의 무대를 연결하는 에이전시.",
};

export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
}

export function updateSiteSettings(settings: Partial<SiteSettings>) {
  const current = getSiteSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}
