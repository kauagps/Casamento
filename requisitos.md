# requisitos.md — Seções e Dados

## Informações do Casamento
- **Casal:** Kauã Gabriel & Ana Heloisa
- **Data:** 16 de Maio de 2026 às 19:00
- **Local:** Igreja Presbiteriana do Placas — R. Joaquim M Macedo, 1980, São Francisco, Rio Branco, AC
- **WhatsApp rifa:** (68) 99281-2731
- **Lista Havan:** https://lista.havan.com.br/Convidado/ItensListaPresente/924579an
- **Chave PIX rifa:** 68992812731 | Prêmio: R$ 300,00

---

## Seção 1 — Hero
- Foto do casal: moldura circular, `~30vh` de diâmetro, posição `top: 38%`
- Dupla borda `--primary` + `--gold` na foto
- Texto abaixo: nome do casal (Belleza, grande) + frase convite (Cormorant itálico)
- Seta bounce na base indicando scroll

## Seção 2 — Contagem Regressiva
- Contador JS em tempo real: dias / horas / minutos / segundos
- Cada unidade em card individual
- Após data: exibir `"Hoje é o grande dia! 🎉"`
- Bloco de local com botão "Ver no Mapa" → Google Maps

## Seção 3 — Presentes
- Texto delicado sobre presentes
- Botão → link Havan (nova aba)

## Seção 4 — Rifa
- Grid 1–100: coração SVG por número
- Estado disponível: fundo branco, borda `--primary`
- Estado comprado: fundo `--primary`, X vermelho sobreposto
- Hover disponível: tooltip "Comprar número X"
- Botão WhatsApp: `https://wa.me/5568992812731?text=...`
- Info prêmio e PIX

## Seção 5 — Mensagens
- Form: código convite + nome + textarea (máx 300 chars)
- Código válido = 1 mensagem por código
- Carrossel auto-play 4s das mensagens aprovadas

---

## Painel Admin (`/?admin=true`)
- Autenticação: senha hardcoded em `admin.js`
- **Rifa:** marcar/desmarcar número vendido + nome do comprador
- **Mensagens:** aprovar / excluir
- **Códigos:** gerar lote, ver status, revogar
- **Config:** foto URL, data, WhatsApp, link Havan

---

## Estrutura Firestore
```
/config/wedding          → { couplePhotoUrl, weddingDate, whatsappNumber, havanListUrl }
/raffle/numbers/{1-100}  → { sold, buyerName, soldAt }
/inviteCodes/{id}        → { code, used, usedBy, usedAt }
/messages/{id}           → { guestName, text, inviteCode, createdAt, approved }
```

## Regras Firestore (resumo)
- Leitura pública: `config`, `raffle`, `messages` (só `approved: true`)
- Escrita pública: `messages` (novo doc), `inviteCodes` (marcar usado)
- Escrita admin: tudo — autenticada via Firebase Auth anônimo + custom claim ou senha client-side
