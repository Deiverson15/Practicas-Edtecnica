const cargartxtBtn = document.querySelector('#cargarTxt');
cargartxtBtn.addEventListener('click', obtenerDatosTxt);

function obtenerDatosTxt() {
    const url = 'data/datos.txt';

    fetch(url)
        .then(respuesta => respuesta.text())
        .then(datos => {
            const contenido = document.querySelector('#contenido');
            contenido.innerHTML = `<p>${datos}</p>`;
        })
        .catch(error => console.error(error));
}