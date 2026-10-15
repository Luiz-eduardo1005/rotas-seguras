#!/usr/bin/env bash
# Funções comuns do protocolo de continuidade.
# Carregado pelos demais scripts; não executar direto.

set -uo pipefail

# Raiz do repositório pelo Git, não por caminho relativo: os scripts podem ser
# instalados em qualquer subpasta e continuam achando a raiz.
cont_raiz() {
  git rev-parse --show-toplevel 2>/dev/null
}

CONT_ATIVA="docs/sessoes/.ativa"
CONT_MARCADOR=".continuidade"

cont_ler_kv() {
  local arquivo="$1" chave="$2" valor
  [ -f "$arquivo" ] || return 1
  valor="$(grep -E "^${chave}=" "$arquivo" 2>/dev/null | head -1 | cut -d= -f2-)"
  [ -n "$valor" ] || return 1
  printf '%s' "$valor"
}

cont_ler_ativa()    { cont_ler_kv "$CONT_ATIVA" "$1"; }
cont_spec_ativa()   { cont_ler_ativa SPEC; }
cont_sessao_ativa() { cont_ler_ativa SESSAO; }
cont_config()       { cont_ler_kv "$CONT_MARCADOR" "$1"; }

# O protocolo pode ser desligado por projeto sem remover nada.
cont_ativo() {
  [ -f "$CONT_MARCADOR" ] || return 1
  [ "$(cont_config ATIVO || echo sim)" != "nao" ]
}

cont_validacao() { cont_config VALIDACAO || echo ""; }

cont_tarefas_com_status() {
  local arquivo="$1" marcador="$2"
  [ -f "$arquivo" ] || return 0
  grep -F -- "- [${marcador}]" "$arquivo" 2>/dev/null || true
}

# Trunca linha longa: um arquivo minificado já transformou um retrato destes
# em despejo de 1,8 MB. Nunca mais.
cont_truncar() { cut -c1-200; }
