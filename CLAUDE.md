# Rotas Seguras

PWA mobile-first (trabalho de faculdade, Tecnologias Urbanas) que sugere a rota a pé mais segura à noite em Manaus-AM (luz + fluxo + risco). Comunidade avalia trechos. Dados MOCK verossímeis. Disclaimer obrigatório: não garante segurança nem substitui emergência.

## Stack
React 19 + Vite 8 + TypeScript, Leaflet/react-leaflet (tiles CARTO dark_matter), Tailwind v4 (`@theme` em `src/index.css`), vite-plugin-pwa, vitest, lucide-react. Rotas: OSRM público + fallback pré-gravado. Persistência: localStorage.

## Estrutura
- `src/domain/` — regra de negócio pura (pontuação de rota, agregação de avaliações). NUNCA em componente UI. Testada com vitest.
- `src/data/` — dados mock tipados (trechos, áreas, pontos de apoio, lugares, rotas pré-gravadas).
- `src/services/` — OSRM, storage (localStorage), share.
- `src/components/` — UI reutilizável (design system do projeto).
- `src/features/` — telas/fluxos:
  - `estado/` — AppEstadoProvider: período, avaliações, agregado, aba, camadas, onboarding; preferências via ref (sem sobrescrita).
  - `mapa/` — camadas Leaflet (trechos/áreas/apoio), toque no mapa → avaliação (FolhaAvaliacao), BotaoLocalizar.
  - `rotas/` — RotasProvider (busca OSRM + fallback, pontuação, salvos, deep link), PainelRotas, CamadaRotas, ListaSalvos.
- Fluxo de dados: `data` (mock) → `domain` (pontuação/agregação puras) → `features` (estado + UI). `App.tsx` monta AppEstado > Rotas > mapa/painéis.
- Regra domain≠UI: cálculo/regra só em `domain`; features apenas chamam e exibem.
- `docs/specs/mvp.md` — spec, fórmula de nota, decisões, tarefas. `docs/pesquisa/` — pesquisa de dados reais de Manaus. `docs/PROTOCOLO.md` — continuidade.

## Regras
Arquivos ≤300 linhas. Reusar componente existente antes de criar. Respeitar `prefers-reduced-motion`. Paleta nos tokens `@theme` (night, route, lamp, safe/warn/danger).

## Comandos
`npm run dev` · `npm run build` · `npm test` · validação: `npx tsc -b && npx vitest run && npm run build`
Continuidade: `bash scripts/continuidade/checkpoint.sh "msg"`.
