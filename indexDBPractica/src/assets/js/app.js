let db;

document.addEventListener('DOMContentLoaded', () => {
    crmDB();
});

function crmDB() {
    const crmDB = window.indexedDB.open('crmDB', 1);

    crmDB.onerror = function() {
        console.error('Hubo un error al abrir la base de datos');
    };

    crmDB.onsuccess = function() {
        console.log('Base de datos abierta con éxito');
        db = crmDB.result;


        crearCliente();
    };


    crmDB.onupgradeneeded = function(e) { 
        const db = e.target.result;

        const objectStore = db.createObjectStore('crmDB', {
            keyPath: 'id', 
            autoIncrement: true
        });


        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('telefono', 'telefono', { unique: false });

        console.log('ObjectStore e índices creados');
    };
}

function crearCliente() {
    const transaction = db.transaction(['crmDB'], 'readwrite');

    transaction.oncomplete = function() {
        console.log('La transacción se completó correctamente');
    };

    transaction.onerror = function() {
        console.error('Ha ocurrido un error en la transacción');
    };

    const objectStore = transaction.objectStore('crmDB');

    const nuevoCliente = {
        nombre: 'Eli',
        telefono: 123456,
        email: 'deiverson2@correo.com'
    };


    const peticion = objectStore.add(nuevoCliente);

    peticion.onsuccess = function() {
        console.log('Cliente insertado correctamente');
    };

    peticion.onerror = function() {
        console.error('Error al insertar el cliente (posible email duplicado)');
    };
}