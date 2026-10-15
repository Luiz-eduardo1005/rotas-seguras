# Estado do repositório

Fotografia técnica gerada automaticamente em **2026-10-15 14:36**.
**Não edite à mão** — é sobrescrito.

Diz apenas *como o repositório está*. Não diz o que estava sendo construído
nem se o que você encontrar funciona. Para retomar, siga [PROMPT_RETOMADA.md](./PROMPT_RETOMADA.md).

## Trabalho ativo

- Spec: [`docs/specs/mvp.md`](../docs/specs/mvp.md)
- Sessão: [`docs/sessoes/mvp.md`](../docs/sessoes/mvp.md)

## Arquivos mexidos, por tarefa

Cruzamento com a lista declarada na spec. A lista é **indicativa**.

**Não previstos — investigar:**

Não presuma vazamento de escopo. Pode ser dependência que só apareceu na
implementação, refatoração necessária, ou trabalho de outra tarefa.

```
  .claude/
      (sem nota — a intenção precisa ser deduzida do código)
  .continuidade
      (sem nota — a intenção precisa ser deduzida do código)
  .gitignore
      (sem nota — a intenção precisa ser deduzida do código)
  docs/
      (sem nota — a intenção precisa ser deduzida do código)
  scripts/
      (sem nota — a intenção precisa ser deduzida do código)
```

## Git

| | |
| --- | --- |
| Branch | `HEAD
?` |
| HEAD | `?` |
| Commits à frente de `master` | ? |
| Staged | 0 |
| Modificados não staged | 0 |
| Não rastreados | 17 |

### Commits desde `master`

```
(nenhum)
```

### Não rastreado

Arquivo novo que ninguém commitou. Pode ser trabalho válido pela metade.

```
.claude/settings.json
.continuidade
.gitignore
docs/ESTADO.md
docs/PROMPT_RETOMADA.md
docs/PROTOCOLO.md
docs/sessoes/.ativa
docs/sessoes/mvp.md
docs/specs/_TEMPLATE.md
docs/specs/mvp.md
scripts/continuidade/checkpoint.sh
scripts/continuidade/estado.sh
scripts/continuidade/lib.sh
scripts/continuidade/nota.sh
scripts/continuidade/rastro.sh
scripts/continuidade/sessao.sh
scripts/continuidade/tarefa.sh
```

## Aviso sobre confiabilidade

Gerado por hook ou à mão. Numa interrupção abrupta — limite de uso, queda de
energia, máquina suspensa — pode não ter rodado, e a data acima estará velha.

**Compare a data com `git log -1 --format=%cd`.** Se o último commit for mais
recente, o retrato está defasado e a verdade é o Git.
