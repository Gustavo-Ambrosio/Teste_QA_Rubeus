import { test, expect } from '@playwright/test';

/**
 * ============================================================
 * TESTES AUTOMATIZADOS — Página /certificacao
 * Processo Seletivo QA Rubeus
 * URL: https://qualidade.apprbs.com.br/certificacao
 * ============================================================
 *
 * Cobertura:
 *  - Carregamento da página e título
 *  - Item 01: Spinner infinito + Erro 403 no formulário
 *  - Item 03: Botões CTA com destinos inconsistentes
 *  - Item 04: Conteúdo Lorem Ipsum em produção
 *  - Item 05: Typo "Salba mais" nos botões
 *  - Item 07: Logo sem link para a Home
 *  - Item 08: Ícone YouTube linkando para TikTok
 *  - Item 12: Typo "Prencha este campo" nos inputs
 *  - Item 13: WhatsApp sem número definido
 *  - Item 18: Ausência de indicadores de foco (acessibilidade)
 *  - Item 19: Erros de CORS e requisições /undefined
 *  - Responsividade Mobile / Tablet
 */

const URL = 'https://qualidade.apprbs.com.br/certificacao';

test.describe('Página /certificacao — Testes de QA', () => {

  // ──────────────────────────────────────────────────────────
  // SETUP: captura de erros de console e de rede
  // ──────────────────────────────────────────────────────────
  let consoleErrors: string[] = [];
  let networkErrors: Array<{ url: string; status: number }> = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    networkErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('response', (response) => {
      if (response.status() >= 400) {
        networkErrors.push({ url: response.url(), status: response.status() });
      }
    });
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-001: Carregamento básico da página
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-001 — Página carrega com status 200 e exibe conteúdo principal', async ({ page }) => {
    const response = await page.goto(URL, { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(URL);

    // Verifica que ao menos um header/título está visível
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await page.screenshot({ path: 'test-results/cert-tc001-load.png', fullPage: false });
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-002: Item 04 — Lorem Ipsum em produção
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-002 — [ITEM-04] Detecta conteúdo Lorem Ipsum na página (Bug Crítico)', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const bodyText = await page.locator('body').innerText();
    const hasLoremIpsum = bodyText.toLowerCase().includes('lorem ipsum');

    // Este teste DEVE falhar nas páginas atuais — comprova o bug
    expect(
      hasLoremIpsum,
      'FALHA ESPERADA: A página contém texto "Lorem ipsum" — conteúdo placeholder em produção (Item 04)'
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-003: Item 05 — Typo "Salba mais"
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-003 — [ITEM-05] Detecta typo "Salba mais" em botões', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const bodyText = await page.locator('body').innerText();
    const hasSalbaMais = bodyText.toLowerCase().includes('salba');

    // Este teste DEVE falhar — comprova o bug
    expect(
      hasSalbaMais,
      'FALHA ESPERADA: Encontrado texto "Salba" na página — typo no botão (Item 05)'
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-004: Item 12 — Typo "Prencha este campo"
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-004 — [ITEM-12] Verifica typo "Prencha" no atributo title dos inputs', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const inputs = page.locator('input[title]');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const titleValue = await inputs.nth(i).getAttribute('title');
      expect(
        titleValue?.toLowerCase(),
        `Input ${i + 1} contém typo no atributo title: "${titleValue}" (Item 12)`
      ).not.toContain('prencha');
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-005: Item 07 — Logo sem link para Home
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-005 — [ITEM-07] Logo no header deve ser um link clicável para a Home', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Verifica se o logo está dentro de uma tag <a>
    const logoLink = page.locator('header a img, header a[href] img, .navbar a img').first();
    const logoImg = page.locator('header img, .navbar img, .logo img').first();

    const logoImgExists = await logoImg.count() > 0;
    if (logoImgExists) {
      const parentTag = await logoImg.evaluate((el) => el.parentElement?.tagName.toLowerCase());
      expect(
        parentTag,
        'FALHA ESPERADA: Logo não está dentro de uma tag <a> — sem link para Home (Item 07)'
      ).toBe('a');
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-006: Item 13 — WhatsApp sem número
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-006 — [ITEM-13] Link WhatsApp deve conter número de contato', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Busca links que contêm "whatsapp"
    const waLinks = page.locator('a[href*="whatsapp"]');
    const count = await waLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await waLinks.nth(i).getAttribute('href');
      const hasNumber = /wa\.me\/\d+/.test(href || '');
      expect(
        hasNumber,
        `FALHA ESPERADA: Link WhatsApp "${href}" não contém número de contato (Item 13)`
      ).toBe(true);
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-007: Validação de formulário — campos vazios
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-007 — Validação do formulário exibe mensagem ao deixar campos vazios', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Localiza o botão de avançar no formulário
    const btnAvancar = page.locator('button:has-text("Avançar"), button:has-text("avancar"), input[type="submit"]').first();
    const btnExists = await btnAvancar.count() > 0;

    if (btnExists) {
      await btnAvancar.click();
      await page.waitForTimeout(1000);

      // Espera que alguma mensagem de validação apareça
      const validation = page.locator('[class*="error"], [class*="invalid"], [class*="alert"], .field-error');
      const validationMessages = await validation.count();

      expect(
        validationMessages,
        'Nenhuma mensagem de validação encontrada ao tentar avançar com campos vazios'
      ).toBeGreaterThan(0);

      await page.screenshot({ path: 'test-results/cert-tc007-validation.png' });
    } else {
      test.skip();
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-008: Item 01 — Spinner infinito + Erro 403
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-008 — [ITEM-01] Formulário com dados válidos não deve retornar 403 nem spinner infinito', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Localiza campos do formulário
    const nameInput = page.locator('input[name*="nome"], input[placeholder*="Nome"], input[name*="name"]').first();
    const phoneInput = page.locator('input[name*="telefone"], input[placeholder*="Telefone"], input[type="tel"]').first();
    const emailInput = page.locator('input[name*="email"], input[placeholder*="Email"], input[type="email"]').first();
    const btnAvancar = page.locator('button:has-text("Avançar"), button:has-text("Enviar"), input[type="submit"]').first();

    const formExists = (await nameInput.count()) > 0 && (await btnAvancar.count()) > 0;

    if (formExists) {
      await nameInput.fill('Gustavo Teste');
      if (await phoneInput.count() > 0) await phoneInput.fill('(11) 98765-4321');
      if (await emailInput.count() > 0) await emailInput.fill('gustavo.teste@email.com');

      await page.screenshot({ path: 'test-results/cert-tc008-filled.png' });

      // Intercepta a resposta da requisição de envio
      const [response] = await Promise.all([
        page.waitForResponse((res) => res.url().includes('/api/') || res.url().includes('/sendData'), { timeout: 10000 }).catch(() => null),
        btnAvancar.click(),
      ]);

      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/cert-tc008-after-submit.png' });

      if (response) {
        expect(
          response.status(),
          `FALHA ESPERADA: API retornou HTTP ${response.status()} (esperado: 200/201) — Item 01`
        ).toBeLessThan(400);
      }

      // Verifica se spinner sumiu
      const spinner = page.locator('[class*="spinner"], [class*="loading"], [class*="loader"]');
      const spinnerVisible = await spinner.isVisible().catch(() => false);
      expect(
        spinnerVisible,
        'FALHA ESPERADA: Spinner ainda visível após 3s — formulário travado (Item 01)'
      ).toBe(false);
    } else {
      test.skip();
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-009: Item 03 — CTAs com destinos incorretos
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-009 — [ITEM-03] Botões CTA devem apontar para página de inscrição interna', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const ctaButtons = page.locator('a:has-text("Quero me certificar"), a:has-text("certificar"), button:has-text("certificar")');
    const count = await ctaButtons.count();

    for (let i = 0; i < count; i++) {
      const href = await ctaButtons.nth(i).getAttribute('href');
      const isExternalRedirect = href?.includes('google.com') || href?.includes('rubeus.com.br');
      expect(
        isExternalRedirect,
        `FALHA ESPERADA: CTA ${i + 1} redireciona para "${href}" — destino externo inesperado (Item 03)`
      ).toBe(false);
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-010: Item 18 — Ausência de foco visível (acessibilidade)
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-010 — [ITEM-18] Elementos interativos devem ter indicador de foco visível', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Navega com Tab e verifica foco
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'test-results/cert-tc010-focus-1.png' });

    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'test-results/cert-tc010-focus-2.png' });

    // Verifica se algum elemento tem outline visível
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return {
        tagName: el.tagName,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor,
      };
    });

    if (focusedElement) {
      const hasVisibleFocus =
        focusedElement.outlineStyle !== 'none' &&
        focusedElement.outlineWidth !== '0px';

      // Registrar resultado como aviso (não quebra o teste, documenta o bug)
      if (!hasVisibleFocus) {
        console.warn(`[ITEM-18] Elemento focado (${focusedElement.tagName}) sem outline visível. outlineStyle: ${focusedElement.outlineStyle}, outlineWidth: ${focusedElement.outlineWidth}`);
      }
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-011: Item 19 — Erros de console/CORS
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-011 — [ITEM-19] Não deve haver erros críticos no console do navegador', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });

    const criticalErrors = consoleErrors.filter(
      (err) =>
        err.includes('Error') ||
        err.includes('CORS') ||
        err.includes('SecurityError') ||
        err.includes('undefined')
    );

    if (criticalErrors.length > 0) {
      console.warn('[ITEM-19] Erros de console detectados:', criticalErrors);
    }

    // Documenta — não bloqueia, pois o ambiente de teste pode ter CORS
    expect(
      criticalErrors.length,
      `ATENÇÃO: ${criticalErrors.length} erros críticos no console: ${criticalErrors.slice(0, 3).join(' | ')}`
    ).toBe(0);
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-012: Responsividade Mobile (375x812 - iPhone)
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-012 — Responsividade: página renderiza corretamente em Mobile 375x812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/cert-tc012-mobile.png', fullPage: true });

    // Verifica que não há overflow horizontal
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });

    expect(
      hasHorizontalOverflow,
      'Página possui overflow horizontal em mobile — layout quebrado'
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-013: Item 08 — Ícone YouTube com link TikTok
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-013 — [ITEM-08] Ícone de rede social deve ter ícone coerente com o link destino', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Busca links para TikTok
    const tiktokLinks = page.locator('a[href*="tiktok"]');
    const count = await tiktokLinks.count();

    for (let i = 0; i < count; i++) {
      const link = tiktokLinks.nth(i);
      // Verifica se há ícone YouTube dentro do link TikTok
      const hasYoutubeIcon = (await link.locator('[class*="youtube"], [aria-label*="YouTube"], [title*="YouTube"]').count()) > 0;
      expect(
        hasYoutubeIcon,
        `FALHA ESPERADA: Link ${i + 1} para TikTok contém ícone YouTube — inconsistência (Item 08)`
      ).toBe(false);
    }
  });

  // ──────────────────────────────────────────────────────────
  // TC-CERT-014: SEO — Título da página não deve ser genérico
  // ──────────────────────────────────────────────────────────
  test('TC-CERT-014 — SEO: título da página não deve ser genérico ou vazio', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    console.log(`Título atual: "${title}"`);

    expect(title.length, 'Título da página está vazio').toBeGreaterThan(0);
    expect(
      ['site', 'certificacao', 'página', 'home', 'index'].includes(title.toLowerCase()),
      `ATENÇÃO: Título genérico detectado: "${title}" — ruim para SEO (Item 16/17)`
    ).toBe(false);
  });

});
