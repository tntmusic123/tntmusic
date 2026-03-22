import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { getNoteById } from "@/lib/store";
import { ArrowLeft, CalendarDays } from "lucide-react";
import NoteInquiryForm from "@/components/NoteInquiryForm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const note = await getNoteById(params.id);
  if (!note) {
    return { title: "노트를 찾을 수 없습니다 | TNT Music" };
  }
  return {
    title: `${note.title} | TNT Music Note`,
    description: note.content.substring(0, 150),
    openGraph: {
      images: note.coverImageUrl ? [note.coverImageUrl] : [],
    },
  };
}

export default async function NoteDetailPage({ params }: Props) {
  const note = await getNoteById(params.id);

  if (!note) {
    notFound();
  }

  return (
    <>
      <article className="pt-32 pb-20 bg-background min-h-screen">
        <div className="mx-auto max-w-3xl px-6">
          {/* Header */}
          <header className="mb-10 text-center">
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
              {note.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              {note.title}
            </h1>
            <time className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {format(new Date(note.createdAt), "yyyy. MM. dd")}
            </time>
          </header>

          {/* Cover Image */}
          {note.coverImageUrl && (
            <div className="rounded-2xl overflow-hidden mb-12 bg-muted border border-border">
              <img
                src={note.coverImageUrl}
                alt={note.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-gold max-w-none text-foreground leading-loose prose-img:rounded-xl prose-img:border prose-img:border-border prose-a:text-gold hover:prose-a:text-gold-light">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.content}
            </ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-border/50 text-center">
            <Link href="/note">
              <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> 목록으로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </article>

      {/* SEO/Conversion Inquiry Form Section */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark to-transparent opacity-80" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            이 노트의 내용과 관련하여 <span className="text-gradient-gold">상담이 필요하신가요?</span>
          </h2>
          <p className="text-white/60 mb-10 text-sm">
            간단한 정보를 남겨주시면 담당자가 빠르게 연락드리겠습니다.
          </p>
          
          <NoteInquiryForm noteTitle={note.title} />
        </div>
      </section>
    </>
  );
}
