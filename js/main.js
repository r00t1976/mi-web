/* ============================================================
   JC.CARVAJAL.DEV — JAVASCRIPT PRINCIPAL
   ============================================================
   Este archivo se carga al final del <body> con:
       <script src="js/main.js"></script>

   POSICIÓN EN EL HTML IMPORTA:
   Si lo pones en el <head>, el archivo se descarga antes de que
   exista el HTML, y todo lo que busca elementos falla.
   Al final del <body> ya existe todo.
   ============================================================ */


/* ============================================================
   1. MENÚ MÓVIL
   ============================================================ */
const botonMenu = document.getElementById('botonMenu');
const nav       = document.getElementById('nav');

if (botonMenu && nav){
  botonMenu.addEventListener('click', () => nav.classList.toggle('abierto'));

  // Cierra el menú al tocar un enlace
  nav.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => nav.classList.remove('abierto'));
  });

  // Cierra el menú si se agranda la ventana (por ejemplo, al
  // girar el celular y pasar a pantalla ancha)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) nav.classList.remove('abierto');
  });
}


/* ============================================================
   2. ANIMACIONES AL HACER SCROLL
   ============================================================
   Cómo funciona:
   - El IntersectionObserver vigila los elementos con .revelar
   - Cuando uno entra en pantalla, le pone la clase .visible
   - El CSS hace el resto (la transición está en .revelar.visible)

   IntersectionObserver es MUCHO más eficiente que un evento
   scroll que revisara posiciones manualmente. El navegador hace
   el trabajo pesado fuera del hilo principal.
   ============================================================ */
const elementosRevelar = document.querySelectorAll('.revelar');

if (elementosRevelar.length > 0){

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting){
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);   // deja de observarlo
      }
    });
  }, {
    threshold: 0.12,      // se activa cuando el 12% del elemento es visible
    rootMargin: '0px 0px -60px 0px'   // un poco antes de que llegue abajo
  });

  elementosRevelar.forEach(el => observador.observe(el));
} else {
  // Si el navegador es muy antiguo y no soporta IntersectionObserver,
  // mostramos todo de una para que el contenido nunca quede invisible.
  document.querySelectorAll('.revelar').forEach(el => el.classList.add('visible'));
}


/* ============================================================
   3. BARRAS DE HABILIDADES ANIMADAS
   ============================================================
   Las barras empiezan en 0% (definido en el CSS) y se llenan
   cuando llegan a pantalla. La transición la hace el CSS.
   ============================================================ */
const habilidades = document.querySelectorAll('.habilidad');

if (habilidades.length > 0){
  const observadorHabilidades = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;

      const barra   = entrada.target.querySelector('.barra');
      const nivel   = entrada.target.dataset.nivel;

      if (barra && nivel){
        // Un pequeño retardo hace que se vea el llenado
        setTimeout(() => { barra.style.width = nivel + '%'; }, 120);
      }

      observadorHabilidades.unobserve(entrada.target);
    });
  }, { threshold: 0.4 });

  habilidades.forEach(h => observadorHabilidades.observe(h));
}


/* ============================================================
   4. MARCAR EL ENLACE ACTIVO DEL MENÚ
   Sabe en qué sección estás mirando y resalta ese enlace.
   ============================================================ */
const enlacesNav = document.querySelectorAll('.nav a[href^="#"]');
const secciones  = document.querySelectorAll('section[id]');

if (enlacesNav.length > 0 && secciones.length > 0){

  const observadorSecciones = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;

      const id = entrada.target.id;

      enlacesNav.forEach(enlace => {
        enlace.classList.toggle('activo', enlace.getAttribute('href') === '#' + id);
      });
    });
  }, {
    rootMargin: '-45% 0px -50% 0px'   // activa en la parte media de la pantalla
  });

  secciones.forEach(s => observadorSecciones.observe(s));
}


/* ============================================================
   5. VALIDACIÓN DEL FORMULARIO DE CONTACTO
   ============================================================
   Patrón de validación con regex.

   ^  → empieza con
   $  → termina con
   [^\s@]+  → uno o más caracteres que NO son espacios ni arroba
   \s → espacio en blanco
   i  → no importa si va en mayúscula o minúscula
   ============================================================ */
const formulario = document.getElementById('formularioContacto');

if (formulario){

  const REGLAS = {
    nombre:  { valida: v => v.trim().length >= 2 },
    email:   { valida: v => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) },
    telefono:{ valida: v => /^\+?56[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(v.trim()) }
  };

  /* Valida un campo mientras la persona escribe, pero solo
     después de que ya se equivocó una vez. Así no molestamos
     a quien está escribiendo bien. */
  for (const clave in REGLAS){
    const input = formulario.querySelector('#' + clave);
    if (!input) continue;

    const campo = input.closest('.campo');

    input.addEventListener('input', () => {
      if (!campo.classList.contains('mostrar-error')) return;   // aún no se equivocó
      campo.classList.toggle('mostrar-error', !REGLAS[clave].valida(input.value));
    });

    input.addEventListener('blur', () => {
      if (input.value.trim() === '') return;   // no molestar si está vacío
      campo.classList.toggle('mostrar-error', !REGLAS[clave].valida(input.value));
    });
  }

  formulario.addEventListener('submit', evento => {
    evento.preventDefault();

    let todoBien = true;
    let primeroConError = null;

    for (const clave in REGLAS){
      const input = formulario.querySelector('#' + clave);
      const campo = input.closest('.campo');
      const ok = REGLAS[clave].valida(input.value);

      campo.classList.toggle('mostrar-error', !ok);

      if (!ok){
        todoBien = false;
        if (!primeroConError) primeroConError = input;
      }
    }

    if (!todoBien){
      primeroConError.focus();
      primeroConError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    /* ============================================================
       ENVÍO REAL A FORMSPREE
       ============================================================
       Flow completo:
       1. Se valida en el navegador (rápido, sin esperas)
       2. Se envían los datos a Formspree con fetch()
       3. Formspree reenvía los datos a tu correo
       4. Formspree devuelve { ok: true } si todo salió bien
       5. Nosotros mostramos el mensaje de éxito

       Alternativa más simple: en vez de todo esto, se puede
       dejar que el <form> haga el envío normal y usar
       ?_redirect= para mandar al usuario a una página de
       gracias. Eso NO requiere JavaScript. La disadvantage es
       que el usuario ve un salto de página.
       ============================================================ */

    const boton   = formulario.querySelector('button[type=submit]');
    const mensaje = document.getElementById('mensajeEnviado');

    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando...';

    // FormData toma todos los campos con name= y los empaqueta
    // en un formato que fetch() entiende.
    const datos = new FormData(formulario);

    fetch(formulario.action, {
      method: 'POST',
      body: datos,
      headers: { 'Accept': 'application/json' }
    })
    .then(respuesta => {
      if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
      return respuesta.json();
    })
    .then(datos => {
      if (!datos.ok) throw new Error(datos.errors ? datos.errors[0].message : 'Error desconocido');

      // Éxito
      if (mensaje) mensaje.classList.add('visible');
      formulario.reset();
      document.querySelectorAll('.campo.mostrar-error')
        .forEach(c => c.classList.remove('mostrar-error'));
    })
    .catch(error => {
      // Fallo: Se muestra un mensaje de error
      if (mensaje) {
        mensaje.textContent = '✕ No se pudo enviar. Revisa tu conexión e inténtalo de nuevo, o escríbeme directo por WhatsApp.';
        mensaje.style.background = 'rgba(248,113,113,.14)';
        mensaje.style.borderColor = 'rgba(248,113,113,.38)';
        mensaje.style.color = '#fca5a5';
        mensaje.classList.add('visible');
      }
      console.error('Error al enviar el formulario:', error);
    })
    .finally(() => {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    });
  });
}


/* ============================================================
   6. COPIAR EL EMAIL AL HACER CLIC
   Un detalle pequeño que hace la vida más fácil.
   ============================================================ */
const copiarEmail = document.querySelectorAll('[data-copiar-email]');

copiarEmail.forEach(elemento => {
  elemento.addEventListener('click', evento => {
    evento.preventDefault();
    const email = elemento.dataset.copiarEmail;

    // clipboard solo existe en contextos seguros (https o localhost)
    if (navigator.clipboard){
      navigator.clipboard.writeText(email).then(() => {
        const original = elemento.textContent;
        elemento.textContent = '✓ Copiado';
        setTimeout(() => { elemento.textContent = original; }, 1800);
      });
    }
  });
});


/* ============================================================
   7. AÑO ACTUAL EN EL PIE DE PÁGINA
   Evita tener que editar el <footer> cada año.
   ============================================================ */
document.querySelectorAll('[data-anio-actual]').forEach(elemento => {
  elemento.textContent = new Date().getFullYear();
});
