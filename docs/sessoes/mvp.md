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
