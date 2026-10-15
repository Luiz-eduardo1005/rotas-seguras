# src/data — dados do cenário (SIMULADOS)

Arquivos `areas|trechos|apoio|lugares|rotasPregravadas|comunidadeSemente.ts` são GERADOS: não editar à mão. `index.ts` expõe `cenario`.

## Simulado vs fonte
- Geometria dos trechos/rotas: reais (OSRM a pé). Bairros, centros, raios e níveis qualitativos: pesquisa em `docs/pesquisa/manaus-v2.{md,json}`. Fatores numéricos (luz/fluxo/risco) e relatos semente: SIMULADOS (faixas por nível + jitter determinístico). Disclaimer do app vale.

## Regenerar
`node scripts/gerar-dados.mjs` (usa `scripts/lib/{util,base,relatos}.mjs`; `base.mjs` = apoio atual, lugares fixos, rotas-modelo, vias extras). Respostas OSRM em cache em `os.tmpdir()/rotas-cache` (offline após 1ª execução). PRNG semeado por id → saída reproduzível; relatos usam data de referência fixa (`REFERENCIA` em `relatos.mjs`), não `Date.now()`. Mudou o gerador → rodar e commitar os `.ts`.

## Invariantes (`dados.test.ts`)
Ids únicos; fatores em 0..1; contagens mínimas; todo bairro-chave tem área e toda zona ≥5 trechos; coords dentro de `BBOX_MANAUS`; relatos semente: ≥3 por trecho, ≥5 por área, 650..1100 no total, todos marcados semente, alvos válidos, datas ≤ referência; rotas-modelo apontam para lugares existentes e têm pré-gravada; diferença de nota ≥15 à noite entre rota segura e insegura nas 6 rotas-modelo.

## O que quebra
Alterar fatores/relatos pode derrubar o teste de contraste; mudar ids invalida avaliações salvas (alvoId) e rotas-modelo.
