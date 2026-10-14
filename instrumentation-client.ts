import posthog from "posthog-js";
import {
  POSTHOG_API_HOST,
  POSTHOG_KEY,
  POSTHOG_UI_HOST,
} from "@/lib/posthog-config";

const isLocalhost =
  typeof window !== "undefined" &&
  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const enabled =
  process.env.NODE_ENV === "production" &&
  (!isLocalhost || !!process.env.NEXT_PUBLIC_POSTHOG_KEY);

if (enabled && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_API_HOST,
    ui_host: POSTHOG_UI_HOST,
    defaults: "2026-08-30",
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: true,
    enable_heatmaps: true,
    capture_dead_clicks: true,
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    session_recording: { maskAllInputs: true },
  });
  posthog.register({ app: "neutron-frontend" });
}
