class Personaje
{
    constructor(id, nombre, tipo)
    {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
    }

    set Nombre(value)
    {
        this.nombre = value;
    }

    get Nombre()
    {
        return this.nombre;
    }

}

class Monstruo extends Personaje
{
    constructor(id, nombre, alias, defensa, miedo, tipo)
    {
        super(id, nombre, tipo);

        this.miedo = miedo;
        this.alias = alias;
        this.defensa = defensa;
    }

    set Alias(value)
    {
        this.alias = value;
    }

    get Alias()
    {
        return this.alias;
    }
}

const spinner = document.getElementById('spinner');

const $formulario = document.forms[0];

$formulario.addEventListener('submit', (e)=>{
    e.preventDefault();

    const txtId = document.getElementById('iHidden');

    if(txtId.value === "")
    {
        let nombre = document.getElementById('nombre-txt').value;
        let alias = document.getElementById('alias-txt').value;
        let defensa = obtenerRadioButtonChecked();
        let miedo = document.getElementById('rng-miedo').value;
        let tipo = document.getElementById('select-tipo').options[select.selectedIndex].text;
        postMonstruo(nombre, alias, defensa, miedo, tipo);
        
        filasDeTabla = document.querySelectorAll('.relleno');
        celdasCabecera = document.querySelectorAll('.traer-th');

    }
    else
    {
        updateMonstruo(txtId.value);
    }

    $formulario.reset();

});


/*---------------CARGAR SELECT DEL LOCAL STORAGE---------------*/ 

const tipos = ["Esqueleto", "Zombie", "Vampiro", "Fantasma", "Bruja", "Hombre Lobo"];

const monstruos = [];

cargarLocalStorage(tipos, monstruos);

const select = document.getElementById('select-tipo');

cargarSelect(select);

arrayMonstruosGeneral = [];

window.addEventListener('DOMContentLoaded', ()=>{
    getMonstruos()
    .then(data=>{
        arrayMonstruosGeneral = data;
        refrescarDiv(crearTabla(data));
    })
    .catch(error => {
        console.error("Error al obtener monstruos", error);
    })

});

function cargarLocalStorage(arrayTipos, arrayMonstruos)
{
    const arrayTiposString = JSON.stringify(arrayTipos);

    const arrayMonstruosString = JSON.stringify(arrayMonstruos);

    localStorage.setItem('arrayTipos', arrayTiposString);
    localStorage.setItem('arrayMonstruos', arrayMonstruosString);

}

function cargarSelect(select)
{
    const arrayTiposString = localStorage.getItem('arrayTipos');

    const arrayTipos = JSON.parse(arrayTiposString);

    arrayTipos.forEach(function(tipo, index){
        const option= document.createElement('option');

        option.value = index;
        option.text = tipo;

        select.appendChild(option);
    });
}

/*---------------------------------------------------------------*/



/*--------------FUNCIONES DEL SERVER CON AJAX--------------------*/

const URL = "http://localhost:3000/monstruos";


function getMonstruos(nombre, alias, defensa, miedo, tipo)
{
    return fetch(URL)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            return res.json();
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
}
function getMonstruo(id)
{
    try
    {
        const res = fetch(URL + "/" + id);

        if(!res.ok)
        {
            throw res;
        }
        const data = res.json();
    }
    catch(res)
    {
        console.error(`Error ${res.status}: ${res.statusText}`);
    }
}


function postMonstruo(nombre, alias, defensa, miedo, tipo)
{
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=>
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status >= 200 && xhr.status < 300)
            {
                const data = JSON.parse(xhr.responseText);
            }
            else
            {
                console.error(`Error ${xhr.status}: ${xhr.statusText}`);
            }
        }
    };

    xhr.open("POST", URL, true);

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    let id;
    let ultimoElemento;

    getMonstruos()
    .then(data => {
        arrayMonstruosGeneral = data;

        if(arrayMonstruosGeneral.length == 0)
        {
            id = 1;
        }
        else
        {
            ultimoElemento = arrayMonstruosGeneral[arrayMonstruosGeneral.length - 1];
            id = ultimoElemento.id + 1;
        }
        
        const nuevoMonstruo = new Monstruo(id,nombre,alias,defensa,miedo,tipo);

        arrayMonstruosGeneral.push(nuevoMonstruo);
    
        try
        {
            xhr.send(JSON.stringify(nuevoMonstruo));
        }
        catch(err)
        {
            console.error(err);
        } 

        getMonstruos()
        .then(data=>{
            refrescarDiv(crearTabla(data));
        })
        .catch(error => {
         console.error("Error al obtener monstruos", error);
        })
        
    })
    .catch(error => {
        console.error("Error al obtener monstruos", error);
    })
    
    
}


function deleteMonstruo(id)
{    
    axios.delete(URL + "/" + id)

    .then((res)=>
    {

    })

    .catch((err)=>
    {
        console.error(err.message);
    })

}

function updateMonstruo(id)
{
    let nombre = document.getElementById('nombre-txt').value;
    let alias = document.getElementById('alias-txt').value;
    let defensa = obtenerRadioButtonChecked();
    let miedo = document.getElementById('rng-miedo').value;
    let tipo = document.getElementById('select-tipo').options[select.selectedIndex].text;

    const nuevoMonstruo = new Monstruo(id,nombre,alias,defensa,miedo,tipo);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=>
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status >= 200 && xhr.status < 300)
            {
                const data = JSON.parse(xhr.responseText);
            }
            else
            {
                console.error(`Error ${xhr.status}: ${xhr.statusText}`);
            }
        }      
    };

    xhr.open("PUT", URL + "/" + id, true);

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    try
    {
        xhr.send(JSON.stringify(nuevoMonstruo));
        getMonstruos()
        .then(data=>{
            refrescarDiv(crearTabla(data));
            arrayMonstruosGeneral = data;
        })
        .catch(error => {
            console.error("Error al obtener monstruos", error);
        })
    }
    catch(err)
    {
        console.error(err);
    } 
}


function mostrarMonstruos()
{
    getMonstruos()
    .then(data=>{
        console.log(data)
    })
    .catch(error => {
        console.error("Error al obtener monstruos", error);
    })
}
/*----------------------------------------------------------------*/

/*-------------------------TABLA DE MONSTRUOS---------------------*/

const btnCancel = document.getElementById('btnCancelar');

btnCancel.addEventListener('click', ()=>{
    const btnDelete = document.getElementById('btnEliminar');
    const textId = document.getElementById('iHidden');

    btnDelete.classList.add('oculto');
    btnCancel.classList.add('oculto');
    cambiarTextoModificarGuardar();
    textId.value="";
});


function cambiarTextoGuardarModificar()
{
    const btnGuardar = document.getElementById('btnGuardar');

    const icono = document.createElement('i');
    
    icono.classList.add('fa-regular', 'fa-floppy-disk');

    btnGuardar.textContent = '';
    btnGuardar.appendChild(icono);
    btnGuardar.appendChild(document.createTextNode('Modificar'));

    btnGuardar.classList.add('estilo-modificar');

}

function cambiarTextoModificarGuardar()
{
    const btnGuardar = document.getElementById('btnGuardar');

    const icono = document.createElement('i');
    
    icono.classList.add('fa-regular', 'fa-floppy-disk');

    btnGuardar.textContent = '';
    btnGuardar.appendChild(icono);
    btnGuardar.appendChild(document.createTextNode('Guardar'));

    btnGuardar.classList.add('estilo-modificar');

}


    function obtenerDatosMonstruo(fila) {
        const celdas = fila.querySelectorAll('td');
        const datos = {};
        const ordenColumnas = ['Nombre', 'Alias', 'Defensa', 'Miedo', 'Tipo'];
    
        celdas.forEach((celda, index) => {
            const clave = ordenColumnas[index];
            datos[clave] = celda.textContent;
        });
    
        return datos;
    }


    function cargarDefensa(defensa) {
        const labels = document.querySelectorAll('#divDefensa label');

        labels.forEach((label) => {
        if (label.innerText.toLowerCase() === defensa.toLowerCase()) {
            label.previousElementSibling.checked = true;
        }
    });
    }

    function cargarDatosEnFormulario(datosMonstruo)
    {      
        document.getElementById('nombre-txt').value = datosMonstruo['nombre'];

        document.getElementById('alias-txt').value = datosMonstruo['alias'];

        cargarDefensa(datosMonstruo['defensa']);

        document.getElementById('rng-miedo').value = datosMonstruo['miedo'];

        const tipoMonstruo = datosMonstruo['tipo'];
        const selectTipo = document.getElementById('select-tipo');

        for (let i = 0; i < selectTipo.options.length; i++)
        {
            if (selectTipo.options[i].text === tipoMonstruo)
            {
                selectTipo.selectedIndex = i;
                break;
            }
        }
        
    }

    window.addEventListener("click", (e)=>{

        if(e.target.matches("td"))
        {
            const id = e.target.parentElement.dataset.id;

            const idTxt = document.getElementById('iHidden');

            idTxt.value = id;

            const selectedMonstruo = arrayMonstruosGeneral.find((mons)=> mons.id == parseInt(id));

            cargarDatosEnFormulario(selectedMonstruo);

            const btnCancel = document.getElementById('btnCancelar');
            const btnEliminar = document.getElementById('btnEliminar');

            btnCancel.classList.remove('oculto');
            btnEliminar.classList.remove('oculto');      

            cambiarTextoGuardarModificar();
        }
    });


const btnEliminar = document.getElementById('btnEliminar');

btnEliminar.addEventListener('click', ()=>{
    const idTxt = document.getElementById('iHidden');
    deleteMonstruo(idTxt.value);
    cambiarTextoModificarGuardar();
    getMonstruos()
        .then(data=>{
            refrescarDiv(crearTabla(data));
            arrayMonstruosGeneral = data;
        })
        .catch(error => {
         console.error("Error al obtener monstruos", error);
        })
});


function crearTabla(arr)
{
    let tabla = document.createElement('table');
    tabla.id = 'tablaMonstruos';
    tabla.appendChild(crearCabeceraTabla(arr[0]));
    tabla.appendChild(crearCuerpoTabla(arr));
    tabla.classList.add('table');
    tabla.classList.add('table-hover');
    tabla.classList.add('bordes');

    return tabla;
}

function crearCabeceraTabla(objeto)
{
    let tHead = document.createElement('thead');
    tHead.id = 'theadTabla';
    let tr = document.createElement('tr');
    tr.classList.add('relleno');

    const headers = ['Nombre', 'Alias', 'Defensa', 'Miedo', 'Tipo'];

    headers.forEach(headerText=>{
        let th = document.createElement('th');
        let texto = document.createTextNode(headerText);
        th.appendChild(texto);
        th.classList.add('table-warning');
        th.classList.add('traer-th');
        th.classList.add('bordes');
        tr.appendChild(th);
    });

    tHead.appendChild(tr);

    tHead.classList.add('text-capitalize');
    tHead.classList.add('text-center');

    return tHead;
}


function crearCuerpoTabla(arr)
{
    let tbody = document.createElement('tbody');
    

    arr.forEach(element => {
        let tr = document.createElement('tr');
        tr.dataset.id = element.id;
        tr.classList.add('relleno');

        const ordenKeys = ['nombre', 'alias', 'defensa', 'miedo', 'tipo'];

        ordenKeys.forEach(key=>{
            let td = document.createElement('td');
            let texto = document.createTextNode(element[key]);
            td.appendChild(texto);
            td.classList.add('text-center');
            td.classList.add('text-capitalize');
            td.classList.add('table-danger');
            td.classList.add('bordes');
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    return tbody
}

function refrescarDiv(tabla)
{
    spinner.classList.remove('oculto');

    calcularPromedio();

    getMonstruos()
    .then(data => {
        const monstruos = data;
        cargarMiedoMaximoEnInput(monstruos);
        cargarMiedoMinimoEnInput(monstruos);
    })
    .catch(error => {
        console.error("Error al obtener monstruos", error);
    });

    const div = document.getElementById('tabla');
    
    while(div.firstChild)
    {
        div.removeChild(div.firstChild);
    }

    const btnGuardar = document.getElementById('btnGuardar');

    btnGuardar.onclick = function(){
        cambiarTextoModificarGuardar();
    }

    setTimeout(function(){
        div.appendChild(tabla);
        spinner.classList.add("oculto");
    }, 2000);
}

/*----------------------------------------------------------------*/
function obtenerRadioButtonChecked()
{
    let radioButtons = document.getElementsByName('rad-defensa');

    let idChecked = "";

    let defensa = "";

    for(let i=0; i<radioButtons.length; i++)
    {
        if(radioButtons[i].checked)
        {
            idChecked = radioButtons[i].id;
            break;
        }
    }

    switch(idChecked)
    {
        case 'rad-estaca':
            defensa = "Estaca";
            break;
        case 'rad-plata':
            defensa = "Plata";
            break;
        case 'rad-crucifijo':
            defensa = "Crucifijo";
            break;
        case 'rad-pocion':
            defensa = "Pocion";
            break; 
    }

    return defensa;
    
}

const btnMonstruos = document.getElementById('btn-monstruos');

btnMonstruos.addEventListener('click', function(){
    document.querySelectorAll('body > *:not(nav)').forEach(element=>{
        element.classList.add('oculto');
    });

    mostrarCards();

    const imagenFondo = document.createElement('div');

    imagenFondo.classList.add('fullscreen-image');
    document.body.appendChild(imagenFondo);

    
});

function mostrarCards()
{
    const cardsMonstruos = document.getElementById('cards-monstruos');
    cardsMonstruos.innerHTML = '';

    getMonstruos()
    .then(data=>{
        data.forEach(monstruo=>{
            const card = crearCardMonstruo(monstruo);
            card.classList.add('tarjeta-monstruo');
            cardsMonstruos.appendChild(card);
        });
        cardsMonstruos.classList.remove('oculto');
    })
    .catch(error=>{
        console.error("Error al obtener monstruos", error);
    });

}

function crearCardMonstruo(monstruo)
{
    const card = document.createElement('div');
    card.classList.add('card');

    const contenido = `
    <h3>${monstruo.nombre}</h3>
    <p><i class="fa-solid fa-masks-theater negro"></i>Alias: ${monstruo.alias}</p>
    <p><i class="fa-solid fa-shield negro"></i>Defensa: ${monstruo.defensa}</p>
    <p><i class="fa-solid fa-face-sad-cry negro"></i>Miedo: ${monstruo.miedo}</p>
    <p><i class="fa-solid fa-spider negro"></i>Tipo: ${monstruo.tipo}</p>
    `;
    card.innerHTML = contenido;
    card.classList.add('estilo-cards');

    return card;
}

const btnInicio = document.getElementById('btn-inicio');

btnInicio.addEventListener('click', function(){
    const elementosOcultos = document.querySelectorAll(':not(#spinner,#btnCancelar,#btnEliminar).oculto');
    const divCards = document.getElementById('cards-monstruos');
    const cards = document.querySelectorAll('.estilo-cards');

    divCards.classList.add('oculto');

    elementosOcultos.forEach(elemento => {
        elemento.classList.remove('oculto');
    });

    cards.forEach(card => {
        card.classList.add('oculto');
    });

    const imagenFondo = document.querySelector('.fullscreen-image');

    if(imagenFondo)
    {
        imagenFondo.remove();
    }   
});

function calcularPromedio()
{
    getMonstruos()
    .then(data=>{
        const monstruos = data;
            const totalMiedo = monstruos.reduce((acumulador, monstruo) => {
                return acumulador + parseInt(monstruo.miedo);
            }, 0);

            const promedio = totalMiedo / monstruos.length;
            const txtPromedio = document.getElementById('txt-promedio-miedo');
            txtPromedio.value = promedio.toFixed(2);

    })
    .catch(error => {
        console.error("Error al obtener monstruos", error);
    })
}

function calcularMiedoMaximo(monstruos) {
    let flag = 0;
    let maximo;

    monstruos.forEach(monstruo => {
        if(flag == 0)
        {
            maximo = monstruo.miedo;
            flag = 1;
        }
        else
        {
            const miedo = parseInt(monstruo.miedo);
            if (miedo > maximo) {
                maximo = miedo;
            }
        }
        
    });

    return maximo;
}

function cargarMiedoMaximoEnInput(monstruos) {
    const miedoMaximo = calcularMiedoMaximo(monstruos);
    const inputMiedoMaximo = document.getElementById('txt-miedo-maximo');
    inputMiedoMaximo.value = miedoMaximo.toString();
}

function calcularMiedoMinimo(monstruos) {
    
    let flag = 0;
    let minimo;

    monstruos.forEach(monstruo => {
        if(flag == 0)
        {
            minimo = monstruo.miedo;
            flag = 1;
        }
        else
        {
            const miedo = parseInt(monstruo.miedo);
            if (miedo < minimo) {
                minimo = miedo;
            }
        }
        
    });

    return minimo;
}

function cargarMiedoMinimoEnInput(monstruos) {
    const miedoMinimo = calcularMiedoMinimo(monstruos);
    const inputMiedoMinimo = document.getElementById('txt-miedo-minimo');
    inputMiedoMinimo.value = miedoMinimo.toString();
}

agregarEventosCheckBoxes();

function agregarEventosCheckBoxes()
{
        const chkboxNombre = document.getElementById('chkbox-nombre');
        const chkboxAlias = document.getElementById('chkbox-alias');
        const chkboxDefensa = document.getElementById('chkbox-defensa');
        const chkboxMiedo = document.getElementById('chkbox-miedo');
        const chkboxTipo = document.getElementById('chkbox-tipo');


        chkboxNombre.addEventListener('change', () => {
            mostrarOcultarColumna(0, chkboxNombre.checked);
            guardarEstadoCheckboxesEnLocalStorage();
        });

        chkboxAlias.addEventListener('change', () => {
            mostrarOcultarColumna(1, chkboxAlias.checked);
            guardarEstadoCheckboxesEnLocalStorage();
        });

        chkboxDefensa.addEventListener('change', () => {
            mostrarOcultarColumna(2, chkboxDefensa.checked);
            guardarEstadoCheckboxesEnLocalStorage();
        });

        chkboxMiedo.addEventListener('change', () => {
            mostrarOcultarColumna(3, chkboxMiedo.checked);
            guardarEstadoCheckboxesEnLocalStorage();
        });

        chkboxTipo.addEventListener('change', () => {
            mostrarOcultarColumna(4, chkboxTipo.checked);
            guardarEstadoCheckboxesEnLocalStorage();
        });
}

let filasDeTabla = [];
let celdasCabecera = [];

setTimeout(()=>{
    filasDeTabla = document.querySelectorAll('.relleno');
    celdasCabecera = document.querySelectorAll('.traer-th');
}, 2500);

function obtenerColumnas() {
    return new Promise((resolve) => {

        const columnas = [];

        filasDeTabla.forEach((fila) => {
        const celdas = fila.querySelectorAll('td');
        celdas.forEach((celda, index) => {
        if (!columnas[index]) {
            columnas[index] = [];
        }
        columnas[index].push(celda);
        columnas[index].push(celdasCabecera[index]);
        });
    });

    resolve(columnas);

    });
}

function mostrarOcultarColumna(indice, mostrar)
{
    obtenerColumnas()
    .then((col)=>{
        const columnas = col;
        if (columnas[indice]) {
            columnas[indice].forEach(celda => {
                if (mostrar) {
                    celda.classList.remove('oculto');
                } else {
                    celda.classList.add('oculto');
                }
            });
        }
    });
    
}


function guardarEstadoCheckboxesEnLocalStorage() {

    checkboxes = document.querySelectorAll('.chkbox');
    let estados = [];

    checkboxes.forEach((checkbox)=>{
        estados.push({ id: checkbox.id, checked: checkbox.checked });
    })

    localStorage.setItem('estadoCheckboxes', JSON.stringify(estados));
}

setTimeout(()=>{
    asignarEstadoCheckboxes();
},2500);


function asignarEstadoCheckboxes()
{
    const checkBoxes = document.querySelectorAll('.chkbox');
    const estadoCheckBoxesDelLocalStorage = JSON.parse(localStorage.getItem('estadoCheckboxes'));
    let event = new Event('change');
    
    if(!estadoCheckBoxesDelLocalStorage)
    {
        checkBoxes.forEach((checkbox)=>{
            estados.push({ id: checkbox.id, checked: checkbox.checked });
        })
    
        localStorage.setItem('estadoCheckboxes', JSON.stringify(estados));
    }
    else
    {
        checkBoxes.forEach((chkbox)=>{
            estadoCheckBoxesDelLocalStorage.forEach(b=>{
                if(chkbox.id == b.id)
                {
                    chkbox.checked = b.checked;
                    chkbox.dispatchEvent(event);
                }
            })
        })
    }
       
}



/* -------------------------CARGAR SELECT FILTRO DE TABLA-------------------------*/

const arrayTiposTabla = ["Todos", "Vampiro", "Hombre Lobo", "Fantasma", "Esqueleto", "Bruja", "Zombie"];

cargarTiposTablaLocalStorage(arrayTiposTabla);

function cargarTiposTablaLocalStorage(arrayTiposTabla)
{
    const arrayTiposString = JSON.stringify(arrayTiposTabla);

    localStorage.setItem('arrayTiposTabla', arrayTiposString);

}

const dropdownFiltroItems = document.querySelectorAll('.dropdown-item');

dropdownFiltroItems.forEach(item=>{
    item.addEventListener('click', ()=>{
        const tipoSeleccionado = item.dataset.tipo;
        getMonstruos()
        .then(data => {
            let monstruosFiltrados = data;
            if (tipoSeleccionado !== 'Todos') {
                monstruosFiltrados = data.filter(monstruo => monstruo.tipo === tipoSeleccionado);   
            }
            refrescarDiv(crearTabla(monstruosFiltrados));
        })
        .catch(error => {
            console.error("Error al obtener monstruos", error);
        });
        })
});



