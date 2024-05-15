// Definir class_names en un ámbito global o en un ámbito accesible desde predecirImagen()
const class_names = ['Margarita', 'Diente de Leon', 'Rosa', 'Girasol', 'Tulipan']; 

async function predecirImagen() {
    // Obtener la referencia al elemento de entrada de archivo
    const inputElement = document.getElementById("fileInput");
    // Obtener el archivo seleccionado por el usuario
    const file = inputElement.files[0];
    
    // Verificar si se seleccionó un archivo
    if (file) {
        // Crear un objeto de tipo FileReader para leer el archivo
        const reader = new FileReader();
        
        // Definir una función de devolución de llamada para ejecutar cuando se complete la lectura del archivo
        reader.onload = async function() {
            // Crear un objeto de imagen en TensorFlow.js desde los datos del archivo
            const img = new Image();
            img.src = reader.result;
            
            // Esperar a que la imagen se cargue completamente
            await img.decode();
            
            // Mostrar la imagen seleccionada
            const imagenElement = document.getElementById("imagen");
            imagenElement.src = reader.result;
            
            // Convertir la imagen a un tensor
            const tensor = tf.browser.fromPixels(img).toFloat();
            
            // Expandir la dimensión del tensor para que sea compatible con el formato de entrada del modelo
            const inputTensor = tensor.expandDims();
            
            // Cargar el modelo
            const model = await tf.loadLayersModel('modelos/model.json');
            
            // Realizar la predicción
            const predictions = model.predict(inputTensor).dataSync();

            // Mostrar los resultados de la predicción
            const resultadoDiv = document.getElementById("resultado");
            resultadoDiv.innerHTML = "";
            let categoriaMaxProbabilidad = '';
            let maxProbabilidad = 0;
            for (let i = 0; i < predictions.length; i++) {
                if (predictions[i] > maxProbabilidad) {
                    categoriaMaxProbabilidad = class_names[i];
                    maxProbabilidad = predictions[i];
                }
                const class_name = class_names[i];
                const probabilidad = predictions[i];
                const porcentaje = (probabilidad * 100).toFixed(2);
                resultadoDiv.innerHTML += `<p>${class_name}: ${porcentaje}%</p>`;
            }

            // Realizar la comparación con la categoría de máxima probabilidad y la humedad
            if (categoriaMaxProbabilidad === 'Girasol') {
                // Obtener la humedad actual
                fetch('/lastHumidity')
                    .then(response => response.json())
                    .then(data => {
                        const humedadActual = data.humidity;
                        if (humedadActual !== null && humedadActual > 60) {
                            // Mostrar el aviso en el sitio web
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita ser regado hasta que la humedad sea menor a 60 y mayor de 40!";
                        }else if (humedadActual !== null && humedadActual < 35) {
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita dejar secar la tierra!";
                        }else if (humedadActual !== null && humedadActual < 60 && humedadActual > 35){
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Tierra en condiciones óptimas!";
                        }
                    })
                    .catch(error => console.error('Error al obtener los datos de humedad:', error));
            }
            if (categoriaMaxProbabilidad === 'Diente de Leon') {
                // Obtener la humedad actual
                fetch('/lastHumidity')
                    .then(response => response.json())
                    .then(data => {
                        const humedadActual = data.humidity;
                        if (humedadActual !== null && humedadActual > 70) {
                            // Mostrar el aviso en el sitio web
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita ser regado hasta que la humedad sea menor a 70 y mayor de 45!";
                        }else if (humedadActual !== null && humedadActual < 40) {
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita dejar secar la tierra!";
                        }else if (humedadActual !== null && humedadActual < 70 && humedadActual > 40){
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Tierra en condiciones óptimas!";
                        }
                    })
                    .catch(error => console.error('Error al obtener los datos de humedad:', error));
            }
            if (categoriaMaxProbabilidad === 'Margarita') {
                // Obtener la humedad actual
                fetch('/lastHumidity')
                    .then(response => response.json())
                    .then(data => {
                        const humedadActual = data.humidity;
                        if (humedadActual !== null && humedadActual > 55) {
                            // Mostrar el aviso en el sitio web
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita ser regado hasta que la humedad sea menor a 55 y mayor de 35!";
                        }else if (humedadActual !== null && humedadActual < 30) {
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita dejar secar la tierra!";
                        }else if (humedadActual !== null && humedadActual < 55 && humedadActual > 30){
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Tierra en condiciones óptimas!";
                        }
                    })
                    .catch(error => console.error('Error al obtener los datos de humedad:', error));
            }
            if (categoriaMaxProbabilidad === 'Rosa') {
                // Obtener la humedad actual
                fetch('/lastHumidity')
                    .then(response => response.json())
                    .then(data => {
                        const humedadActual = data.humidity;
                        if (humedadActual !== null && humedadActual > 75) {
                            // Mostrar el aviso en el sitio web
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita ser regado hasta que la humedad sea menor a 75 y mayor de 45!";
                        }else if (humedadActual !== null && humedadActual < 40) {
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita dejar secar la tierra!";
                        }else if (humedadActual !== null && humedadActual < 75 && humedadActual > 40){
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Tierra en condiciones óptimas!";
                        }
                    })
                    .catch(error => console.error('Error al obtener los datos de humedad:', error));
            }
            if (categoriaMaxProbabilidad === 'Tulipan') {
                // Obtener la humedad actual
                fetch('/lastHumidity')
                    .then(response => response.json())
                    .then(data => {
                        const humedadActual = data.humidity;
                        if (humedadActual !== null && humedadActual > 60) {
                            // Mostrar el aviso en el sitio web
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita ser regado hasta que la humedad sea menor a 60 y mayor de 45!";
                        }else if (humedadActual !== null && humedadActual < 40) {
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Necesita dejar secar la tierra!";
                        }else if (humedadActual !== null && humedadActual < 60 && humedadActual > 40){
                            const avisoElement = document.getElementById('aviso');
                            avisoElement.innerText = "¡Tierra en condiciones óptimas!";
                        }
                    })
                    .catch(error => console.error('Error al obtener los datos de humedad:', error));
            }
        };
        
        // Leer el contenido del archivo como una URL de datos
        reader.readAsDataURL(file);
    } else {
        // Si no se seleccionó ningún archivo, mostrar un mensaje de error
        alert("Por favor, selecciona una imagen antes de hacer clic en Predecir.");
    }
}



function obtenerHumedad() {
    fetch('/lastHumidity')
        .then(response => response.json())
        .then(data => {
            console.log('Datos de humedad recibidos:', data);
            const humedadElement = document.getElementById('humedad');
            if (data.humidity !== null) {
                humedadElement.innerText = `Humedad actual: ${data.humidity}%`;
            } else {
                humedadElement.innerText = "Humedad actual: Datos no disponibles";
            }
        })
        .catch(error => console.error('Error al obtener los datos de humedad:', error));
}



// Llamar a la función para obtener la humedad al cargar la página
window.addEventListener('DOMContentLoaded', obtenerHumedad);

document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });

});