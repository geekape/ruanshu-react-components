import { defineConfig } from 'dumi';

const repo = 'ruanshu-react-components';

export default defineConfig({
  title: repo,
  locales: [['zh-CN', '中文']],
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'doc',
  hash: true,
  // Because of using GitHub Pages
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/geekape/ruanshu-react-components.git',
    },
  ],
  // more config: https://d.umijs.org/config
});
