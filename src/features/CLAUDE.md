# src/features — telas e estado

Fluxo: `data` (cenário simulado) → `domain` (cálculo puro) → `features` (estado + UI). Providers em `App.tsx`: `AppEstadoProvider > PerfilProvider > RotasProvider`. Regra: nenhum cálculo aqui; chamar `domain`.

## Features
- `estado/` — AppEstado: período (padrão vindo do perfil), avaliações (do usuário + semente → `todasAvaliacoes`), agregado, aba, camadas, onboarding.
- `mapa/` — camadas Leaflet (trechos/áreas/apoio/relatos), `CamadasMapa` (toque → `FolhaAvaliacao`), `BotaoLocalizar`, `rendererCanvas`, `cores`.
- `rotas/` — RotasProvider (OSRM + fallback pré-gravado, pontuação, salvos, histórico), PainelRotas, BuscasRecentes (máx 8), CampoLugar, CamadaRotas, ListaSalvos, compartilhar.
- `comunidade/` — ListaRelatos (autor, tipo, tempo relativo, marca de simulado), MinhasAvaliacoes (exclusão só das próprias).
- `perfil/` — PerfilProvider (perfil local, período padrão pelo horário de retorno), CriarPerfil (após onboarding, pulável), AbaPerfil (editar, apagar dados).

## Persistência
`services/`: `armazenamento` (avaliações, preferências, rotas salvas), `historicoStorage`, `perfilStorage`; chaves `rotas-seguras:v1:*` (avaliacoes, preferencias, rotas-salvas, historico, perfil, perfil-pulado). "Apagar meus dados" limpa todas as `rotas-seguras:v1:*`.

## Desempenho
Todas as camadas usam o MESMO `rendererCanvas` (um canvas) e são memoizadas (`memo`/`useMemo`); props instáveis ou renderer novo por camada reintroduzem lentidão. Transições do painel respeitam `prefers-reduced-motion`.

## O que quebra
- Contrato `onToqueMapa(coord): boolean` (`App` → `CamadasMapa`): `true` consome o toque (escolher origem/destino); `false` abre a avaliação.
- `FolhaAvaliacao` é montada com `key=alvoId`; relatos via `relatosParaPonto`.
