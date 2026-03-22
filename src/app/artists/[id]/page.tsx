import { notFound } from "next/navigation";
import Link from "next/link";
import { getArtists } from "@/lib/store";
import { ArrowLeft, User, Phone, Mail, Instagram, MessageSquare } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const artists = await getArtists();
  const artist = artists.find(a => a.id === id);
  
  if (!artist) {
    return { title: "아티스트를 찾을 수 없습니다 | TNT Music" };
  }
  return {
    title: `${artist.name} | TNT Music Artist`,
    description: artist.bio || `${artist.name} 아티스트의 프로필입니다.`,
    openGraph: {
      images: artist.imageUrl ? [artist.imageUrl] : [],
    },
  };
}

export default async function ArtistDetailPage({ params }: Props) {
  const { id } = await params;
  const artists = await getArtists();
  const artist = artists.find(a => a.id === id);

  if (!artist) {
    notFound();
  }

  return (
    <>
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-navy opacity-80" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <Link href="/artists" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-12 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> 목록으로 돌아가기
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Left: Artist Image */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-gold to-gold-light opacity-30 blur rounded-3xl group-hover:opacity-50 transition-opacity" />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-navy-dark border border-white/10 shadow-2xl">
                {artist.imageUrl ? (
                  <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-32 w-32 text-gold/10" />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Artist Info */}
            <div className="lg:col-span-7 pt-4">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-4">
                    {artist.role}
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">
                    {artist.name}
                  </h1>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-gold/50 to-transparent" />

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Profile & Bio</h3>
                    <p className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap font-medium">
                      {artist.bio || "등록된 소개글이 없습니다."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <h4 className="text-[10px] font-bold text-gold/60 uppercase tracking-widest mb-2">Part</h4>
                      <p className="text-white font-bold">{artist.role}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <h4 className="text-[10px] font-bold text-gold/60 uppercase tracking-widest mb-2">Status</h4>
                      <p className="text-white font-bold">TNT Music Artist</p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/contact"
                      className="btn-gold inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-sm font-bold tracking-wider group w-full sm:w-auto"
                    >
                      <MessageSquare className="h-4 w-4" />
                      아티스트 섭외 문의
                      <span className="w-4 h-px bg-white/30 group-hover:w-8 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-background border-t border-border">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6 italic">
            &quot;진정성 있는 울림으로 감동을 전하는 아티스트&quot;
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            TNT Music은 아티스트의 고유한 보이스와 감성을 존중합니다. <br className="hidden sm:block" />
            우리는 음악을 통해 세상과 소통하고 감동의 무대를 만들어가고 있습니다.
          </p>
        </div>
      </section>
    </>
  );
}
