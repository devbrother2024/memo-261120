"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createMemo } from "@/lib/memo-actions";
import { clearDraft, getDraftSnapshot, parseDraft, saveDraft, subscribe, type Draft } from "@/lib/memo-store";
import { categories, labelColors, type Block } from "@/lib/memos";
import { ButtonPrimary } from "./button-primary";
import { Chip } from "./chip";
import { ColorDot } from "./color-dot";
import { IconButton } from "./icon-button";
import { RichEditor } from "./rich-editor";
import { Screen } from "./screen";

/** 메모 작성 — Figma Mobile/Write */
export function WriteScreen() {
  // 서버에서는 임시 저장을 읽을 수 없어서 undefined(아직 모름), 브라우저에서는 문자열 또는 null(없음)
  const rawDraft = useSyncExternalStore<string | null | undefined>(subscribe, getDraftSnapshot, () => undefined);
  if (rawDraft === undefined) return <Screen className="pt-space-48" />;
  return <WriteForm initialDraft={parseDraft(rawDraft)} />;
}

function WriteForm({ initialDraft }: { initialDraft: Draft | null }) {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(() => ({
    title: initialDraft?.title ?? "",
    category: initialDraft?.category ?? categories[1],
    color: initialDraft?.color ?? labelColors[1],
  }));
  const [autosaved, setAutosaved] = useState(initialDraft !== null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // 임시 저장 타이머가 최신 값을 읽을 수 있게 ref 에도 둔다
  const formRef = useRef(form);
  const blocksRef = useRef<Block[]>(initialDraft?.blocks ?? []);
  const timerRef = useRef<number | undefined>(undefined);
  const doneRef = useRef(false); // 저장을 마치면 임시 저장을 더 하지 않는다

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  /** 작성 중인 글을 임시 저장한다. 아무것도 안 썼으면 임시 저장을 지운다. 보이는 표시(autosaved)를 돌려준다 */
  const persistDraft = (): boolean => {
    timerRef.current = undefined;
    if (doneRef.current) return false;
    const { title, category, color } = formRef.current;
    const blocks = blocksRef.current;
    if (!title.trim() && blocks.length === 0) {
      clearDraft();
      return false;
    }
    return saveDraft({ title, category, color, blocks });
  };

  const scheduleDraft = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAutosaved(persistDraft()), 500);
  };

  // 화면을 떠날 때, 아직 저장 안 된 마지막 입력을 임시 저장한다
  useEffect(
    () => () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
        persistDraft();
      }
    },
    // persistDraft 는 ref 만 읽어서 다시 만들 필요가 없다
    [],
  );

  const update = (patch: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setMessage("");
    scheduleDraft();
  };

  const save = async () => {
    if (saving) return;
    const title = form.title.trim();
    if (!title) {
      setMessage("제목을 입력해 주세요");
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    let result;
    try {
      result = await createMemo({ title, category: form.category, color: form.color, blocks: blocksRef.current });
    } catch {
      result = { ok: false as const, message: "메모를 저장하지 못했어요. 잠시 뒤에 다시 눌러 주세요" };
    }
    if (!result.ok) {
      setMessage(result.message);
      setSaving(false);
      return;
    }
    doneRef.current = true;
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
    clearDraft();
    router.push("/");
  };

  return (
    <Screen className="pt-space-48">
      <nav className="flex items-center justify-between">
        <IconButton icon="chevron-left" label="뒤로가기" href="/" />
        {autosaved && <span className="text-caption-sm text-text-muted">자동 저장됨</span>}
      </nav>

      <main className="flex flex-1 flex-col gap-space-12">
        <label className="flex flex-col gap-space-4 rounded-lg bg-surface-card px-space-20 py-space-16 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary">
          <span className="text-caption-sm text-text-muted">제목</span>
          <input
            ref={titleRef}
            value={form.title}
            onChange={(event) => update({ title: event.target.value })}
            placeholder="제목을 입력하세요"
            maxLength={100}
            className="h-6 w-full bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-col gap-space-12 px-space-8 py-space-4">
          <div role="group" aria-label="분류" className="flex items-center gap-space-8">
            <span className="text-caption-sm whitespace-nowrap text-text-muted">분류</span>
            {categories.map((category) => (
              <Chip
                key={category}
                selected={form.category === category}
                onClick={() => update({ category })}
              >
                {category}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label="색" className="flex items-center gap-space-8">
            <span className="text-caption-sm whitespace-nowrap text-text-muted">색</span>
            {labelColors.map((color) => (
              <ColorDot key={color} color={color} selected={form.color === color} onClick={() => update({ color })} />
            ))}
          </div>
        </div>

        <RichEditor
          initialBlocks={initialDraft?.blocks ?? []}
          onChange={(blocks) => {
            blocksRef.current = blocks;
            setMessage("");
            scheduleDraft();
          }}
        />

        {message && (
          <p role="alert" className="px-space-8 text-caption-md text-text-muted">
            {message}
          </p>
        )}
      </main>

      <ButtonPrimary label={saving ? "저장하는 중…" : "저장하기"} onClick={save} disabled={saving} />
    </Screen>
  );
}
