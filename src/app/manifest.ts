import type { MetadataRoute } from "next";

/**
 * 홈 화면에 추가했을 때의 앱 정보.
 * 색은 surface/page (Light) 값: 열릴 때 보이는 바탕과 위쪽 막대 색.
 * 다크 모드의 위쪽 막대 색은 layout.tsx 의 viewport 에서 정한다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "메모",
    short_name: "메모",
    description: "메모를 쓰고 모아 보는 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f4f6",
    theme_color: "#f2f4f6",
    categories: ["productivity"],
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
