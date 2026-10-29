# Renovare — Design System & Art Direction (`DESIGN.md`)

## 1. Visual World & Art Direction (`one-motif`)
- **Direction:** `one-motif` (Taste Skill v2 + Impeccable v4.8)
- **The Idea:** *Na página da Renovare, a pétala em espiral do lírio de 8 pétalas torna-se a escultura viva em 3D no Hero (que desabrocha no carregamento e gira com o scroll), a máscara geométrica das imagens editoriais e o selo arquitetônico de cada seção.*
- **Surface Mode:** `Persuade` com momentos `Experience` (Hero 3D procedural em Three.js + Seletor Interativo de Protocolos + Vitrine Interativa de Especialistas).

## 2. Color Tokens (Manual Oficial — Doze Agência + Regras WCAG)
| Token | Hex | Role & Contrast Rules |
| :--- | :--- | :--- |
| `--olive-dark` | `#475A38` | **Dark Olive Green:** Fundo do Hero e seções de impacto, títulos e logo sobre fundo claro (~7:1 sobre Polar White, passa AAA). |
| `--olive-deep` | `#2F3D24` | **Deep Botanical Olive:** Tom de profundidade para superfícies escuras em degrau (sem sombras artificiais). |
| `--moss-pale` | `#DBE4A9` | **Pale Moss Green:** Acento luminoso, prefixo `re-`, botões primários sobre fundo escuro, iluminação rim/key do lírio 3D (~5.6:1 sobre Dark Olive, passa AA). **Proibido** para texto sobre Polar White (contraste 1.25:1). |
| `--polar-white` | `#F8F7F7` | **Polar White:** Fundo principal de leitura silenciosa e limpa. |
| `--stone-warm` | `#EFECE6` | **Warm Botanical Paper:** Degrau tonal claro para separar blocos sobre Polar White sem uso de linhas divisórias de 1px ou sombras. |
| `--onyx` | `#0F0F0F` | **Onyx:** Texto corrido principal em máxima legibilidade. |
| `--onyx-muted` | `#3D4437` | **Tinted Olive-Charcoal:** Texto secundário matizado no matiz verde-oliva (nunca cinza puro). |

## 3. Typography System
- **Primary Sans (Manual):** **Aileron** (`Bold` 700 para Display/Títulos, `Medium` 500 para Subtítulos, `Regular` 400 para Corpo).
- **Editorial Accent (Toque do Feed):** **Cormorant Garamond** (*Italic* 500/600) usada exclusivamente para o toque poético do feed em palavras-chave selecionadas e citações do manifesto.
- **Scale & Measure:**
  - Display Hero: `clamp(2.5rem, 4.8vw, 4.25rem)`, `line-height: 0.96`, `letter-spacing: -0.03em` (máximo 2 linhas).
  - Section Title (`h2`): `clamp(2rem, 3.4vw, 3.25rem)`, `line-height: 1.04`, `letter-spacing: -0.025em`.
  - Subtitle / Lead: `clamp(1.15rem, 1.4vw, 1.35rem)`, `line-height: 1.45`, peso Medium.
  - Body: `1.0625rem` (17px), `line-height: 1.6`, largura de leitura 60–70ch.

## 4. 3D & Motion Architecture (`img2threejs` + `gsap-skills`)
- **Hero 3D (`createRenovareLilyModel.ts`):**
  - Construído em código puro via `THREE.Shape`, `THREE.ExtrudeGeometry` com chanfro orgânico (`bevelEnabled: true`, `bevelSegments: 5`), preservando as 8 pétalas rotacionais e suas gotas internas (`holes`) extraídas exatamente das coordenadas de `renovare-logo.svg`.
  - Material `THREE.MeshPhysicalMaterial` acetinado botânico (`#475A38` com `clearcoat`, `sheenColor: #DBE4A9`, `transmission` sutil nas bordas) iluminado por Key Light em `#DBE4A9` e Rim Light quente.
  - Pivôs individuais por pétala (`petalPivots[0..7]`): animação de desabrochar (`bloom`) no carregamento, respiração orgânica contínua (`userData.tick`), resposta suave ao ponteiro e rotação/abertura vinculada ao `ScrollTrigger`.
  - Respeito integral a `prefers-reduced-motion: reduce` e fallback estático de alta precisão em dispositivos sem WebGL.
- **GSAP Choreography (`@gsap/react` + `ScrollTrigger`):**
  - Alternância fluida da assinatura verbal `re-` (`renovar`, `redescobrir`, `reconectar`, `reanimar`, `reascender`, `resgatar`) no Hero com prefixo `re` fixo em `#DBE4A9`.
  - Linha do tempo interativa da **Primeira Sessão** com progressão vinculada ao scroll.
  - Transições suaves no diagnóstico interativo **"Qual te incomoda?"** e na vitrine interativa de **Profissionais da Clínica**.
