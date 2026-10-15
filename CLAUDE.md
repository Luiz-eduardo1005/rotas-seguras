# Rotas Seguras

PWA mobile-first (trabalho de faculdade, Tecnologias Urbanas) que sugere a rota a pé mais segura à noite em Manaus-AM (luz + fluxo + risco). Comunidade avalia trechos. Dados MOCK verossímeis. Disclaimer obrigatório: não garante segurança nem substitui emergência.

## Stack
React 19 + Vite 8 + TypeScript, Leaflet/react-leaflet (tiles OSM padrão com filtro CSS escuro/claro por período; CARTO passou a exigir API key), Tailwind v4 (`@theme` em `src/index.css`), vite-plugin-pwa, vitest, lucide-react. Rotas: OSRM público + fallback pré-gravado. Persistência: localStorage (sem backend).

## Estrutura
- `src/domain/` — regra de negócio pura (nota, agregação, geo, relatos). NUNCA em UI. Detalhe: `src/domain/CLAUDE.md`.
- `src/data/` — cenário SIMULADO gerado (áreas de todos os bairros, trechos, apoio, lugares, rotas pré-gravadas, relatos semente). Gerador `scripts/gerar-dados.mjs` + `scripts/lib/*`; fontes em `docs/pesquisa/manaus-v2.{md,json}`. Detalhe: `src/data/CLAUDE.md`.
- `src/services/` — `rotasApi` (OSRM), `armazenamento` (avaliações/prefs/salvas), `historicoStorage`, `perfilStorage`; localStorage com chaves `rotas-seguras:v1:*`.
- `src/lib/` — utilitários (`gerarId`). `src/components/` — UI reutilizável (design system do projeto).
- `src/features/` — `estado/` (AppEstado), `mapa/` (camadas canvas, folha de avaliação), `rotas/` (busca, salvos, histórico), `comunidade/` (relatos, minhas avaliações), `perfil/` (perfil local, período padrão). Detalhe: `src/features/CLAUDE.md`.
- Fluxo: `data` → `domain` → `features`. `App.tsx`: AppEstado > Perfil > Rotas > mapa/painéis.
- Regra domain≠UI: cálculo/regra só em `domain`; features chamam e exibem.
- Mapa: um `rendererCanvas` compartilhado por todas as camadas (fluidez); não criar renderer por camada.
- Docs: `docs/specs/mvp.md`, `docs/specs/v2.md`, `docs/pesquisa/`, `docs/PROTOCOLO.md`, `docs/ESTADO.md`.

## Regras
Arquivos ≤300 linhas. Reusar componente existente antes de criar. Respeitar `prefers-reduced-motion`. Paleta nos tokens `@theme` (night, route, lamp, safe/warn/danger).

## Comandos
`npm run dev` · `npm run build` · `npm test` · validação: `npx tsc -b && npm run lint && npx vitest run --reporter=dot && npm run build` · dados: `node scripts/gerar-dados.mjs`
Continuidade: `bash scripts/continuidade/checkpoint.sh "msg"`.
