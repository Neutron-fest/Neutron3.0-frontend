// Public PostHog project key (phc_ client key). Safe to ship in the browser bundle.
// NEXT_PUBLIC_POSTHOG_KEY overrides it, e.g. to point a fork at another project.
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_oLm8fb7L4CXDqGdJcc7a6boCtR8rVjf6dNx7G995eGdy'

// Events go through the /ingest rewrite in next.config so ad blockers don't drop them.
export const POSTHOG_API_HOST = '/ingest'
export const POSTHOG_UI_HOST = 'https://us.posthog.com'
