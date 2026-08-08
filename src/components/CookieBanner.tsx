import React, {useEffect, useState} from 'react';

import {
  DOCS_COOKIE_CONSENT_KEY,
  captureDocsEvent,
  hasDocsAnalyticsConsent,
  syncDocsPosthogConsent,
} from '../lib/posthog';

import styles from './CookieBanner.module.css';

export default function CookieBanner(): React.JSX.Element | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const landingConsent = window.localStorage.getItem('cookie-consent');
    const docsConsent = window.localStorage.getItem(DOCS_COOKIE_CONSENT_KEY);
    if (landingConsent === 'accepted' || landingConsent === 'rejected' || docsConsent) {
      setVisible(false);
      syncDocsPosthogConsent();
      return;
    }
    setVisible(true);
  }, []);

  const setConsent = (accepted: boolean) => {
    window.localStorage.setItem(DOCS_COOKIE_CONSENT_KEY, accepted ? 'accepted' : 'rejected');
    syncDocsPosthogConsent();
    if (accepted) {
      captureDocsEvent('cookie_consent_updated', {
        accepted: true,
        status: 'accepted',
      });
    }
    window.dispatchEvent(new Event('efcDocsCookieConsentUpdate'));
    setVisible(false);
  };

  if (!visible || hasDocsAnalyticsConsent()) {
    return null;
  }

  return (
    <div className={styles.banner} role="dialog" aria-labelledby="docs-cookie-title">
      <div className={styles.card}>
        <div>
          <p id="docs-cookie-title" className={styles.title}>
            Cookies
          </p>
          <p className={styles.text}>
            Nous utilisons PostHog pour mesurer l&apos;usage de la documentation (optionnel).{' '}
            <a href="https://efactureconnect.fr/politique-de-cookies" target="_blank" rel="noreferrer">
              Politique de cookies
            </a>
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={() => setConsent(false)}>
            Refuser
          </button>
          <button type="button" className={styles.primary} onClick={() => setConsent(true)}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
