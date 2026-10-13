const notificacionBTN = document.querySelector('#notificar');
const verNotificacion = document.querySelector('#verNotificacion');

notificacionBTN.addEventListener('click', () => {
    Notification.requestPermission().then(resultado => {
        console.log('El resultado es: ', resultado);
    });
});

verNotificacion.addEventListener('click', () => {
    if (Notification.permission === 'granted') {
        const notificacion = new Notification('Aqui esta la notificacion', {
            icon: '../img/edetecnica.png',
            body: 'enviando notificacion'
        });
        
        notificacion.onclick = function () {
            window.open('https://google.com');
        };
    }
});