const cargarAPIbtn = document.querySelector('#cargarAPI');
cargarAPIbtn.addEventListener('click', obtenerDatosAPI);

function obtenerDatosAPI() {
    const url = 'https://picsum.photos/v2/list'; 

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarHTMLAPI(resultado))
        .catch(error => console.error(error));
}

function mostrarHTMLAPI(datos) {
    const contenido = document.querySelector('#contenido');
    let html = '';

    datos.forEach(perfil => {
        const { author, url: postUrl } = perfil;
        html += `
            <p>Autor: ${author}</p>
            <a href="${postUrl}" target="_blank">Ver Imagen</a>
            <hr>
        `;
    });

    contenido.innerHTML = html;
}