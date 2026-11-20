import type { Metadata } from "next";
import { WriteScreen } from "@/components/write-screen";

export const metadata: Metadata = { title: "새 메모" };

/** 메모 작성 — Figma Mobile/Write */
export default function WritePage() {
  return <WriteScreen />;
}
