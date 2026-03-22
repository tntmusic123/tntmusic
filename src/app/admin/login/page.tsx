import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { getSiteSettings } from "@/lib/store";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  
  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    
    const settings = await getSiteSettings();
    const adminPassword = settings.adminPassword || "tntmusic123";
    
    const reqHeaders = await headers();
    const referer = reqHeaders.get("referer");
    let basePath = "/admin";
    if (referer) {
      try {
        const url = new URL(referer);
        basePath = url.pathname.replace('/login', ''); // /admin-secret
      } catch(e) {}
    }
    
    if (password === adminPassword) {
      const cookieStore = await cookies();
      cookieStore.set("admin_token", password, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7 // 7일 유지
      });
      redirect(basePath);
    } else {
      redirect(`${basePath}/login?error=1`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">관리자 로그인</CardTitle>
          {params.error && (
            <p className="text-sm text-destructive mt-2">비밀번호가 일치하지 않습니다.</p>
          )}
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                required
                className="text-center bg-muted/50"
              />
            </div>
            <Button type="submit" className="w-full btn-gold">
              접속하기
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              초기 비밀번호: tntmusic123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
