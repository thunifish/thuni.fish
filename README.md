<p align="center">
  <img src="./public/og.png" alt="thuni.fish" width="100%" />
</p>

<h1>thuni.fish</h1>

<p>
  o cantinho do thom na internet :3
</p>

<p>
  <a href="https://thuni.fish"><strong>visitar o site</strong></a>
</p>

---

## 🚀 sobre

site feito com:

- **[Astro](https://astro.build)** — framework
- **[Tailwind CSS](https://tailwindcss.com)** — estilos
- **[TypeScript](https://www.typescriptlang.org)** — tipagem

### ✨ recursos

- 🌗 toggle de tema claro e escuro (ele tmb vê pelo dispositivo)
- 🎵 player de música com créditos
- 🃏 cards de perfil
- 🗺️ página 404 legal
- 🔎 SEO com og, sitemap e dados estruturados
- 📱 layout responsivo
- 📈 lighthouse 100%

---

## 🛠️ rodar localmente

o projeto usa o **[Bun](https://bun.sh)** (eh mais rápido), mas dá pra usar o `npm`, `pnpm` ou `yarn` sem problema. :3

> ainda não tem o Bun? só rodar `curl -fsSL https://bun.sh/install | bash` (eh facil viu)

1. clone o repositório e instale as dependências:

   ```bash
   git clone https://github.com/thunifish/www.git
   cd www
   bun install
   ```

2. inicie o servidor de desenvolvimento:

   ```bash
   bun run dev
   ```

3. abra `http://localhost:4321` e modifique como quiser! :)

---

## 📦 scripts

| comando             | descrição                                    |
| ------------------- | -------------------------------------------- |
| `bun run dev`       | inicia o servidor de desenvolvimento         |
| `bun run build`     | gera o build de produção em `dist/`          |
| `bun run preview`   | pré-visualiza o build de produção localmente |
| `bun run typecheck` | verifica os tipos do TypeScript              |

---

## 🌐 rodar online

esse site é estático e pode ser hospedado na [Cloudflare Pages](https://pages.cloudflare.com) (ou em qualquer lugar que sirva arquivos estáticos, como a vercel a netlify).

<p>
  <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/thunifish/www">
    <img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare"/>
  </a>
</p>

---

## 📂 estrutura

```text
src/
├── components/  # componentes (perfil, player, ui)
├── data/        # dados estáticos (links, textos)
├── layouts/     # base das páginas
├── pages/       # rotas (home, 404)
├── scripts/     # lógica client-side (tema, player, peixe)
└── styles/      # estilos globais e tokens do Tailwind
```

---

## 📄 licença

[MIT](./LICENSE)

> [!IMPORTANT]  
> você pode modificar o site como quiser, mas remova as minhas informações!! (pff)

<p align="center">
  <sub>feito com ♥ por thom!! :3</sub>
</p>
