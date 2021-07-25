function Seguro (marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.CotizarSeguro = function () {
    let cantidad;
    const base = 2000; 
    switch (this.marca) {
        case "1" :
            cantidad = base * 1.15;
            break;
        case "2":
            cantidad = base * 1.05;
            break;

        case "3":
            cantidad = base * 1.35;
            break;
        default :
            break;
    }
    // leer el año 
    const diferencia = new Date().getFullYear() - this.year;

    // por cada año bajara un 3%

    cantidad -= ((diferencia * 3) * cantidad)/100;

    if (this.tipo === "basico") {
        cantidad *= 1.30;
    }
    else {
        cantidad *=1.50
    }
   return cantidad;
}

function UI () {}; // Crear una clase vacia para la interfaz y no hace referencia a ningun this por ende podemos utilizar un ARROW FUNCTION

// Llena las opciones de los años 
UI.prototype.LLenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;
    const selectYear = document.querySelector("#year");
    for (let i = max ; i >= min; i--){

        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

UI.prototype.MostrarMensaje = (mensaje,tipo) => {
    const div = document.createElement("div");
    if (tipo === "error") {
        div.classList.add("error");
    } else {
        div.classList.add("correcto");
    }
    div.classList.add("mensaje","mt-10");
    div.textContent=mensaje;

    //insertar en el html 
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector("#resultado"));
    
    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.MostrarResultado = function (seguro,total) {
    const {marca,year,tipo} = seguro;
    let textoMarca;
    switch(marca) {
        case "1":
            textoMarca = "AMERICANO";
            break;
        case "2":
            textoMarca = "ASIATICO"
            break;
        case "3":
            textoMarca = "EUROPEO";
            break;
        default:
            break;
    }

    const div = document.createElement("div");
    div.classList.add("mt-10");

    div.innerHTML = `
        <p class="header"> Resumen: </p>
        <p class="font-bold"> MARCA: <span class="font-normal"> ${textoMarca}</span> </p>
        <p class="font-bold"> AÑO: <span class="font-normal"> ${year}</span> </p>
        <p class="font-bold"> TIPO DE SEGURO: <span class="font-normal"> ${tipo}</span> </p>
        <p class="font-bold"> Total a pagar: <span class="font-normal"> ${total} COP </span> </p>
    `;

    const resultadoDiv = document.querySelector("#resultado");

    //spinner
    const spinner = document.querySelector("#cargando");
    spinner.style.display = "block";

    setTimeout(() => {
        spinner.style.display = "none"; // esconde el spinner
        resultadoDiv.appendChild(div); // muestra el resultado

    }, 3000);
}



// instanciar UI

const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
    ui.LLenarOpciones(); // cuando se cargue el documento se llenaran las opciones
});


Eventos();

function Eventos () {
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit",ValidarFormulario);
}

function ValidarFormulario (e) {
    e.preventDefault();
    // Seleccionar Inputs
    const marca = document.querySelector("#marca").value;
    const year = document.querySelector("#year").value;
    const tipo = document.querySelector("input[name=tipo]:checked").value;

    if (marca === "" || year === "" || tipo === "") {
        ui.MostrarMensaje("Todos los campos son obligatorios","error");
        return;
    }

    ui.MostrarMensaje("Cotizando","correcto");

    // eliminar el div previo 
    const resultados = document.querySelector("#resultado div");
    if (resultados !== null) {
        resultados.remove();
    }

    // instanciar el seguro

    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.CotizarSeguro();

    // utilizar el prototype que va a cotizar
    ui.MostrarResultado(seguro,total);
}
