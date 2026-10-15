#!/usr/bin/env bash
# Declara a tarefa em execução. Declaração, nunca dedução.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
RAIZ="$(cont_raiz)" || exit 1; cd "$RAIZ" || exit 1
[ -f "$CONT_ATIVA" ] || { echo "erro: nenhuma sessão ativa. Rode antes: sessao.sh <id-da-spec> \"objetivo\"" >&2; exit 1; }
ID="${1:-}"
if [ -z "$ID" ]; then
  echo "tarefa declarada: $(cont_ler_ativa TAREFA || echo '(nenhuma)')  (desde $(cont_ler_ativa TAREFA_DESDE || echo '-'))"
  SPEC="$(cont_spec_ativa || echo '')"
  [ -n "$SPEC" ] && [ -f "$SPEC" ] && { echo; echo "tarefas da spec:"; grep -E '^- \[.\] \*\*T[0-9]+\*\*' "$SPEC" | sed 's/ —.*//; s/^/  /'; }
  exit 0
fi
grep -vE '^(TAREFA|TAREFA_DESDE)=' "$CONT_ATIVA" > "${CONT_ATIVA}.tmp" 2>/dev/null; mv "${CONT_ATIVA}.tmp" "$CONT_ATIVA"
if [ "$ID" = "--limpar" ]; then echo "declaração removida."; bash "$(dirname "${BASH_SOURCE[0]}")/rastro.sh"; exit 0; fi
SPEC="$(cont_spec_ativa || echo '')"
[ -n "$SPEC" ] && [ -f "$SPEC" ] && ! grep -qE "\*\*${ID}\*\*" "$SPEC" && echo "aviso: ${ID} não aparece na spec ativa. Declarando mesmo assim." >&2
{ echo "TAREFA=${ID}"; echo "TAREFA_DESDE=$(date '+%Y-%m-%d %H:%M')"; } >> "$CONT_ATIVA"
bash "$(dirname "${BASH_SOURCE[0]}")/rastro.sh"
echo "tarefa ativa: ${ID}"
