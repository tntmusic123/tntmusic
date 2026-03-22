"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  
  const reqHeaders = await headers();
  const referer = reqHeaders.get("referer");
  let loginPath = "/admin/login";
  if (referer) {
    try {
      const url = new URL(referer);
      loginPath = `${url.pathname}/login`;
    } catch(e) {}
  }
  redirect(loginPath);
}
