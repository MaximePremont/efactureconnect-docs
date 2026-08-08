import React, {useEffect} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import posthog from 'posthog-js';

import CookieBanner from '../components/CookieBanner';
import {enhanceAppCtaLinks} from '../lib/enhance-app-cta-links';
import {hasDocsAnalyticsConsent, syncDocsPosthogConsent} from '../lib/posthog';

type RootProps = {
  children: React.ReactNode;
};

export default function Root({children}: RootProps): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    posthogProjectToken?: string;
    posthogHost?: string;
    posthogDisabled?: boolean;
  };

  useEffect(() => {
    if (customFields.posthogDisabled) {
      return;
    }
    const token = customFields.posthogProjectToken;
    if (token && !posthog.__loaded) {
      posthog.init(token, {
        api_host: customFields.posthogHost || 'https://eu.i.posthog.com',
        defaults: '2026-01-30',
        opt_out_capturing_by_default: true,
        cross_subdomain_cookie: true,
        capture_pageview: false,
        loaded: () => {
          syncDocsPosthogConsent();
          if (hasDocsAnalyticsConsent()) {
            posthog.capture('$pageview', {
              source: 'docs',
              app: 'docs',
              doc_path: window.location.pathname,
            });
          }
        },
      });
    } else if (posthog.__loaded) {
      syncDocsPosthogConsent();
    }

    const onConsent = () => {
      syncDocsPosthogConsent();
      if (hasDocsAnalyticsConsent() && posthog.__loaded) {
        posthog.capture('$pageview', {
          source: 'docs',
          app: 'docs',
          doc_path: window.location.pathname,
        });
      }
    };
    window.addEventListener('efcDocsCookieConsentUpdate', onConsent);

    const cleanupLinks = enhanceAppCtaLinks();
    return () => {
      window.removeEventListener('efcDocsCookieConsentUpdate', onConsent);
      cleanupLinks();
    };
  }, [
    customFields.posthogDisabled,
    customFields.posthogHost,
    customFields.posthogProjectToken,
  ]);

  return (
    <>
      {children}
      <CookieBanner />
    </>
  );
}
