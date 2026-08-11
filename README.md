# Araguaia Digital

Crie um site profissional institucional/pessoal de altíssimo nível para um profissional individual baseado em Conceição do Araguaia (PA), que também atende Couto Magalhães (TO) e oferece alguns serviços remotamente. É um projeto separado de qualquer outro site existente. O profissional trabalha registrado em TI e também presta serviços por fora. Não representar como empresa grande, não inventar clientes, avaliações, números, cases ou equipe.

OBJETIVO: autoridade, confiança, apresentação profissional, explicação clara dos serviços, prova visual e geração de contatos via WhatsApp. O site deve servir também como destino para anúncios pagos específicos por serviço.

SERVIÇOS PRINCIPAIS:
1) TI e suporte técnico: suporte, computadores, configuração, assistência, diagnóstico, resolução de problemas e suporte remoto via ferramentas como AnyDesk.
2) Software e sistemas: suporte a softwares, configuração, problemas em sistemas, orientação de uso, suporte empresarial.
3) Manutenção tecnológica: manutenção de equipamentos/produtos de tecnologia para empresas; não reduzir comunicação a 'formatação de computador'.
4) Finanças: serviços relacionados à área financeira.
5) Contabilidade / impostos: contabilidade, impostos, orientação fiscal e necessidades administrativas relacionadas.

ROTAS:
- `/` Home
- `/servicos`
- `/ti`
- `/manutencao`
- `/financas`
- `/contabilidade`
- `/sobre`
- `/contato`
Poucas páginas muito bem feitas. Cada rota de serviço deve ter CTA próprio para WhatsApp com mensagem pré-preenchida específica. Centralize nome profissional, telefone/WhatsApp, analytics IDs, localização e mídias em um arquivo de configuração fácil de editar. Use placeholders explícitos enquanto os dados reais não forem fornecidos.

NÃO CRIAR: login, cadastro, painel, carrinho, checkout, conta de cliente, histórico, banco de dados ou backend desnecessário. Primeira versão frontend estática.

MENSURAÇÃO: deixe estrutura pronta para GA4, Search Console, Meta Pixel, UTMs e eventos de clique no WhatsApp por serviço. Não invente IDs.

DIREÇÃO VISUAL: prioridade absoluta para animação e interatividade de alto nível. O site deve parecer customizado e cinematográfico, não template. Não se limitar a fade-up, cards, zoom pequeno ou glow de botão. Use WebGL, Three.js, React Three Fiber, shaders, pointer interaction, parallax, scroll storytelling, profundidade, câmera, iluminação e transições contínuas com significado. A descrição conceitual é 'quase um carnaval animado', porém elegante e profissional, sem efeitos aleatórios.

REFERÊNCIA TÉCNICA 1: Animated Shader Hero do 21st.dev. Use a IDEIA TÉCNICA, não copie texto/cores/estrutura. A referência tem WebGL2 puro, renderer próprio, vertex + fragment shader, requestAnimationFrame, pointer handling, uniforms resolution/time, procedural noise, value noise, FBM, clouds e hero HTML sobre Canvas. Quero uma atmosfera procedural viva equivalente em ambição, mas original para este profissional.

REFERÊNCIA TÉCNICA 2: Stellar 3D Card Gallery do 21st.dev. Use a IDEIA TÉCNICA, não copie literalmente. A referência usa React + Three.js + R3F + Drei, milhares de pontos/estrelas via BufferGeometry/PointsMaterial, PerspectiveCamera, cards distribuídos no espaço, objetos olhando para a câmera, Environment, lights, OrbitControls, drag, scroll zoom, hover/click e modal. Quero a noção de espaço 3D explorável e interativo, porém adaptada a serviços profissionais.

Essas referências são o PISO técnico, não o teto. Não instale os dois componentes e empilhe. Extraia: atmosfera procedural viva + espaço 3D explorável + scroll storytelling + pointer interaction + conteúdo real do profissional.

NARRATIVA VISUAL SUGERIDA:
- Hero: ambiente digital vivo, shader procedural sofisticado, headline forte e CTA.
- TI: infraestrutura digital reagindo ao scroll/pointer; nodes, conexões, diagnóstico/solução.
- Manutenção: componentes/equipamentos se abrindo/revelando de modo quase exploded-view, sem estética gamer.
- Finanças: dados e fluxos desorganizados se reorganizando em estrutura clara e legível.
- Contabilidade/tributos: informação caótica se transformando em ordem/clareza, com visual próprio distinto de finanças.
- Sobre: preparar layout para fotos e vídeo real do profissional trabalhando, com placeholders elegantes temporários.
- CTA final: WhatsApp forte e contextual.

IDENTIDADE: crie direção visual original que una tecnologia + finanças + tributário sem cair em neon gamer, banco tradicional ou escritório contábil genérico. Ponto de partida sugerido: base escura sofisticada, azul profundo/ciano controlado para tecnologia, acentos verde/âmbar discretos para finanças/clareza, tipografia editorial-tech premium. Pode melhorar essa direção se encontrar algo superior.

DESKTOP: experiência agressiva e cinematográfica, cursor reagindo, profundidade, 3D, shaders, grandes transições, scroll como narrativa e elementos atravessando seções.

MOBILE: não transformar em versão estática/genérica. Preserve direção artística, atmosfera, movimento, profundidade e storytelling. Adaptar DPR, partículas, complexidade geométrica e resolução quando necessário. Respeitar prefers-reduced-motion.

PERFORMANCE: não remover 3D só para ficar leve. Fazer 3D direito: lazy load cenas próximas da viewport, pausar renderização fora da viewport, otimizar geometria/texturas, DPR adaptativo, compartilhar shaders e preferir uma cena consolidada quando fizer sentido.

STACK DESEJADA: React + TypeScript + Tailwind. Use Framer Motion e/ou GSAP para coreografia. Use Three.js/R3F/Drei para 3D. Pode escrever shader próprio. Evite múltiplos contextos WebGL desnecessários.

PRIMEIRA VERSÃO OBRIGATÓRIA:
- todas as rotas principais implementadas;
- sistema visual consistente;
- hero realmente impactante, não placeholder;
- pelo menos 2 experiências WebGL/3D significativas e integradas à narrativa, não decorativas;
- estrutura pronta para fotos/vídeos reais;
- SEO básico por rota;
- WhatsApp específico por serviço;
- navegação desktop/mobile premium;
- reduced motion;
- responsividade real.

TEXTO: escrever PT-BR natural, profissional e humano. Não usar linguagem de guru, hype corporativo vazio, promessas exageradas ou números inventados.

Use placeholders claramente marcados para: nome do profissional, WhatsApp, foto, vídeo, GA4, Pixel e qualquer credencial que ainda não foi fornecida.

Implemente agora. Não fique apenas em plan mode.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a3758a05-63d3-43be-a522-4144baa2101c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
