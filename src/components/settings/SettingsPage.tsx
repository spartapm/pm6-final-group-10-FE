"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { createClient } from "@/lib/supabase/client";
import { clearDevSession, isSupabaseConfigured } from "@/lib/supabase/config";
import { nicknameSchema } from "@/lib/validators";
import type { Profile } from "@/lib/types";
import { Modal, ModalButton } from "@/components/ui/Modal";

export function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiFetch<Profile>("/profile"),
  });

  const displayNickname = nickname || profile?.nickname || "";

  async function handleSaveNickname() {
    const result = nicknameSchema.safeParse(nickname);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "닉네임 형식이 올바르지 않습니다.");
      return;
    }

    setError("");
    try {
      await apiFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({ nickname }),
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch {
      setSaveError(true);
    }
  }

  async function handleAvatar(file: File) {
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("JPG, PNG 파일만 업로드할 수 있어요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("5MB 이하의 파일만 업로드할 수 있어요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    await apiFetch("/profile/avatar", { method: "POST", body: formData });
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  }

  async function handleLogout() {
    if (posthog.__loaded) posthog.reset();

    if (!isSupabaseConfigured()) {
      clearDevSession();
      router.push("/login");
      router.refresh();
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleWithdraw() {
    await apiFetch("/account", { method: "DELETE" });

    if (posthog.__loaded) posthog.reset();

    if (!isSupabaseConfigured()) {
      clearDevSession();
      router.push("/login");
      router.refresh();
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative h-full overflow-y-auto px-10 py-8">
      <h1 className="text-2xl font-bold text-dd-black">설정</h1>

      <button
        onClick={handleLogout}
        className="absolute right-10 top-8 text-sm text-dd-gray-500 hover:text-dd-black"
      >
        로그아웃
      </button>

      <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-6">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-dd-gray-200 text-2xl text-dd-gray-500"
        >
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="프로필"
              className="size-full object-cover"
            />
          ) : (
            "+"
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAvatar(file);
          }}
        />

        <div className="w-full">
          <label className="mb-1 block text-sm font-medium text-dd-black">
            닉네임
          </label>
          <div className="flex gap-2">
            <input
              value={displayNickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 rounded-[8px] border border-dd-gray-400 bg-dd-gray-100 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={handleSaveNickname}
              className="rounded-[8px] bg-dd-black px-4 py-2 text-sm text-white"
            >
              저장
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-dd-error">{error}</p>}
        </div>

        <div className="w-full">
          <label className="mb-1 block text-sm font-medium text-dd-black">
            이메일
          </label>
          <p className="rounded-[8px] border border-dd-gray-400 bg-dd-gray-100 px-3 py-2 text-sm text-dd-gray-500">
            {profile?.email}
          </p>
        </div>

        <div className="mt-8 w-full rounded-lg border border-dd-gray-400 bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-dd-green">딱풀 ddakpool</h2>
          <p className="mt-2 text-sm text-dd-gray-500">ddakpool.v1.0</p>
          <p className="mt-2 text-sm text-dd-black">
            채용공고를 딱 붙여두고, 딱 맞게 꺼내 쓰세요.
          </p>
        </div>

        <button
          onClick={() => setShowWithdraw(true)}
          className="text-sm text-dd-gray-500 underline"
        >
          회원 탈퇴
        </button>

        <p className="text-xs text-dd-gray-500">made by CHOIGOODAHM!</p>
      </div>

      <Modal
        open={saveError}
        title="안내"
        onClose={() => setSaveError(false)}
        variant="error"
        actions={
          <ModalButton variant="outline" onClick={() => setSaveError(false)}>
            닫기
          </ModalButton>
        }
      >
        <p>
          수정한 내용을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      </Modal>

      <Modal
        open={showWithdraw}
        title="안내"
        onClose={() => setShowWithdraw(false)}
        variant="confirm-withdraw"
        actions={
          <>
            <ModalButton variant="danger" onClick={handleWithdraw}>
              탈퇴하기
            </ModalButton>
            <ModalButton
              variant="outline"
              onClick={() => setShowWithdraw(false)}
            >
              취소
            </ModalButton>
          </>
        }
      >
        <p>
          정말 탈퇴하시겠어요? 탈퇴하면 저장된 모든 공고와 데이터가 삭제되며
          복구할 수 없어요.
        </p>
      </Modal>
    </div>
  );
}
