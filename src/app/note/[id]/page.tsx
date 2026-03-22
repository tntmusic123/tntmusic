import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getNoteById, getNotes } from "@/lib/store";
import { ArrowLeft, CalendarDays, ChevronRight, MessageSquare } from "lucide-react";
import NoteInquiryForm from "@/components/NoteInquiryForm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteById(id);
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
  const { id } = await params;
  const note = await getNoteById(id);
  const allNotes = await getNotes();
  const otherNotes = allNotes.filter(n => n.id !== id).slice(0, 2);

  if (!note) {
    notFound();
  }

  // Linter hint: note is guaranteed to be non-null here
  const safeNote = note;

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

      {/* More Notes Section */}
      {otherNotes.length > 0 && (
        <section className="py-24 bg-muted/30 border-t border-border">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-widest mb-2 block">Discovery</span>
                <h2 className="text-3xl font-bold text-foreground">더 많은 이야기</h2>
              </div>
              <Link href="/note" className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors flex items-center gap-1 group">
                전체보기 <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherNotes.map(otherNote => (
                <Link key={otherNote.id} href={`/note/${otherNote.id}`} className="group block">
                  <div className="flex gap-6 items-center">
                    <div className="w-32 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                      {otherNote.coverImageUrl ? (
                        <img src={otherNote.coverImageUrl} alt={otherNote.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-navy flex items-center justify-center">
                          <span className="text-gold/20 font-bold text-xl">TNT</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{otherNote.category}</span>
                      <h3 className="font-bold text-foreground group-hover:text-gold transition-colors line-clamp-2 mt-1">
                        {otherNote.title}
                      </h3>
                      <time className="text-[10px] text-muted-foreground mt-2 block">
                        {format(new Date(otherNote.createdAt), "yyyy. MM. dd")}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO/Conversion Inquiry Form Section */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark to-transparent opacity-90" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/20 mb-8">
            <MessageSquare className="h-8 w-8 text-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            이 노트의 내용과 관련하여 <br/> <span className="text-gradient-gold">전문가 상담이 필요하신가요?</span>
          </h2>
          <p className="text-white/50 mb-12 text-base max-w-lg mx-auto leading-relaxed">
            TNT Music의 전문가들이 당신의 보이스와 비전을 위해 <br className="hidden sm:block" />
            최선의 가이드를 제안해 드립니다.
          </p>
          
          <div className="bg-white/5 p-8 sm:p-12 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <NoteInquiryForm noteTitle={safeNote.title} />
          </div>
        </div>
      </section>
    </>
  );
}
