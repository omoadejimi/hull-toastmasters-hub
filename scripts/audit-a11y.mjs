/**
 * Regression checks against a running production build:
 *   npm run build && npm start
 *   npm run test:a11y
 * Install the matching Playwright Chromium separately before running this script.
 * The checks prepare local drafts only: they never open an email app or send mail.
 */
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const baseURL = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const outputPath = path.resolve(process.env.QA_OUTPUT || "artifacts/a11y-results.json");
const screenshotDirectory = process.env.QA_SCREENSHOTS
  ? path.resolve(process.env.QA_SCREENSHOTS)
  : null;
const widths = [320, 768, 1440];
const routes = ["/", "/meetings", "/calendar", "/contact"];
const navigation = [
  ["Home", "/"],
  ["Meetings", "/meetings"],
  ["Calendar", "/calendar"],
  ["Contact", "/contact"],
];
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const report = {
  startedAt: new Date().toISOString(),
  baseURL,
  browser: "Chromium",
  widths,
  wcagTags,
  checks: [],
  axe: [],
  runtimeErrors: [],
  limitations: [
    "Automated rules and regression journeys do not establish full WCAG conformance.",
    "Screen-reader announcements, real devices, operating-system email clients and mailbox delivery require manual verification.",
    "No email app is opened, clipboard contents are stubbed, and no email is sent by these checks.",
  ],
};
let browser;
let failureCount = 0;

function check(condition, message) {
  assert.ok(condition, message);
}

async function step(name, action) {
  try {
    const detail = await action();
    report.checks.push({ name, status: "passed", ...(detail ? { detail } : {}) });
    console.log(`PASS ${name}`);
  } catch (error) {
    failureCount += 1;
    report.checks.push({ name, status: "failed", error: error.stack || String(error) });
    console.error(`FAIL ${name}: ${error.message || error}`);
  }
}

async function load(page, route) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  check(response?.ok(), `Unexpected HTTP response for ${route}: ${response?.status()}`);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  check(
    (await page.locator('script[src*="/@vite/client"]').count()) === 0,
    "Use a production build, not the Vite development server.",
  );
}

async function waitForFocus(page, selector) {
  await page.waitForFunction((target) => document.activeElement?.matches(target), selector);
}

async function noOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  check(
    dimensions.document <= dimensions.viewport + 1 && dimensions.body <= dimensions.viewport + 1,
    `Horizontal page overflow: ${JSON.stringify(dimensions)}`,
  );
  return dimensions;
}

async function scan(page, name) {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(
    async (tags) =>
      window.axe.run(document, {
        runOnly: { type: "tag", values: tags },
      }),
    wcagTags,
  );
  report.axe.push({
    name,
    url: page.url(),
    testEngine: result.testEngine,
    violations: result.violations,
    incomplete: result.incomplete,
    passedRuleCount: result.passes.length,
    inapplicableRuleCount: result.inapplicable.length,
  });
  check(
    result.violations.length === 0,
    `${result.violations.length} axe violation(s): ${result.violations.map((violation) => `${violation.id} (${violation.nodes.length} node(s))`).join(", ")}`,
  );
  return {
    violations: result.violations.length,
    incomplete: result.incomplete.length,
    passedRules: result.passes.length,
  };
}

async function checkNavigation(page, width, route) {
  const nav = page.locator(width < 1024 ? "#mobile-nav" : 'header nav[aria-label="Main"]');
  for (const [label, target] of navigation) {
    const link = nav.getByRole("link", { name: label, exact: true, includeHidden: true });
    assert.equal(await link.getAttribute("href"), target, `${label} navigation target`);
    if (target === route)
      assert.equal(
        await link.getAttribute("aria-current"),
        "page",
        `${label} must expose the current page`,
      );
  }
}

async function keyboardJourney(page, width) {
  await load(page, "/");
  await page.keyboard.press("Tab");
  await waitForFocus(page, 'a[href="#main"]');
  const skip = page.getByRole("link", { name: "Skip to main content", exact: true });
  const skipBox = await skip.boundingBox();
  check(
    skipBox && skipBox.width > 0 && skipBox.height > 0 && skipBox.y >= 0,
    "The skip link must become visible when focused.",
  );
  await page.keyboard.press("Enter");
  await waitForFocus(page, "main#main");

  if (width < 1024) {
    const menu = page.locator('header button[aria-controls="mobile-nav"]');
    await menu.focus();
    await page.keyboard.press("Enter");
    assert.equal(await menu.getAttribute("aria-expanded"), "true");
    check(await page.locator("#mobile-nav").isVisible(), "The mobile menu must open.");
    await page.keyboard.press("Tab");
    await waitForFocus(page, '#mobile-nav a[href="/"]');
    await page.keyboard.press("Escape");
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    check(
      await menu.evaluate((element) => element === document.activeElement),
      "Escape must return focus to the menu button.",
    );
    check(!(await page.locator("#mobile-nav").isVisible()), "Escape must close the mobile menu.");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await waitForFocus(page, '#mobile-nav a[href="/meetings"]');
  } else {
    await page
      .locator('header nav[aria-label="Main"]')
      .getByRole("link", { name: "Home", exact: true })
      .focus();
    await page.keyboard.press("Tab");
    await waitForFocus(page, 'header nav[aria-label="Main"] a[href="/meetings"]');
  }
  await page.keyboard.press("Enter");
  await page.waitForURL(`${baseURL}/meetings`);
  await waitForFocus(page, "main#main");
  if (width < 1024)
    check(
      !(await page.locator("#mobile-nav").isVisible()),
      "Selecting a route must close the mobile menu.",
    );
}

async function invalidForm(page, route) {
  await load(page, route);
  await page
    .getByRole("button", {
      name: route === "/contact" ? "Prepare email draft" : "Prepare email request",
      exact: true,
    })
    .click();
  const summary = page.getByRole("alert").filter({ hasText: "Please check these details" });
  await summary.waitFor();
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "alert");
  const ids = route === "/contact" ? ["name", "email", "subject", "message"] : ["name", "email"];
  for (const id of ids) {
    const field = page.locator(`#${id}`);
    assert.equal(await field.getAttribute("aria-invalid"), "true", `${id} must be marked invalid`);
    check((await field.getAttribute("required")) !== null, `${id} must be required`);
    const describedBy = ((await field.getAttribute("aria-describedby")) || "").split(/\s+/);
    check(describedBy.includes(`${id}-error`), `${id} must reference its error message`);
    check(
      (await page.locator(`#${id}-error`).textContent())?.trim(),
      `${id} error must contain guidance`,
    );
  }
  await summary.locator('a[href="#name"]').click();
  await waitForFocus(page, "#name");
  const nameBox = await page.locator("#name").boundingBox();
  const headerBox = await page.locator("header").boundingBox();
  check(
    nameBox.y >= headerBox.y + headerBox.height,
    "Focused error target must clear the sticky header.",
  );
  // Scan the complete error summary in its initial presentation, after separately
  // checking its field link. A partially scrolled summary is clipped by design.
  await page
    .getByRole("button", {
      name: route === "/contact" ? "Prepare email draft" : "Prepare email request",
      exact: true,
    })
    .click();
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "alert");
  check(
    (await page.locator("#email-draft").count()) === 0,
    "An invalid form must not create an email draft.",
  );
}

async function validDraft(page, route) {
  const outbound = [];
  const onRequest = (request) => {
    if (!["GET", "HEAD"].includes(request.method()))
      outbound.push({ url: request.url(), method: request.method() });
  };
  page.on("request", onRequest);
  try {
    await page.getByLabel("Full name (required)", { exact: true }).fill("QA Visitor");
    await page.getByLabel("Email address (required)", { exact: true }).fill("qa@example.invalid");
    if (route === "/contact") {
      await page
        .getByLabel("Subject (required)", { exact: true })
        .fill("Website accessibility check");
      await page
        .getByLabel("Message (required)", { exact: true })
        .fill("This is a local automated test. No email will be sent.");
    } else {
      const radios = page.getByRole("radio");
      check(
        (await radios.count()) > 1,
        "At least two upcoming meetings are needed to test keyboard selection.",
      );
      await radios.nth(0).focus();
      await page.keyboard.press("ArrowDown");
      check(await radios.nth(1).isChecked(), "ArrowDown must select the next meeting.");
      check(
        await radios.nth(1).evaluate((element) => element === document.activeElement),
        "ArrowDown must move radio focus.",
      );
      await page
        .getByLabel("Questions or access needs (optional)", { exact: true })
        .fill("This is a local automated test. No email will be sent.");
    }
    await page
      .getByRole("button", {
        name: route === "/contact" ? "Prepare email draft" : "Prepare email request",
        exact: true,
      })
      .click();
    await page.getByRole("heading", { name: "Your email draft is ready", exact: true }).waitFor();
    await page.waitForFunction(
      () =>
        document.querySelector("#email-draft")?.closest("section")?.parentElement ===
        document.activeElement,
    );
    const draft = page.getByLabel("Email draft to review or copy", { exact: true });
    check(
      (await draft.getAttribute("readonly")) !== null,
      "The manual-copy fallback must be read-only.",
    );
    const text = await draft.inputValue();
    check(
      text.includes("To: contact@hullspeakers.org") &&
        text.includes("QA Visitor") &&
        text.includes("qa@example.invalid"),
      "The draft must retain the recipient and visitor details.",
    );
    const link = page.getByRole("link", { name: "Open email app", exact: true });
    const mailto = new URL(await link.getAttribute("href"));
    assert.equal(mailto.protocol, "mailto:");
    assert.equal(mailto.pathname, "contact@hullspeakers.org");
    check(
      mailto.searchParams.get("subject") && mailto.searchParams.get("body")?.includes("QA Visitor"),
      "The email link must encode a subject and body.",
    );
    check(
      (await page.getByRole("status").allTextContents()).some((status) =>
        status.includes("Nothing has been sent"),
      ),
      "The draft must clearly disclose that nothing was sent.",
    );
    assert.equal(
      await page.locator("#name").inputValue(),
      "QA Visitor",
      "Preparing a draft must preserve the form contents.",
    );
    assert.equal(await page.locator("#email").inputValue(), "qa@example.invalid");
    assert.equal(
      new URL(page.url()).pathname,
      route,
      "Preparing a draft must stay on the current page.",
    );
    assert.deepEqual(outbound, [], "Preparing a draft must not submit data over the network.");
    return { draftCharacters: text.length, outboundSubmissions: outbound.length };
  } finally {
    page.off("request", onRequest);
  }
}

async function copyFallback(page) {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Clipboard unavailable in QA");
        },
      },
    });
  });
  await page.getByRole("button", { name: "Copy email draft", exact: true }).click();
  await page
    .getByText(
      "Copy is unavailable. Select and copy the draft below, then paste it into your email service.",
      { exact: true },
    )
    .waitFor();
  check(
    (await page.locator("#email-draft").inputValue()).includes("QA Visitor"),
    "Manual-copy content must remain available after a clipboard error.",
  );

  await page.evaluate(() => {
    window.__qaCopiedDraft = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__qaCopiedDraft = text;
        },
      },
    });
  });
  await page.getByRole("button", { name: "Copy email draft", exact: true }).click();
  await page
    .getByText("Email draft copied. Paste it into your email service and send it.", { exact: true })
    .waitFor();
  check(
    await page.evaluate(() => window.__qaCopiedDraft.includes("QA Visitor")),
    "The copy action must supply the draft text.",
  );
}

async function meetingDateDisclosure(page) {
  await load(page, "/meetings");
  assert.equal(await page.getByRole("radio").count(), 4);
  const toggle = page.locator('button[aria-controls="meeting-dates"]');
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  check((await page.getByRole("radio").count()) > 4, "Later meeting dates must be available.");
  const lastDate = page.getByRole("radio").last();
  const selectedValue = await lastDate.getAttribute("value");
  await lastDate.check();
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  const selected = page.locator(`input[name="meeting"][value="${selectedValue}"]`);
  check(await selected.isVisible(), "A selected later date must stay visible after collapse.");
  check(await selected.isChecked(), "Collapsing the dates must retain the selection.");
  await noOverflow(page);
}

async function reducedMotion(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const settings = await page.evaluate(() => ({
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    transition: getComputedStyle(document.querySelector("header button")).transitionDuration,
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  check(settings.reduced, "The browser must emulate reduced motion.");
  check(
    settings.transition.split(",").every((duration) => Number.parseFloat(duration) <= 0.001),
    `Transitions must be reduced: ${settings.transition}`,
  );
  assert.equal(settings.scroll, "auto", "Reduced motion must disable smooth scrolling.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  return settings;
}

try {
  browser = await chromium.launch({ headless: true });
  report.browserVersion = browser.version();
  if (screenshotDirectory) await mkdir(screenshotDirectory, { recursive: true });
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      locale: "en-GB",
      timezoneId: "Europe/London",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on("pageerror", (error) =>
      report.runtimeErrors.push({ width, url: page.url(), message: error.message }),
    );
    for (const route of routes) {
      const name = `${route} at ${width}px`;
      await step(`${name}: page semantics and navigation`, async () => {
        await load(page, route);
        assert.equal(
          await page.getByRole("heading", { level: 1 }).count(),
          1,
          "Each page must have one h1.",
        );
        assert.equal(
          await page.getByRole("main").count(),
          1,
          "Each page must have one main landmark.",
        );
        await checkNavigation(page, width, route);
        return noOverflow(page);
      });
      await step(`${name}: axe WCAG A/AA`, () => scan(page, name));
      if (screenshotDirectory) {
        await page.screenshot({
          path: path.join(
            screenshotDirectory,
            `${route === "/" ? "home" : route.slice(1)}-${width}.png`,
          ),
          fullPage: true,
        });
      }
    }
    await step(`Keyboard skip link, menu and route focus at ${width}px`, () =>
      keyboardJourney(page, width),
    );
    await step(`Reduced motion at ${width}px`, () => reducedMotion(page));
    await step(`Meeting date disclosure preserves selection at ${width}px`, () =>
      meetingDateDisclosure(page),
    );
    if (width < 1024) {
      await step(`Open mobile menu axe at ${width}px`, async () => {
        await load(page, "/");
        await page.getByRole("button", { name: "Open menu", exact: true }).click();
        await noOverflow(page);
        return scan(page, `open mobile menu at ${width}px`);
      });
    }
    for (const route of ["/meetings", "/contact"]) {
      await step(`${route} invalid-form focus and error associations at ${width}px`, () =>
        invalidForm(page, route),
      );
      await step(`${route} invalid-form axe at ${width}px`, () =>
        scan(page, `${route} invalid form at ${width}px`),
      );
      await step(`${route} local draft and preserved details at ${width}px`, () =>
        validDraft(page, route),
      );
      await step(`${route} draft axe and overflow at ${width}px`, async () => {
        await noOverflow(page);
        return scan(page, `${route} prepared draft at ${width}px`);
      });
      if (route === "/contact")
        await step(`Contact clipboard and manual-copy fallback at ${width}px`, () =>
          copyFallback(page),
        );
    }
    await context.close();
  }
  await step("No browser runtime errors", () => assert.deepEqual(report.runtimeErrors, []));
} catch (error) {
  failureCount += 1;
  report.fatalError = error.stack || String(error);
  console.error(error);
} finally {
  if (browser) await browser.close();
  report.finishedAt = new Date().toISOString();
  report.summary = {
    checks: report.checks.length,
    passed: report.checks.filter((item) => item.status === "passed").length,
    failed: failureCount,
    axeScans: report.axe.length,
    axeViolations: report.axe.reduce((count, item) => count + item.violations.length, 0),
    axeIncomplete: report.axe.reduce((count, item) => count + item.incomplete.length, 0),
    runtimeErrors: report.runtimeErrors.length,
  };
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Report: ${outputPath}`);
  console.log(JSON.stringify(report.summary));
  process.exitCode = failureCount ? 1 : 0;
}
