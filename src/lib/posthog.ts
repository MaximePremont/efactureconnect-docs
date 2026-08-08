import posthog from 'posthog-js';

export const DOCS_COOKIE_CONSENT_KEY = 'efc-docs-cookie-consent';

export function hasDocsAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  // Prefer shared landing consent when present on .efactureconnect.fr
  const landingConsent = window.localStorage.getItem('cookie-consent');
  if (landingConsent === 'accepted') {
    return true;
  }
  if (landingConsent === 'rejected') {
    return false;
  }
  return window.localStorage.getItem(DOCS_COOKIE_CONSENT_KEY) === 'accepted';
}

export function syncDocsPosthogConsent(): void {
  if (typeof window === 'undefined' || !posthog.__loaded) {
    return;
  }
  if (hasDocsAnalyticsConsent()) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
}

export function captureDocsEvent(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
): void {
  if (typeof window === 'undefined' || !posthog.__loaded || !hasDocsAnalyticsConsent()) {
    return;
  }
  posthog.capture(event, {
    source: 'docs',
    app: 'docs',
    doc_path: window.location.pathname,
    ...properties,
  });
}

export function buildAppCtaUrl(
  path: '/register' | '/login',
  ctaLocation: string,
): string {
  const url = new URL(`https://app.efactureconnect.fr${path}`);
  url.searchParams.set('utm_source', 'docs');
  url.searchParams.set('utm_medium', 'docs');
  url.searchParams.set('utm_campaign', 'documentation');
  url.searchParams.set('utm_content', ctaLocation);

  if (typeof window !== 'undefined' && posthog.__loaded && hasDocsAnalyticsConsent()) {
    const distinctId = posthog.get_distinct_id();
    const sessionId = posthog.get_session_id();
    if (distinctId) {
      url.searchParams.set('ph_distinct_id', distinctId);
    }
    if (sessionId) {
      url.searchParams.set('ph_session_id', sessionId);
    }
  }

  return url.toString();
}
