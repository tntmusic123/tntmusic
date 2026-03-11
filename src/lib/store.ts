import { createClient } from "./supabase";

const supabase = createClient();

// ============================================
// TNT Music — Supabase 연동 클라이언트 사이드 데이터 스토어
// ============================================

export interface Reservation {
  id: string;
  date: string;
  timeSlots: string[];
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface SiteSettings {
  heroImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutImageUrl?: string; // 백워드 호환용
  aboutImages?: string[];
  studioImages?: string[];
  studioPriceWeekday?: string;
  studioPriceWeekend?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactEmail?: string;
  bankInfo?: string; // 예: 우리은행 1005-103-980558 (최찬양)
  studioDescription?: string;
  studioLocation?: string; // 지도 하단 노출용 주소
  siteTitle?: string;
  siteDescription?: string;
  siteKeywords?: string;
  ogImageUrl?: string;
}

export interface Inquiry {
  id: string;
  type: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  sourceUrl?: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
  coverImageUrl?: string;
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  voice: string;
  field: string;
  imageUrl?: string;
  createdAt: string;
}

// ---- Reservations ----

export async function getReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetch reservations error:", error);
    return [];
  }

  return data.map((d: any) => ({
    id: d.id,
    date: d.date,
    timeSlots: d.time_slots,
    name: d.user_name,
    phone: d.user_phone,
    message: d.user_details,
    status: d.status,
    createdAt: d.created_at,
  }));
}

export async function addReservation(
  reservation: Omit<Reservation, "id" | "status" | "createdAt">
): Promise<Reservation | null> {
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      date: reservation.date,
      time_slots: reservation.timeSlots,
      user_name: reservation.name,
      user_phone: reservation.phone,
      user_details: reservation.message || "",
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("insert reservation error:", error);
    return null;
  }

  // TODO: 이후 Resend 이메일 발송 API 호출 연동 필요
  try {
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'studio', data: reservation })
    });
  } catch(e) {}

  return {
    id: data.id,
    date: data.date,
    timeSlots: data.time_slots,
    name: data.user_name,
    phone: data.user_phone,
    message: data.user_details,
    status: data.status,
    createdAt: data.created_at,
  };
}

export async function updateReservationStatus(
  id: string,
  status: Reservation["status"]
) {
  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);
  if (error) console.error("update status error:", error);
}

export async function deleteReservation(id: string) {
  const { error } = await supabase.from("reservations").delete().eq("id", id);
  if (error) console.error("delete reservation error:", error);
}

export async function getBookedSlots(date: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("time_slots, status")
    .eq("date", date)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    console.error("fetch booked slots error:", error);
    return [];
  }

  return data.flatMap((d: any) => d.time_slots);
}

// ---- Site Settings ----

export async function getSiteSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase.from("settings").select("key, value");
  
  if (error || !data) {
    console.error("fetch settings error:", error);
    return {};
  }
  
  const settings: Record<string, any> = {};
  data.forEach((row: any) => {
    try {
      if (typeof row.value === 'string' && (row.value.startsWith('{') || row.value.startsWith('['))) {
         settings[row.key] = JSON.parse(row.value);
      } else if (typeof row.value === 'string' && row.value.startsWith('"')) {
         settings[row.key] = JSON.parse(row.value);
      } else {
         settings[row.key] = row.value;
      }
    } catch {
      settings[row.key] = row.value;
    }
  });
  
  return settings;
}

export async function updateSiteSettings(settingsMap: Record<string, any>) {
  for (const [key, val] of Object.entries(settingsMap)) {
    const valuePayload = typeof val === 'string' ? `"${val}"` : JSON.stringify(val);
    
    // settings 테이블은 PK(key) 충돌 시 업데이트되도록 upsert를 사용
    const { error } = await supabase
      .from("settings")
      .upsert({ key, value: valuePayload }, { onConflict: "key" });
      
    if (error) console.error(`update settings [${key}] error:`, error);
  }
}

// ---- Inquiries (문의폼) ----

export async function addInquiry(
  type: string,
  name: string,
  phone: string,
  email?: string,
  message?: string,
  sourceUrl?: string
) {
  const { error } = await supabase.from("inquiries").insert({
    type,
    name,
    phone,
    email: email || "",
    message: message || "",
    source_url: sourceUrl || "",
    status: "unread",
  });

  if (error) console.error("insert inquiry error:", error);

  // 이메일 발송 자동화 (에러 무시)
  try {
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data: { name, phone, email, message, sourceUrl } })
    });
  } catch(e) {}
}

export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  
  return data.map((d: any) => ({
    id: d.id,
    type: d.type,
    name: d.name,
    phone: d.phone,
    email: d.email,
    message: d.message,
    sourceUrl: d.source_url,
    status: d.status,
    createdAt: d.created_at,
  }));
}

// ---- Notes (블로그/게시물) ----

export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("fetch notes error:", error);
    return [];
  }

  return data.map((d: any) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    content: d.content,
    coverImageUrl: d.cover_image_url,
    createdAt: d.created_at,
  }));
}

export async function getNoteById(id: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("fetch note error:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    category: data.category,
    content: data.content,
    coverImageUrl: data.cover_image_url,
    createdAt: data.created_at,
  };
}

export async function addNote(note: Omit<Note, "id" | "createdAt">) {
  const { error } = await supabase.from("notes").insert({
    title: note.title,
    category: note.category,
    content: note.content,
    cover_image_url: note.coverImageUrl || "",
  });
  if (error) console.error("add note error:", error);
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) console.error("delete note error:", error);
}

// ---- Artists ----

export async function getArtists(): Promise<Artist[]> {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("fetch artists error:", error);
    return [];
  }

  return data.map((d: any) => ({
    id: d.id,
    name: d.name,
    voice: d.voice,
    field: d.field,
    imageUrl: d.image_url,
    createdAt: d.created_at,
  }));
}

export async function addArtist(artist: Omit<Artist, "id" | "createdAt">) {
  const { error } = await supabase.from("artists").insert({
    name: artist.name,
    voice: artist.voice,
    field: artist.field,
    image_url: artist.imageUrl || "",
  });
  if (error) console.error("add artist error:", error);
}

export async function deleteArtist(id: string) {
  const { error } = await supabase.from("artists").delete().eq("id", id);
  if (error) console.error("delete artist error:", error);
}

// ---- Storage ----

export async function uploadStorageImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage.from("tnt-media").upload(filePath, file);
  if (error) {
    console.error("upload error:", error);
    return null;
  }

  const { data } = supabase.storage.from("tnt-media").getPublicUrl(filePath);
  return data.publicUrl;
}
