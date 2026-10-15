#!/usr/bin/env bash
# Nota de intenção presa a um ARQUIVO. Mais leve que checkpoint.
#   checkpoint -> "onde eu estava"     (um momento)
#   nota       -> "por que isto mudou" (um arquivo)
# Vale só enquanto o arquivo está sujo; ao commitar, a mensagem do commit assume.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
RAIZ="$(cont_raiz)" || exit 1; cd "$RAIZ" || exit 1
mkdir -p docs/sessoes; NOTAS="docs/sessoes/.notas"; touch "$NOTAS" 2>/dev/null
podar() {
  [ -s "$NOTAS" ] || return 0
  local sujos; sujos="$(git status --porcelain 2>/dev/null | sed 's/^...//')"; local keep=""
  while IFS='|' read -r c resto; do [ -z "$c" ] && continue
    printf '%s\n' "$sujos" | grep -qxF "$c" && keep="${keep}${c}|${resto}"$'\n'
  done < "$NOTAS"; printf '%s' "$keep" > "$NOTAS"
}
case "${1:-}" in
  --listar|"") podar
    [ -s "$NOTAS" ] || { echo "(nenhuma nota ativa)"; exit 0; }
    while IFS='|' read -r c t q m; do [ -z "$c" ] && continue
      printf '%s  (tarefa declarada na hora: %s · %s)\n    %s\n' "$c" "${t:-nenhuma}" "$q" "$m"
    done < "$NOTAS"; exit 0 ;;
  --remover) A="${2:-}"; [ -z "$A" ] && { echo "uso: nota.sh --remover <arquivo>" >&2; exit 1; }
    grep -vF -- "${A}|" "$NOTAS" > "${NOTAS}.tmp" 2>/dev/null; mv "${NOTAS}.tmp" "$NOTAS"
    echo "nota removida de ${A}."; exit 0 ;;
esac
ARQ="$1"; shift; MOTIVO="${*:-}"
[ -z "$MOTIVO" ] && { echo "uso: nota.sh <arquivo> \"por que mudou\"" >&2; exit 1; }
[ -e "$ARQ" ] || echo "aviso: ${ARQ} não existe no disco. Registrando mesmo assim." >&2
podar; grep -vF -- "${ARQ}|" "$NOTAS" > "${NOTAS}.tmp" 2>/dev/null; mv "${NOTAS}.tmp" "$NOTAS"
printf '%s|%s|%s|%s\n' "$ARQ" "$(cont_ler_ativa TAREFA || echo '')" "$(date '+%Y-%m-%d %H:%M')" "$MOTIVO" >> "$NOTAS"
bash "$(dirname "${BASH_SOURCE[0]}")/rastro.sh"
echo "nota registrada em ${ARQ}."
