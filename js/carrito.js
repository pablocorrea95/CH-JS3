let carrito = JSON.parse(localStorage.getItem('carrito')) || []

// export function agregarAlCarrito(idPizza, listaPizzas) {
//     if (typeof idPizza !== 'number' || !Array.isArray(listaPizzas)) {
//         console.error('Parámetros inválidos:', { idPizza, listaPizzas })
//         return false
//     }

    // const pizza = listaPizzas.find(p => p.id === idPizza)

    // if (!pizza) {
    //     console.error(`Pizza con ID ${idPizza} no encontrada`)
    //     return false
    // }

    carrito.push(pizza)
    actualizarCarrito()
    return true
// }

function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
    updateCartUI()
}

function updateCartUI() {
    const counter = document.getElementById('carrito-counter')
    if (counter) counter.textContent = carrito.length
}

// notificación al usuario
function mostrarNotificacion(nombrePizza) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${nombrePizza} agregada!`,
            showConfirmButton: false,
            timer: 1000
        })
    } 
}

export function obtenerCarrito() {
    return JSON.stringify(carrito)
}

export function vaciarCarrito() {
    carrito = []
    actualizarCarrito()
}