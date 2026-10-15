#!/usr/bin/env bash
# Rastro automático: foto do instante, sobrescrita a cada arquivo salvo.
# Não depende de o agente lembrar de registrar nada.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
RAIZ="$(cont_raiz)" || exit 0; cd "$RAIZ" || exit 0
cont_ativo || exit 0
mkdir -p docs/sessoes
SHA="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
ARQS="$(git status --porcelain 2>/dev/null | grep -vE ' (docs/ESTADO\.md|docs/HANDOFF\.md|docs/sessoes/)' | sed 's/^/  /' | cont_truncar | head -15)"
{
  echo "# Rastro automático — foto do instante, sobrescrita a cada arquivo salvo."
  echo "# Não é histórico. O histórico são os checkpoints e os commits."
  echo "QUANDO=$(date '+%Y-%m-%d %H:%M:%S')"
  echo "HEAD=${SHA}"
  echo "SPEC=$(cont_spec_ativa || echo '（nenhuma）')"
  echo "SESSAO=$(cont_ler_ativa SESSAO_ID || echo '（nenhuma）')"
  echo "TAREFA=$(cont_ler_ativa TAREFA || echo '（nenhuma）')"
  echo "TAREFA_DESDE=$(cont_ler_ativa TAREFA_DESDE || echo '－')"
  echo "# TAREFA é o que o AGENTE DECLAROU, não dedução do sistema."
  echo "# Se TAREFA_DESDE estiver longe de QUANDO, a declaração pode estar velha."
  echo "# Arquivos mexidos neste momento:"
  [ -n "$ARQS" ] && printf '%s\n' "$ARQS" || echo "  (árvore limpa)"
} > docs/sessoes/.rastro 2>/dev/null
exit 0
