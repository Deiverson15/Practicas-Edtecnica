// Selectores
const pasajeroInput = document.querySelector('#pasajero');
const documentoInput = document.querySelector('#documento');
const telefonoInput = document.querySelector('#telefono');
const origenInput = document.querySelector('#origen');
const destinoInput = document.querySelector('#destino');
const fechaInput = document.querySelector('#fecha');
const claseInput = document.querySelector('#clase');
const asientoInput = document.querySelector('#asiento');

const formulario = document.querySelector('#nueva-reserva');
const contenedorReservas = document.querySelector('#reservas');
let editando = false;

// Clases
class Reservas {
    constructor() {
        this.vuelos = [];
    }

    agregarVuelo(vuelo) {
        this.vuelos = [...this.vuelos, vuelo];
    }

    eliminarVuelo(id) {
        this.vuelos = this.vuelos.filter(vuelo => vuelo.id !== id);
    }

    editarVuelo(vueloActualizado) {
        this.vuelos = this.vuelos.map(vuelo => vuelo.id === vueloActualizado.id ? vueloActualizado : vuelo);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        const alertaPrevia = document.querySelector('.alerta-activa');
        if (alertaPrevia) alertaPrevia.remove();

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alert', 'text-center', 'fw-bold', 'col-12', 'alerta-activa', 'mb-3');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;


        const contenedor = document.querySelector('#contenido');
        contenedor.insertBefore(divMensaje, document.querySelector('.row'));

        setTimeout(() => {
            divMensaje.remove();
        }, 3500);
    }

    imprimirVuelos({ vuelos }) {
        this.limpiarHTML();

        if (vuelos.length === 0) {
            contenedorReservas.innerHTML = `
                <div class="alert alert-secondary text-center">
                    No hay reservas registradas en este momento. Completa el formulario para reservar un vuelo.
                </div>
            `;
            return;
        }

        vuelos.forEach(vuelo => {
            const { pasajero, documento, telefono, origen, destino, fecha, clase, asiento, id } = vuelo;

            const divCard = document.createElement('div');
            divCard.classList.add('reserva-card', 'p-4', 'mb-3', 'shadow-sm', 'border');
            divCard.dataset.id = id;


            const encabezado = document.createElement('div');
            encabezado.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'border-bottom', 'pb-2', 'mb-3');
            encabezado.innerHTML = `
                <h5 class="text-primary fw-bold mb-0">✈️ ${origen} ➔ ${destino}</h5>
                <span class="badge bg-primary text-uppercase">${clase}</span>
            `;

            const pasajeroP = document.createElement('p');
            pasajeroP.innerHTML = `<span class="fw-bold">Pasajero:</span> ${pasajero} (Doc: ${documento})`;

            const contactoP = document.createElement('p');
            contactoP.innerHTML = `<span class="fw-bold">Teléfono:</span> ${telefono}`;

            const fechaP = document.createElement('p');
            fechaP.innerHTML = `<span class="fw-bold">Fecha de Salida:</span> ${fecha}`;

            const asientoP = document.createElement('p');
            asientoP.innerHTML = `<span class="fw-bold">Notas / Asiento:</span> ${asiento ? asiento : 'Sin preferencias especiales'}`;


            const contenedorBotones = document.createElement('div');
            contenedorBotones.classList.add('mt-3', 'd-flex', 'gap-2');


            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-outline-danger', 'btn-sm');
            btnEliminar.innerHTML = `
                Cancelar Vuelo
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            `;
            btnEliminar.onclick = () => cancelarReserva(id);

            // Botón Editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-outline-info', 'btn-sm');
            btnEditar.innerHTML = `
                Editar Reserva
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
            `;
            btnEditar.onclick = () => cargarEdicion(vuelo);

            contenedorBotones.appendChild(btnEliminar);
            contenedorBotones.appendChild(btnEditar);

            divCard.appendChild(encabezado);
            divCard.appendChild(pasajeroP);
            divCard.appendChild(contactoP);
            divCard.appendChild(fechaP);
            divCard.appendChild(asientoP);
            divCard.appendChild(contenedorBotones);

            contenedorReservas.appendChild(divCard);
        });
    }

    limpiarHTML() {
        while (contenedorReservas.firstChild) {
            contenedorReservas.removeChild(contenedorReservas.firstChild);
        }
    }
}

const gestorReservas = new Reservas();
const ui = new UI();

// Objeto de la reserva
const reservaObj = {
    pasajero: '',
    documento: '',
    telefono: '',
    origen: '',
    destino: '',
    fecha: '',
    clase: '',
    asiento: ''
};

// Eventos
function registrarEventos() {
    pasajeroInput.addEventListener('input', capturarDatos);
    documentoInput.addEventListener('input', capturarDatos);
    telefonoInput.addEventListener('input', capturarDatos);
    origenInput.addEventListener('change', capturarDatos);
    destinoInput.addEventListener('change', capturarDatos);
    fechaInput.addEventListener('input', capturarDatos);
    claseInput.addEventListener('change', capturarDatos);
    asientoInput.addEventListener('input', capturarDatos);

    formulario.addEventListener('submit', procesarReserva);
}

function capturarDatos(e) {
    reservaObj[e.target.name] = e.target.value;
}

function procesarReserva(e) {
    e.preventDefault();

    const { pasajero, documento, telefono, origen, destino, fecha, clase } = reservaObj;

    // Validación de campos obligatorios
    if (
        pasajero.trim() === '' || 
        documento.trim() === '' || 
        telefono.trim() === '' || 
        origen === '' || 
        destino === '' || 
        fecha.trim() === '' || 
        clase === ''
    ) {
        ui.imprimirAlerta('Todos los campos con selección y datos del pasajero son obligatorios', 'error');
        return;
    }

    // Validación de ruta: origen y destino no pueden ser iguales
    if (origen === destino) {
        ui.imprimirAlerta('El aeropuerto de origen y de destino no pueden ser el mismo', 'error');
        return;
    }

    if (editando) {
        gestorReservas.editarVuelo({ ...reservaObj });
        ui.imprimirAlerta('Reserva actualizada correctamente');
        formulario.querySelector('button[type="submit"]').textContent = 'Confirmar Reserva';
        editando = false;
    } else {
        reservaObj.id = Date.now();
        gestorReservas.agregarVuelo({ ...reservaObj });
        ui.imprimirAlerta('¡Boleto reservado exitosamente!');
    }

    formulario.reset();
    reiniciarObjeto();
    ui.imprimirVuelos(gestorReservas);
}

function reiniciarObjeto() {
    reservaObj.pasajero = '';
    reservaObj.documento = '';
    reservaObj.telefono = '';
    reservaObj.origen = '';
    reservaObj.destino = '';
    reservaObj.fecha = '';
    reservaObj.clase = '';
    reservaObj.asiento = '';
    delete reservaObj.id;
}

function cancelarReserva(id) {
    gestorReservas.eliminarVuelo(id);
    ui.imprimirAlerta('La reserva ha sido cancelada satisfactoriamente');
    ui.imprimirVuelos(gestorReservas);
}

function cargarEdicion(vuelo) {
    const { pasajero, documento, telefono, origen, destino, fecha, clase, asiento, id } = vuelo;

    // Llenar inputs
    pasajeroInput.value = pasajero;
    documentoInput.value = documento;
    telefonoInput.value = telefono;
    origenInput.value = origen;
    destinoInput.value = destino;
    fechaInput.value = fecha;
    claseInput.value = clase;
    asientoInput.value = asiento;

    // Actualizar objeto
    reservaObj.pasajero = pasajero;
    reservaObj.documento = documento;
    reservaObj.telefono = telefono;
    reservaObj.origen = origen;
    reservaObj.destino = destino;
    reservaObj.fecha = fecha;
    reservaObj.clase = clase;
    reservaObj.asiento = asiento;
    reservaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}

// Iniciar aplicación
registrarEventos();
ui.imprimirVuelos(gestorReservas);