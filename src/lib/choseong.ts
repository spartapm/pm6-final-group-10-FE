const CHO =
  "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

/** 완성형 한글 음절 → 초성 문자열. 비한글은 소문자로 유지. */
export function toChoseong(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const choIndex = Math.floor((code - 0xac00) / (21 * 28));
      out += CHO[choIndex] ?? "";
    } else if (/[ㄱ-ㅎ]/.test(ch)) {
      out += ch;
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      out += ch.toLowerCase();
    }
  }
  return out;
}

/** 입력이 초성(자음)만으로 구성된 미완성 검색어인지 */
export function isChoseongQuery(query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return false;
  return /^[ㄱ-ㅎ]+$/.test(trimmed);
}

export function matchesChoseong(keyword: string, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const choseong = toChoseong(keyword);
  return choseong.includes(q);
}

export function isPrefixChoseongMatch(keyword: string, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  return toChoseong(keyword).startsWith(q);
}
