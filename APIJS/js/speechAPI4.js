const microfono = document.querySelector('#microfono');
const salida = document.querySelector('#salida');

microfono.addEventListener('click', ejecutarSpeechApi);

function ejecutarSpeechApi() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        salida.textContent = 'Speech Recognition no está soportado en este navegador.';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; 

    recognition.start();

    recognition.onstart = function () {
        salida.classList.add('mostrar');
        salida.textContent = 'escuchando...';
    };

    recognition.onspeechend = function () {
        salida.innerHTML = 'Se dejó de escuchar';
        recognition.stop();
    };

    recognition.onresult = function (e) {
        const { confidence, transcript } = e.results[0][0];

        const speech = document.createElement('p');
        speech.innerHTML = `Lo que escucha: <strong>${transcript}</strong>`;

        const confianza = document.createElement('p');
        confianza.innerHTML = `Nivel de confianza: ${(confidence * 100).toFixed(2)}%`;

        salida.appendChild(speech);
        salida.appendChild(confianza);
    };
}