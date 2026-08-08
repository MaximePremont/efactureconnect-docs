import {buildAppCtaUrl, captureDocsEvent} from './posthog';

function resolveCta(anchor: HTMLAnchorElement): {
  kind: 'register' | 'login' | 'site';
  location: string;
} | null {
  const href = anchor.href || '';
  try {
    const url = new URL(href, window.location.origin);
    const host = url.hostname;
    if (host === 'efactureconnect.fr' || host === 'www.efactureconnect.fr') {
      if (url.pathname === '/' || url.pathname === '') {
        return {kind: 'site', location: 'navbar'};
      }
      return null;
    }
    if (host === 'app.efactureconnect.fr') {
      const location =
        url.searchParams.get('utm_content') ||
        (anchor.closest('footer') ? 'footer' : 'navbar');
      if (url.pathname.startsWith('/register')) {
        return {kind: 'register', location};
      }
      if (url.pathname.startsWith('/login')) {
        return {kind: 'login', location};
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Intercept clicks on app / site CTA links to attach ph_* params and fire analytics.
 */
export function enhanceAppCtaLinks(): () => void {
  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!anchor) {
      return;
    }

    const cta = resolveCta(anchor);
    if (!cta) {
      return;
    }

    event.preventDefault();

    if (cta.kind === 'site') {
      captureDocsEvent('cta_site_clicked', {cta_location: cta.location});
      window.location.href = 'https://efactureconnect.fr/';
      return;
    }

    captureDocsEvent(cta.kind === 'login' ? 'cta_login_clicked' : 'cta_register_clicked', {
      cta_location: cta.location,
    });
    window.location.href = buildAppCtaUrl(
      cta.kind === 'login' ? '/login' : '/register',
      cta.location,
    );
  };

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
