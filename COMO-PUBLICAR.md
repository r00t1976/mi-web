# Publicar tu portafolio — Guía paso a paso

**Tu sitio:** `JC.Carvajal.Dev` · Julio Contreras Carvajal
**Hosting recomendado:** Cloudflare Pages (gratis, sin límites)

---

## Lo que ya está listo

| Elemento | Estado |
|---|---|
| Portada | ✅ Lista |
| Página de proyectos | ✅ Lista |
| 5 proyectos navegables | ✅ Copiados y funcionando |
| Formulario de contacto | ✅ Conectado a Formspree |
| Certificado HTTPS | ✅ Automático al publicar |
| SEO (metadatos, schema.org) | ✅ Listo |
| Diseño responsive | ✅ Móvil, tablet, escritorio |

**Formulario probado:** se envió un mensaje de prueba a tu correo con éxito.

---

## Opción A — Cloudflare Pages (recomendada)

### Paso 1: Crear la cuenta

1. Entra a **dash.cloudflare.com**
2. Click en **"Sign up"**
3. Regístrate con tu correo de Formspree
4. Verifica tu correo (te llega un link)

### Paso 2: Crear el proyecto

1. En el panel, busca **"Workers & Pages"** en el menú lateral
2. Click en **"Create application"**
3. Elige **"Pages"** → **"Connect to Git"**
4. Aunque no tengas GitHub, también hay opción **"Upload assets"**:
   - Elige esa
   - Ponle nombre al proyecto: `jccarvajal`
   - Sube **la carpeta `portfolio/` completa**

> **Importante:** sube la carpeta `portfolio/`, no `mi-negocio-web/`.
> Si subes la carpeta equivocada, las rutas se romperán.

### Paso 3: Obtener tu dirección

Cloudflare te dará algo como:

```
https://jccarvajal.pages.dev
```

**Espera 1-2 minutos** mientras despliega. Después abre la dirección y verás tu sitio.

### Paso 4: Actualizar el canonical

Cuando tengas la dirección real, avísame y ajusto dos líneas. O hazlo tú:

En `index.html` y `proyectos.html`, busca la línea que dice:

```html
<link rel="canonical" href="https://jccarvajal.cl/">
```

Y reemplázala por tu dirección real:

```html
<link rel="canonical" href="https://jccarvajal.pages.dev/">
```

---

## Opción B — Netlify (más simple)

1. Entra a **app.netlify.com/drop**
2. **Arrastra la carpeta `portfolio/`** directamente a la página
3. Te da una dirección tipo `jccarvajal-abc123.netlify.app`

Literal es soltar la carpeta. Es la forma más rápida de probar.

**Ventaja:** es más rápido que Cloudflare.
**Desventaja:** tiene límite de 100 GB/mes de ancho de banda (no te importa).

---

## Opción C — GitHub Pages (si ya tienes GitHub)

```bash
# 1. Crear repositorio en github.com (puede ser privado)
# 2. Desde la terminal:

cd ~/Proyectos/mi-negocio-web/portfolio
git init
git add .
git commit -m "Primer commit del portafolio"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/jccarvajal.git
git push -u origin main

# 3. En GitHub: Settings → Pages → Deploy from branch → main / root
```

---

## Verificar que todo funciona

Después de publicar, revisa estas cosas:

| Prueba | Dónde |
|---|---|
| La portada carga | Abre la dirección |
| El menú funciona | Haz clic en "Servicios" |
| Los proyectos se abren | Click en "Ver en vivo" |
| El carrito persiste | Agrega algo, recarga, sigue ahí |
| El formulario envía | Llénalo y revisa tu correo |
| Se ve bien en celular | Abre en tu teléfono |

---

## Cosas que hay que saber

### El límite del plan gratuito de Formspree

50 envíos al mes. Si recibes 5 consultas, usas el 10%. Cuando necesites más, se cambia el plan desde la misma cuenta sin tocar el código.

### Tu email con dominio.tutamail.com

Funciona, pero es un servicio poco conocido. Si algún cliente duda si es real, considera crear un correo con tu propio dominio cuando tengas.

### El hosting no da correo

Cloudflare Pages y Netlify solo sirven tu sitio. No incluyen casillas de correo. Para eso tendrías que contratar por separado.

---

## Cuándo comprar el dominio

El dominio `jccarvajal.cl` cuesta alrededor de **$10.000 al año** en NIC Chile.

**No lo necesitas ahora.** Usa la dirección gratuita mientras consigues tus primeros clientes. Cuando tengas el negocio más encaminado, compras el dominio y lo apuntas al mismo hosting (los dos pueden convivir sin costo extra).

---

## Para actualizar el sitio después

Cada vez que modifiques algo:

1. Edita los archivos en `~/Proyectos/mi-negocio-web/portfolio/`
2. Sube la carpeta de nuevo a Cloudflare (arrastrando)
3. En 1 minuto está actualizado

Con GitHub es automático: `git push` y listo.

---

**¿Listo para publicar?** Dime por dónde quieres empezar y te guío paso a paso.
