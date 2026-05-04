# CLAUDE.md — Site de Casamento Kauã & Ana

## Stack
- Vanilla HTML + CSS + JS (sem framework)
- Firebase Firestore (SDK v9 CDN) — dados em tempo real
- GSAP (CDN) — Full Page Scroll
- Google Fonts: Belleza, Cormorant Garamond
- Deploy: GitHub Pages ou Netlify
- Responsivo

## Arquivos do Projeto
```
index.html      → 5 seções + estrutura do painel admin
style.css       → design system (ver design.md)
main.js         → full page scroll + inicialização
firebase.js     → config e helpers do Firestore
admin.js        → painel admin (senha hardcoded)
raffle.js       → grade de rifas + estado
messages.js     → envio + carrossel de mensagens
```

## Referências
- **Design, paleta, tipografia, ornamentos:** `design.md`
- **Seções, funcionalidades, estrutura de dados:** `requisitos.md`
- **Imagem do casal** `assets\Casal\Foto do Casal.png`
- **Referencias, Convite, Rifa** `assets\Referencias\`

## Regras Críticas
1. Fonte Belleza em TODOS os títulos e nomes
2. Ornamento SVG de canto em TODAS as seções
3. Cada seção = exatamente `100vh`, scroll bloqueado durante transição
4. Firebase é a única fonte de verdade (rifa + mensagens + códigos)
5. Painel admin em `/?admin=true` + senha — nunca expor no HTML público
6. Mensagens só aparecem no carrossel após `approved: true`
7. Deve ser responsivo
