function actualizarEstado() {
    if (navigator.onLine) {
        console.log('tienes conexion');
    } else {
        console.log('no tienes conexion');
    }
}
window.addEventListener('online', actualizarEstado);
window.addEventListener('offline', actualizarEstado);