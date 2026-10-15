# src/domain — regra de negócio pura

Sem React/Leaflet/localStorage. Toda nota, agregação e geometria vive aqui; UI só chama e exibe. Testes: `*.test.ts` (vitest).

## Mapa
- `tipos.ts` — Trecho/Area/PontoApoio/Avaliacao/Cenario/Fatores (luz, fluxo, risco 0..1).
- `geo.ts` — `distanciaM`, `distanciaPontoSegmentoM`, `amostrarPolilinha` (passo 50 m), `BBOX_MANAUS`, `validarTrajeto` (máx 25 km, mín 30 m), `areaDoPonto` (área que contém o ponto; empate → centro mais próximo; única busca de área, usada por pontuação, folha e título).
- `pontuacao.ts` — `notaFatores`, `nivelDaNota`, `fatoresNoPonto`, `pontuarRota`, `ordenarRotas`, `resumoRota`.
- `avaliacoes.ts` — `agregarAvaliacoes`, `pesoComunidade`, `aplicarAvaliacoes`, `alvoIdParaCoord`, `relatosProximos`/`relatosParaPonto`, `podeExcluir`, `tempoRelativo`.

## Fórmulas
- Nota = 100·(pL·luz + pF·fluxo + pR·(1−risco)). Noite 0.45/0.35/0.20; dia 0.15/0.45/0.40.
- Níveis: ≥70 verde, ≥45 amarelo, senão vermelho. Fator isolado: ≥0.6 / ≥0.4.
- Rota: média das amostras (50 m) + bônus apoio 2/ponto ≤150 m, teto 10; nota arredondada 0..100.
- `fatoresNoPonto`: trecho mais próximo ≤60 m; senão `areaDoPonto`; senão NEUTRO (0.5). Depois `aplicarAvaliacoes` sobre o alvo achado.
- Comunidade: peso = total/(total+3), teto 0.7 (`PESO_MAX_COMUNIDADE`); votos luz/fluxo/atencao puxam os fatores; relatos semente e do usuário passam pela mesma agregação.
- `relatosParaPonto`: `proximos` (relatos do alvo, inclusive a ~900 m, ou a ≤raioM) + `doBairro` (alvoId = área, fora de `proximos`).

## O que quebra
- Mudar pesos/cortes/bônus altera notas e quebra `data/dados.test.ts` (contraste ≥15 nas rotas-modelo) e `pontuacao.test.ts`.
- `alvoIdParaCoord` define chave de avaliação de ponto solto: mudar invalida avaliações salvas.
- `BBOX_MANAUS` é a fonte única do limite (dados e validação).
