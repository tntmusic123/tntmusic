import BookingForm from "./BookingForm";

// 이 속성이 있어야 Vercel CLI 빌드 시 람다(Lambda)로 올바르게 생성될 가능성이 높음
export const dynamic = 'force-dynamic';

export default function StudioBookPage() {
  return <BookingForm />;
}
