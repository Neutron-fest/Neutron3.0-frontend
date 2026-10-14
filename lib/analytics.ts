import posthog from "posthog-js";

/** Product events for the Neutron dashboard. No-op when PostHog isn't initialised (dev/localhost). */
export function track(event: string, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

export function identifyUser(user: {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}) {
  if (!posthog.__loaded || !user.id) return;
  if (posthog.get_distinct_id() === user.id) return;
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetAnalytics() {
  if (!posthog.__loaded) return;
  posthog.reset();
}
