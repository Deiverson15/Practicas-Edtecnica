// Selectores
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');
let modoEdicion = false;

// Clases
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaAct) {
        this.citas = this.citas.map(cita => cita.id === citaAct.id ? citaAct : cita);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Evitar múltiples alertas repetidas al mismo tiempo
        const alertaPrevia = document.querySelector('.alert');
        if (alertaPrevia) alertaPrevia.remove();

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.row'));

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({ citas }) {
        this.limpiarHTML();

        if (citas.length === 0) {
            contenedorCitas.innerHTML = '<p class="text-center text-muted">No hay citas agendadas aún.</p>';
            return;
        }

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3', 'shadow-sm', 'bg-light');
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement('h4');
            mascotaParrafo.classList.add('card-title', 'fw-bold', 'text-primary');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="fw-bold">Propietario/Paciente: </span>${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="fw-bold">Teléfono: </span>${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="fw-bold">Fecha: </span>${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="fw-bold">Hora: </span>${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="fw-bold">Síntomas: </span>${sintomas}`;

            // Botón Eliminar con icono SVG
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'me-2');
            btnEliminar.innerHTML = `
                Eliminar 
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="ms-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            `;
            btnEliminar.onclick = () => eliminarCita(id);

            // Botón Editar con icono SVG
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info', 'text-white');
            btnEditar.innerHTML = `
                Editar 
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="ms-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
            `;
            btnEditar.onclick = () => cargarEdicion(cita);

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const administrarCitas = new Citas();
const useri = new UI();

// Objeto de la cita
const citasObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
};

// Event Listeners
function eventListener() {
    mascotaInput.addEventListener('input', datosCitas);
    propietarioInput.addEventListener('input', datosCitas);
    telefonoInput.addEventListener('input', datosCitas);
    fechaInput.addEventListener('input', datosCitas);
    horaInput.addEventListener('input', datosCitas);
    sintomasInput.addEventListener('input', datosCitas);

    formulario.addEventListener('submit', nuevaCita); // Cambiado a submit
}

function datosCitas(e) {
    citasObj[e.target.name] = e.target.value; // Corregido: se asigna e.target.value
}

function nuevaCita(e) {
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citasObj;

    // Validación
    if (mascota.trim() === '' || propietario.trim() === '' || telefono.trim() === '' || fecha.trim() === '' || hora.trim() === '' || sintomas.trim() === '') {
        useri.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (modoEdicion) {
        administrarCitas.editarCita({ ...citasObj });
        useri.imprimirAlerta('Se ha modificado la cita correctamente');
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        modoEdicion = false;
    } else {
        citasObj.id = Date.now();
        administrarCitas.agregarCita({ ...citasObj });
        useri.imprimirAlerta('Se ha agregado su cita satisfactoriamente');
    }

    formulario.reset();
    reiniciarObjeto();
    useri.imprimirCitas(administrarCitas);
}

function reiniciarObjeto() {
    citasObj.mascota = '';
    citasObj.propietario = '';
    citasObj.telefono = '';
    citasObj.fecha = '';
    citasObj.hora = '';
    citasObj.sintomas = '';
    delete citasObj.id;
}

function eliminarCita(id) {
    administrarCitas.eliminarCita(id);
    useri.imprimirAlerta('La cita se ha eliminado correctamente');
    useri.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citasObj.mascota = mascota;
    citasObj.propietario = propietario;
    citasObj.telefono = telefono;
    citasObj.fecha = fecha;
    citasObj.hora = hora;
    citasObj.sintomas = sintomas;
    citasObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    modoEdicion = true;
}

// Inicialización de la aplicación
eventListener();