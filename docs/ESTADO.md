# Estado do repositório

Fotografia técnica gerada automaticamente em **2026-10-15 14:38**.
**Não edite à mão** — é sobrescrito.

Diz apenas *como o repositório está*. Não diz o que estava sendo construído
nem se o que você encontrar funciona. Para retomar, siga [PROMPT_RETOMADA.md](./PROMPT_RETOMADA.md).

## Trabalho ativo

- Spec: [`docs/specs/mvp.md`](../docs/specs/mvp.md)
- Sessão: [`docs/sessoes/mvp.md`](../docs/sessoes/mvp.md)

## Último arquivo salvo

Rastro reescrito a cada edição — **independe de alguém lembrar de registrar**.
Se a sessão foi cortada, é o instante mais próximo do corte que existe.

- Quando: `2026-10-15 14:36:07` · HEAD: `?`
- Tarefa **declarada pelo agente**: `T1` (desde `2026-10-15 14:36`)

Declaração, não dedução. Se *desde* estiver longe de *quando*, pode ter ficado para trás.

```
  ?? .claude/
  ?? .continuidade
  ?? .gitignore
  ?? docs/
  ?? scripts/
```

## Arquivos mexidos, por tarefa

Cruzamento com a lista declarada na spec. A lista é **indicativa**.

**Previstos:**
```
  package.json  ->  T1 
  public/  ->  T6 
  src/  ->  T1 T1 T2 T3 T4 T5 T5 
  vite.config.ts  ->  T1 
```

**Não previstos — investigar:**

Não presuma vazamento de escopo. Pode ser dependência que só apareceu na
implementação, refatoração necessária, ou trabalho de outra tarefa.

```
  .oxlintrc.json
      (sem nota — a intenção precisa ser deduzida do código)
  index.html
      (sem nota — a intenção precisa ser deduzida do código)
  package-lock.json
      (sem nota — a intenção precisa ser deduzida do código)
  tsconfig.app.json
      (sem nota — a intenção precisa ser deduzida do código)
  tsconfig.json
      (sem nota — a intenção precisa ser deduzida do código)
  tsconfig.node.json
      (sem nota — a intenção precisa ser deduzida do código)
```

## Git

| | |
| --- | --- |
| Branch | `main` |
| HEAD | `1418fc2` |
| Commits à frente de `main` | 0 |
| Staged | 0 |
| Modificados não staged | 1 |
| Não rastreados | 21 |

### Commits desde `main`

```
```

### Modificado, não staged

```
 docs/ESTADO.md | 84 ++++++++++++++++++++++++++++------------------------------
 1 file changed, 41 insertions(+), 43 deletions(-)
```

### Não rastreado

Arquivo novo que ninguém commitou. Pode ser trabalho válido pela metade.

```
.oxlintrc.json
docs/sessoes/.ativa
docs/sessoes/.rastro
docs/sessoes/mvp.md
docs/specs/mvp.md
index.html
package-lock.json
package.json
public/pin.svg
src/App.tsx
src/components/.gitkeep
src/data/.gitkeep
src/domain/.gitkeep
src/features/.gitkeep
src/index.css
src/main.tsx
src/services/.gitkeep
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

## Código sem consumidor

Módulo novo que nenhum outro arquivo importa. Pode compilar sem erro e nunca
ter sido executado — trate como **implementado sem validação**.

```
vite.config.ts
```

## Aviso sobre confiabilidade

Gerado por hook ou à mão. Numa interrupção abrupta — limite de uso, queda de
energia, máquina suspensa — pode não ter rodado, e a data acima estará velha.

**Compare a data com `git log -1 --format=%cd`.** Se o último commit for mais
recente, o retrato está defasado e a verdade é o Git.
