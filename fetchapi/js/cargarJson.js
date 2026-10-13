const cargarJsonBtn = document.querySelector('#cargarJSON');
cargarJsonBtn.addEventListener('click', obtenerDatosJson);

function obtenerDatosJson() {
    const url = 'data/empleado.json';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarHTMLJson(resultado))
        .catch(error => console.error(error));
}

function mostrarHTMLJson(empleado) {
    const { id, nombre, empresa, trabajo } = empleado;
    const contenido = document.querySelector('#contenido'); 
    contenido.innerHTML = `
        <p>Empleado: ${nombre}</p>
        <p>Id: ${id}</p>
        <p>Empresa: ${empresa}</p>
        <p>Trabajo: ${trabajo}</p>
    `;
}