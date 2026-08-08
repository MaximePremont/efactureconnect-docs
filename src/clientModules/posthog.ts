import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import posthog from 'posthog-js';

import {hasDocsAnalyticsConsent, syncDocsPosthogConsent} from '../lib/posthog';

export default (function posthogClientModule() {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteDidUpdate({
      location,
      previousLocation,
    }: {
      location: {pathname: string};
      previousLocation?: {pathname: string};
    }) {
      if (previousLocation && previousLocation.pathname === location.pathname) {
        return;
      }
      if (!posthog.__loaded) {
        return;
      }
      syncDocsPosthogConsent();
      if (!hasDocsAnalyticsConsent()) {
        return;
      }
      posthog.capture('$pageview', {
        source: 'docs',
        app: 'docs',
        doc_path: location.pathname,
        $current_url: window.location.href,
      });
    },
  };
})();
