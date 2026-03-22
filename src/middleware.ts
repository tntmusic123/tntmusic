import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // _next, api, 스태틱 파일 등은 미들웨어 건너뛰기
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Supabase REST를 통해 최신 adminPath 및 admin_password 설정 조회 (Edge Runtime 호환)
  let adminPath = 'admin';
  let adminPassword = process.env.ADMIN_PASSWORD || 'tntmusic123';
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && anonKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/settings?key=in.(adminPath,admin_password)&select=key,value`, {
        headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` },
        next: { revalidate: 0 } // Cache disable for immediate effect
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const row of data) {
          let val = row.value;
          if (typeof val === 'string') val = val.replace(/^"|"$/g, '');
          if (row.key === 'adminPath' && val) adminPath = val;
          if (row.key === 'admin_password' && val) adminPassword = val;
        }
      }
    }
  } catch (e) {}

  // 기본 /admin 경로 접근 차단 로직 (DB에서 adminPath가 변경되었을 경우)
  if (pathname.startsWith('/admin') && adminPath !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const dynamicAdminRoute = `/${adminPath}`;

  // 동적 어드민 경로에 접근한 경우
  if (pathname.startsWith(dynamicAdminRoute)) {
    // 뒷부분 경로 추출 (예: /admin-secret/login -> /login)
    const suffix = pathname.replace(dynamicAdminRoute, '');
    const mappedPath = `/admin${suffix}`; // 내부적으로는 /admin 으로 포워딩
    
    if (mappedPath === '/admin/login') {
      return NextResponse.rewrite(new URL(mappedPath, request.url));
    }
    
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (adminToken !== adminPassword) {
      return NextResponse.redirect(new URL(`${dynamicAdminRoute}/login`, request.url));
    }

    return NextResponse.rewrite(new URL(mappedPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
