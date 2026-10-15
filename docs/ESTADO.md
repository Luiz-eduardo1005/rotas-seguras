# Estado do repositório

Fotografia técnica gerada automaticamente em **2026-10-15 15:08**.
**Não edite à mão** — é sobrescrito.

Diz apenas *como o repositório está*. Não diz o que estava sendo construído
nem se o que você encontrar funciona. Para retomar, siga [PROMPT_RETOMADA.md](./PROMPT_RETOMADA.md).

## Trabalho ativo

- Spec: [`docs/specs/mvp.md`](../docs/specs/mvp.md)
- Sessão: [`docs/sessoes/mvp.md`](../docs/sessoes/mvp.md)

## Último arquivo salvo

Rastro reescrito a cada edição — **independe de alguém lembrar de registrar**.
Se a sessão foi cortada, é o instante mais próximo do corte que existe.

- Quando: `2026-10-15 15:00:12` · HEAD: `8bd1183`
- Tarefa **declarada pelo agente**: `T2` (desde `2026-10-15 14:43`)

Declaração, não dedução. Se *desde* estiver longe de *quando*, pode ter ficado para trás.

```
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
  ?? src/features/mapa/CamadaAvaliacoes.tsx
  ?? src/features/rotas/mesclarRotas.test.ts
  ?? src/features/rotas/mesclarRotas.ts
```

## Git

| | |
| --- | --- |
| Branch | `main` |
| HEAD | `adf1fd6` |
| Commits à frente de `main` | 0 |
| Staged | 0 |
| Modificados não staged | 3 |
| Não rastreados | 0 |

### Commits desde `main`

```
```

### Modificado, não staged

```
 docs/ESTADO.md       |  68 ++++++--------------
 docs/sessoes/.rastro |  23 +++++--
 docs/sessoes/mvp.md  | 177 +++++++++++++++++++++++++++++++++++++++++++++++++++
 3 files changed, 214 insertions(+), 54 deletions(-)
```

## Aviso sobre confiabilidade

Gerado por hook ou à mão. Numa interrupção abrupta — limite de uso, queda de
energia, máquina suspensa — pode não ter rodado, e a data acima estará velha.

**Compare a data com `git log -1 --format=%cd`.** Se o último commit for mais
recente, o retrato está defasado e a verdade é o Git.
