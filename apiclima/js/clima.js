const contenedor = document.querySelector('.contenedor');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    const ciudad = document.querySelector('#ciudad').value.trim();
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        mostrarError('Todos los campos son obligatorios');
        return;
    }

    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if (!alerta) {
        const alertaMsj = document.createElement('div');
        alertaMsj.classList.add(
            'bg-red-100', 
            'border', 
            'border-red-400', 
            'text-red-700', 
            'px-4', 
            'py-3', 
            'rounded', 
            'relative', 
            'max-w-md', 
            'mx-auto', 
            'mt-6', 
            'text-center'
        );
        alertaMsj.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        contenedor.appendChild(alertaMsj);

        setTimeout(() => {
            alertaMsj.remove();
        }, 3000);
    }
}

function consultarAPI(ciudad, pais) {
    const appid = 'cbeb6984da303539191282156ca6ff61';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appid}`;

    spinner();
     
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();
            if (datos.cod === '404') {
                mostrarError('La ciudad ingresada no ha sido encontrada');
            } else {
                mostrarClima(datos);
            }
        })
        .catch(error => {
            console.error(error);
            limpiarHTML();
            mostrarError('Hubo un problema de conexión al consultar el clima');
        });
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos;

    const grados = kelvinACent(temp);
    const min = kelvinACent(temp_min);
    const max = kelvinACent(temp_max);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.innerHTML = `Clima en: ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl', 'text-slate-800', 'mb-2');

    const tempActual = document.createElement('p');
    tempActual.innerHTML = `${grados}&#8451;`;
    tempActual.classList.add('font-black', 'text-6xl', 'text-slate-900', 'my-3');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Mín: <span class="font-semibold text-slate-700">${min}&#8451;</span>`;
    tempMinima.classList.add('text-base', 'text-slate-500');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Máx: <span class="font-semibold text-slate-700">${max}&#8451;</span>`;
    tempMaxima.classList.add('text-base', 'text-slate-500');

    const contenedorMinMax = document.createElement('div');
    contenedorMinMax.classList.add('flex', 'justify-center', 'gap-6', 'mt-2');
    contenedorMinMax.appendChild(tempMinima);
    contenedorMinMax.appendChild(tempMaxima);

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center');

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(tempActual);
    resultadoDiv.appendChild(contenedorMinMax);

    resultado.appendChild(resultadoDiv);
}

function kelvinACent(grados) {
    return Math.round(grados - 273.15);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('flex', 'justify-center', 'my-4');
    divSpinner.innerHTML = `
        <div class="lds-roller">
            <div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div>
        </div>
    `;

    resultado.appendChild(divSpinner);
}