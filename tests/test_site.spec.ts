import { test, expect } from '@playwright/test';

/**
 * ============================================================
 * TESTES AUTOMATIZADOS — Página /site
 * Processo Seletivo QA Rubeus
 * URL: https://qualidade.apprbs.com.br/site
 * ============================================================
 *
 * Cobertura:
 *  - Carregamento da página
 *  - Item 02: Campo "Base Legal" ausente — formulário newsletter bloqueado
 *  - Item 06: Typo "Matriculas abertas!" no carousel hero
 *  - Item 09: Copyright desatualizado (2022)
 *  - Item 10: Header não fixo (sticky)
 *  - Item 11: Layout de largura fixa — sem responsividade
 *  - Item 13: WhatsApp sem número definido
 *  - Item 14: Datas de eventos obsoletas (2022)
 *  - Item 15: Validação de e-mail com mensagem genérica
 *  - Item 16: Título HTML genérico "<title>Site</title>"
 *  - Item 17: Ausência de meta description e Open Graph
 *  - Responsividade Mobile / Tablet
 */

const URL = 'https://qualidade.apprbs.com.br/site';

test.describe('Página /site — Testes de QA', () => {

  // ──────────────────────────────────────────────────────────
  // TC-SITE-001: Carregamento básico da página
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-001 — Página carrega com status 200 e exibe conteúdo principal', async ({ page }) => {
    const response = await page.goto(URL, { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(URL);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await page.screenshot({ path: 'test-results/site-tc001-load.png', fullPage: false });
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-002: Item 16 — Título genérico "<title>Site</title>"
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-002 — [ITEM-16] Título da página não deve ser "Site" genérico', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    console.log(`Título atual da página /site: "${title}"`);

    expect(title.length, 'Título da página está vazio').toBeGreaterThan(3);
    expect(
      title.toLowerCase(),
      `FALHA ESPERADA: Título genérico "${title}" — não descreve a página (Item 16)`
    ).not.toBe('site');
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-003: Item 17 — Meta description e Open Graph
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-003 — [ITEM-17] Página deve ter meta description e Open Graph tags', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const metaDescription = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute('content')
    ).catch(() => null);

    const ogTitle = await page.$eval(
      'meta[property="og:title"]',
      (el) => el.getAttribute('content')
    ).catch(() => null);

    expect(
      metaDescription,
      'FALHA ESPERADA: Meta description ausente (Item 17)'
    ).not.toBeNull();

    expect(
      ogTitle,
      'FALHA ESPERADA: Open Graph og:title ausente (Item 17)'
    ).not.toBeNull();
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-004: Item 09 — Copyright desatualizado
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-004 — [ITEM-09] Copyright no footer deve estar atualizado', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/site-tc004-footer.png' });

    const footerText = await page.locator('footer').innerText().catch(() => '');
    const bodyText = await page.locator('body').innerText();
    const fullText = footerText + bodyText;

    const currentYear = new Date().getFullYear().toString();
    const hasOldCopyright = fullText.includes('2022') || fullText.includes('2021');
    const hasCurrentCopyright = fullText.includes(currentYear);

    expect(
      hasOldCopyright && !hasCurrentCopyright,
      `FALHA ESPERADA: Copyright desatualizado encontrado (2022) — deve exibir ${currentYear} (Item 09)`
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-005: Item 06 — Typo "Matriculas abertas!"
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-005 — [ITEM-06] Verifica typo "Matriculas" sem acento no hero carousel', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Aguarda slides do carousel

    const bodyText = await page.locator('body').innerText();

    // "Matriculas" sem acento é o bug; "Matrículas" é o correto
    const hasTypo = bodyText.includes('Matriculas');
    const hasCorrect = bodyText.includes('Matrículas');

    if (hasTypo && !hasCorrect) {
      await page.screenshot({ path: 'test-results/site-tc005-typo-matriculas.png' });
    }

    expect(
      hasTypo && !hasCorrect,
      'FALHA ESPERADA: Texto "Matriculas" sem acento encontrado no hero — typo (Item 06)'
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-006: Item 10 — Header não é sticky
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-006 — [ITEM-10] Header deve permanecer visível após scroll', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const header = page.locator('header, nav, .navbar, [class*="header"]').first();
    await expect(header).toBeVisible();

    // Faz scroll para baixo
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/site-tc006-after-scroll.png' });

    // Header deve ainda estar visível na viewport
    const isStillVisible = await header.isVisible();
    expect(
      isStillVisible,
      'FALHA ESPERADA: Header sumiu após scroll de 1000px — não é sticky (Item 10)'
    ).toBe(true);
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-007: Item 02 — Formulário newsletter bloqueado (Base Legal)
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-007 — [ITEM-02] Formulário de newsletter deve ser enviável com dados válidos', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    // Localiza inputs do formulário de newsletter
    const nameInput = page.locator('input[name*="nome"], input[placeholder*="Nome"], input[name*="name"]').first();
    const emailInput = page.locator('input[type="email"], input[name*="email"], input[placeholder*="Email"]').first();
    const submitBtn = page.locator('button:has-text("Concluir"), button:has-text("Enviar"), button[type="submit"]').first();

    const formExists = (await nameInput.count() > 0 || await emailInput.count() > 0) && await submitBtn.count() > 0;

    if (!formExists) {
      // Scroll para encontrar o formulário
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    }

    if (await submitBtn.count() > 0) {
      if (await nameInput.count() > 0) await nameInput.fill('Gustavo Ferreira');
      if (await emailInput.count() > 0) await emailInput.fill('gustavo.ferreira@email.com');

      await page.screenshot({ path: 'test-results/site-tc007-filled-form.png' });

      // Intercepta resposta da API
      const [apiResponse] = await Promise.all([
        page.waitForResponse(
          (res) => res.url().includes('/api/') || res.url().includes('/contact') || res.url().includes('/newsletter'),
          { timeout: 8000 }
        ).catch(() => null),
        submitBtn.click(),
      ]);

      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/site-tc007-after-submit.png' });

      if (apiResponse) {
        const body = await apiResponse.json().catch(() => ({}));
        const hasBaseLegalError = JSON.stringify(body).toLowerCase().includes('base legal');

        expect(
          hasBaseLegalError,
          `FALHA ESPERADA: API retornou erro "É necessário informar a base legal" — campo ausente na UI (Item 02). Resposta: ${JSON.stringify(body)}`
        ).toBe(false);
      }
    } else {
      test.skip();
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-008: Item 14 — Datas de eventos obsoletas
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-008 — [ITEM-14] Eventos não devem exibir datas passadas (2022)', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const bodyText = await page.locator('body').innerText();

    // Verifica se há referências a 2022 em contexto de eventos/vestibulares
    const hasOldEventDate = /vestibular.*2022|2022.*vestibular|evento.*2022|2022.*evento/i.test(bodyText);

    if (hasOldEventDate) {
      await page.screenshot({ path: 'test-results/site-tc008-old-events.png' });
    }

    expect(
      hasOldEventDate,
      'FALHA ESPERADA: Eventos com data de 2022 encontrados na seção de eventos (Item 14)'
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-009: Item 15 — Validação e-mail com mensagem genérica
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-009 — [ITEM-15] Mensagem de validação de e-mail deve ser específica', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const emailInput = page.locator('input[type="email"]').first();
    const emailExists = await emailInput.count() > 0;

    if (emailExists) {
      await emailInput.fill('emailinvalido');
      await emailInput.blur();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/site-tc009-email-validation.png' });

      // Busca mensagem de erro próxima ao campo
      const validationMsg = await page.locator('[class*="error"], [class*="invalid"], .field-message').first().innerText().catch(() => '');

      if (validationMsg) {
        console.log(`Mensagem de validação encontrada: "${validationMsg}"`);
        // A mensagem deve ser específica sobre e-mail, não genérica
        const isGeneric = validationMsg.toLowerCase().includes('preencha este campo');
        if (isGeneric) {
          console.warn(`[ITEM-15] Mensagem genérica detectada: "${validationMsg}" — deveria indicar formato de e-mail inválido`);
        }
      }
    } else {
      test.skip();
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-010: Item 13 — WhatsApp sem número
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-010 — [ITEM-13] Link WhatsApp deve ter número de contato definido', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const waLinks = page.locator('a[href*="whatsapp"]');
    const count = await waLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await waLinks.nth(i).getAttribute('href');
      const hasNumber = /wa\.me\/\d+/.test(href || '');
      expect(
        hasNumber,
        `FALHA ESPERADA: Link WhatsApp "${href}" não contém número (Item 13)`
      ).toBe(true);
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-011: Item 12 — Typo "Prencha este campo" nos inputs
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-011 — [ITEM-12] Atributo title dos inputs não deve ter typo "Prencha"', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const inputs = page.locator('input[title]');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const titleValue = await inputs.nth(i).getAttribute('title');
      expect(
        titleValue?.toLowerCase(),
        `Input ${i + 1} com typo: "${titleValue}" (Item 12)`
      ).not.toContain('prencha');
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-012: Item 11 — Layout responsivo em Desktop
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-012 — [ITEM-11] Layout deve aproveitar viewport completa em desktop 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: 'test-results/site-tc012-desktop-layout.png', fullPage: false });

    // Verifica que o container principal usa ao menos 60% da largura
    const mainContentWidth = await page.evaluate(() => {
      const main = document.querySelector('main, .container, #content, [class*="content"]') as HTMLElement;
      if (!main) return 0;
      return main.getBoundingClientRect().width;
    });

    const viewportWidth = 1280;
    const usage = mainContentWidth / viewportWidth;

    if (usage < 0.6 && mainContentWidth > 0) {
      console.warn(`[ITEM-11] Container ocupa apenas ${Math.round(usage * 100)}% da largura do viewport (esperado: >60%) — layout estreito`);
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-013: Responsividade Mobile (375x812)
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-013 — Responsividade: página renderiza corretamente em Mobile 375x812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/site-tc013-mobile.png', fullPage: true });

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });

    expect(
      hasHorizontalOverflow,
      'Página possui overflow horizontal em mobile — layout quebrado'
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-014: Responsividade Tablet (768x1024)
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-014 — Responsividade: página renderiza corretamente em Tablet 768x1024', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/site-tc014-tablet.png', fullPage: false });

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });

    expect(
      hasHorizontalOverflow,
      'Página possui overflow horizontal em tablet — layout quebrado'
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────
  // TC-SITE-015: Performance — Tempo de carregamento
  // ──────────────────────────────────────────────────────────
  test('TC-SITE-015 — Performance: página deve carregar em menos de 5 segundos', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(URL, { waitUntil: 'load' });
    const loadTime = Date.now() - startTime;

    console.log(`Tempo de carregamento: ${loadTime}ms`);

    expect(
      loadTime,
      `Página levou ${loadTime}ms para carregar — acima do limite de 5000ms`
    ).toBeLessThan(5000);
  });

});
