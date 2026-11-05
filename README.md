<div align="center">

# Tania Vilches Fuentes

### DevOps · Analista Programadora

Infraestructura como código, pipelines CI/CD y automatización en la nube, desde Santiago de Chile.

[![Ver portafolio](https://img.shields.io/badge/🌐_Ver_portafolio_en_vivo-4ea8ff?style=for-the-badge&labelColor=0b1220)](https://TU-PROYECTO.pages.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://cl.linkedin.com/in/tania-vilches-fuentes-6577032b0)

<br>

<img src="docs/preview-escritorio.png" alt="Vista de escritorio del portafolio" width="720">

<br><br>

<img src="docs/preview-movil.png" alt="Vista móvil del portafolio" width="220">

</div>

---

## ✨ Sobre este proyecto

Este es mi portafolio profesional: un sitio rápido, bilingüe y accesible donde reúno mi experiencia en **DevOps y Cloud**, mis habilidades, mi formación y un formulario de contacto que funciona de verdad.

👉 **Míralo en vivo: [https://TU-PROYECTO.pages.dev](https://TU-PROYECTO.pages.dev)**

## 🚀 Características

- 🌍 **Español / Inglés** con un solo clic; recuerda tu elección.
- 🌗 **Modo oscuro y claro**, que sigue la preferencia de tu sistema.
- 📱 **Responsive**: diseñado para móvil, tablet y escritorio.
- ♿ **Accesible**: navegación por teclado, enlace "saltar al contenido", foco visible y respeto por "reducir movimiento".
- 📬 **Formulario de contacto real**: valida y sanea los datos, tiene protección anti-spam (trampa para bots y límite de mensajes), guarda cada mensaje en una base de datos y me avisa por correo.
- 🧩 **Contenido separado del diseño**: todos los textos viven en un solo archivo (`public/content.json`).
- 🔒 **Cabeceras de seguridad** (CSP, anti-iframe) y sin dependencias de terceros en el navegador.

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES modules), sin framework ni paso de build |
| Backend | Cloudflare Pages Functions (TypeScript) |
| Base de datos | Cloudflare D1 (SQLite) |
| Correo | Resend |
| Anti-bots | Honeypot, límite por visitante y Cloudflare Turnstile (opcional) |
| Hosting | Cloudflare Pages |

## 📁 Estructura

```text
├── public/                 Sitio estático (lo que se publica)
│   ├── index.html
│   ├── styles.css
│   ├── app.js              Render, idioma, tema y formulario
│   ├── content.json        Contenido ES/EN
│   ├── _headers            Cabeceras de seguridad
│   └── img/
├── functions/api/
│   └── contact.ts          Endpoint POST /api/contact
├── migrations/
│   └── 0001_init.sql       Tabla de mensajes (D1)
├── docs/                   Capturas para este README
└── wrangler.toml
```

## 💻 Ejecutarlo en tu computador

Requiere [Node.js](https://nodejs.org) (versión LTS).

```bash
npm install
cp .dev.vars.example .dev.vars   # completa tus claves (opcional para ver el sitio)
npm run db:local
npm run dev
```

<details>
<summary><b>☁️ Publicarlo gratis en Cloudflare Pages</b></summary>

1. Crea una cuenta gratis en [Cloudflare](https://dash.cloudflare.com).
2. `npx wrangler login` y luego `npx wrangler d1 create portafolio-db`. Copia el `database_id` en `wrangler.toml`.
3. `npm run db:remote` para crear la tabla.
4. En Cloudflare: *Workers & Pages → Create → Pages → Connect to Git*. Elige este repositorio, deja vacío el *Build command* y pon `public` como *Build output directory*.
5. En *Settings → Variables and Secrets* agrega `RESEND_API_KEY`, `MAIL_TO`, `IP_SALT` y `ALLOWED_ORIGIN` (tu dirección `https://….pages.dev`). Opcional: `MAIL_FROM` y `TURNSTILE_SECRET`.
6. Vuelve a desplegar para que tome las variables.

Los mensajes quedan guardados en D1. Para leerlos:

```bash
npx wrangler d1 execute portafolio-db --remote --command "SELECT id,created_at,name,email,message,status FROM messages ORDER BY id DESC LIMIT 20"
```

</details>

## 📫 Contacto

- 💼 [LinkedIn](https://cl.linkedin.com/in/tania-vilches-fuentes-6577032b0)
- ✉️ tania.vilches.tr@gmail.com
- 📍 Santiago, Chile

<div align="center">
<sub>Hecho con 💙 por Tania Vilches · 2026</sub>
</div>
