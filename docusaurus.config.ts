import {config as loadEnv} from 'dotenv';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Load .env for local and Docker builds (customFields are baked at build time)
loadEnv();

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Documentation eFactureConnect',
  tagline: 'Ajoutez la facturation électronique française à Stripe',
  favicon: 'img/favicon.ico',
  titleDelimiter: '-',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://docs.efactureconnect.fr',
  baseUrl: '/',

  organizationName: 'MaximePremont',
  projectName: 'efactureconnect-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  clientModules: [require.resolve('./src/clientModules/posthog.ts')],

  customFields: {
    posthogProjectToken:
      process.env.POSTHOG_PROJECT_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || '',
    posthogHost: process.env.POSTHOG_HOST || 'https://eu.i.posthog.com',
    posthogDisabled: process.env.DISABLE_POSTHOG === 'true',
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/preview.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'eFactureConnect',
      logo: {
        alt: 'eFactureConnect Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://efactureconnect.fr',
          label: 'Site',
          position: 'right',
        },
        {
          href: 'https://app.efactureconnect.fr/login?utm_source=docs&utm_medium=docs&utm_campaign=documentation&utm_content=navbar',
          label: 'Connexion',
          position: 'right',
        },
        {
          href: 'https://app.efactureconnect.fr/register?utm_source=docs&utm_medium=docs&utm_campaign=documentation&utm_content=navbar',
          label: 'Créer un compte',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'eFactureConnect',
          items: [
            {
              label: 'Site',
              href: 'https://efactureconnect.fr',
              target: '_blank',
            },
            {
              label: 'Créer un compte',
              href: 'https://app.efactureconnect.fr/register?utm_source=docs&utm_medium=docs&utm_campaign=documentation&utm_content=footer',
            },
            {
              label: 'Contact',
              href: 'mailto:support@efactureconnect.fr',
            },
          ],
        },
        {
          title: 'Légal',
          items: [
            {
              label: 'Mentions légales',
              href: 'https://efactureconnect.fr/mentions-legales',
              target: '_blank',
            },
            {
              label: 'Politique de confidentialité',
              href: 'https://efactureconnect.fr/politique-de-confidentialite',
              target: '_blank',
            },
            {
              label: 'Politique de cookies',
              href: 'https://efactureconnect.fr/politique-de-cookies',
              target: '_blank',
            },
            {
              label: 'RGPD',
              href: 'https://efactureconnect.fr/rgpd',
              target: '_blank',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} eFactureConnect.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
