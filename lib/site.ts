/**
 * Single source of truth for site-wide SEO / GEO metadata.
 *
 * ⚠️  SET YOUR PRODUCTION URL: either set NEXT_PUBLIC_SITE_URL in your deploy
 * environment, or edit the fallback below. Everything (canonical URLs, sitemap,
 * Open Graph image URLs, JSON-LD) is derived from this — get it right once.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://traceapp.naviteklabs.com"
).replace(/\/$/, "");

export const APP_VERSION = "1.0.2";
export const DMG_PATH = `/downloads/Trace-${APP_VERSION}.dmg`;

export const site = {
  name: "Trace",
  publisher: "Navitek Labs",
  tagline: "An honest record of what you actually did",
  title: "Trace — An honest record of what you actually did",
  description:
    "Trace is a macOS menubar app for people running several projects at once. Log tasks and notes with slash commands in under five seconds — then watch a per-project heatmap built from your real work, not your intentions.",
  keywords: [
    "macOS menubar app",
    "developer time tracking",
    "work journal",
    "project heatmap",
    "task logging",
    "slash commands",
    "local-first productivity",
    "honest record",
  ],
  operatingSystem: "macOS 14 Sonoma or later, Apple Silicon & Intel",
  price: "0",
  priceCurrency: "USD",
};

/**
 * GEO note: LLMs and AI search engines cite clear Q&A pairs. These power the
 * FAQPage JSON-LD and are intentionally phrased as questions people actually ask.
 */
export const faqs = [
  {
    q: "What is Trace?",
    a: "Trace is a macOS menubar app for people running several projects at once. You log tasks and notes with slash commands in under five seconds, then see a per-project, GitHub-style heatmap built from your real completed work.",
  },
  {
    q: "Is Trace free?",
    a: "Yes. Trace is free to download and use. There are no accounts and no subscription.",
  },
  {
    q: "What do I need to run Trace?",
    a: "macOS 14 Sonoma or later. The app is a universal build that runs natively on both Apple Silicon and Intel Macs, and ships as a 3.3 MB .dmg.",
  },
  {
    q: "Does Trace need an account or sync my data?",
    a: "No. Everything lives in a single local SQLite file on your machine. There is no account, no cloud sync, and no network calls for logging — nothing phones home.",
  },
  {
    q: "Why is the heatmap called 'honest'?",
    a: "Only completed tasks and journal entries count toward the heatmap — creating a task does not — and once an activity is more than 24 hours old it becomes immutable. The record can't be edited into a lie.",
  },
  {
    q: "Is Trace a planner or a team tool?",
    a: "No. Trace is deliberately a single-user record of what you actually did, not a planner, team tool, knowledge base, or gamified tracker. It answers 'what have I been doing?' rather than 'what needs to be done?'",
  },
];
