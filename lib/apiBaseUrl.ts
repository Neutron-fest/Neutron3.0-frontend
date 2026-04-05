const trimTrailingSlashes = (value: string): string => value.replace(/\/+$/, "");

const stripApiV1Suffix = (value: string): string =>
  value.replace(/\/api\/v1\/?$/i, "");

const getBrowserDefaultBaseUrl = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:8080`;
};

export const getApiOriginBaseUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fallback = getBrowserDefaultBaseUrl() || "http://localhost:8080";

  return trimTrailingSlashes(stripApiV1Suffix(configured || fallback));
};

export const getApiV1BaseUrl = (): string => `${getApiOriginBaseUrl()}/api/v1`;