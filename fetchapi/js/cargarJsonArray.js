const cargarJsonArrayBtn = document.querySelector('#cargarJSONArray');
cargarJsonArrayBtn.addEventListener('click', obtenerDatosJsonArray);

function obtenerDatosJsonArray() {
    const url = 'data/empleados.js'; 

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarHTMLJsonArray(resultado))
        .catch(error => console.error(error));
}

function mostrarHTMLJsonArray(empleados) {
    const contenido = document.querySelector('#contenido');
    let html = '';

    empleados.forEach(empleado => {
        const { id, nombre, empresa, trabajo } = empleado;
        html += `
            <p>Empleado: ${nombre}</p>
            <p>Id: ${id}</p>
            <p>Empresa: ${empresa}</p>
            <p>Trabajo: ${trabajo}</p>
            <hr>
        `;
    });

    contenido.innerHTML = html;
}