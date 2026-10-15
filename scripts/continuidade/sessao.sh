#!/usr/bin/env bash
# Abre sessão de execução ligada a uma spec, gravando o commit-base.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
RAIZ="$(cont_raiz)" || { echo "erro: não é um repositório git" >&2; exit 1; }; cd "$RAIZ" || exit 1
ID="${1:-}"; OBJ="${2:-}"
if [ -z "$ID" ]; then
  echo "uso: sessao.sh <id-da-spec> \"objetivo\"" >&2; echo >&2; echo "specs:" >&2
  ls docs/specs/*.md 2>/dev/null | grep -v _TEMPLATE | sed 's|docs/specs/||; s|\.md$||; s|^|  |' >&2
  exit 1
fi
SPEC="docs/specs/${ID}.md"
[ -f "$SPEC" ] || { echo "erro: spec não existe em $SPEC. Crie a spec antes — ela é a fonte de verdade." >&2; exit 1; }
mkdir -p docs/sessoes; SESSAO="docs/sessoes/${ID}.md"
if [ ! -f "$SESSAO" ]; then
  { echo "# Sessões de execução — ${ID}"; echo
    echo "Registro de quem executou o quê, com evidência. A spec é [\`${SPEC}\`](../../${SPEC})."; echo
    echo "Marcadores: \`[ ]\` não iniciada · \`[>]\` em andamento · \`[?]\` implementada sem"
    echo "validação · \`[x]\` concluída e validada · \`[!]\` bloqueada · \`[~]\` incerto."; echo
    echo "Quem retoma **não confia nestes marcadores sem conferir**: compare com \`git diff\`"
    echo "e rode os testes. O marcador diz o que o agente acreditava, não o que é verdade."; echo
  } > "$SESSAO"
fi
N="$(grep -c '^## Sessão ' "$SESSAO" 2>/dev/null | head -1 | tr -cd '0-9')"; N=$(( ${N:-0} + 1 ))
BASE_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
SUJO="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
{ echo "## Sessão S${N} — $(date '+%Y-%m-%d %H:%M')"; echo
  echo "| | |"; echo "| --- | --- |"
  echo "| Branch | \`$(git rev-parse --abbrev-ref HEAD 2>/dev/null)\` |"
  echo "| Commit-base (antes desta sessão) | \`${BASE_SHA}\` |"
  echo "| Árvore ao abrir | $([ "$SUJO" = 0 ] && echo limpa || echo "**suja — ${SUJO} pendente(s)**") |"
  echo "| Objetivo | ${OBJ:-（não declarado）} |"; echo; echo "### Checkpoints"; echo
} >> "$SESSAO"
{ echo "SPEC=${SPEC}"; echo "SESSAO=${SESSAO}"; echo "SESSAO_ID=S${N}"
  echo "COMMIT_BASE=${BASE_SHA}"; echo "ABERTA_EM=$(date '+%Y-%m-%d %H:%M')"; } > "$CONT_ATIVA"
bash "$(dirname "${BASH_SOURCE[0]}")/estado.sh"
echo "Sessão S${N} aberta em ${SESSAO} (commit-base ${BASE_SHA})."
[ "$SUJO" != 0 ] && echo "AVISO: árvore já suja ao abrir (${SUJO}). Verifique se é trabalho de outra sessão."
exit 0
