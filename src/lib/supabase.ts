import { createClient } from "@supabase/supabase-js";

/**
 * 서버에서 쓰는 Supabase 클라이언트. 접속 주소와 공개 키는 .env.local 에서 읽는다.
 * 로그인이 없는 교육용 앱이라 공개(anon) 키로 접속하고, 접근 범위는 테이블의 RLS 정책이 정한다.
 */
export function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(".env.local 에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 를 넣어 주세요");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
