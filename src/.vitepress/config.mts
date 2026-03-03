import { defineConfig } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import { headerPlugin } from './headerMdPlugin'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config

type Section = {
  base: string;
  groupText: string;
  pages: Array<{ text: string; file: string }>;
};

const groupMeta: Record<string, { text: string; activeMatch: string }> = {
  web: { text: '前端', activeMatch: '^/web/' },
  back: { text: '后端', activeMatch: '^/back/' },
  database: { text: '数据库', activeMatch: '^/database/' }
};

const structure: Section[] = [
  {
    base: 'web/JavaScript',
    groupText: 'JavaScript',
    pages: [
      { text: 'JavaScript', file: 'index' },
      { text: 'day01', file: 'day01' },
      { text: 'day02', file: 'day02' }
    ]
  },
  {
    base: 'back/node',
    groupText: 'Node',
    pages: [
      { text: 'Node.js', file: 'index' },
      { text: 'day01', file: 'day01' },
      { text: 'day02', file: 'day02' }
    ]
  },
  {
    base: 'back/java',
    groupText: 'Java',
    pages: [
      { text: 'Java', file: 'index' },
      { text: 'day01', file: 'day01' },
      { text: 'day02', file: 'day02' }
    ]
  },
  {
    base: 'database/mysql',
    groupText: 'MySQL',
    pages: [
      { text: 'MySQL', file: 'index' },
      { text: 'day01', file: 'day01' },
      { text: 'day02', file: 'day02' }
    ]
  },
  {
    base: 'database/PostgreSql',
    groupText: 'PostgreSql',
    pages: [
      { text: 'PostgreSql', file: 'index' },
      { text: 'day01', file: 'day01' },
      { text: 'day02', file: 'day02' }
    ]
  }
];

const nav: ThemeConfig['nav'] = Object.entries(groupMeta).map(([prefix, meta]) => ({
  text: meta.text,
  activeMatch: meta.activeMatch,
  items: structure
    .filter(s => s.base.startsWith(prefix + '/'))
    .map(s => ({ text: s.groupText, link: `/${s.base}` }))
}));

const generatedSidebar: Record<string, unknown> = structure.reduce((acc, section) => {
  acc[`/${section.base}/`] = [
    {
      text: section.groupText,
      items: section.pages.map(p => ({ text: p.text, link: `/${section.base}/${p.file}` }))
    }
  ];
  return acc;
}, {} as Record<string, unknown>);

export const sidebar: ThemeConfig['sidebar'] = generatedSidebar as unknown as ThemeConfig['sidebar'];
export default defineConfig({
  base: '/vitepress/',
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://x.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],
    footer: {
      message: 'MIT License — https://opensource.org/licenses/MIT',
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },
  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin).use(groupIconMdPlugin)
      // .use(textAdPlugin)
    }
  },
})
