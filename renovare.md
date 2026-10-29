# Renovare: identidade, design system e plano da landing page

Oct 28, 2026 · @Zé da Doze

## O que o guideline corrige

O guideline oficial (doze agência, 2025) substitui as estimativas feitas a partir do Instagram: a página segue o manual, não o feed.

| Item | Estimativa pelo Instagram | Guideline oficial |
| --- | --- | --- |
| Verde-base | Verde-floresta | Dark Olive Green `#475A38` |
| Verde claro | Sálvia | Pale Moss Green `#DBE4A9` |
| Neutros | Off-white e branco | Polar White `#F8F7F7` e Onyx `#0F0F0F` |
| Tipografia | Sans leve + serifada itálica | Aileron (Bold 56 e 32, Medium 20, Regular 16) |
| Símbolo | Floral genérico | Lírio estilizado, pétalas em espiral rotacional |

O feed usa uma serifada itálica de destaque que o manual não prevê. Proposta: na página, o destaque vem de cor e peso, em Aileron.

## Leitura da marca

A Renovare não promete criar uma nova pessoa: promete revelar a que já existe. A frase-guia do manual é "Beleza real não precisa de filtro".

- **Filosofia:** "Não criamos uma nova você, revelamos a verdadeira." O lírio simboliza o desabrochar da beleza que já existe.
- **Valores:** colaboração, profissionalismo, conexão, integração.
- **Assinatura verbal:** a família *re-* (renovar, redescobrir, reconectar, reanimar, reascender, resgatar). No moodboard, o "re" aparece em Pale Moss e o resto da palavra em branco.

**Tensão a tratar na copy:** o manual rejeita "padrões impossíveis", mas os posts recentes tratam de emagrecimento e antes/depois. A página deve falar de bem-estar e revelação, não de corpo ideal. Isso também reduz risco de publicidade em saúde, tema a alinhar com o responsável técnico antes de fechar a copy.

## Fase 3: Design system

O design system usa as quatro cores e a tipografia do manual, com regras de contraste que impedem o Pale Moss de carregar texto sobre fundo claro.

| Token | Hex | Uso |
| --- | --- | --- |
| Dark Olive Green | `#475A38` | Fundos de seções de impacto, títulos e logo sobre fundo claro |
| Pale Moss Green | `#DBE4A9` | Acentos, o "re" das palavras, botões sobre escuro, luz do 3D |
| Polar White | `#F8F7F7` | Fundo principal de leitura |
| Onyx | `#0F0F0F` | Texto corrido |

**Contraste (calculado, WCAG):**

- Dark Olive sobre Polar White: cerca de 7:1, passa em AA e AAA.
- Pale Moss sobre Dark Olive: cerca de 5,6:1, passa em AA.
- Pale Moss sobre Polar White: cerca de 1,25:1, não serve para texto nem logo. Sobre fundo claro, o logo usa a versão Dark Olive, como no manual.

**Tipografia:** Aileron em quatro níveis do manual: Display 56 px Bold, Título 32 px Bold, Subtítulo 20 px Medium, Corpo 16 px Regular. No mobile, escala fluida para o Display.

**Pendências de marca:**

- Arquivo do logo em vetor (símbolo e wordmark). O wordmark minúsculo e o lettering "re…" usam uma display exclusiva que o manual não nomeia.
- Licença de uso web do Aileron: confirmar com a doze agência.

## Movimento e 3D

O símbolo tem simetria rotacional e pétalas separadas, o que permite animá-lo sem inventar identidade nova: o movimento é o próprio "desabrochar" do manual.

- **Hero (img2threejs):** as pétalas extrudadas em volume, abrindo no carregamento e girando levemente com o scroll. Fundo Dark Olive, luz em Pale Moss.
- **Palavras "re" (GSAP):** a família re- alterna no hero, com "re" em Pale Moss e a raiz em branco.
- **Scroll (GSAP ScrollTrigger):** revelações suaves por seção, linha do tempo da primeira sessão fixada na tela e contagem regressiva da Black.
- **Limites:** fallback estático do símbolo no mobile, `prefers-reduced-motion` respeitado e orçamento de peso definido antes do build, já que o tráfego vem do Instagram, quase todo em celular.

## Estrutura da página

A página converte o visitante do Instagram em agendamento de avaliação por WhatsApp, na voz do manual.

1. **Hero:** "Beleza real não precisa de filtro", símbolo 3D e CTA de avaliação por WhatsApp.
2. **Manifesto:** "Você se reconhece no espelho?", com a filosofia em duas linhas.
3. **Re-jornada:** os seis "re" como pontos do método.
4. **Qual te incomoda?:** seleção interativa que leva ao protocolo.
5. **Tratamentos e tecnologias:** criolipólise, seca-barriga e protocolo de emagrecimento.
6. **Sua primeira sessão:** linha do tempo do que esperar.
7. **Black da Renovare:** oferta e contagem regressiva, se ainda for relevante. A Black Friday 2026 cai em 27/11.
8. **Prova social, equipe e clínica, FAQ.**
9. **Localização e CTA final:** mapa, horários e WhatsApp.

## Pendências e próximos passos

Cinco itens destravam o build; o primeiro é o logo em vetor.

- [ ] Logo em vetor (SVG ou AI) do símbolo e do wordmark, ou PNG transparente de alta resolução.
- [ ] Decisão sobre a serifada itálica do feed: seguir só o manual ou levar o toque ao site.
- [ ] Lista de serviços e carro-chefe, e se a Black é pontual ou perene.
- [ ] Endereço, horários, WhatsApp e nomes dos profissionais que podem aparecer.
- [ ] Fotos próprias da clínica e da equipe.

**Próximo passo:** com esses itens, avançar para o protótipo do hero 3D com o símbolo.
