import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/AI-Demand-Refining' : '',
    },
    prerender: {
      entries: [
        '/',
        '/summarizer',
        '/prd', 
        '/interview',
        '/tech-guide',
        '/meeting',
        '/competitive'
      ],
      handleHttpError: 'warn'
    }
  }
};

export default config;

