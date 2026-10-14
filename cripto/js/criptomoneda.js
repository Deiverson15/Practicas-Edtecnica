const moneda = document.querySelector('#moneda');

const selectCripto = document.querySelector('#criptomoneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('.resultado');
const spinner = document.querySelector('.spinner');

// Tu API Key integrada
const API_KEY = '57bb2534fd4a57555f1a1dea59ca347896cf217bda7960c1c48b8759777e1bc7';

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

document.addEventListener('DOMContentLoaded', () => {
    consultarCripto();

    moneda.addEventListener('input', obtenerValores);
    selectCripto.addEventListener('change', obtenerValores);
    formulario.addEventListener('submit', cotizar);
});

function consultarCripto() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&api_key=${API_KEY}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => selectCriptomoneda(resultado.Data))
        .catch(error => console.error('Error cargando criptomonedas:', error));
}

function obtenerValores(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function selectCriptomoneda(criptomonedas) {

    selectCripto.innerHTML = '<option value="">-- Seleccione --</option>';

    criptomonedas.forEach(cripto => {
        const { Name, FullName } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.textContent = FullName;
        option.value = Name;

        selectCripto.appendChild(option);
    });
}

function cotizar(e) {
    e.preventDefault(); // Evita que se recargue la página

    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarError('Los campos son obligatorios');
        return;
    }

    consultarAPI();
}

function mostrarError(mensaje) {
    const existeError = document.querySelector('.error');
    if (!existeError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}&api_key=${API_KEY}`;

    limpiarHTML();
    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizar => {
            ocultarSpinner();
            mostrarResultado(cotizar.DISPLAY[criptomoneda][moneda]);
        })
        .catch(error => {
            ocultarSpinner();
            limpiarHTML();
            mostrarError('No se pudo obtener la cotización');
            console.error(error);
        });
}

function mostrarResultado(cotizacion) {
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const titulo = document.createElement('h2');
    titulo.textContent = 'Resultado';

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;

    const ult24horas = document.createElement('p');
    ult24horas.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultAct = document.createElement('p');
    ultAct.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(titulo);
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ult24horas);
    resultado.appendChild(ultAct);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function ocultarSpinner() {
    if (spinner) {
        spinner.style.display = 'none';
    }
}