import { agregarAlCarrito } from './carrito.js'

// carga data.json
async function obtenerData() {
  const respuesta = await fetch('./js/data.json')
  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el archivo JSON')
  }
  return await respuesta.json()
}

// carga prod
function cargarProductos() {
  obtenerData()
    .then(pizzas => {
      renderizarProductos(pizzas)
      inicializarEventosAgregar(pizzas)
      inicializarBotonCarrito()
    })
    .catch(error => {
      console.error("Error al cargar pizzas:", error)
    })
}

document.addEventListener('DOMContentLoaded', cargarProductos)

// render pizza
function renderizarProductos(pizzas) {
  const container = document.getElementById('products-container')
  
  container.innerHTML = pizzas.map(pizza => {
    let ingredientes = ''
    for (let i = 0; i < pizza.ingredientes.length; i++) {
      ingredientes += pizza.ingredientes[i]
      if (i < pizza.ingredientes.length - 1) {
        ingredientes += ', '
      }
    } 
    return `
      <div class="producto" data-id="${pizza.id}">
        <img src="${pizza.img}" alt="${pizza.nombre}" width="180">
        <h3>${pizza.nombre}</h3>
        <p class="ingredientes">${ingredientes}</p>
        <p></p>
        <p class="descripcion">${pizza.descripcion}</p>
        <p class="precio">$${pizza.precio.toLocaleString('es-AR')}</p>
        <div class="contador">
          <button class="btn-agregar" data-action="restar"> − </button>
          <span class="cantidad"> 1 </span>
          <button class="btn-agregar" data-action="sumar"> + </button>
        </div>
        <button class="btn-agregar btn-agregar-producto">Agregar</button>
      </div>
    `
  }).join('')
}


// botones plusle, minun
function inicializarEventosAgregar(pizzas) {
  document.querySelectorAll('.producto').forEach(productoEl => {
    const id = parseInt(productoEl.dataset.id)
    const cantidadEl = productoEl.querySelector('.cantidad')
    let cantidad = 1

    const btnSumar = productoEl.querySelector('[data-action="sumar"]')
    const btnRestar = productoEl.querySelector('[data-action="restar"]')
    const btnAgregar = productoEl.querySelector('.btn-agregar-producto')

    btnSumar.addEventListener('click', () => {
      cantidad++
      cantidadEl.textContent = cantidad
    })

    btnRestar.addEventListener('click', () => {
      if (cantidad > 1) {
        cantidad--
        cantidadEl.textContent = cantidad
      }
    })

    btnAgregar.addEventListener('click', () => {
      const pizza = pizzas.find(p => p.id === id)
      if (!pizza) return

      for (let i = 0; i < cantidad; i++) {
        agregarAlCarrito(id, pizzas)
      }

      cantidad = 1
      cantidadEl.textContent = cantidad
    })
  })
}

// Carrito con alert
function inicializarBotonCarrito() {
  const btnCarrito = document.getElementById('carrito-btn');
  if (!btnCarrito) return;

  btnCarrito.addEventListener('click', () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
      Swal.fire('Tu carrito está vacío 🍕');
      return;
    }

    const resumen = carrito.map((p, index) => `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>🍕 ${p.nombre} - $${p.precio.toLocaleString('es-AR')}</span>
        <button onclick="eliminarDelCarrito(${index})" style="background: none; border: none; color: red; font-size: 1.2rem; cursor: pointer;">✖</button>
      </div>
    `).join('');

    const total = carrito.reduce((acc, p) => acc + p.precio, 0);

    Swal.fire({
      title: 'Tu carrito',
      html: `
        <div id="modal-carrito-list">
          ${resumen}<hr>
          <strong>Total: $${total.toLocaleString('es-AR')}</strong><br><br>
          <a href="pago.html" class="btn-pago" style="display:inline-block; padding: 0.5rem 1rem; background-color: #2a9d8f; color: white; border-radius: 6px; text-decoration: none; font-weight: bold;">Ir a pagar</a>
        </div>
      `,
      showConfirmButton: false
    });
  });
}

// delete all changuito
window.eliminarDelCarrito = function(index) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito))
  document.getElementById('carrito-btn').click()
}
