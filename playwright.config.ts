import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright — Processo Seletivo QA Rubeus
 * Páginas testadas:
 *   - https://qualidade.apprbs.com.br/certificacao
 *   - https://qualidade.apprbs.com.br/site
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'relatorio-playwright', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://qualidade.apprbs.com.br',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    headless: true,
    viewport: { width: 1280, height: 800 },
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'tablet-ipad',
      use: { ...devices['iPad (gen 7)'] },
    },
  ],
  outputDir: 'test-results',
});
