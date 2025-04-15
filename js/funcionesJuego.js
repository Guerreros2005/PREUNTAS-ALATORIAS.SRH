// Elementos del DOM
const marco = document.getElementById("marco");
const botones = document.querySelectorAll(".boton-juego");
const pregunta = document.getElementById("pregunta");
const mensaje = document.getElementById("mensaje");

const preguntas = [
  "¿Qué lenguaje de programación es conocido como el más utilizado en desarrollo web?",
  "¿Qué es una variable en programación?",
  "¿Qué significa la abreviatura 'HTML'?",
  "¿Qué estructura de control se usa para repetir un bloque de código varias veces?",
  "¿Qué es un 'bug' en el contexto de la programación?",
  "¿Qué significa 'API'?"
];

const opciones = [
  ["JavaScript", "Python", "Java", "C#", "Ruby", "PHP"],
  ["Un espacio en memoria para almacenar datos", "Una función matemática", "Una herramienta para compilar código", "Una librería externa", "Una interfaz de usuario", "Una estructura de datos"],
  ["HyperText Markup Language", "High Text Markup Language", "HyperTool Markup Language", "Home Text Markup Language", "Hyper Transfer Markup Language", "HyperTemplate Markup Language"],
  ["Bucle", "Condicional", "Función", "Switch", "Array", "Clase"],
  ["Un error en el código que causa un mal funcionamiento", "Un tipo de dato", "Un lenguaje de programación", "Una estructura de control", "Un algoritmo de búsqueda", "Una librería de JavaScript"],
  ["Application Programming Interface", "Application Program Interface", "Applied Programming Interface", "Array Programming Interface", "Algorithm Programming Interface", "Auto Programming Interface"]
];

let intervaloMovimiento = null;
let preguntasUsadas = []; // Para rastrear preguntas mostradas

// Evita superposición de botones
function moverBotones() {
  const marcoWidth = marco.clientWidth;
  const marcoHeight = marco.clientHeight;
  const botonWidth = 90;
  const botonHeight = 90;
  const padding = 10;
  const posiciones = [];

  botones.forEach(boton => {
    let x, y, valido = false, intentos = 0;

    while (!valido && intentos < 300) {
      x = Math.random() * (marcoWidth - botonWidth);
      y = Math.random() * (marcoHeight - botonHeight);
      valido = true;

      for (const pos of posiciones) {
        const dx = pos.x - x;
        const dy = pos.y - y;
        if (Math.abs(dx) < botonWidth + padding && Math.abs(dy) < botonHeight + padding) {
          valido = false;
          break;
        }
      }
      intentos++;
    }

    if (valido) {
      posiciones.push({ x, y });
      boton.style.left = `${x}px`;
      boton.style.top = `${y}px`;
    } else {
      console.warn("No se pudo ubicar un botón sin superposición.");
    }
  });

  mensaje.textContent = "";
}

function generarNumero() {
  if (preguntasUsadas.length === preguntas.length) {
    preguntasUsadas = []; // Reinicia si se usaron todas
  }
  let nro;
  do {
    nro = Math.floor(Math.random() * preguntas.length);
  } while (preguntasUsadas.includes(nro));
  preguntasUsadas.push(nro);
  return nro;
}

function cargarOpciones(nroPregunta) {
  botones.forEach((boton, index) => {
    if (opciones[nroPregunta][index]) {
      boton.innerHTML = opciones[nroPregunta][index];
      boton.setAttribute("data-num", index);
      boton.style.display = "block";
    } else {
      boton.style.display = "none"; // Oculta botones sobrantes
    }
  });
}

function iniciarJuego() {
  mensaje.textContent = "";
  const nro = generarNumero();
  pregunta.textContent = `Pregunta: ${preguntas[nro]}`;
  cargarOpciones(nro);
  moverBotones();
  if (!intervaloMovimiento) {
    intervaloMovimiento = setInterval(moverBotones, 6000);
  }
}

function terminarJuego() {
  clearInterval(intervaloMovimiento);
  intervaloMovimiento = null;
  pregunta.textContent = "...";
  botones.forEach(boton => (boton.style.display = "none"));
  mensaje.textContent = "Juego terminado.";
}

document.getElementById("iniciarBtn").addEventListener("click", iniciarJuego);
document.getElementById("terminarBtn").addEventListener("click", terminarJuego);

botones.forEach(boton => {
  boton.addEventListener("click", () => {
    const num = parseInt(boton.getAttribute("data-num"));
    if (num === 0) {
      mensaje.textContent = "¡Correcto!";
      setTimeout(() => {
        if (preguntasUsadas.length < preguntas.length) {
          iniciarJuego();
        } else {
          terminarJuego();
          mensaje.textContent = "¡Has respondido todas las preguntas!";
        }
      }, 1000);
    } else {
      mensaje.textContent = "¡Intenta de nuevo!";
    }
  });
});
