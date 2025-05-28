// tests/e2e/token-refresh.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Token refresh flow', () => {
  test('should transparently renew accessToken when expired', async ({
    page,
    context,
  }) => {
    // 1) Faça login
    await page.goto('http://localhost:3000/login');
    await page.fill('input#email', 'admin@oficina.com');
    await page.fill('input#password', 'admin123');
    await page.click('button[type=submit]');

    // Aguarde navegação pro painel
    await page.waitForURL('**/painel');

    // 2) Capture todas as cookies do domínio
    const cookies = await context.cookies();
    // Identifique o refreshToken
    const refreshTokenCookie = cookies.find((c) => c.name === 'refreshToken');
    expect(refreshTokenCookie).toBeDefined();

    // 3) Remova todas as cookies (simula expiração do accessToken)
    await context.clearCookies();
    // 4) Reponha apenas o refreshToken no contexto
    await context.addCookies([refreshTokenCookie!]);

    // 5) Interaja com a página para disparar a chamada protegida
    //    (botão que você já adicionou no Dashboard)
    await page.click('text=Testar Refresh');

    // 6) Aguarde e confira que os dados aparecem (indicando sucesso)
    await expect(
      page.locator('h1:has-text("Bem-vindo ao painel!")')
    ).toBeVisible();
    // opcional: verifique uma linha da lista de clientes
    await expect(page.locator('tbody tr').first()).toBeVisible();
  });
});
