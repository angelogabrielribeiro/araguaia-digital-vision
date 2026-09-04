# WVS Informática

Site institucional profissional desenvolvido para **Wangelo Silva dos Santos**, reunindo serviços de **Tecnologia da Informação, suporte técnico, manutenção tecnológica, finanças e contabilidade** em uma experiência web responsiva, interativa e visualmente imersiva.

**Site em produção:** https://wvsinformaticacda.com.br

> O repositório mantém o nome técnico `araguaia-digital-vision`, usado durante o desenvolvimento do projeto. A identidade comercial publicada é **WVS Informática**.

## Visão geral

O projeto foi criado para apresentar serviços profissionais, fortalecer presença digital e transformar visitas em contatos qualificados pelo WhatsApp. A experiência combina conteúdo institucional, scroll storytelling, motion design e elementos 3D/WebGL sem sacrificar legibilidade ou navegação.

O atendimento é apresentado para **Conceição do Araguaia (PA)**, **Couto Magalhães (TO)** e suporte remoto para todo o Brasil.

## Áreas de atuação

- TI e suporte técnico;
- software e sistemas;
- manutenção tecnológica;
- finanças;
- contabilidade e impostos.

## Funcionalidades e destaques

- navegação responsiva para desktop e mobile;
- páginas específicas por área de serviço;
- CTAs contextuais para WhatsApp;
- motion design com Framer Motion;
- cenas 3D com Three.js, React Three Fiber e Drei;
- WebGL integrado à narrativa da interface;
- mídia real do profissional;
- SEO técnico com Open Graph, sitemap e robots.txt;
- Google Analytics 4;
- verificação do Google Search Console;
- configuração centralizada de domínio, contato, localização e mídia;
- suporte a `prefers-reduced-motion`;
- adaptação da complexidade visual para diferentes tamanhos de tela.

## Stack

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- Vite
- Tailwind CSS
- Three.js
- React Three Fiber
- Drei
- Framer Motion
- Zod

## Arquitetura

Dados importantes do site, como domínio, nome profissional, WhatsApp, localização, mídia e identificadores de analytics, ficam centralizados em `src/config/site.ts`. Isso evita duplicação de informações e simplifica manutenção e evolução do projeto.

Os elementos 3D e as animações são usados como parte da experiência de navegação, enquanto conteúdo, contato e serviços continuam acessíveis mesmo em dispositivos com menor capacidade gráfica ou preferência por movimento reduzido.

## Executando localmente

```bash
git clone https://github.com/angelogabrielribeiro/araguaia-digital-vision.git
cd araguaia-digital-vision
npm install
npm run dev
```

## Status

**Projeto publicado em domínio próprio e em uso.** O código continua disponível para manutenção, refinamentos de performance, conteúdo e experiência visual.

## Objetivos técnicos

Este projeto explora desenvolvimento de uma presença digital real com domínio próprio, SEO, analytics, WebGL, experiências 3D, responsividade, arquitetura de componentes reutilizáveis e motion design aplicado a um produto institucional.

---

Desenvolvido por **Angelo Gabriel Ribeiro Santos**.