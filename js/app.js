//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');




//Eventos
eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

  document.addEventListener('submit', agregarGasto);
}




//Classes
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
    this.restante = this.presupuesto - gastado;

  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter( gasto => gasto.id !== id);
    this.calcularRestante();
  }


}

class UI {
  insertarPresupuesto(cantidad) {
    //Extrayendo los valores
    const { presupuesto, restante } = cantidad;

    //Agregar al HTML
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = presupuesto;
  }

  imprimirAlerta(mensaje, tipo) {
    //crear el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');

    if(tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }

    divMensaje.textContent = mensaje;

    document.querySelector('.primario').insertBefore(divMensaje, formulario);

    setTimeout(() => {
        divMensaje.remove();
    }, 3000);
  }

  agregarGastosListado(gastos) {

    this.limpiarHtml();
    //itera sobre los gastos
    gastos.forEach(gasto => {
      const { cantidad, nombre, id } = gasto;

      //crear un li
      const nuevoGasto = document.createElement('li');
      nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id;

      //agregar un html del gasto
      nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'>$ ${cantidad} </span>`;

      //agregar boton para borrar el gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.textContent= 'Borrar x';
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      }
      nuevoGasto.appendChild(btnBorrar);

      //agregar al html
      gastoListado.appendChild(nuevoGasto);


    })
  }

  limpiarHtml() {
    while(gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector('#restante').textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;

    const divRestante = document.querySelector('.restante');

    if( restante < (presupuesto*25)/100 ) {
      divRestante.classList.remove('alert-success', 'alert-warning');
      divRestante.classList.add('alert-danger');
    } else if( restante < (presupuesto / 2)) {
      divRestante.classList.remove('alert-success');
      divRestante.classList.add('alert-warning');
    } else {
      divRestante.classList.remove('alert-danger', 'alert-warning');
      divRestante.classList.add('alert-success');
    }

    //Si el restante es <= 0 
    if( restante <= 0 ) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }


}

//instancias
const ui = new UI();
let presupuesto;



//Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt('Cual es tu presupuesto?');

  if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  }

  //presupuesto valido 

  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);

  ui.insertarPresupuesto(presupuesto);
}

//Agregar gastos

function agregarGasto(e) {
  e.preventDefault();

  //leer datos del formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  //validar
  if(nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

    return;
  } else if(cantidad <= 0 || cantidad === isNaN(cantidad)) {
    ui.imprimirAlerta('Cantidad no valida', 'error')

    return;
  }

  //generar un objeto gasto, con object literal
  const gasto = { nombre, cantidad, id:Date.now() };

  //Añade nuevo gasto
  presupuesto.nuevoGasto(gasto);
  
  ui.imprimirAlerta('Gasto agregado correctamente')

  //imprimir los gastos
  const { gastos, restante } = presupuesto
  ui.agregarGastosListado(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);

  //reiniciar formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //elimina los gastos del objeto
  presupuesto.eliminarGasto(id);

  //elimina los gastos del html
  const { gastos, restante } = presupuesto;
  ui.agregarGastosListado(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
}