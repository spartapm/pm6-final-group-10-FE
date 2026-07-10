import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "아이디를 입력해주세요.")
  .email("이메일 형식을 확인해주세요.");

export const loginPasswordSchema = z
  .string()
  .min(1, "비밀번호를 입력해주세요.")
  .min(6, "비밀번호는 6~12자로 입력해주세요.")
  .max(12, "비밀번호는 6~12자로 입력해주세요.");

export const signupPasswordSchema = z
  .string()
  .min(1, "*비밀번호를 입력해주세요.")
  .min(6, "*비밀번호 형식이 올바르지 않습니다.")
  .max(12, "*비밀번호 형식이 올바르지 않습니다.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    "*비밀번호 형식이 올바르지 않습니다."
  );

export const nicknameSchema = z
  .string()
  .min(1, "*닉네임을 입력해주세요.")
  .min(2, "*닉네임 형식이 올바르지 않습니다.")
  .max(8, "*닉네임 형식이 올바르지 않습니다.")
  .regex(/^[가-힣a-zA-Z0-9]+$/, "*닉네임 형식이 올바르지 않습니다.");

export function validateJobUrl(input: string): {
  valid: boolean;
  code?: string;
  message?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, code: "url_format", message: "" };
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const host = url.hostname.replace(/^www\./, "");
    if (host.includes("saramin.co.kr") || host.includes("jobkorea.co.kr")) {
      return { valid: true };
    }
    return {
      valid: false,
      code: "unsupported_platform",
      message:
        "* 아직 지원하지 않는 플랫폼이에요. 지금은 사람인과 잡코리아 공고를 저장할 수 있어요.",
    };
  } catch {
    return {
      valid: false,
      code: "url_format",
      message:
        "* 올바른 URL 형식이 아니에요. 채용공고 페이지 주소를 다시 확인해 주세요.",
    };
  }
}
