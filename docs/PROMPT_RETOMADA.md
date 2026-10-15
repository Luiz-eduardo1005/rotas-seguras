# Retomada de trabalho interrompido

Cole o bloco abaixo em qualquer agente com acesso ao repositório — Claude, Codex,
ChatGPT ou outro. Não depende de memória, de conversa anterior nem de
funcionalidade específica de um assistente.

---

```text
Você vai assumir um trabalho que outro agente deixou pela metade neste
repositório. A sessão anterior pode ter sido cortada no meio de uma frase, então
NADA do que estiver escrito como status é confiável até você conferir contra o
Git e os testes.

Execute este protocolo, em ordem, ANTES de escrever qualquer código:

1. Leia docs/PROTOCOLO.md e docs/decisoes.md (se existir). O segundo registra
   escolhas já fechadas: não reabra nenhuma. Leia também as instruções do
   projeto na raiz (CLAUDE.md, AGENTS.md ou equivalente).

2. Leia docs/sessoes/.ativa. Ele aponta a spec ativa, o registro de sessão, o
   identificador da sessão e o COMMIT_BASE.
   Se não existir, não havia trabalho registrado: leia docs/HANDOFF.md para o
   panorama e trate qualquer alteração não commitada como de origem
   desconhecida — preserve, não apague.

3. Leia a spec ativa por inteiro: objetivo, escopo, o que está fora do escopo,
   restrições, tarefas com IDs, dependências e critérios de aceite.

4. Leia o registro de sessão: os checkpoints e quais tarefas o agente anterior
   marcou como em andamento, sem validação, incertas ou bloqueadas.

5. Leia docs/sessoes/.rastro: hora do último arquivo salvo e qual tarefa o agente
   anterior DECLAROU estar executando. É declaração dele, não dedução do sistema
   — se TAREFA_DESDE estiver longe de QUANDO, pode ter ficado para trás.
   Rode também: bash scripts/continuidade/nota.sh --listar
   São notas de intenção presas a arquivos específicos. É onde costuma estar a
   explicação de alteração pequena feita de passagem.
   Em docs/ESTADO.md, veja "Arquivos mexidos, por tarefa". Arquivo marcado como
   "não previsto" NÃO significa vazamento de escopo: significa que ninguém o
   antecipou. Descubra a que tarefa pertence.

6. Levante a evidência real, sem confiar no que leu:
      git status
      git log --oneline <COMMIT_BASE>..HEAD
      git diff <COMMIT_BASE>..HEAD --stat
      git diff --stat
      git diff --cached --stat
   Compare a data no topo de docs/ESTADO.md com: git log -1 --format=%cd
   Se o último commit for mais recente, o retrato está defasado — confie no Git.

7. Relacione cada alteração a um ID de tarefa, usando a lista "Arquivos
   esperados por tarefa" da spec. Alteração que não bate com nenhuma tarefa NÃO
   é necessariamente erro: pode ser dependência que só apareceu na
   implementação. Marque como "não previsto — investigar", descubra a que
   pertence, e NUNCA apague.

8. Rode apenas o necessário para descobrir o estado real. O comando de validação
   deste projeto está em docs/PROTOCOLO.md, na seção "Validação".

9. Classifique cada tarefa pela evidência, não pelo que estava escrito:
      não iniciada · em andamento · implementada sem validação ·
      concluída e validada · bloqueada · incerto (precisa investigar)
   Use "incerto" sem constrangimento: é melhor que fingir certeza. Um módulo que
   compila mas que nenhum arquivo importa nunca foi executado — "compila" não é
   evidência de nada nesse caso. Vale também para tarefa que talvez tenha sido
   resolvida dentro do diff de outra: marque incerto e confira contra o critério
   de aceite antes de dar por concluída.

10. NÃO descarte, sobrescreva nem reverta alteração não commitada que você não
    entendeu. Na dúvida, preserve e pergunte.

11. Continue pela primeira tarefa incompleta cujas dependências estejam
    satisfeitas.

12. Abra sua própria sessão antes de mexer em código:
       bash scripts/continuidade/sessao.sh <id-da-spec> "o que você vai fazer"
    Declare a tarefa, e atualize ao trocar:
       bash scripts/continuidade/tarefa.sh T3
    Registre checkpoints conforme avança — uma linha basta:
       bash scripts/continuidade/checkpoint.sh "T3 feita, compila, sem teste ainda"
    Mexeu em arquivo fora da lista da spec? Deixe nota:
       bash scripts/continuidade/nota.sh <arquivo> "por quê"

13. Trabalhe por unidade lógica, não por arquivo. Quando uma unidade estiver
    concluída E validada: atualize o marcador da tarefa na spec e faça um commit
    atômico. Evite acumular muita alteração não commitada — é o que torna
    impossível distinguir trabalho válido de tentativa abandonada.

Comece respondendo, antes de codificar:
- qual é a spec ativa e seu objetivo;
- a classificação de cada tarefa, com a evidência que a sustenta;
- qual é a próxima tarefa segura e por quê;
- o que você encontrou que não bate com o que estava documentado.
```

---

## Se não houver sessão ativa

Significa que o trabalho não foi registrado. Leia `docs/HANDOFF.md` para o
panorama e `docs/ESTADO.md` para a fotografia técnica, e trate qualquer
alteração não commitada como de origem desconhecida: preserve, não apague.
