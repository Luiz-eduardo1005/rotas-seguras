# Sessões de execução — mvp

Registro de quem executou o quê, com evidência. A spec é [`docs/specs/mvp.md`](../../docs/specs/mvp.md).

Marcadores: `[ ]` não iniciada · `[>]` em andamento · `[?]` implementada sem
validação · `[x]` concluída e validada · `[!]` bloqueada · `[~]` incerto.

Quem retoma **não confia nestes marcadores sem conferir**: compare com `git diff`
e rode os testes. O marcador diz o que o agente acreditava, não o que é verdade.

## Sessão S1 — 2026-10-15 14:36

| | |
| --- | --- |
| Branch | `HEAD` |
| Commit-base (antes desta sessão) | `1418fc2` |
| Árvore ao abrir | **suja — 5 pendente(s)** |
| Objetivo | MVP funcional Rotas Seguras |

### Checkpoints

- `2026-10-15 14:36` · HEAD `?` · **16 arquivo(s) pendentes** · commit `?` — 
  - arquivos em jogo:
    A  .claude/settings.json
    A  .continuidade
    A  .gitignore
    A  docs/PROMPT_RETOMADA.md
    A  docs/PROTOCOLO.md
    A  scripts/continuidade/checkpoint.sh
    A  scripts/continuidade/estado.sh
    A  scripts/continuidade/lib.sh
    A  scripts/continuidade/nota.sh
    A  scripts/continuidade/rastro.sh
    A  scripts/continuidade/sessao.sh
    A  scripts/continuidade/tarefa.sh
- `2026-10-15 14:36` · HEAD `1418fc2` · **3 arquivo(s) pendentes** · commit `1418fc2` — chore: inicializa repo e protocolo de continuidade
- `2026-10-15 14:37` · HEAD `1418fc2` · **12 arquivo(s) pendentes** · commit `1418fc2` — chore: inicializa repo e protocolo de continuidade
  - arquivos em jogo:
    ?? .oxlintrc.json
    ?? index.html
    ?? package-lock.json
    ?? package.json
    ?? src/
    ?? tsconfig.app.json
    ?? tsconfig.json
    ?? tsconfig.node.json
    ?? vite.config.ts
- `2026-10-15 14:38` · HEAD `1418fc2` · **13 arquivo(s) pendentes** · commit `1418fc2` — chore: inicializa repo e protocolo de continuidade
  - arquivos em jogo:
    ?? .oxlintrc.json
    ?? index.html
    ?? package-lock.json
    ?? package.json
    ?? public/
    ?? src/
    ?? tsconfig.app.json
    ?? tsconfig.json
    ?? tsconfig.node.json
    ?? vite.config.ts
- `2026-10-15 14:38` · HEAD `1418fc2` · **14 arquivo(s) pendentes** · T1 feita, build ok
  - arquivos em jogo:
    ?? .oxlintrc.json
    ?? CLAUDE.md
    ?? index.html
    ?? package-lock.json
    ?? package.json
    ?? public/
    ?? src/
    ?? tsconfig.app.json
    ?? tsconfig.json
    ?? tsconfig.node.json
    ?? vite.config.ts
- `2026-10-15 14:38` · HEAD `ca173f3` · árvore limpa · commit `ca173f3` — feat: scaffold Vite + React + Leaflet + Tailwind v4 + PWA
- `2026-10-15 14:38` · HEAD `ca173f3` · **2 arquivo(s) pendentes** · commit `ca173f3` — feat: scaffold Vite + React + Leaflet + Tailwind v4 + PWA
- `2026-10-15 14:39` · HEAD `ca173f3` · **4 arquivo(s) pendentes** · commit `ca173f3` — feat: scaffold Vite + React + Leaflet + Tailwind v4 + PWA
- `2026-10-15 14:40` · HEAD `ca173f3` · **4 arquivo(s) pendentes** · commit `ca173f3` — feat: scaffold Vite + React + Leaflet + Tailwind v4 + PWA
- `2026-10-15 14:41` · HEAD `ca173f3` · **10 arquivo(s) pendentes** · commit `ca173f3` — feat: scaffold Vite + React + Leaflet + Tailwind v4 + PWA
  - arquivos em jogo:
    ?? src/domain/avaliacoes.test.ts
    ?? src/domain/avaliacoes.ts
    ?? src/domain/geo.ts
    ?? src/domain/pontuacao.test.ts
    ?? src/domain/pontuacao.ts
    ?? src/domain/tipos.ts
- `2026-10-15 14:41` · HEAD `ed38bdb` · **5 arquivo(s) pendentes** · T3 domínio + testes ok
- `2026-10-15 14:41` · HEAD `fc99b4f` · **1 arquivo(s) pendentes** · commit `fc99b4f` — docs: T3 concluída e commit-base da sessão
- `2026-10-15 14:44` · HEAD `7e8ebd3` · **5 arquivo(s) pendentes** · commit `7e8ebd3` — feat(estado): contexto do app
  - arquivos em jogo:
    ?? docs/pesquisa/
- `2026-10-15 14:44` · HEAD `c3fee4b` · **5 arquivo(s) pendentes** · commit `c3fee4b` — feat(estado): contexto do app
  - arquivos em jogo:
    ?? docs/pesquisa/
- `2026-10-15 14:44` · HEAD `c3fee4b` · **5 arquivo(s) pendentes** · commit `c3fee4b` — feat(estado): contexto do app
  - arquivos em jogo:
    ?? docs/pesquisa/
- `2026-10-15 14:45` · HEAD `c3fee4b` · **11 arquivo(s) pendentes** · commit `c3fee4b` — feat(estado): contexto do app
  - arquivos em jogo:
     M src/App.tsx
    ?? docs/pesquisa/
    ?? src/components/AvisoOnboarding.tsx
    ?? src/components/BarraNavegacao.tsx
    ?? src/components/Legenda.tsx
    ?? src/components/Painel.tsx
    ?? src/components/SeletorPeriodo.tsx
- `2026-10-15 14:45` · HEAD `405342a` · **5 arquivo(s) pendentes** · T5 parte 1: serviços/estado/casca ok
  - arquivos em jogo:
    ?? docs/pesquisa/
- `2026-10-15 14:45` · HEAD `405342a` · **5 arquivo(s) pendentes** · commit `405342a` — feat(ui): navegação, legenda, período e aviso
  - arquivos em jogo:
    ?? docs/pesquisa/
- `2026-10-15 14:49` · HEAD `405342a` · **14 arquivo(s) pendentes** · T2 dados mock ok
  - arquivos em jogo:
    ?? docs/pesquisa/
    ?? scripts/gerar-dados.mjs
    ?? src/data/apoio.ts
    ?? src/data/areas.ts
    ?? src/data/dados.test.ts
    ?? src/data/index.ts
    ?? src/data/lugares.ts
    ?? src/data/rotasPregravadas.ts
    ?? src/data/trechos.ts
- `2026-10-15 14:49` · HEAD `9b4073b` · árvore limpa · commit `9b4073b` — docs: T2 concluída na spec
- `2026-10-15 14:52` · HEAD `9b4073b` · **6 arquivo(s) pendentes** · commit `9b4073b` — docs: T2 concluída na spec
  - arquivos em jogo:
     M src/data/dados.test.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
    ?? src/features/mapa/
- `2026-10-15 14:53` · HEAD `9b4073b` · **9 arquivo(s) pendentes** · commit `9b4073b` — docs: T2 concluída na spec
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
    ?? src/features/mapa/
- `2026-10-15 14:53` · HEAD `9b4073b` · **9 arquivo(s) pendentes** · commit `9b4073b` — docs: T2 concluída na spec
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
    ?? src/features/mapa/
- `2026-10-15 14:53` · HEAD `9b4073b` · **14 arquivo(s) pendentes** · commit `9b4073b` — docs: T2 concluída na spec
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
     M src/index.css
     M src/services/armazenamento.ts
    ?? src/data/tmp.test.ts
    ?? src/features/mapa/
    ?? src/features/rotas/
- `2026-10-15 14:53` · HEAD `9b4073b` · **13 arquivo(s) pendentes** · commit `9b4073b` — docs: T2 concluída na spec
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
     M src/index.css
     M src/services/armazenamento.ts
    ?? src/features/mapa/
    ?? src/features/rotas/
- `2026-10-15 14:53` · HEAD `9b4073b` · **13 arquivo(s) pendentes** · commit `9b4073b` — docs: T2 concluída na spec
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
     M src/index.css
     M src/services/armazenamento.ts
    ?? src/features/mapa/
    ?? src/features/rotas/
- `2026-10-15 14:54` · HEAD `9b4073b` · **13 arquivo(s) pendentes** · commit `9b4073b` — docs: T2 concluída na spec
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
     M src/index.css
     M src/services/armazenamento.ts
    ?? src/features/mapa/
    ?? src/features/rotas/
- `2026-10-15 14:54` · HEAD `c5da09d` · **10 arquivo(s) pendentes** · commit `c5da09d` — feat(mapa): avaliação de trecho e botão localizar
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/services/armazenamento.ts
    ?? src/data/tmp.test.ts
    ?? src/features/rotas/
- `2026-10-15 14:54` · HEAD `c5da09d` · **9 arquivo(s) pendentes** · commit `c5da09d` — feat(mapa): avaliação de trecho e botão localizar
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/services/armazenamento.ts
    ?? src/features/rotas/
- `2026-10-15 14:55` · HEAD `c5da09d` · **9 arquivo(s) pendentes** · commit `c5da09d` — feat(mapa): avaliação de trecho e botão localizar
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/services/armazenamento.ts
    ?? src/features/rotas/
- `2026-10-15 14:55` · HEAD `c5da09d` · **9 arquivo(s) pendentes** · commit `c5da09d` — feat(mapa): avaliação de trecho e botão localizar
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
     M src/services/armazenamento.ts
    ?? src/features/rotas/
- `2026-10-15 14:55` · HEAD `801e76d` · **7 arquivo(s) pendentes** · commit `801e76d` — feat(rotas): compartilhar e rotas salvas
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
- `2026-10-15 14:55` · HEAD `801e76d` · **7 arquivo(s) pendentes** · commit `801e76d` — feat(rotas): compartilhar e rotas salvas
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
- `2026-10-15 14:55` · HEAD `801e76d` · **7 arquivo(s) pendentes** · commit `801e76d` — feat(rotas): compartilhar e rotas salvas
  - arquivos em jogo:
     M scripts/gerar-dados.mjs
     M src/data/dados.test.ts
     M src/data/rotasPregravadas.ts
     M src/data/trechos.ts
- `2026-10-15 14:55` · HEAD `1316626` · **3 arquivo(s) pendentes** · commit `1316626` — fix(data): contraste entre alternativas nas rotas-modelo
- `2026-10-15 14:57` · HEAD `8bd1183` · **3 arquivo(s) pendentes** · commit `8bd1183` — docs: CLAUDE.md com mapa das features
- `2026-10-15 14:57` · HEAD `8bd1183` · **4 arquivo(s) pendentes** · commit `8bd1183` — docs: CLAUDE.md com mapa das features
  - arquivos em jogo:
    ?? .claude/launch.json
- `2026-10-15 14:59` · HEAD `8bd1183` · **14 arquivo(s) pendentes** · commit `8bd1183` — docs: CLAUDE.md com mapa das features
  - arquivos em jogo:
     M index.html
     M package-lock.json
     M package.json
     M vite.config.ts
    ?? .claude/launch.json
    ?? public/apple-touch-icon.png
    ?? public/favicon.svg
    ?? public/maskable-512.png
    ?? public/pwa-192.png
    ?? public/pwa-512.png
    ?? scripts/gerar-icones.mjs
- `2026-10-15 15:00` · HEAD `8bd1183` · **16 arquivo(s) pendentes** · commit `8bd1183` — docs: CLAUDE.md com mapa das features
  - arquivos em jogo:
     M index.html
     M package-lock.json
     M package.json
     M vite.config.ts
    ?? .claude/launch.json
    ?? README.md
    ?? public/apple-touch-icon.png
    ?? public/favicon.svg
    ?? public/maskable-512.png
    ?? public/pwa-192.png
    ?? public/pwa-512.png
    ?? scripts/gerar-icones.mjs
- `2026-10-15 15:00` · HEAD `95d2e3b` · **13 arquivo(s) pendentes** · commit `95d2e3b` — chore: config de deploy e README
  - arquivos em jogo:
     M src/App.tsx
     M src/features/mapa/CamadasMapa.tsx
     M src/features/rotas/CamadaRotas.tsx
     M src/features/rotas/PainelRotas.tsx
     M src/features/rotas/RotasEstado.tsx
     M src/index.css
    ?? .claude/launch.json
    ?? src/features/mapa/CamadaAvaliacoes.tsx
    ?? src/features/rotas/mesclarRotas.test.ts
    ?? src/features/rotas/mesclarRotas.ts
- `2026-10-15 15:00` · HEAD `9a0ef58` · **4 arquivo(s) pendentes** · commit `9a0ef58` — feat(mapa): camada de avaliações da comunidade
  - arquivos em jogo:
    ?? .claude/launch.json
- `2026-10-15 15:06` · HEAD `9a0ef58` · **5 arquivo(s) pendentes** · commit `9a0ef58` — feat(mapa): camada de avaliações da comunidade
  - arquivos em jogo:
    ?? .claude/launch.json
    ?? src/data/_repro.test.ts
- `2026-10-15 15:08` · HEAD `adf1fd6` · **3 arquivo(s) pendentes** · commit `adf1fd6` — docs: atualiza CLAUDE.md (tiles) e config de preview
- `2026-10-15 15:09` · HEAD `adf1fd6` · **4 arquivo(s) pendentes** · MVP funcional verificado no navegador; publicando no GitHub
- `2026-10-15 15:09` · HEAD `9011cd8` · árvore limpa · commit `9011cd8` — docs: estado do MVP e sessão
- `2026-10-15 15:10` · HEAD `9011cd8` · **2 arquivo(s) pendentes** · commit `9011cd8` — docs: estado do MVP e sessão
- `2026-10-15 15:12` · HEAD `9011cd8` · **2 arquivo(s) pendentes** · commit `9011cd8` — docs: estado do MVP e sessão
- `2026-10-15 15:13` · HEAD `9011cd8` · **4 arquivo(s) pendentes** · commit `9011cd8` — docs: estado do MVP e sessão
  - arquivos em jogo:
     M .claude/launch.json
- `2026-10-15 15:15` · HEAD `9011cd8` · **14 arquivo(s) pendentes** · commit `9011cd8` — docs: estado do MVP e sessão
  - arquivos em jogo:
     M .claude/launch.json
     M src/domain/geo.ts
     M src/features/estado/AppEstado.tsx
     M src/features/mapa/FolhaAvaliacao.tsx
     M src/features/rotas/RotasEstado.tsx
     M src/features/rotas/compartilhar.ts
     M src/main.tsx
     M src/services/armazenamento.ts
     M vite.config.ts
    ?? src/components/LimiteErro.tsx
    ?? src/lib/
- `2026-10-15 15:15` · HEAD `8488f56` · **13 arquivo(s) pendentes** · commit `8488f56` — perf(build): chunks vendor e cache do SW só para tiles
  - arquivos em jogo:
     M .claude/launch.json
     M src/domain/geo.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
     M src/features/rotas/CamadaRotas.tsx
     M src/features/rotas/PainelRotas.tsx
     M src/features/rotas/RotasEstado.tsx
     M src/features/rotas/compartilhar.test.ts
     M src/features/rotas/compartilhar.ts
    ?? src/lib/
- `2026-10-15 15:15` · HEAD `8488f56` · **13 arquivo(s) pendentes** · commit `8488f56` — perf(build): chunks vendor e cache do SW só para tiles
  - arquivos em jogo:
     M .claude/launch.json
     M src/domain/geo.ts
     M src/domain/pontuacao.test.ts
     M src/domain/pontuacao.ts
     M src/features/rotas/CamadaRotas.tsx
     M src/features/rotas/PainelRotas.tsx
     M src/features/rotas/RotasEstado.tsx
     M src/features/rotas/compartilhar.test.ts
     M src/features/rotas/compartilhar.ts
    ?? src/lib/
- `2026-10-15 15:15` · HEAD `7075629` · **5 arquivo(s) pendentes** · commit `7075629` — refactor(domain): nível de fator e resumo de rota saem da UI
  - arquivos em jogo:
     M .claude/launch.json
    ?? src/lib/
- `2026-10-15 15:16` · HEAD `c74e8c9` · **3 arquivo(s) pendentes** · commit `c74e8c9` — chore: config de preview do build
- `2026-10-15 15:16` · HEAD `c74e8c9` · **3 arquivo(s) pendentes** · commit `c74e8c9` — chore: config de preview do build
- `2026-10-15 15:17` · HEAD `c74e8c9` · **3 arquivo(s) pendentes** · commit `c74e8c9` — chore: config de preview do build
- `2026-10-15 15:17` · HEAD `c74e8c9` · **3 arquivo(s) pendentes** · QA final: correções aplicadas, validação completa ok
- `2026-10-15 15:17` · HEAD `f395eea` · **1 arquivo(s) pendentes** · commit `f395eea` — docs: estado pós QA final
- `2026-10-15 15:17` · HEAD `5d5cc2f` · árvore limpa · commit `5d5cc2f` — docs: registro do checkpoint QA final
- `2026-10-15 15:20` · HEAD `00243f1` · **9 arquivo(s) pendentes** · commit `00243f1` — fix(rotas): mensagem de localização sem https
  - arquivos em jogo:
     M src/App.tsx
     M src/features/mapa/BotaoLocalizar.tsx
     M src/features/mapa/CamadaAreas.tsx
     M src/features/mapa/CamadaAvaliacoes.tsx
     M src/features/mapa/CamadaTrechos.tsx
     M src/features/mapa/CamadasMapa.tsx
- `2026-10-15 15:21` · HEAD `e5769d8` · **3 arquivo(s) pendentes** · commit `e5769d8` — fix(mapa): mensagem de localização sem https
- `2026-10-15 15:24` · HEAD `e5769d8` · **3 arquivo(s) pendentes** · commit `e5769d8` — fix(mapa): mensagem de localização sem https
- `2026-10-15 15:25` · HEAD `e5769d8` · **3 arquivo(s) pendentes** · commit `e5769d8` — fix(mapa): mensagem de localização sem https
- `2026-10-15 15:25` · HEAD `e5769d8` · **3 arquivo(s) pendentes** · Itens baixos do QA resolvidos e verificados no navegador
