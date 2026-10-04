/* ============================================================
   JS-CARRITO.JS — EJEMPLO 5
   ============================================================
   Este archivo contiene TODA la lógica del carrito. Lo cargan
   las 4 páginas (index, producto, carrito, checkout), y por eso
   el carrito es el mismo en todas: los datos viven en un solo
   lugar y se guardan en el navegador.

   CONCEPTO CLAVE: localStorage
   ----------------------------------------
   localStorage es memoria que el navegador guarda en tu disco.
   Sobrevive al cierre del navegador y al reinicio del
   computador. Solo se borra si tú lo borras.

   Se usa con dos funciones:

     localStorage.setItem('clave', 'valor')   →  guardar
     localStorage.getItem('clave')            →  leer

   OJO: localStorage SOLO guarda texto. Si quieres guardar un
   objeto o un array, primero conviértelo a texto con
   JSON.stringify(), y al leerlo vuelve con JSON.parse().

   Eso es exactamente lo que hacemos aquí con el carrito.
   ============================================================ */


/* ============================================================
   1. LAS FUNCIONES BÁSICAS
   ============================================================ */

/* Constante con el nombre de la clave.
   Si dos páginas usan el mismo nombre, ven el mismo dato.
   Cambiar 'sendero-carrito' por otra cosa rompería todo. */
const CLAVE_CARRITO = 'sendero-carrito';


/** Lee el carrito guardado y lo devuelve como array.
    Si no hay nada guardado, devuelve un array vacío. */
function leerCarrito(){
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  if (!guardado) return [];

  try {
    // El try/catch protege por si el dato guardado está corrupto
    return JSON.parse(guardado);
  } catch (error) {
    console.error('El carrito guardado tenía un formato inválido:', error);
    return [];
  }
}


/** Guarda el carrito en el navegador.
    Recibe el array y lo convierte a texto antes de guardar. */
function guardarCarrito(items){
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
}


/** Vacía el carrito completo. */
function vaciarCarrito(){
  localStorage.removeItem(CLAVE_CARRITO);
}


/* ============================================================
   2. AGREGAR Y QUITAR PRODUCTOS
   ============================================================ */

/**
 * Agrega un producto al carrito.
 *
 * @param {number} id      - ID del producto
 * @param {string} talla   - Talla elegida
 * @param {number} cantidad- Cuántas unidades (por defecto 1)
 *
 * OJO con la lógica: si ya tienes la MISMA prenda en la MISMA
 * talla, no agrega una línea nueva: suma la cantidad.
 * Si es otra talla, crea una línea aparte.
 *
 * Ejemplo: chaqueta talla M dos veces = una línea con cantidad 2.
 * Chaqueta talla M y luego talla L = dos líneas separadas.
 */
function agregarAlCarrito(id, talla, cantidad = 1){
  const items = leerCarrito();

  // Busca si ya existe esa combinación de producto y talla
  const existente = items.find(item => item.id === id && item.talla === talla);

  if (existente){
    existente.cantidad += cantidad;
  } else {
    items.push({ id: id, talla: talla, cantidad: cantidad });
  }

  guardarCarrito(items);
  actualizarContadorCarrito();
}


/** Cambia la cantidad de una línea. Si llega a 0, la elimina. */
function cambiarCantidad(indice, cantidad){
  const items = leerCarrito();

  if (!items[indice]) return;         // índice inválido, no hacer nada
  if (cantidad <= 0){                  // cantidad 0 o menos = borrar
    items.splice(indice, 1);
  } else {
    items[indice].cantidad = cantidad;
  }

  guardarCarrito(items);
  actualizarContadorCarrito();
}


/** Elimina una línea completa del carrito. */
function quitarDelCarrito(indice){
  const items = leerCarrito();
  items.splice(indice, 1);
  guardarCarrito(items);
  actualizarContadorCarrito();
}


/* ============================================================
   3. LOS CÁLCULOS
   ============================================================
   Estas funciones reciben el carrito y los productos, y
   calculan los totales. La clave es que el total SIEMPRE se
   calcula acá, leyendo de una fuente única.
   ============================================================ */

/** Suma las unidades de todas las líneas del carrito. */
function contarUnidades(items){
  return items.reduce((total, item) => total + item.cantidad, 0);
}


/**
 * Calcula todos los totales del carrito.
 *
 * @param {Array} items     - El carrito
 * @param {Array} productos - La lista de productos (con precios)
 *
 * @returns {Object} con subtotal, envio, total y descuento
 */
function calcularTotales(items, productos){
  const SUBTOTAL_ENVIO_GRATIS = 50000;   // envío gratis sobre este monto
  const COSTO_ENVIO           = 5900;    // costo del envío

  let subtotal = 0;

  for (const item of items){
    // Busca el producto para saber su precio actual
    const producto = productos.find(p => p.id === item.id);

    // Si el producto ya no existe (lo borraron del catálogo),
    // lo saltamos en vez de romper todo
    if (!producto) continue;

    subtotal += producto.precio * item.cantidad;
  }

  // Envío gratis solo si hay cosas y se pasa del monto
  const envio = (subtotal === 0 || subtotal >= SUBTOTAL_ENVIO_GRATIS)
    ? 0
    : COSTO_ENVIO;

  return {
    subtotal: subtotal,
    envio: envio,
    total: subtotal + envio,
    faltaParaEnvioGratis: Math.max(0, SUBTOTAL_ENVIO_GRATIS - subtotal)
  };
}


/* ============================================================
   4. EL CONTADOR DEL BOTÓN
   ============================================================
   Cada página que tenga el botón del carrito llama a esta
   función al cargar y después de cada cambio.
   ============================================================ */
function actualizarContadorCarrito(){
  const contador = document.getElementById('contadorCarrito');
  if (!contador) return;    // esta página no tiene el botón

  const unidades = contarUnidades(leerCarrito());
  contador.textContent = unidades;

  // Si está vacío, lo deja más apagado
  contador.style.opacity = unidades === 0 ? '0.5' : '1';
}


/* ============================================================
   5. EL AVISO FLOTANTE
   ============================================================
   Cuando agregas algo, sale un cartel abajo que confirma.
   Las páginas que lo necesitan definen su propio #aviso y
   su propia función mostrarAviso; esta solo la usa si existe.
   ============================================================ */
function notificar(mensaje){
  const aviso = document.getElementById('aviso');
  if (!aviso) return;

  const texto = document.getElementById('avisoTexto');
  if (texto) texto.textContent = mensaje;

  aviso.classList.add('visible');
  clearTimeout(window._temporizadorAviso);
  window._temporizadorAviso = setTimeout(() => aviso.classList.remove('visible'), 2400);
}


/* ============================================================
   6. FORMATO DE DINERO CHILENO
   ============================================================
   El formato CLP separa los miles con punto:
   89900  →  $89.900

   El segundo parámetro de toLocaleString controla los decimales
   con 0 decimales, que es lo que lleva el peso chileno.
   ============================================================ */
const dinero = n => '$' + Math.round(n).toLocaleString('es-CL');
