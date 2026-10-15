# Estado do repositório

Fotografia técnica gerada automaticamente em **2026-10-15 14:45**.
**Não edite à mão** — é sobrescrito.

Diz apenas *como o repositório está*. Não diz o que estava sendo construído
nem se o que você encontrar funciona. Para retomar, siga [PROMPT_RETOMADA.md](./PROMPT_RETOMADA.md).

## Trabalho ativo

- Spec: [`docs/specs/mvp.md`](../docs/specs/mvp.md)
- Sessão: [`docs/sessoes/mvp.md`](../docs/sessoes/mvp.md)

## Último arquivo salvo

Rastro reescrito a cada edição — **independe de alguém lembrar de registrar**.
Se a sessão foi cortada, é o instante mais próximo do corte que existe.

- Quando: `2026-10-15 14:45:12` · HEAD: `c3fee4b`
- Tarefa **declarada pelo agente**: `T2` (desde `2026-10-15 14:43`)

Declaração, não dedução. Se *desde* estiver longe de *quando*, pode ter ficado para trás.

```
   M src/App.tsx
  ?? docs/pesquisa/
  ?? src/components/AvisoOnboarding.tsx
  ?? src/components/BarraNavegacao.tsx
  ?? src/components/Legenda.tsx
  ?? src/components/Painel.tsx
  ?? src/components/SeletorPeriodo.tsx
```

## Arquivos mexidos, por tarefa

Cruzamento com a lista declarada na spec. A lista é **indicativa**.

**Não previstos — investigar:**

Não presuma vazamento de escopo. Pode ser dependência que só apareceu na
implementação, refatoração necessária, ou trabalho de outra tarefa.

```
  docs/pesquisa/
      (sem nota — a intenção precisa ser deduzida do código)
```

## Git

| | |
| --- | --- |
| Branch | `main` |
| HEAD | `405342a` |
| Commits à frente de `main` | 0 |
| Staged | 0 |
| Modificados não staged | 4 |
| Não rastreados | 1 |

### Commits desde `main`

```
```

### Modificado, não staged

```
 docs/ESTADO.md       | 92 ++++++++--------------------------------------------
 docs/sessoes/.ativa  |  6 ++--
 docs/sessoes/.rastro | 21 ++++++------
 docs/sessoes/mvp.md  | 25 ++++++++++++++
 4 files changed, 54 insertions(+), 90 deletions(-)
```

### Não rastreado

Arquivo novo que ninguém commitou. Pode ser trabalho válido pela metade.

```
docs/pesquisa/manaus.md
```

## Aviso sobre confiabilidade

Gerado por hook ou à mão. Numa interrupção abrupta — limite de uso, queda de
energia, máquina suspensa — pode não ter rodado, e a data acima estará velha.

**Compare a data com `git log -1 --format=%cd`.** Se o último commit for mais
recente, o retrato está defasado e a verdade é o Git.
