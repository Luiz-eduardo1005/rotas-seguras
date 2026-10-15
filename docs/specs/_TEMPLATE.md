# <identificador> — <título curto>

> Modelo de spec. Copie para `docs/specs/<identificador>.md` e preencha **antes**
> de começar a implementar. A spec é a fonte de verdade sobre *o que precisa ser
> entregue*; ela não narra passo a passo *como* digitar o código.
>
> Regra prática: se a spec só faz sentido para quem participou da conversa que a
> originou, ela falhou.

## Objetivo

Uma ou duas frases. O que muda no produto quando isto estiver pronto.

## Contexto

Por que isto existe. Que problema real resolve, com evidência (número, erro,
tela). Se corrige um bug, descreva o sintoma e a causa, não só o sintoma.

> **Regra dura:** toda afirmação sobre código que já existe precisa ser
> verificada no momento da escrita, com o arquivo aberto. Uma spec com
> "o módulo X já foi corrigido" que não é verdade é pior que uma spec omissa,
> porque quem retoma trata a spec como contrato e fecha escopo com bug ao lado.
> Já aconteceu neste projeto. Se não deu para verificar, escreva
> "não verificado" em vez de afirmar.

## Escopo

**Incluído:**
- ...

**Fora do escopo:**
- ... (tão importante quanto o incluído — é o que impede o próximo agente de
  expandir o trabalho por conta própria)

## Restrições e invariantes

Regras que não podem ser violadas, mesmo que facilitem. Ex.: assinatura pública
que não pode mudar, camada onde a regra precisa morar, decisão já fechada em
`decisoes.md`.

## Módulos envolvidos

Caminhos reais de arquivo e pasta. Quem retoma precisa saber onde olhar sem
varrer o repositório.

## Tarefas

Marcadores: `[ ]` não iniciada · `[>]` em andamento · `[?]` implementada sem
validação · `[x]` concluída e validada · `[!]` bloqueada · `[~]` incerto, precisa investigar.

- [ ] **T1** — ...
- [ ] **T2** — ... (depende de T1)

## Arquivos esperados por tarefa

Lista **indicativa**, não contrato. Mexer em arquivo fora dela é legítimo. O
retrato automático marca esses casos como "não previsto — investigar", nunca
como vazamento de escopo.

Formato lido por script: `<TAREFA>: <caminho>`, um por linha.

T1: caminho/do/arquivo.ts
T2: outro/caminho.tsx

## Dependências entre tarefas

T2 depende de T1 porque ... Só descreva quando a ordem importa de verdade.

## Critérios de aceite

Verificável, não subjetivo. "A soma bate com o total real acima de mil linhas"
serve; "o código fica mais limpo" não serve.

Marque com `[ambiente]` o critério que **não pode ser provado só com `tsc` e
`vitest`** — os que exigem Docker, banco no ar ou navegador. Quem não tiver o
ambiente declara esses como não verificados, em vez de deduzir por leitura de
código.

- [ ] ...
- [ambiente] ...

## Testes e validações esperados

Comando exato que prova cada critério.

```bash
npx tsc --noEmit && npx vitest run && npm run build
```

## Definição de pronto

O que precisa ser verdade para a spec ser encerrada: critérios aceitos, testes
passando, commits feitos, documentos atualizados.
