# Estado do repositório

Fotografia técnica gerada automaticamente em **2026-10-15 18:55**.
**Não edite à mão** — é sobrescrito.

Diz apenas *como o repositório está*. Não diz o que estava sendo construído
nem se o que você encontrar funciona. Para retomar, siga [PROMPT_RETOMADA.md](./PROMPT_RETOMADA.md).

## Trabalho ativo

- Spec: [`docs/specs/v2.md`](../docs/specs/v2.md)
- Sessão: [`docs/sessoes/v2.md`](../docs/sessoes/v2.md)

## Último arquivo salvo

Rastro reescrito a cada edição — **independe de alguém lembrar de registrar**.
Se a sessão foi cortada, é o instante mais próximo do corte que existe.

- Quando: `2026-10-15 18:39:57` · HEAD: `5fb48fa`
- Tarefa **declarada pelo agente**: `V1` (desde `2026-10-15 18:16`)

Declaração, não dedução. Se *desde* estiver longe de *quando*, pode ter ficado para trás.

```
   M scripts/gerar-dados.mjs
   M src/data/apoio.ts
   M src/data/areas.ts
   M src/data/comunidadeSemente.ts
   M src/data/dados.test.ts
   M src/data/lugares.ts
   M src/data/rotasPregravadas.ts
   M src/data/trechos.ts
  ?? scripts/lib/
```

## Git

| | |
| --- | --- |
| Branch | `feat/v2-comunidade-perfil` |
| HEAD | `cc082d0` |
| Commits à frente de `main` | 28 |
| Staged | 0 |
| Modificados não staged | 2 |
| Não rastreados | 0 |

### Commits desde `main`

```
cc082d0 docs: spec v2 concluída e estado
db20a16 docs: CLAUDE.md em cascata da fase 2
ff2786f refactor(domain): busca de área centralizada em areaDoPonto
2b07298 fix(comunidade): rótulo do resumo de relatos por contexto
72cd78b feat(data): relatos semente em todos os trechos e bairros
f2d3427 fix(rotas): regex de controle com escapes
3f00df7 fix(mapa): título sem bairro duplicado e apoio por zoom
7281ba2 feat(comunidade): relatos do bairro quando não há relatos próximos
bd45a6d test(data): cobertura, relatos e contraste
da83b7f feat(data): relatos semente da comunidade
c0ee395 feat(data): trechos de corredores e pontos críticos
fc126be feat(data): gerador v2 com cobertura de todos os bairros
5fb48fa docs: pesquisa aprofundada de Manaus (v2)
b373663 perf(mapa): tiles e animações mais leves
e91e89e perf(mapa): renderer canvas e camadas memoizadas
d908673 feat(rotas): enviar trajeto ao contato de confiança e atalho Casa
2d714f9 feat(perfil): minhas avaliações e autor pelo perfil
c3c99c6 test: stub de localStorage no histórico
33b278d feat(comunidade): relatos visíveis, comentários e exclusão
69bcc9d feat(comunidade): relatos semente iniciais
```

### Modificado, não staged

```
 docs/ESTADO.md     | 31 ++++++++++---------------------
 docs/sessoes/v2.md |  1 +
 2 files changed, 11 insertions(+), 21 deletions(-)
```

## Aviso sobre confiabilidade

Gerado por hook ou à mão. Numa interrupção abrupta — limite de uso, queda de
energia, máquina suspensa — pode não ter rodado, e a data acima estará velha.

**Compare a data com `git log -1 --format=%cd`.** Se o último commit for mais
recente, o retrato está defasado e a verdade é o Git.
Git.
