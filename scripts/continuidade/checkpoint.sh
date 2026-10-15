#!/usr/bin/env bash
# Checkpoint: ponto seguro da execução. É sobre um MOMENTO.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
RAIZ="$(cont_raiz)" || exit 0; cd "$RAIZ" || exit 0
cont_ativo || exit 0
SESSAO="$(cont_sessao_ativa || echo '')"
[ -n "$SESSAO" ] && [ -f "$SESSAO" ] || exit 0
MSG="${*:-}"; SHA="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
SUJO="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
[ -z "$MSG" ] && MSG="commit \`${SHA}\` — $(git log -1 --pretty=%s 2>/dev/null)"
[ "$SUJO" = 0 ] && ARV="árvore limpa" || ARV="**${SUJO} arquivo(s) pendentes**"
printf -- '- `%s` · HEAD `%s` · %s · %s\n' "$(date '+%Y-%m-%d %H:%M')" "$SHA" "$ARV" "$MSG" >> "$SESSAO"
ARQ="$(git status --porcelain 2>/dev/null | grep -vE ' (docs/ESTADO\.md|docs/HANDOFF\.md|docs/sessoes/|docs/specs/)' | sed 's/^/    /' | cont_truncar | head -12)"
[ -n "$ARQ" ] && printf -- '  - arquivos em jogo:\n%s\n' "$ARQ" >> "$SESSAO"
exit 0
