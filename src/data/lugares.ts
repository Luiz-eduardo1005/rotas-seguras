// DADOS SIMULADOS para demonstração acadêmica — ver docs/pesquisa/manaus.md
// Gerado por scripts/gerar-dados.mjs — não editar à mão.
import type { LatLng } from '../domain/tipos'

export interface Lugar {
  id: string
  nome: string
  tipo: 'escola' | 'terminal' | 'bairro' | 'apoio' | 'referencia'
  coord: LatLng
  bairro: string
}

export interface RotaModelo {
  id: string
  titulo: string
  descricao: string
  origemId: string
  destinoId: string
}

export const lugares: Lugar[] = [
  {"id":"escola-e-e-julia-bittencourt","nome":"E.E. Júlia Bittencourt","tipo":"escola","coord":{"lat":-3.1086,"lng":-60.0516},"bairro":"Compensa"},
  {"id":"escola-e-e-balbina-mestrinho-coord-estimada","nome":"E.E. Balbina Mestrinho (coord. estimada)","tipo":"escola","coord":{"lat":-3.12732,"lng":-60.00306},"bairro":"Educandos"},
  {"id":"escola-e-e-demostenes-belduque-traves","nome":"E.E. Demóstenes Belduque Traves","tipo":"escola","coord":{"lat":-3.0307,"lng":-59.9299},"bairro":"Jorge Teixeira"},
  {"id":"escola-e-e-prof-cacilda-pinto","nome":"E.E. Prof. Cacilda Pinto","tipo":"escola","coord":{"lat":-3.0315,"lng":-59.9269},"bairro":"Jorge Teixeira"},
  {"id":"escola-universidade-nilton-lins","nome":"Universidade Nilton Lins","tipo":"escola","coord":{"lat":-3.0572,"lng":-60.0066},"bairro":"Flores"},
  {"id":"escola-unip-parque-dez","nome":"UNIP Parque Dez","tipo":"escola","coord":{"lat":-3.0808,"lng":-60.0235},"bairro":"Parque Dez"},
  {"id":"escola-uea-escola-superior-de-tecnologia","nome":"UEA Escola Superior de Tecnologia","tipo":"escola","coord":{"lat":-3.09192,"lng":-60.01794},"bairro":"Parque Dez"},
  {"id":"terminal-terminal-cidade-nova-t3","nome":"Terminal Cidade Nova (T3)","tipo":"terminal","coord":{"lat":-3.0316,"lng":-59.9855},"bairro":"Cidade Nova"},
  {"id":"terminal-terminal-embarque-metropolitano","nome":"Terminal Embarque Metropolitano","tipo":"terminal","coord":{"lat":-3.1035,"lng":-60.0668},"bairro":"Compensa"},
  {"id":"terminal-terminal-sao-jose-t5","nome":"Terminal São José (T5)","tipo":"terminal","coord":{"lat":-3.07486,"lng":-59.95466},"bairro":"São José Operário"},
  {"id":"terminal-terminal-2-cachoeirinha","nome":"Terminal 2 (Cachoeirinha)","tipo":"terminal","coord":{"lat":-3.12718,"lng":-60.0055},"bairro":"Educandos"},
  {"id":"terminal-terminal-matriz","nome":"Terminal Matriz","tipo":"terminal","coord":{"lat":-3.13561,"lng":-60.02633},"bairro":"Centro"},
  {"id":"bairro-zumbi-dos-palmares","nome":"Zumbi dos Palmares","tipo":"bairro","coord":{"lat":-3.075,"lng":-59.9463},"bairro":"Zumbi dos Palmares"},
  {"id":"bairro-jorge-teixeira","nome":"Jorge Teixeira","tipo":"bairro","coord":{"lat":-3.027,"lng":-59.9182},"bairro":"Jorge Teixeira"},
  {"id":"bairro-tancredo-neves","nome":"Tancredo Neves","tipo":"bairro","coord":{"lat":-3.0532,"lng":-59.9389},"bairro":"Tancredo Neves"},
  {"id":"bairro-sao-jose-operario","nome":"São José Operário","tipo":"bairro","coord":{"lat":-3.0665,"lng":-59.9458},"bairro":"São José Operário"},
  {"id":"bairro-compensa","nome":"Compensa","tipo":"bairro","coord":{"lat":-3.1052,"lng":-60.0537},"bairro":"Compensa"},
  {"id":"bairro-ponta-negra","nome":"Ponta Negra","tipo":"bairro","coord":{"lat":-3.0509,"lng":-60.0962},"bairro":"Ponta Negra"},
  {"id":"bairro-centro","nome":"Centro","tipo":"bairro","coord":{"lat":-3.1321,"lng":-60.0216},"bairro":"Centro"},
  {"id":"bairro-adrianopolis","nome":"Adrianópolis","tipo":"bairro","coord":{"lat":-3.1017,"lng":-60.009},"bairro":"Adrianópolis"},
  {"id":"bairro-parque-dez","nome":"Parque Dez","tipo":"bairro","coord":{"lat":-3.089,"lng":-60.0189},"bairro":"Parque Dez"},
  {"id":"bairro-educandos","nome":"Educandos","tipo":"bairro","coord":{"lat":-3.1421,"lng":-60.011},"bairro":"Educandos"},
  {"id":"bairro-cidade-nova","nome":"Cidade Nova","tipo":"bairro","coord":{"lat":-3.0299,"lng":-59.9926},"bairro":"Cidade Nova"},
  {"id":"bairro-cidade-de-deus","nome":"Cidade de Deus","tipo":"bairro","coord":{"lat":-3.0187,"lng":-59.9504},"bairro":"Cidade de Deus"},
  {"id":"bairro-novo-aleixo","nome":"Novo Aleixo","tipo":"bairro","coord":{"lat":-3.0549,"lng":-59.9647},"bairro":"Novo Aleixo"},
  {"id":"bairro-taruma","nome":"Tarumã","tipo":"bairro","coord":{"lat":-3.0247,"lng":-60.0513},"bairro":"Tarumã"},
  {"id":"bairro-alvorada","nome":"Alvorada","tipo":"bairro","coord":{"lat":-3.0759,"lng":-60.0491},"bairro":"Alvorada"},
  {"id":"bairro-petropolis","nome":"Petrópolis","tipo":"bairro","coord":{"lat":-3.1119,"lng":-59.9948},"bairro":"Petrópolis"},
  {"id":"bairro-flores","nome":"Flores","tipo":"bairro","coord":{"lat":-3.0728,"lng":-60.0212},"bairro":"Flores"},
  {"id":"referencia-teatro-amazonas","nome":"Teatro Amazonas","tipo":"referencia","coord":{"lat":-3.1303,"lng":-60.0234},"bairro":"Centro"},
  {"id":"referencia-arena-da-amazonia","nome":"Arena da Amazônia","tipo":"referencia","coord":{"lat":-3.08311,"lng":-60.02801},"bairro":"Flores"},
  {"id":"referencia-shopping-manauara","nome":"Shopping Manauara","tipo":"referencia","coord":{"lat":-3.104,"lng":-60.0113},"bairro":"Adrianópolis"},
  {"id":"referencia-shopping-ponta-negra","nome":"Shopping Ponta Negra","tipo":"referencia","coord":{"lat":-3.0846,"lng":-60.0724},"bairro":"Ponta Negra"},
  {"id":"referencia-praia-da-ponta-negra-calcadao","nome":"Praia da Ponta Negra (calçadão)","tipo":"referencia","coord":{"lat":-3.06247,"lng":-60.10375},"bairro":"Ponta Negra"},
  {"id":"referencia-ufam","nome":"UFAM","tipo":"referencia","coord":{"lat":-3.09992,"lng":-59.9752},"bairro":"Coroado"},
  {"id":"referencia-praca-osvaldo-cruz-matriz","nome":"Praça Osvaldo Cruz (Matriz)","tipo":"referencia","coord":{"lat":-3.1354,"lng":-60.0254},"bairro":"Centro"},
  {"id":"apoio-pronto-socorro-platao-araujo","nome":"Pronto Socorro Platão Araújo","tipo":"apoio","coord":{"lat":-3.03827,"lng":-59.94173},"bairro":"Jorge Teixeira"},
  {"id":"apoio-1-dip","nome":"1º DIP","tipo":"apoio","coord":{"lat":-3.1185,"lng":-60.0116},"bairro":"Centro-Sul"},
]

export const rotasModelo: RotaModelo[] = [
  {"id":"julia-centro","titulo":"Escola na Compensa até o Centro","descricao":"Saída do turno noturno da E.E. Júlia Bittencourt rumo ao Centro","origemId":"escola-e-e-julia-bittencourt","destinoId":"referencia-teatro-amazonas"},
  {"id":"cacilda-t5","titulo":"Escola no Jorge Teixeira até o T5","descricao":"Da E.E. Cacilda Pinto ao Terminal São José (Zona Leste)","origemId":"escola-e-e-prof-cacilda-pinto","destinoId":"terminal-terminal-sao-jose-t5"},
  {"id":"demostenes-t3","titulo":"Escola no Jorge Teixeira até o T3","descricao":"Da E.E. Demóstenes Belduque ao Terminal Cidade Nova","origemId":"escola-e-e-demostenes-belduque-traves","destinoId":"terminal-terminal-cidade-nova-t3"},
  {"id":"unip-compensa","titulo":"UNIP até a Compensa","descricao":"Da UNIP Parque Dez para casa, na Compensa","origemId":"escola-unip-parque-dez","destinoId":"bairro-compensa"},
  {"id":"lins-zumbi","titulo":"Nilton Lins até Zumbi dos Palmares","descricao":"Da Universidade Nilton Lins para casa, em Zumbi dos Palmares","origemId":"escola-universidade-nilton-lins","destinoId":"bairro-zumbi-dos-palmares"},
  {"id":"trabalho-centro-compensa","titulo":"Trabalho no Centro até a Compensa","descricao":"Do Teatro Amazonas (Centro) para casa, na Compensa","origemId":"referencia-teatro-amazonas","destinoId":"bairro-compensa"},
]
