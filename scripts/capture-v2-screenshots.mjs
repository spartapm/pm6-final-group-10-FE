/**
 * MVP v2 verification screenshot script
 * Usage: node scripts/capture-v2-screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../docs/v2-screenshots");
const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";
const API = process.env.VERIFY_API_URL ?? "http://localhost:4000";
const EMAIL = process.env.VERIFY_EMAIL ?? "test@test.com";
const PASSWORD = process.env.VERIFY_PASSWORD ?? "Test1234";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://ehuxqqgpsznvkcrabdjn.supabase.co";
const SUPABASE_ANON =
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodXhxcWdwc3pudmtjcmFiZGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNjczMDMsImV4cCI6MjA5ODk0MzMwM30.1NuIA2CqhuptxIDIMD5B-ku-0YFZGYpZ_nzf_vJC5sw";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

async function getAccessToken() {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    }
  );
  const data = await res.json();
  if (!data.access_token) throw new Error("Login failed: " + JSON.stringify(data));
  return data.access_token;
}

async function resetOnboarding(userId) {
  if (!SERVICE_KEY) return;
  await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ onboarding_completed_at: null }),
  });
}

async function getUserId(token) {
  const res = await fetch(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profile = await res.json();
  return profile.id;
}

async function login(page) {
  await page.goto(`${BASE}/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/all/, { timeout: 30000 });
}

async function shot(page, name) {
  const file = path.join(OUT_DIR, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`saved ${name}`);
}

async function dismissOnboardingIfVisible(page) {
  const skip = page.getByRole("button", { name: /건너뛰기|시작하기/ });
  if (await skip.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skip.first().click();
    await page.waitForTimeout(600);
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const token = await getAccessToken();
  const userId = await getUserId(token);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    // --- Onboarding capture (reset first) ---
    await resetOnboarding(userId);
    await login(page);
    await page.waitForTimeout(1200);
    const onboardingVisible = await page
      .getByText("채용공고 URL만 붙여넣으면")
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (onboardingVisible) {
      await shot(page, "10-onboarding.png");
      await page.getByRole("button", { name: "건너뛰기" }).click();
      await page.waitForTimeout(600);
    } else {
      console.log("skip 10-onboarding.png (not shown)");
    }

    await dismissOnboardingIfVisible(page);
    await page.waitForTimeout(800);
    await shot(page, "01-gnb-top-tabs.png");

    // URL folder dropdown
    await page.locator('input[type="url"]').fill(
      "https://www.saramin.co.kr/zf_user/jobs/relay/view?view_type=search&rec_idx=123456"
    );
    await page.getByRole("button", { name: "URL 추가" }).click();
    await page.waitForTimeout(700);
    await shot(page, "02-url-folder-dropdown.png");
    await page.mouse.click(20, 20);
    await page.waitForTimeout(400);

    // Folder edit modal
    await page.getByRole("button", { name: "폴더 수정하기" }).click();
    await page.waitForTimeout(600);
    await shot(page, "03-folder-edit-modal.png");
    await page.mouse.click(20, 20); // backdrop close
    await page.waitForTimeout(400);

    // Etc tab
    await page.getByRole("button", { name: "미분류", exact: true }).click();
    await page.waitForTimeout(800);
    await shot(page, "04-folder-tab-list.png");

    await page.getByRole("button", { name: "전체보기" }).click();
    await page.waitForTimeout(800);

    // Keyword filter search
    await page.getByRole("button", { name: "역량키워드" }).click();
    await page.waitForTimeout(400);
    const search = page.getByPlaceholder("키워드 검색");
    if (await search.isVisible()) {
      await search.fill("개");
      await page.waitForTimeout(400);
    }
    await shot(page, "05-keyword-filter-search.png");
    await page.mouse.click(20, 20);
    await page.waitForTimeout(400);

    // Job detail - open first card (before leaving app shell)
    const cards = page.locator(".cursor-pointer.rounded-2xl.border, .cursor-pointer.rounded-lg.border");
    const cardCount = await cards.count();
    if (cardCount === 0) {
      console.log("skip detail screenshots (no job cards)");
    } else {
      await cards.first().click();
      await page.waitForTimeout(1000);
      await shot(page, "06-detail-keyword-groups.png");
      await shot(page, "09-detail-modal-size.png");

      const alwaysOpen = page.getByLabel("상시채용");
      if (await alwaysOpen.isVisible()) {
        await alwaysOpen.check();
        await page.waitForTimeout(400);
        await shot(page, "08-deadline-checkboxes.png");
        await alwaysOpen.uncheck();
      }

      const saveBtn = page.getByRole("button", { name: "저장하기" });
      if (await saveBtn.isDisabled()) {
        const companyInput = page
          .locator('span:text("기업 이름")')
          .locator("xpath=following::input[1]");
        if (await companyInput.isVisible()) {
          await companyInput.fill("검증기업");
          await page.waitForTimeout(300);
        }
      }
      if (!(await saveBtn.isDisabled())) {
        await saveBtn.click();
        await page.waitForTimeout(800);
        await shot(page, "07-save-toast.png");
      } else {
        console.log("skip 07-save-toast.png (save disabled)");
        await page.getByRole("button", { name: "닫기", exact: false }).first().click().catch(() => page.keyboard.press("Escape"));
      }
    }

    // Empty state - folder likely empty
    const foldersRes = await fetch(`${API}/folders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const folders = await foldersRes.json();
    const emptyFolder =
      folders.find((f) => f.name === "관심기업") ?? folders.at(-1);
    if (emptyFolder) {
      await page.goto(`${BASE}/folders/${emptyFolder.id}`);
      await page.waitForTimeout(1000);
      if (
        await page
          .getByText(/공고가 없어요/)
          .isVisible()
          .catch(() => false)
      ) {
        await shot(page, "11-empty-state.png");
      } else {
        console.log("skip 11-empty-state.png (folder has jobs)");
      }
    }

    // Settings CS email (still logged in)
    await page.goto(`${BASE}/settings`);
    await page.waitForTimeout(1000);
    await shot(page, "13-cs-email.png");

    // Signup terms in fresh context (no login required)
    const signupPage = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await signupPage.goto(`${BASE}/signup`);
    await signupPage.waitForTimeout(1000);
    await signupPage.screenshot({
      path: path.join(OUT_DIR, "12-signup-terms.png"),
    });
    console.log("saved 12-signup-terms.png");
    await signupPage.close();

    console.log("Screenshot capture complete.");
  } catch (err) {
    console.error("Verification failed:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
