import { defineConfig } from '@playwright/test';
import config from './playwright.config';
export default defineConfig({
  ...config,
  testMatch: 'mobile-release.spec.ts',
  use: { ...config.use, browserName: 'webkit', channel: undefined },
});
