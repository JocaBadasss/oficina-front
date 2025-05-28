# Test info

- Name: Token refresh flow >> should transparently renew accessToken when expired
- Location: /home/joca/Documents/Trabalhos/oficina-front/tests/e2e/token-refresh.spec.ts:5:7

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Testar Refresh')

    at /home/joca/Documents/Trabalhos/oficina-front/tests/e2e/token-refresh.spec.ts:31:16
```

# Page snapshot

```yaml
- complementary:
  - img "Ícone de engrenagem"
  - text: OFICINA
  - navigation:
    - link "Painel":
      - /url: /painel
    - link "Novo Atendimento":
      - /url: /novo-atendimento
    - link "Clientes":
      - /url: /clientes
    - link "Veículos":
      - /url: /veiculos
    - link "Ordens":
      - /url: /ordens
    - link "Agendamentos":
      - /url: /agendamentos
    - link "Configurações":
      - /url: /configuracoes
- banner:
  - heading "Painel" [level=1]
  - paragraph: Confiança e qualidade no serviço.
  - text: Olá, Administrador
  - button "Logout"
- main:
  - heading "Visão Geral" [level=1]
  - link "0 Agendamentos Hoje":
    - /url: /agendamentos
    - heading "0" [level=2]
    - paragraph: Agendamentos Hoje
  - link "29 Ordens Abertas":
    - /url: /ordens
    - heading "29" [level=2]
    - paragraph: Ordens Abertas
  - heading "Agendamentos" [level=3]
  - paragraph: Nenhum agendamento pendente.
  - heading "Ordens de Serviço" [level=3]
  - list:
    - listitem:
      - link "5 FFF5555 Aguardando":
        - /url: /ordens/749df8b9-1947-40cb-a442-488a2c2221fd
        - strong: "5"
        - text: FFF5555 Aguardando
    - listitem:
      - link "QQQ1111 Aguardando":
        - /url: /ordens/8e335621-796b-4ed8-b09d-13f0e834347b
        - strong
        - text: QQQ1111 Aguardando
    - listitem:
      - link "FAS3151 Em andamento":
        - /url: /ordens/658f8113-9211-44f0-a139-277667efbeea
        - strong
        - text: FAS3151 Em andamento
    - listitem:
      - link "ABC2222 Aguardando":
        - /url: /ordens/466faf93-88d8-43cd-b87e-9f9a4b0af8a2
        - strong
        - text: ABC2222 Aguardando
    - listitem:
      - link "sxzsdvcxzv zxvzxv 1920 AAA1111 Aguardando":
        - /url: /ordens/34ffc178-f5c9-4532-a1da-a10fe6b3a28e
        - strong: sxzsdvcxzv zxvzxv 1920
        - text: AAA1111 Aguardando
    - listitem:
      - link "safsaf asfasf 1920 KDF3344 Aguardando":
        - /url: /ordens/58e632c6-56b6-49e3-a6d4-c2ad4b3eadfe
        - strong: safsaf asfasf 1920
        - text: KDF3344 Aguardando
    - listitem:
      - link "asfasfsaf asfasfsa 1928 SAF1241 Aguardando":
        - /url: /ordens/4ff1676f-90d7-4e8e-b996-920d74a85911
        - strong: asfasfsaf asfasfsa 1928
        - text: SAF1241 Aguardando
    - listitem:
      - link "sasf sfasa 1920 BRA3A34 Aguardando":
        - /url: /ordens/daec3e7a-3439-4a49-8203-f9e0c85f3ec1
        - strong: sasf sfasa 1920
        - text: BRA3A34 Aguardando
    - listitem:
      - link "GVT1938 Aguardando":
        - /url: /ordens/574d0729-8856-481b-bb5a-0ff001b95f14
        - strong
        - text: GVT1938 Aguardando
    - listitem:
      - link "VBS6346 Aguardando":
        - /url: /ordens/d31e4875-ded4-4d52-940b-04de2d1b3430
        - strong
        - text: VBS6346 Aguardando
    - listitem:
      - link "ASF2141 Aguardando":
        - /url: /ordens/26945e1e-aa34-4347-a2b2-a82279f44bf1
        - strong
        - text: ASF2141 Aguardando
    - listitem:
      - link "Volkswagen Gol 2015 BRA3E14 Aguardando":
        - /url: /ordens/4111d0ca-e72c-424a-992d-749b99285233
        - strong: Volkswagen Gol 2015
        - text: BRA3E14 Aguardando
    - listitem:
      - link "Volkswagen Gol 2015 BRA9E14 Aguardando":
        - /url: /ordens/efb6d433-2cee-4623-a523-eb37efd4cfdc
        - strong: Volkswagen Gol 2015
        - text: BRA9E14 Aguardando
    - listitem:
      - link "Volkswagen Gol 2015 BRA7E14 Aguardando":
        - /url: /ordens/8a6b352b-b452-4dd2-88f0-9acef4ae9887
        - strong: Volkswagen Gol 2015
        - text: BRA7E14 Aguardando
    - listitem:
      - link "Volkswagen Gol 2015 BRA2E14 Aguardando":
        - /url: /ordens/031f6eca-da00-4b27-8378-f4c3745f2b37
        - strong: Volkswagen Gol 2015
        - text: BRA2E14 Aguardando
    - listitem:
      - link "BUCETA Uno 2012 ABC1234 Aguardando":
        - /url: /ordens/4ce78a14-fc05-4b37-964f-76dc890e027f
        - strong: BUCETA Uno 2012
        - text: ABC1234 Aguardando
    - listitem:
      - link "BRA1234 Aguardando":
        - /url: /ordens/86b71dab-f1be-44a2-badf-511d8498dd4c
        - strong
        - text: BRA1234 Aguardando
    - listitem:
      - link "ASF-4636 Aguardando":
        - /url: /ordens/d35f5938-d25c-45a7-b489-06fd384c56fb
        - strong
        - text: ASF-4636 Aguardando
    - listitem:
      - link "DAS-5212 Aguardando":
        - /url: /ordens/5f9d3e02-fef3-4a53-ad48-88ded3f6d897
        - strong
        - text: DAS-5212 Aguardando
    - listitem:
      - link "SAF-2141 Aguardando":
        - /url: /ordens/7e2049d0-9f29-4fce-b3f5-fbaa9a9fcb24
        - strong
        - text: SAF-2141 Aguardando
    - listitem:
      - link "ASF-2432 Aguardando":
        - /url: /ordens/56f62049-6f57-4532-97ca-10d703ba2e56
        - strong
        - text: ASF-2432 Aguardando
    - listitem:
      - link "SAF-1234 Aguardando":
        - /url: /ordens/b264f33c-b2cf-46ed-9017-21291e8ef817
        - strong
        - text: SAF-1234 Aguardando
    - listitem:
      - link "ASF-1412 Aguardando":
        - /url: /ordens/69984b71-e669-4483-a026-97fefe5f50ea
        - strong
        - text: ASF-1412 Aguardando
    - listitem:
      - link "Volkswagen Fusca 1980 FGH-4566 Aguardando":
        - /url: /ordens/8aff471b-8293-4457-8e10-ff40d685b27b
        - strong: Volkswagen Fusca 1980
        - text: FGH-4566 Aguardando
    - listitem:
      - link "FHH-5555 Aguardando":
        - /url: /ordens/3d85e1de-bdf1-4caf-86d9-8fb350aa92ee
        - strong
        - text: FHH-5555 Aguardando
    - listitem:
      - link "AAA-9876 Aguardando":
        - /url: /ordens/344ae2fd-4817-48be-96ec-46d9e1dd6c6c
        - strong
        - text: AAA-9876 Aguardando
    - listitem:
      - link "HJF-4444 Em andamento":
        - /url: /ordens/e91a5aa9-f75a-45b3-b13e-2559a6f5c553
        - strong
        - text: HJF-4444 Em andamento
    - listitem:
      - link "AAA-2222 Aguardando":
        - /url: /ordens/e74ac583-a449-4830-85f4-dbc48ddaef94
        - strong
        - text: AAA-2222 Aguardando
    - listitem:
      - link "Volkswagen Fusca 1989 TTT-2222 Aguardando":
        - /url: /ordens/7da18ce8-efcb-4ab1-bc43-942784f65a8c
        - strong: Volkswagen Fusca 1989
        - text: TTT-2222 Aguardando
- region "Notifications (F8)":
  - list
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | // tests/e2e/token-refresh.spec.ts
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | test.describe('Token refresh flow', () => {
   5 |   test('should transparently renew accessToken when expired', async ({
   6 |     page,
   7 |     context,
   8 |   }) => {
   9 |     // 1) Faça login
  10 |     await page.goto('http://localhost:3000/login');
  11 |     await page.fill('input#email', 'admin@oficina.com');
  12 |     await page.fill('input#password', 'admin123');
  13 |     await page.click('button[type=submit]');
  14 |
  15 |     // Aguarde navegação pro painel
  16 |     await page.waitForURL('**/painel');
  17 |
  18 |     // 2) Capture todas as cookies do domínio
  19 |     const cookies = await context.cookies();
  20 |     // Identifique o refreshToken
  21 |     const refreshTokenCookie = cookies.find((c) => c.name === 'refreshToken');
  22 |     expect(refreshTokenCookie).toBeDefined();
  23 |
  24 |     // 3) Remova todas as cookies (simula expiração do accessToken)
  25 |     await context.clearCookies();
  26 |     // 4) Reponha apenas o refreshToken no contexto
  27 |     await context.addCookies([refreshTokenCookie!]);
  28 |
  29 |     // 5) Interaja com a página para disparar a chamada protegida
  30 |     //    (botão que você já adicionou no Dashboard)
> 31 |     await page.click('text=Testar Refresh');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  32 |
  33 |     // 6) Aguarde e confira que os dados aparecem (indicando sucesso)
  34 |     await expect(
  35 |       page.locator('h1:has-text("Bem-vindo ao painel!")')
  36 |     ).toBeVisible();
  37 |     // opcional: verifique uma linha da lista de clientes
  38 |     await expect(page.locator('tbody tr').first()).toBeVisible();
  39 |   });
  40 | });
  41 |
```