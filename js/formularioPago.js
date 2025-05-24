document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-pago')

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault()

      Swal.fire({
        icon: 'success',
        title: '¡Pedido confirmado!',
        text: 'Gracias por elegirnos. ¡Disfrutá tu pizza!',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        localStorage.removeItem('carrito');
        window.location.href = 'index.html';
      });
    });
  }
})
