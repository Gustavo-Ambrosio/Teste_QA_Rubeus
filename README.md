# 🧪 Testes Automatizados QA — Rubeus

Testes automatizados desenvolvidos com **Playwright + TypeScript** para o processo seletivo da Rubeus, cobrindo as páginas:

- 🎓 [https://qualidade.apprbs.com.br/certificacao](https://qualidade.apprbs.com.br/certificacao)
- 🌐 [https://qualidade.apprbs.com.br/site](https://qualidade.apprbs.com.br/site)

---

## 📋 Sumário dos Bugs Cobertos

| Item | Descrição | Tipo | Prioridade | Página |
|------|-----------|------|------------|--------|
| 01 | Spinner infinito + Erro 403 no formulário | Correção | **Alta** | /certificacao |
| 02 | Campo "Base Legal" ausente — newsletter bloqueada | Correção | **Alta** | /site |
| 03 | CTAs "Quero me certificar" com destinos incorretos | Correção | **Alta** | /certificacao |
| 04 | Lorem Ipsum em +70% do conteúdo | Correção | **Alta** | /certificacao |
| 05 | Typo "Salba mais" em botão de curso | Correção | Média | /certificacao |
| 06 | Acento ausente: "Matriculas abertas!" | Correção | Média | /site |
| 07 | Logo sem link para a Home | Correção | Média | /certificacao |
| 08 | Ícone YouTube linkando para TikTok | Correção | Média | /certificacao |
| 09 | Copyright desatualizado: "© 2022" | Correção | Baixa | /site |
| 10 | Header não fixo — desaparece ao rolar | Melhoria | Média | /site |
| 11 | Layout estreito — sem responsividade real | Melhoria | Média | /site |
| 12 | Typo "Prencha este campo" nos inputs | Correção | Baixa | Ambas |
| 13 | WhatsApp sem número de contato | Melhoria | Média | Ambas |
| 14 | Datas de eventos obsoletas (2022) | Correção | Média | /site |
| 15 | Validação e-mail com mensagem genérica | Melhoria | Baixa | /site |
| 16 | `<title>Site</title>` — título genérico | Melhoria | Baixa | /site |
| 17 | Ausência de meta description e Open Graph | Melhoria | Baixa | Ambas |
| 18 | Foco invisível em navegação por teclado (WCAG) | Melhoria | Média | Ambas |
| 19 | Erros de CORS e requisições para `/undefined` | Correção | Média | Ambas |

---

## 📁 Estrutura do Projeto

```
testes-automatizados/
├── tests/
│   ├── test_certificacao.spec.ts   # 14 test cases — /certificacao
│   └── test_site.spec.ts           # 15 test cases — /site
├── playwright.config.ts            # Configuração (Desktop, Mobile, Tablet)
├── package.json
└── README.md
```

---

## ⚙️ Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm

### Instalação

```bash
npm install
npx playwright install
```

### Executar todos os testes

```bash
npx playwright test
```

### Executar apenas /certificacao

```bash
npx playwright test tests/test_certificacao.spec.ts
```

### Executar apenas /site

```bash
npx playwright test tests/test_site.spec.ts
```

### Executar em modo visual (headed)

```bash
npx playwright test --headed
```

### Gerar e abrir relatório HTML

```bash
npx playwright show-report relatorio-playwright
```

### Executar por projeto (browser/dispositivo)

```bash
# Apenas Chrome Desktop
npx playwright test --project=chromium-desktop

# Apenas Mobile
npx playwright test --project=mobile-chrome

# Apenas Tablet
npx playwright test --project=tablet-ipad
```

---

## 🏗️ Projetos de Dispositivo Configurados

| Projeto | Dispositivo | Resolução |
|---------|-------------|-----------|
| `chromium-desktop` | Chrome Desktop | 1280×800 |
| `firefox-desktop` | Firefox Desktop | 1280×800 |
| `mobile-chrome` | Pixel 5 (Android) | 393×851 |
| `tablet-ipad` | iPad Gen 7 | 810×1080 |

---

## 📊 Resultado Esperado

A maioria dos testes está configurada para **documentar falhas existentes** — ou seja, eles falharão intencionalmente nos bugs identificados, servindo como evidência técnica do problema. Alguns testes de infraestrutura (responsividade, carregamento) devem ser aprovados.

> **Nota:** Testes que comprovam bugs são nomeados com `[ITEM-XX]` para rastreabilidade direta com o relatório de QA.

---

## 🛠️ Tecnologias

- [Playwright](https://playwright.dev/) — Framework de automação de testes
- [TypeScript](https://www.typescriptlang.org/) — Linguagem de tipagem estática
- Node.js — Runtime

---

## 👤 Autor

Desenvolvido por **Gustavo** como parte do processo seletivo para a vaga de **QA Analyst** na Rubeus.

📅 Data: Março/2026
