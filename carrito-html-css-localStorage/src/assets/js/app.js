// Variables
const CARRITO = document.querySelector('#carrito');
const LISTACURSO = document.querySelector('#lista-cursos');
const CONTENEDORCARRITO = document.querySelector('#lista-carrito tbody');
const VACIARCARRITOBTN = document.querySelector('#vaciar-carrito');

let articulosCarrito = [];


cargarEventListener();

function cargarEventListener() {

    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });


    LISTACURSO.addEventListener('click', agregarCurso);


    CARRITO.addEventListener('click', eliminarCurso);


    VACIARCARRITOBTN.addEventListener('click', () => {
        articulosCarrito = []; 
        carritoHTML();
    });
}


function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCursos(cursoSeleccionado);
    }
}

function eliminarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        const cursoExistente = articulosCarrito.find(curso => curso.id === cursoId);

        if (cursoExistente) {
            if (cursoExistente.cantidad > 1) {
                articulosCarrito = articulosCarrito.map(curso => {
                    if (curso.id === cursoId) {
                        return { ...curso, cantidad: curso.cantidad - 1 };
                    }
                    return curso;
                });
            } else {
                articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
            }

            carritoHTML();
        }
    }
}

function vaciarCarrito() {
    while (CONTENEDORCARRITO.firstChild) {
        CONTENEDORCARRITO.removeChild(CONTENEDORCARRITO.firstChild);
    }
}

function leerDatosCursos(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    const existe = articulosCarrito.some(cursoItem => cursoItem.id === infoCurso.id);

    if (existe) {
        articulosCarrito = articulosCarrito.map(cursoItem => {
            if (cursoItem.id === infoCurso.id) {
                return { ...cursoItem, cantidad: cursoItem.cantidad + 1 };
            }
            return cursoItem;
        });
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();
}

function carritoHTML() {
    vaciarCarrito();

    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${curso.imagen}" width="100">
            </td>    
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>${curso.cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>
        `;
        CONTENEDORCARRITO.appendChild(row);
    });

    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}