import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'eFactureConnect',
  tagline: 'Ajoutez la facturation électronique française à Stripe',
  favicon: 'img/favicon.ico',

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
            },
            {
              label: 'Contact',
              href: 'mailto:contact@efactureconnect.fr',
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
