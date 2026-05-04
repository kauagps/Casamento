# design.md — Sistema de Design

## Paleta CSS
```css
--bg: #F9F6F2;
--primary: #540505;
--primary-light: #7A0A0A;
--gold: #C9A84C;
--text: #1A0A0A;
--text-muted: #6B4A4A;
--white: #FFFFFF;
--border: rgba(84,5,5,0.15);
```

## Tipografia
- **Títulos / nomes:** `Belleza`, sem-serif
- **Corpo / citações:** `Cormorant Garamond`, serifada, usar itálico em subtítulos
- **Números de rifa:** `Courier New`

## Ornamentos
- Cantos SVG (volutas/arabescos) em `--gold` com `opacity: 0.6` em TODAS as seções
- Linha divisória: ornamento central (losango ou flor) + linhas laterais em `--border`
- Fundo: noise texture sutil via SVG filter ou `background-image: url("data:image/svg+xml...")`

## Animações
- Full Page Scroll: `gsap.to` com `duration: 0.7, ease: "power2.inOut"`
- Entrada de seção: elementos sobem `30px` + fade, `stagger: 0.1`
- Foto hero: `scale 0.85→1` + fade no load
- Contador: flip suave no dígito ao mudar (CSS `rotateX`)
- Carrossel: slide horizontal com `overflow: hidden`

## Botões
```css
/* padrão */
background: var(--primary); color: #fff; border: 2px solid var(--primary);
font-family: Belleza; letter-spacing: 0.08em; padding: 12px 28px;
/* hover */
background: transparent; color: var(--primary);
```

## Cards (mensagens / contador)
```css
background: var(--white); border: 1px solid var(--border);
box-shadow: 0 4px 20px rgba(84,5,5,0.08); border-radius: 4px;
```

## Responsivo
- Mobile: `≥ 375px` — grid da rifa 5 colunas, carrossel 1 card
- Desktop: `≥ 768px` — grid da rifa 10 colunas, carrossel 2 cards
