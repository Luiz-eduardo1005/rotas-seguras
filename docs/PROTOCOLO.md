# Protocolo de continuidade

Como este projeto sobrevive a uma sessão de IA interrompida no meio do trabalho.

## O problema que isto resolve

Uma sessão pode morrer sem aviso: limite de uso atingido, máquina suspensa,
queda de energia. Quando isso acontece, o trabalho não commitado fica em disco
sem explicação. Quem retoma encontra arquivos modificados e não tem como saber
se aquilo está pronto, pela metade ou quebrado.

A primeira versão deste sistema registrava só o estado do Git. Isso responde
*onde o repositório está*, mas não responde o que importa:

- qual era a intenção da tarefa;
- que parte do plano estava em execução;
- quais critérios de aceite faltavam;
- se o que está em disco funciona;
- qual é o próximo passo seguro.

## Divisão de responsabilidade

Cada documento responde uma pergunta, e só uma. Misturá-las foi o erro original.

| Documento | Pergunta | Quem escreve | Confiável? |
| --- | --- | --- | --- |
| `docs/specs/<id>.md` | O que precisa ser entregue | Humano ou agente, **antes** de implementar | Sim — é o contrato |
| `docs/sessoes/<id>.md` | Quem assumiu, o que executou, com que evidência | Agente, durante a execução | **Não sem conferir** |
| `docs/ESTADO.md` | Como o repositório está agora | Hook, automático | Sim, se a data for recente |
| `docs/HANDOFF.md` | Panorama e prioridades | Humano ou agente, à mão | Resumo, não fonte única |
| `docs/decisoes.md` | Por que cada escolha foi feita | Humano ou agente, à mão | Sim — não reabrir |
| Git e testes | O que de fato existe | Ninguém: é evidência | **A verdade final** |

A regra que sustenta tudo: **status escrito por agente é hipótese; Git e teste
são evidência.** Quem retoma compara os dois e acredita na evidência.

## Fluxo de trabalho

### Antes de implementar

```bash
cp docs/specs/_TEMPLATE.md docs/specs/<id>.md
# preencha objetivo, escopo, restrições, tarefas com IDs e critérios de aceite
bash scripts/continuidade/sessao.sh <id> "objetivo desta sessão"
```

`nova-sessao.sh` grava o **commit-base** — o SHA antes de qualquer alteração. É
o dado mais valioso do protocolo: permite perguntar ao Git "o que mudou desde
então" sem depender de nenhuma narrativa.

### Durante

A cada bloco coerente concluído:

```bash
bash scripts/continuidade/checkpoint.sh "T3 implementada, tsc limpo, ainda sem teste"
```

E atualize o marcador da tarefa na spec: `[ ]` → `[>]` → `[?]` → `[x]`.

Após todo `git commit`, um checkpoint é gravado automaticamente pelo hook.

### Ao trocar de tarefa

```bash
bash scripts/continuidade/tarefa.sh T3      # declara qual tarefa está em execução
bash scripts/continuidade/tarefa.sh         # mostra a declarada e lista as da spec
bash scripts/continuidade/tarefa.sh --limpar
```

O rastro copia essa declaração literalmente. **Não é dedução do sistema**: o
hook recebe um caminho de arquivo e não teria como saber a que tarefa ele serve.
Adivinhar produziria atribuição errada, e atribuição errada é pior que nenhuma,
porque quem retoma trata documento como fato. Como a declaração vai carimbada
com hora, uma declaração esquecida fica visível em vez de passar por verdade.

### Registrando intenção: checkpoint ou nota

São coisas diferentes, e confundi-las deixa alteração chegando muda:

| | Checkpoint | Nota |
| --- | --- | --- |
| Responde | "onde eu estava" | "por que ISTO mudou" |
| É sobre | um momento | um arquivo |
| Vive em | registro de sessão, acumula | `.notas`, só enquanto o arquivo está sujo |
| Sai quando | nunca | o arquivo é commitado (a mensagem do commit assume) |

```bash
bash scripts/continuidade/nota.sh lib/format.ts "T5 vai precisar formatar quantidade"
bash scripts/continuidade/nota.sh --listar
```

**Checkpoint curto é bem-vindo.** Uma linha basta. A pior falha observada num
teste de retomada foi um arquivo alterado chegar sem nenhuma explicação, porque
escrever um checkpoint parecia grande demais para uma função de cinco linhas.
Registro barato e frequente vale mais que registro caprichado e raro.

Quando mexer em arquivo fora da lista da spec, **deixe uma nota**. É o caso em
que quem retoma mais precisa de ajuda: o retrato vai marcar o arquivo como não
previsto, e sem nota a intenção precisa ser deduzida do código.

### Tarefa resolvida por efeito colateral de outra

Acontece: o diff de uma tarefa remove o comentário obsoleto que era o alvo de
outra, ou refatora o trecho que a outra ia mexer. Nenhum hook percebe isso — o
sistema cruza arquivos, não intenção semântica.

Quando desconfiar de que uma tarefa já foi resolvida assim, **marque `[~]` e
escreva por quê**, em vez de `[x]`. Só promova a `[x]` depois de conferir
contra o critério de aceite. Fechar tarefa por dedução é o mesmo erro que
afirmar na spec que um módulo está corrigido sem abrir o arquivo.

### Ao retomar trabalho de outro

Siga `docs/PROMPT_RETOMADA.md`. Ele funciona em qualquer agente com acesso ao
repositório, sem depender de memória ou de conversa anterior.

## Marcadores de status

| Marcador | Significado |
| --- | --- |
| `[ ]` | não iniciada |
| `[>]` | em andamento — pode estar pela metade |
| `[?]` | implementada, ninguém provou que funciona |
| `[x]` | concluída e validada |
| `[!]` | bloqueada |
| `[~]` | **incerto — a evidência não fecha, precisa investigar** |

`[?]` é o mais importante. É o estado em que uma sessão cortada deixa o
trabalho, e é o que distingue "código existe" de "código funciona".

Há um sinal ainda mais forte que `[?]`: **código sem consumidor**. Um módulo
novo pode passar em `tsc` com folga e nunca ter sido importado por ninguém —
nunca foi executado uma única vez. `ESTADO.md` detecta isso sozinho e lista numa
seção própria. Ao classificar tarefas, "compila" não é evidência de nada se
nada chama o código.

Nos critérios de aceite, `[ambiente]` marca o que não pode ser provado só com
`tsc` e `vitest` — exige Docker, banco no ar ou navegador. Sem o ambiente,
declare esses critérios como **não verificados**; não os deduza por leitura.

## Hooks: o que dispara e o que não dispara

Configurados em `.claude/settings.json`:

| Evento | Quando | O que roda |
| --- | --- | --- |
| `Stop` | Fim normal de uma resposta | Atualiza `ESTADO.md` |
| `StopFailure` | Resposta terminada em erro | Atualiza `ESTADO.md` |
| `PreCompact` | Antes de compactar contexto | Atualiza `ESTADO.md` |
| `SessionEnd` | Fim da sessão | Atualiza `ESTADO.md` |
| `SubagentStop` | Subagente termina | Atualiza `ESTADO.md` |
| `PostToolUse` em `git commit` | Após cada commit | Grava checkpoint + atualiza `ESTADO.md` |

### Limitação que não dá para eliminar

**Não é possível garantir que um hook rode numa interrupção abrupta.**

`StopFailure` foi incluído porque o esquema de configuração o oferece para
resposta terminada em erro, que é a forma de um corte por limite de uso. Mas
isso é **inferência a partir do esquema, não observação**: não consegui provocar
um corte real de limite para confirmar que ele dispara. Trate como reforço, não
como garantia.

Casos em que nenhum hook roda, com certeza:

- queda de energia ou suspensão da máquina;
- encerramento forçado do processo;
- falha do próprio processo que executaria o hook.

**É por isso que o checkpoint após cada commit existe.** Ele não depende do fim
da sessão: dispara no meio do trabalho. E é por isso que a orientação de commits
pequenos é parte do protocolo, não estilo pessoal — commit atômico frequente é a
única forma de registro que sobrevive a qualquer tipo de corte.

Os hooks nunca rodam build ou teste. Eles disparam com frequência e precisam ser
baratos; a versão atual leva cerca de um segundo. Validação pesada pertence ao
fluxo da tarefa.

### Uma falha já corrigida, registrada como aviso

A primeira versão de `estado-sessao.sh` varria o disco inteiro atrás de
`TODO`/`FIXME` e engoliu source maps de uma pasta temporária: gerou um
`ESTADO.md` de **1,8 MB**, inútil para o fim a que servia. Hoje varre apenas
arquivos rastreados pelo Git e trunca linhas em 200 caracteres.

A lição vale para quem for estender isto: **o artefato de continuidade também
pode quebrar**, e quando quebra ninguém percebe, porque ninguém o lê até a hora
em que ele é necessário. Rode `bash scripts/continuidade/estado.sh` e olhe o resultado
depois de qualquer mudança nele.

## Compatibilidade entre agentes

Nada aqui depende de funcionalidade privada de um assistente. São arquivos
Markdown, scripts `bash` e comandos `git`. Os hooks são uma conveniência do
Claude Code; qualquer outro agente roda os mesmos scripts à mão:

```bash
bash scripts/continuidade/estado.sh      # atualiza a fotografia
bash scripts/continuidade/sessao.sh <id> "objetivo"
bash scripts/continuidade/checkpoint.sh "mensagem"
```

## O que sobrevive a cada tipo de corte

A pergunta que importa não é "o sistema funciona?", é "o que resta quando ele
não funciona?". As camadas foram desenhadas para degradar, não para falhar de
uma vez.

| Camada | Escrita por | Idade no pior caso | Sobrevive a quê |
| --- | --- | --- | --- |
| Commits | Agente, em blocos | Desde o último commit | Tudo, inclusive queda de energia |
| `.rastro` | Hook, a cada arquivo salvo | Segundos | Corte por limite, se o hook rodar |
| Checkpoints | Agente, por bloco | Minutos | Corte por limite |
| `ESTADO.md` | Hook, ao parar | Até a última parada | Corte por limite, se o hook rodar |
| Spec | Humano, antes de começar | Não envelhece | Tudo — está commitada |
| `PROMPT_RETOMADA.md` | Ninguém: é procedimento fixo | **Nunca envelhece** | Tudo |

Duas consequências práticas:

**O prompt de retomada não precisa estar atualizado.** Ele não guarda estado —
é um roteiro que manda o próximo agente extrair o estado do Git. Confundir isso
é natural, mas é o oposto do desenho: nada que precise ser atualizado no momento
do corte pode ser confiável, justamente porque o corte impede a atualização.

**A spec é o que salva o trabalho não commitado.** Se o corte pega uma hora de
edição sem commit, o Git mostra *quais arquivos* mudaram, o rastro mostra
*quando*, mas só a spec — escrita antes de começar — explica *o que aquilo
deveria fazer*. É por isso que ela vem antes da execução, e não depois.

### Quando nada disso salva

Queda de energia ou máquina suspensa: nenhum hook roda, o rastro e o `ESTADO.md`
ficam na idade da última parada normal. Resta o Git e a spec. É o caso em que
commits frequentes deixam de ser boa prática e passam a ser a única rede.

## Sobre a hora de modificação dos arquivos

O `mtime` do sistema de arquivos parece uma linha do tempo pronta das edições,
e é tentador tratá-lo assim. **Não trate.** Ele é reescrito por formatador, por
script, por `git checkout`, por cópia de arquivo e por várias operações que nada
têm a ver com alguém ter editado aquilo.

Serve como **evidência auxiliar**: se um arquivo não previsto tem `mtime` do
mesmo minuto dos arquivos da tarefa declarada, é um indício de que pertence a
ela. Indício, não prova.

A ordem de força das fontes continua sendo:

1. **Git** — commits e diff, que registram conteúdo, não metadado;
2. **Spec** — o que aquilo deveria fazer, escrito antes e commitado;
3. **Testes** — o que de fato funciona;
4. **Código** — o que está escrito;
5. `mtime`, rastro e checkpoints — pistas de *quando* e de *o que alguém achou*.

## Validação

Comando que prova que o projeto está são:

```bash
（defina o comando de validação em .continuidade）
```
