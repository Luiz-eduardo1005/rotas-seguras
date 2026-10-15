#!/usr/bin/env bash
# Gera docs/ESTADO.md — fotografia técnica do repositório neste instante.
# Barato de propósito: só git e leitura. Nada de build ou teste.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
RAIZ="$(cont_raiz)" || exit 0; cd "$RAIZ" || exit 0
cont_ativo || exit 0
mkdir -p docs docs/specs docs/sessoes
SAIDA="docs/ESTADO.md"

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
HEAD_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
BASE="$(git rev-parse --verify --quiet main >/dev/null 2>&1 && echo main || echo master)"
ADIANTE="$(git rev-list --count "${BASE}..HEAD" 2>/dev/null || echo '?')"
NS="$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')"
NU="$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')"
NT="$(git ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')"
SPEC="$(cont_spec_ativa || echo '')"; SESSAO="$(cont_sessao_ativa || echo '')"

{
echo "# Estado do repositório"; echo
echo "Fotografia técnica gerada automaticamente em **$(date '+%Y-%m-%d %H:%M')**."
echo "**Não edite à mão** — é sobrescrito."; echo
echo "Diz apenas *como o repositório está*. Não diz o que estava sendo construído"
echo "nem se o que você encontrar funciona. Para retomar, siga [PROMPT_RETOMADA.md](./PROMPT_RETOMADA.md)."; echo

echo "## Trabalho ativo"; echo
if [ -n "$SPEC" ] || [ -n "$SESSAO" ]; then
  [ -n "$SPEC" ]   && echo "- Spec: [\`${SPEC}\`](../${SPEC})"
  [ -n "$SESSAO" ] && echo "- Sessão: [\`${SESSAO}\`](../${SESSAO})"
  for par in '>|Declaradas em andamento (podem estar pela metade)' \
             '?|Implementadas sem validação (código existe, ninguém provou que funciona)' \
             '~|Incertas (a evidência não fecha)' \
             '!|Bloqueadas'; do
    m="${par%%|*}"; t="${par#*|}"
    [ -n "$SESSAO" ] && [ -f "$SESSAO" ] || continue
    linhas="$(cont_tarefas_com_status "$SESSAO" "$m")"
    [ -z "$linhas" ] && continue
    echo; echo "**${t}:**"; echo '```'; echo "$linhas" | cont_truncar; echo '```'
  done
else
  echo "Nenhuma spec ou sessão ativa em \`docs/sessoes/.ativa\`."
  echo "Se há trabalho em andamento, ele não foi registrado — trate tudo abaixo como suspeito."
fi
echo

if [ -f docs/sessoes/.rastro ]; then
  echo "## Último arquivo salvo"; echo
  echo "Rastro reescrito a cada edição — **independe de alguém lembrar de registrar**."
  echo "Se a sessão foi cortada, é o instante mais próximo do corte que existe."; echo
  echo "- Quando: \`$(cont_ler_kv docs/sessoes/.rastro QUANDO || echo '?')\` · HEAD: \`$(cont_ler_kv docs/sessoes/.rastro HEAD || echo '?')\`"
  echo "- Tarefa **declarada pelo agente**: \`$(cont_ler_kv docs/sessoes/.rastro TAREFA || echo '?')\` (desde \`$(cont_ler_kv docs/sessoes/.rastro TAREFA_DESDE || echo '?')\`)"
  echo; echo "Declaração, não dedução. Se *desde* estiver longe de *quando*, pode ter ficado para trás."
  echo; echo '```'; sed -n '/^# Arquivos mexidos/,$p' docs/sessoes/.rastro | tail -n +2; echo '```'; echo
fi

if [ -n "$SPEC" ] && [ -f "$SPEC" ]; then
  MAPA="$(grep -E '^T[0-9]+: ' "$SPEC" 2>/dev/null)"
  MEX="$(git status --porcelain 2>/dev/null | grep -vE ' (docs/ESTADO\.md|docs/HANDOFF\.md|docs/sessoes/|docs/specs/)' | sed 's/^...//' | head -20)"
  if [ -n "$MAPA" ] && [ -n "$MEX" ]; then
    P=""; I=""
    while IFS= read -r arq; do
      [ -z "$arq" ] && continue
      dono="$(printf '%s\n' "$MAPA" | grep -F -- " $arq" | cut -d: -f1 | tr '\n' ' ')"
      nota=""
      [ -s docs/sessoes/.notas ] && nota="$(grep -F -- "${arq}|" docs/sessoes/.notas 2>/dev/null | head -1 | awk -F'|' '{ if ($2!="") printf "(tarefa declarada na hora: %s) %s",$2,$4; else printf "%s",$4 }')"
      if [ -n "$dono" ]; then
        P="${P}  ${arq}  ->  ${dono}"$'\n'; [ -n "$nota" ] && P="${P}      nota: ${nota}"$'\n'
      else
        I="${I}  ${arq}"$'\n'
        [ -n "$nota" ] && I="${I}      nota: ${nota}"$'\n' || I="${I}      (sem nota — a intenção precisa ser deduzida do código)"$'\n'
      fi
    done <<< "$MEX"
    echo "## Arquivos mexidos, por tarefa"; echo
    echo "Cruzamento com a lista declarada na spec. A lista é **indicativa**."; echo
    [ -n "$P" ] && { echo "**Previstos:**"; echo '```'; printf '%s' "$P" | cont_truncar; echo '```'; echo; }
    if [ -n "$I" ]; then
      echo "**Não previstos — investigar:**"; echo
      echo "Não presuma vazamento de escopo. Pode ser dependência que só apareceu na"
      echo "implementação, refatoração necessária, ou trabalho de outra tarefa."; echo
      echo '```'; printf '%s' "$I" | cont_truncar; echo '```'; echo
    fi
  fi
fi

echo "## Git"; echo
echo "| | |"; echo "| --- | --- |"
echo "| Branch | \`${BRANCH}\` |"; echo "| HEAD | \`${HEAD_SHA}\` |"
echo "| Commits à frente de \`${BASE}\` | ${ADIANTE} |"
echo "| Staged | ${NS} |"; echo "| Modificados não staged | ${NU} |"; echo "| Não rastreados | ${NT} |"
echo; echo "### Commits desde \`${BASE}\`"; echo; echo '```'
git log --oneline "${BASE}..HEAD" 2>/dev/null | head -20 || echo "(nenhum)"; echo '```'; echo
[ "$NS" != "0" ] && { echo "### Staged"; echo; echo '```'; git diff --cached --stat 2>/dev/null | cont_truncar | head -30; echo '```'; echo; }
[ "$NU" != "0" ] && { echo "### Modificado, não staged"; echo; echo '```'; git diff --stat 2>/dev/null | cont_truncar | head -30; echo '```'; echo; }
if [ "$NT" != "0" ]; then
  echo "### Não rastreado"; echo; echo "Arquivo novo que ninguém commitou. Pode ser trabalho válido pela metade."; echo
  echo '```'; git ls-files --others --exclude-standard 2>/dev/null | cont_truncar | head -30; echo '```'; echo
fi

ORF=""
while IFS= read -r arq; do
  case "$arq" in *.ts|*.tsx|*.js|*.jsx|*.py|*.go|*.rb) ;; *) continue ;; esac
  case "$arq" in *.test.*|*.spec.*|*.d.ts) continue ;; esac
  mod="$(basename "$arq")"; mod="${mod%.*}"
  usos="$(git grep -l -- "/${mod}\"\|/${mod}'\|${mod}\b" -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.py' '*.go' '*.rb' 2>/dev/null | grep -v -F "$arq" | head -1)"
  [ -z "$usos" ] && ORF="${ORF}${arq}"$'\n'
done < <(git status --porcelain 2>/dev/null | grep -E '^\?\?' | sed 's/^?? //' | head -15)
if [ -n "$ORF" ]; then
  echo "## Código sem consumidor"; echo
  echo "Módulo novo que nenhum outro arquivo importa. Pode compilar sem erro e nunca"
  echo "ter sido executado — trate como **implementado sem validação**."; echo
  echo '```'; printf '%s' "$ORF" | cont_truncar | head -10; echo '```'; echo
fi

echo "## Aviso sobre confiabilidade"; echo
echo "Gerado por hook ou à mão. Numa interrupção abrupta — limite de uso, queda de"
echo "energia, máquina suspensa — pode não ter rodado, e a data acima estará velha."; echo
echo "**Compare a data com \`git log -1 --format=%cd\`.** Se o último commit for mais"
echo "recente, o retrato está defasado e a verdade é o Git."
} > "$SAIDA" 2>/dev/null
exit 0
