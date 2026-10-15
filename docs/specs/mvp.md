# mvp — MVP funcional Rotas Seguras

## Objetivo

PWA mobile-first que sugere a rota a pé mais segura à noite em Manaus-AM, priorizando iluminação e movimento. A comunidade avalia trechos e o mapa se recolore.

## Contexto

Trabalho de faculdade (Tecnologias Urbanas). Equipe: Alex Victor, Luiz Eduardo, Marcos Vinícius. Dados de segurança são MOCK verossímeis (pesquisa de base em `docs/pesquisa/manaus.md`). Disclaimer obrigatório: o app não garante segurança nem substitui serviços de emergência.

## Público

Pedestres (estudantes, trabalhadores noturnos) em Manaus que caminham à noite até escola, terminal ou casa.

## Escopo MVP

- **F1** Mapa escuro de Manaus com camada de trechos/áreas coloridos (verde/amarelo/vermelho) + legenda.
- **F2** Origem/destino (busca com sugestões mock: escolas, terminais, bairros + "minha localização" + toque no mapa) -> 2–3 rotas comparadas; a mais segura em ciano, outras cinza; card com tempo, distância, nota 0–100 e barras Luz/Fluxo/Atenção.
- **F3** Avaliar trecho: tocar no mapa/trecho -> sheet com LUZ / FLUXO / ATENÇÃO (+ comentário opcional) -> salva em localStorage -> recalcula cor e notas.
- **F4** Pontos de apoio (delegacia, UBS/SPA, terminal, comércio 24h) com ícones; rota ganha bônus ao passar perto.
- **F5** Modo horário Dia/Noite (padrão Noite; muda pesos da nota).
- **F6** Rotas-modelo: atalhos "Escola -> casa" para escolas-modelo (Zona Leste, Compensa, Centro).
- **F7** Compartilhar trajeto (Web Share API / copiar link com origem+destino na URL).
- **F8** Aviso de limite (onboarding curto + rodapé) e tela "Como funciona / fontes de dados reais".

## Fora de escopo

Backend, contas de usuário, navegação turn-by-turn, dados reais em tempo real, moderação de comentários, publicação (deploy só na T6).

## Decisões [DECIDIDO 2026-10-15]

- [DECIDIDO 2026-10-15] Stack: React + Vite + TypeScript + Leaflet (react-leaflet) + tiles CARTO dark_matter (sem chave) + vite-plugin-pwa + Tailwind v4 (shadcn só se houver componentes).
- [DECIDIDO 2026-10-15] Rotas HÍBRIDO: rota a pé real via OSRM público (alternatives) + nota calculada no cliente com dados mock; fallback para rotas pré-gravadas se a API falhar.
- [DECIDIDO 2026-10-15] Persistência em localStorage; sem backend.
- [DECIDIDO 2026-10-15] Entrega por link publicado (Vercel ou GitHub Pages) — não publicar antes da T6.
- [DECIDIDO 2026-10-15] Identidade: fundo #060b16, rota ciano #22d3ee com glow, luz âmbar #f5b544, cards escuros translúcidos arredondados, barra inferior com 4 ícones (Mapa, Camadas, Salvos, Perfil), botão flutuante de localizar; respeitar prefers-reduced-motion. Status #22c55e / #eab308 / #ef4444.
- [DECIDIDO 2026-10-15] Regra de negócio (pontuação, agregação) só em `src/domain/`; arquivos ≤300 linhas.

## Fórmula de nota

1. Amostrar a polilinha a cada ~50 m.
2. Cada amostra recebe luz/fluxo/risco do trecho/área mock mais próximo (ou default neutro), ajustados pelas avaliações da comunidade (média ponderada pelo nº de votos).
3. Nota = pesos × médias, com risco invertido (100 − risco):
   - Noite: luz 0.45, fluxo 0.35, risco 0.20
   - Dia: luz 0.15, fluxo 0.45, risco 0.40
4. Bônus de pontos de apoio a <150 m da rota (máx +10); nota limitada a 0–100.
5. Cor: ≥70 verde · 45–69 amarelo · <45 vermelho.

## Critérios de aceite

- [ ] Mapa escuro de Manaus carrega com legenda e trechos coloridos.
- [ ] Busca origem/destino retorna 2–3 rotas; a mais segura em ciano com card de nota.
- [ ] Avaliação salva em localStorage e altera cor/nota após recarregar.
- [ ] Alternar Dia/Noite muda as notas.
- [ ] Funciona sem internet com rotas pré-gravadas (fallback) e app instalável.
- [ ] Disclaimer visível no onboarding e rodapé.
- [ ] Testes vitest do domínio passam.

## Validação

```bash
npx tsc -b && npx vitest run --reporter=dot && npm run build
```

## Tarefas

- [x] **T1** — Fundação: repo, scaffold, tema, mapa mínimo, PWA, CLAUDE.md
- [x] **T2** — Dados mock tipados (trechos, áreas, pontos de apoio, lugares, rotas pré-gravadas)
- [x] **T3** — Domínio: scoring + avaliações, com testes vitest (depende de T2)
- [ ] **T4** — Mapa + camadas + legenda (depende de T2, T3)
- [ ] **T5** — Busca/rotas/card/avaliação/compartilhar (depende de T3, T4)
- [ ] **T6** — PWA final + deploy + docs (Como funciona, fontes)

## Arquivos esperados por tarefa

T1: package.json
T1: vite.config.ts
T1: src/App.tsx
T1: src/index.css
T1: CLAUDE.md
T2: src/data/
T3: src/domain/
T4: src/features/map/
T5: src/features/routes/
T5: src/services/
T6: public/
