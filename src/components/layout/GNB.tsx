"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { assets } from "@/lib/assets";
import { TAG_ROUTES } from "@/lib/constants";
import { colors } from "@/lib/design-tokens";
import { apiFetch } from "@/lib/api-client";
import type { Profile } from "@/lib/types";

function isNavActive(pathname: string, href: string, label: string) {
  const path = decodeURIComponent(pathname).replace(/\/$/, "");
  if (href === "/all") return path === "/all";
  return path === href || path === `/tags/${label}`;
}

export function GNB() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    apiFetch<Profile>("/profile")
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  function handleNavClick(href: string, label: string) {
    if (isNavActive(pathname, href, label)) {
      router.refresh();
    }
  }

  return (
    <nav className="sticky top-0 grid h-svh w-[92px] shrink-0 grid-rows-[1fr_auto] bg-dd-black text-white">
      <div className="flex flex-col gap-px self-start pt-6">
        {TAG_ROUTES.map(({ href, label }) => {
          const active = isNavActive(pathname, href, label);
          const isAll = href === "/all";

          if (isAll) {
            return (
              <Link
                key={href}
                href={href}
                onClick={() => handleNavClick(href, label)}
                className={`mx-3.5 mb-2.5 flex items-center justify-between gap-1 py-1 text-[12px] font-medium transition ${
                  active
                    ? "text-dd-yellow"
                    : "text-white hover:opacity-80"
                }`}
              >
                <AssetImage
                  src={assets.iconGrid}
                  alt=""
                  width={17}
                  height={17}
                  placeholderClassName="bg-dd-gray-500"
                />
                <span className="leading-none">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              onClick={() => handleNavClick(href, label)}
              aria-current={active ? "page" : undefined}
              className="flex min-h-[35px] w-full items-center justify-center px-2.5 py-2.5 text-[10px] font-medium tracking-[-0.11px] transition hover:bg-white/10"
              style={
                active
                  ? { backgroundColor: colors.yellow, color: colors.black }
                  : { color: colors.white }
              }
            >
              <span className="text-center leading-normal">{label}</span>
            </Link>
          );
        })}
      </div>

      <Link
        href="/settings"
        className="mx-2 mb-2 flex flex-col items-center gap-1 rounded-bl-[20px] rounded-br-lg px-2 py-3 hover:bg-white/10"
      >
        <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-white text-dd-black">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="프로필"
              className="size-full object-cover"
            />
          ) : (
            <span className="text-[10px]">👤</span>
          )}
        </div>
        <span className="max-w-full truncate text-[10px]">
          {profile?.nickname ?? "프로필"}
        </span>
      </Link>
    </nav>
  );
}
