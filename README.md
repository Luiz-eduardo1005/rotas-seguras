# Rotas Seguras

PWA mobile-first que sugere a rota a pé mais segura à noite em Manaus-AM, combinando iluminação, fluxo de pessoas e risco. A comunidade avalia trechos do percurso.

> **Aviso:** os dados são **simulados para demonstração acadêmica**. O app **não garante segurança** e **não substitui serviços de emergência**.

## Equipe

- Alex Victor
- Luiz Eduardo
- Marcos Vinícius

Trabalho da disciplina Tecnologias Urbanas.

## Como rodar

```bash
npm i
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm test         # testes (vitest)
npm run icones   # regenera os PNGs de ícone a partir de public/pin.svg
```

## Stack

React 19, Vite 8, TypeScript, Leaflet / react-leaflet (tiles CARTO), Tailwind CSS v4, vite-plugin-pwa, vitest, lucide-react. Rotas via OSRM público, com fallback pré-gravado. Persistência em localStorage.

## Fontes dos dados

Os dados mock se baseiam em pesquisa sobre Manaus, documentada em [`docs/pesquisa/manaus.md`](docs/pesquisa/manaus.md).
