# Araguaia Digital

Site institucional interativo criado para apresentar serviços profissionais com uma experiência visual mais rica do que um site corporativo tradicional, combinando **conteúdo, motion design, WebGL e 3D**.

**Demo:** https://araguaia-digital-vision.lovable.app

## Visão geral

O Araguaia Digital apresenta serviços nas áreas de tecnologia, manutenção, finanças e contabilidade em uma experiência responsiva orientada à autoridade e geração de contato.

A proposta técnica foi integrar recursos visuais avançados sem transformar o projeto em uma demonstração 3D desconectada do conteúdo. As animações, cenas e transições acompanham a narrativa das páginas e os CTAs de cada serviço.

## Funcionalidades e destaques

- navegação responsiva para desktop e mobile;
- páginas específicas por área de serviço;
- CTAs contextuais para WhatsApp;
- motion design com Framer Motion;
- cenas 3D com Three.js, React Three Fiber e Drei;
- uso de WebGL integrado à interface;
- estrutura preparada para SEO e mensuração;
- configuração centralizada de dados de contato;
- suporte a `prefers-reduced-motion`;
- adaptação de complexidade visual para diferentes tamanhos de tela.

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

## Decisões técnicas

O projeto busca equilibrar impacto visual e usabilidade. Elementos 3D e animações são tratados como parte da experiência, enquanto informações de serviço, navegação e contato permanecem acessíveis e legíveis.

A arquitetura também evita backend desnecessário para um site institucional, mantendo a solução mais simples onde complexidade adicional não agrega valor ao produto.

## Executando localmente

```bash
git clone https://github.com/angelogabrielribeiro/araguaia-digital-vision.git
cd araguaia-digital-vision
npm install
npm run dev
```

## Status

**Versão demonstrável publicada.** O projeto continua recebendo refinamentos de conteúdo, performance e experiência visual.

## Objetivos técnicos

Este projeto explora integração de WebGL em interfaces reais, performance de experiências 3D no navegador, responsividade, arquitetura de componentes reutilizáveis e motion design aplicado à narrativa de uma interface.

---

Desenvolvido por **Angelo Gabriel Ribeiro Santos**.