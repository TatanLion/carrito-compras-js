const carrito = document.querySelector('#carrito');
const contenedorCarrrito = document.querySelector('#lista-carrito tbody');
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners(){
    //Aqui vamos a llamar otra funcion cuando le demos click
    listaCursos.addEventListener('click', agregarCurso);

    //Eliminar los cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Muestra los cursos en el carrito desde el LocalStorage
    document.addEventListener('DOMContentLoaded', () =>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });

    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML();
    });
}

function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

//Eliminar curso del carrito
function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        // console.log(e.target.getAttribute('data-id'));
        const cursoId = e.target.getAttribute('data-id');

        //Elimina del arreglo pot el dataId
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        //Iteramos sobre el arreglo con la funcion carritoHTML()
        carritoHTML();
    }
}


function leerDatosCurso(curso){
    console.log(curso);

    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //Revisar si un elemento ya existe dentro en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);

    if(existe){
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso; //Retorna el objeto actualizado
            }else{
                return curso; //Este retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursos];
    }else{
        //Agrega los elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    
    console.log(articulosCarrito);
    carritoHTML();
}

//Mostrar el carrito de compras en el HTML
function carritoHTML(){
    //Limpiar el HTML 
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;

        //Agregar  el HTML generado al tbody del HTML
        contenedorCarrrito.appendChild(row);

    });

    //Sincronizar el carrito al Storage
    sincronizarStorage();
    
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Elimina los cursos dentro del carrito HTML
function limpiarHTML(){
    // //Forma lenta de limpiar el HTML
    // contenedorCarrrito.innerHTML = '';

    while(contenedorCarrrito.firstChild){
        contenedorCarrrito.removeChild(contenedorCarrrito.firstChild);
    }
}