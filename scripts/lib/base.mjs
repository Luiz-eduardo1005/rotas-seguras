// dados-base fixos do gerador (coordenadas obtidas no Nominatim/Overpass em 2026-10-15)

// [nome, tipo, lat, lng, bairro]; fora: Hemoam (fecha 18h) e PRF (fecha 17h).
export const APOIO_ATUAL = [
  ['1º Distrito Integrado de Polícia', 'delegacia', -3.1185, -60.0116, 'Centro-Sul'],
  ['12º Distrito Integrado de Polícia', 'delegacia', -3.0709, -60.0227, 'Flores'],
  ['10º Distrito Integrado de Polícia', 'delegacia', -3.0719, -60.0457, 'Alvorada'],
  ['23ª Delegacia Integrada de Polícia', 'delegacia', -3.0707, -59.9962, 'Parque Dez'],
  ['27º Distrito Integrado de Polícia', 'delegacia', -3.0446, -59.9592, 'Novo Aleixo'],
  ['Comando de Policiamento de Área Oeste', 'delegacia', -3.1034, -60.0635, 'Compensa'],
  ['Comando de Policiamento de Área Norte', 'delegacia', -3.0444, -59.9589, 'Novo Aleixo'],
  ['Hospital e PS Delphina Rinaldi Abdel Aziz', 'saude', -2.9979, -60.0295, 'Tarumã'],
  ['Hospital Universitário Getúlio Vargas', 'saude', -3.1164, -60.0189, 'Centro'],
  ['Hospital Adriano Jorge', 'saude', -3.1189, -60.0056, 'Petrópolis'],
  ['Hospital e PS da Criança Zona Leste', 'saude', -3.0735, -59.9614, 'Zumbi dos Palmares'],
  ['SPA Galiléia', 'saude', -3.0139, -59.9909, 'Cidade Nova'],
  ['Policlínica Gilberto Mestrinho', 'saude', -3.1324, -60.0209, 'Centro'],
  ['Pronto Socorro Dr. Aristóteles Platão Araújo', 'saude', -3.03827, -59.94173, 'Jorge Teixeira'],
  ['Terminal Cidade Nova (T3)', 'terminal', -3.0316, -59.9855, 'Cidade Nova'],
  ['Terminal Embarque Metropolitano', 'terminal', -3.1035, -60.0668, 'Compensa'],
  ['Terminal São José (T5)', 'terminal', -3.07486, -59.95466, 'São José Operário'],
  ['Terminal 2 (Cachoeirinha)', 'terminal', -3.12718, -60.0055, 'Educandos'],
  ['Terminal Matriz', 'terminal', -3.13561, -60.02633, 'Centro'],
  ['Posto Equador', 'comercio24h', -3.0499, -59.9925, 'Cidade Nova'],
  ['Posto Shell', 'comercio24h', -3.0891, -59.9953, 'Petrópolis'],
  ['Farmabem', 'comercio24h', -3.1161, -60.0181, 'Centro'],
  ['Drogaria Avenida', 'comercio24h', -3.1161, -60.0194, 'Centro'],
  ['Shopping Manauara', 'comercio24h', -3.104, -60.0113, 'Adrianópolis'],
  ['Shopping Ponta Negra', 'comercio24h', -3.0846, -60.0724, 'Ponta Negra'],
  ['Área de lazer do Shopping T4', 'praca', -3.0354, -59.942, 'Cidade de Deus'],
  ['Praça Osvaldo Cruz (Praça da Matriz)', 'praca', -3.1354, -60.0254, 'Centro'],
  ['Teatro Amazonas', 'praca', -3.1303, -60.0234, 'Centro'],
]

// [nome, tipo, lat, lng, bairro]; os 7 primeiros vêm antes dos terminais/bairros, o resto depois
export const LUGARES_FIXOS = [
  ['E.E. Júlia Bittencourt', 'escola', -3.1086, -60.0516, 'Compensa'],
  ['E.E. Balbina Mestrinho (coord. estimada)', 'escola', -3.12732, -60.00306, 'Educandos'],
  ['E.E. Demóstenes Belduque Traves', 'escola', -3.0307, -59.9299, 'Jorge Teixeira'],
  ['E.E. Prof. Cacilda Pinto', 'escola', -3.0315, -59.9269, 'Jorge Teixeira'],
  ['Universidade Nilton Lins', 'escola', -3.0572, -60.0066, 'Flores'],
  ['UNIP Parque Dez', 'escola', -3.0808, -60.0235, 'Parque Dez'],
  ['UEA Escola Superior de Tecnologia', 'escola', -3.09192, -60.01794, 'Parque Dez'],
  ['Teatro Amazonas', 'referencia', -3.1303, -60.0234, 'Centro'],
  ['Arena da Amazônia', 'referencia', -3.08311, -60.02801, 'Flores'],
  ['Shopping Manauara', 'referencia', -3.104, -60.0113, 'Adrianópolis'],
  ['Shopping Ponta Negra', 'referencia', -3.0846, -60.0724, 'Ponta Negra'],
  ['Praia da Ponta Negra (calçadão)', 'referencia', -3.06247, -60.10375, 'Ponta Negra'],
  ['UFAM', 'referencia', -3.09992, -59.9752, 'Coroado'],
  ['Praça Osvaldo Cruz (Matriz)', 'referencia', -3.1354, -60.0254, 'Centro'],
  ['Pronto Socorro Platão Araújo', 'apoio', -3.03827, -59.94173, 'Jorge Teixeira'],
  ['1º DIP', 'apoio', -3.1185, -60.0116, 'Centro'],
]

// [id, titulo, descricao, origem(nome), destino(nome), indice da alternativa 'segura']
export const MODELOS = [
  ['julia-centro', 'Escola na Compensa até o Centro', 'Saída do turno noturno da E.E. Júlia Bittencourt rumo ao Centro', 'E.E. Júlia Bittencourt', 'Teatro Amazonas', 1],
  ['cacilda-t5', 'Escola no Jorge Teixeira até o T5', 'Da E.E. Cacilda Pinto ao Terminal São José (Zona Leste)', 'E.E. Prof. Cacilda Pinto', 'Terminal São José (T5)', 1],
  ['demostenes-t3', 'Escola no Jorge Teixeira até o T3', 'Da E.E. Demóstenes Belduque ao Terminal Cidade Nova', 'E.E. Demóstenes Belduque Traves', 'Terminal Cidade Nova (T3)', 0],
  ['unip-compensa', 'UNIP até a Compensa', 'Da UNIP Parque Dez para casa, na Compensa', 'UNIP Parque Dez', 'Compensa', 0],
  ['lins-zumbi', 'Nilton Lins até Zumbi dos Palmares', 'Da Universidade Nilton Lins para casa, em Zumbi dos Palmares', 'Universidade Nilton Lins', 'Zumbi dos Palmares', 1],
  ['trabalho-centro-compensa', 'Trabalho no Centro até a Compensa', 'Do Teatro Amazonas (Centro) para casa, na Compensa', 'Teatro Amazonas', 'Compensa', 1],
]

// waypoints que forçam a alternativa 'segura' numa avenida iluminada (OSRM devolve alternativas quase iguais)
export const VIA = { 'julia-centro': [-3.1355, -60.0230], 'trabalho-centro-compensa': [-3.1355, -60.0230] }

// vias da pesquisa v1 [nome, início, fim, [luz, fluxo, risco]]
export const VIAS = [
  ['Av. Djalma Batista', [-3.0916, -60.0237], [-3.0910, -60.0242], [0.8, 0.8, 0.25]],
  ['Av. Constantino Nery', [-3.0985, -60.0266], [-3.0978, -60.0261], [0.5, 0.5, 0.45]],
  ['Av. Autaz Mirim', [-3.0980, -59.9471], [-3.0778, -59.9559], [0.55, 0.55, 0.55]],
  ['Av. Brasil', [-3.1019, -60.0330], [-3.0896, -60.0610], [0.7, 0.7, 0.35]],
  ['Av. Torquato Tapajós', [-2.9912, -60.0309], [-2.9898, -60.0302], [0.5, 0.45, 0.6]],
  ['Av. Eduardo Ribeiro', [-3.1299, -60.0241], [-3.1290, -60.0241], [0.85, 0.85, 0.3]],
  ['Av. Cosme Ferreira', [-3.0876, -59.9278], [-3.0873, -59.9282], [0.25, 0.8, 0.65]],
  ['Av. Darcy Vargas', [-3.0936, -60.0266], [-3.0934, -60.0264], [0.5, 0.5, 0.45]],
  ['Av. Mário Ypiranga', [-3.0869, -60.0193], [-3.0807, -60.0243], [0.55, 0.8, 0.4]],
  ['Av. Coronel Teixeira', [-3.0893, -60.0598], [-3.0894, -60.0597], [0.45, 0.5, 0.5]],
  ['Av. Manicoré (Leonardo Malcher no OSM)', [-3.1271, -60.0078], [-3.1263, -60.0110], [0.5, 0.5, 0.5]],
]

export const EXTRA = [
  ['Eixo comercial — Zumbi dos Palmares', [-3.0750, -59.9463], [-3.07486, -59.95466], [0.75, 0.75, 0.3]],
  ['Ruas internas — Zumbi dos Palmares', [-3.0665, -59.9458], [-3.0750, -59.9463], [0.3, 0.3, 0.8]],
  ['Eixo de ônibus — Cidade de Deus', [-3.0187, -59.9504], [-3.0354, -59.942], [0.7, 0.7, 0.35]],
  ['Ruas internas — Cidade de Deus', [-3.0187, -59.9504], [-3.0270, -59.9420], [0.3, 0.3, 0.75]],
  ['Eixo principal — Jorge Teixeira', [-3.0307, -59.9299], [-3.03827, -59.94173], [0.7, 0.7, 0.35]],
  ['Ruas internas — São José Operário', [-3.0665, -59.9458], [-3.0620, -59.9400], [0.35, 0.4, 0.55]],
  ['Ruas internas — Centro (becos)', [-3.1303, -60.0234], [-3.1340, -60.0200], [0.4, 0.3, 0.7]],
  ['Eixo principal — Compensa', [-3.1086, -60.0516], [-3.1035, -60.0668], [0.7, 0.7, 0.3]],
]

// fatores [luz, fluxo, risco] por tipo de ponto crítico (pesquisa v2)
export const FCRIT = {
  assalto_ponto_onibus: [0.4, 0.5, 0.82], arrastao_pontos_onibus: [0.4, 0.5, 0.82], arrastao_comercio_pontos: [0.45, 0.7, 0.78],
  assalto_coletivo: [0.4, 0.5, 0.8], serie_assaltos: [0.35, 0.4, 0.85], roubo_pedestre: [0.35, 0.35, 0.82],
  furto_celular_pedestre: [0.45, 0.5, 0.72], latrocinio_pedestre: [0.3, 0.3, 0.9],
  iluminacao_furtada: [0.12, 0.3, 0.7], escuridao_infraestrutura: [0.12, 0.3, 0.72], iluminacao_apagada: [0.12, 0.3, 0.7],
  iluminacao_pracas_escuras: [0.18, 0.3, 0.68], iluminacao_postes: [0.2, 0.35, 0.65],
  toque_de_recolher_informal: [0.3, 0.12, 0.85], medo_caminhada_noturna: [0.35, 0.25, 0.8], violencia_reportada: [0.35, 0.3, 0.82],
  sem_vigilancia: [0.4, 0.25, 0.75], ocorrencias_orla_noite: [0.5, 0.4, 0.75],
  iluminacao_reforcada: [0.8, 0.6, 0.3], ponto_onibus_noite: [0.5, 0.6, 0.55], saida_turno_noite: [0.5, 0.6, 0.55],
  pouco_movimento_noite: [0.4, 0.15, 0.65], iluminacao_regular: [0.5, 0.45, 0.5],
}
