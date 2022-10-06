let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

let brush = null; // variable para guardar el lapiz o el borrador.
let isMouseDown = null; // variable para saber si el mouse esta apretado.
let image = new Img(canvas.width, canvas.height , ctx , canvas); // variable para la imagen.

/**************************************************************************************************************
*** - - - - - - - - - - - - - - - - - - - EVENTOS Y FUNCIONES - - - - - - - - - - - - - - - - - - - - - - - ***
*** - - - - - - - - - - - - - - - - - - - - - - BROCHA - - - - - - - - - - - - - - - - - - - - - - - - - - -***
**************************************************************************************************************/
/* Cuando presiono el boton para el LAPIZ */ 
document.getElementById("pencil").addEventListener("click", (e) => { 
  setBrush("pencil"); 
});

/* Cuando presiono el boton para la GOMA DE BORRAR */
document.getElementById("eraser").addEventListener("click", (e) => { 
  setBrush("eraser"); 
});

/* Creo instancia de la brocha dependiendo que boton se apreto */
function setBrush(type) {
    if(type === "eraser"){ // Si se presiono el boton goma.
      brush = new Eraser(0,0, "white", ctx, tam.value); // Creo la goma y la guardo en la brocha.
    }
    if (type === "pencil") {// Si se presiono el boton lapiz.
      brush = new Pencil(0,0 , color.value, ctx, tam.value); // Creo el lapiz y lo guardo en la brocha.
    }
}

/**************************************************************************************************************
*** - - - - - - - - - - - - - - - - - - - EVENTOS AL CAMBIAR - - - - - - - - - - - - - - - - - - - - - - - -***
*** - - - - - - - - - - - - - - - - - - - - COLOR Y TAMAÑO  - - - - - - - - - - - - - - - - - - - - - - -  -***
**************************************************************************************************************/
/* Cuando cambio el color del lapiz */
let color = document.getElementById("color"); color.addEventListener("change", () => {
  if (brush instanceof Pencil){// chequeo que mi brocha sea un lapiz.
    brush.setColor(color.value);// le seteo el color.
  }
});

/* Cuando cambio el tamaño de la brocha */
let tam = document.getElementById("customRange"); 
tam.addEventListener("change", () => { brush.setLineWidth(tam.value);});// seteo el tamaño de la linea.

/**************************************************************************************************************
*** - - - - - - - - - - - - - - - - - - - EVENTOS Y FUNCIONES - - - - - - - - - - - - - - - - - - - - - - - ***
*** - - - - - - - - - - - - - - - - - - - - -  CANVAS  - - - - - - - - - - - - - - - - - - - - - - - - - - -***
**************************************************************************************************************/
/* Mientras el CLICK del mouse esta APRETADO */
canvas.addEventListener("mousedown", onMouseDown); 

function onMouseDown(event){
  isMouseDown = true;// La variable del click apretado se vuelve true.

  let pos = getMousePos(event);// obtengo la posicion del mouse dentro del canvas .
  
  if(brush!=null){// Si la brocha es distinta de null.
    brush.setPosition(pos.x, pos.y); // A la brocha le seteo la posicion en la que esta el mouse.
  }
};

/* Cuando se SUELTA el CLICK del mouse */
canvas.addEventListener("mouseup", onMouseUp);

function onMouseUp() {
  isMouseDown = false; // La variable del click apretado se vuelve false.
}

/* Mientras el mouse se MUEVE */
canvas.addEventListener("mousemove", onMouseMove);

function onMouseMove(event){
  if(isMouseDown && brush != null){// Si el click esta apretado y si la brocha es distinta de null.
    let pos = getMousePos(event);// Obtengo la posicion del mouse dentro del canvas .
    brush.draw(pos.x, pos.y);// Llamo a la funcion de dibujar de la brocha.
  }
}

/* Obtengo la posicion relativa del mouse dentro del canvas */ 
function getMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

/**************************************************************************************************************
*** - - - - - - - - - - - - - - - - - - - EVENTOS Y FUNCIONES - - - - - - - - - - - - - - - - - - - - -  - -***
*** - - - - - - - - - - - - - - - - - - - - - OPCIONES - - - - - - - - - - - - - - - - - - - - - - - - - - -***
**************************************************************************************************************/
/* Cuando presiono el boton REINICIAR */ 
document.getElementById("reload").addEventListener("click", (e) => { loadCanvas(); });

/* Funcion para cargar el canvas en blanco */
function loadCanvas() {
    ctx.clearRect(0,0,850,600);
    ctx.fillStyle = "#FFFFFFFF";
    ctx.fillRect (0,0,850,600);
    // Si en algun momento se subio una imagen, borro la src tmp guardada de la imagen para evitar bugs
    // cuando presiono el boton de quitar filtro.
    image.deleteSrcImgTemp(); 
}

/* Cuando presiono el boton GUARDAR*/
document.getElementById("save").addEventListener("click", () => {
  let enlace = document.createElement('a'); // Creo un elemento <a>
  enlace.download = "Canvas.png";// El titulo que tiene el enlace.
  enlace.href = canvas.toDataURL();// Convierto la imagen a Base64 y lo pongo en el enlace
  enlace.click(); // Lo descargo
});

let file_input = document.getElementById("file");// Variable para guardar el input file (que esta oculto)

 /* Cuando presiono el boton SUBIR IMAGEN */
document.getElementById("upload").addEventListener("click", () => { 
  file_input.click()// Acciono el input tipo file.
});

/* Cuando subo una imagen */
file_input.addEventListener("change", (e) => { 
  image.drawImage(e); // Llamo al metodo para dibujar la imagen.
});

 /* Cuando presiono el boton QUITAR FILTRO*/
document.getElementById("no_filter").addEventListener("click", () => { 
  image.resetImage();// Llamo al metodo para cargar la imagen original.
});

/**************************************************************************************************************
*** - - - - - - - - - - - - - - - - - - - - - -EVENTOS- - - - - - - - - - - - - - - - - - - - - - - - -  - -***
*** - - - - - - - - - - - - - - - - - - - - -  FILTROS - - - - - - - - - - - - - - - - - - - - - - - - - - -***
**************************************************************************************************************/
/* Cuando presiono el boton FILTRO NEGATIVO*/ 
document.getElementById("filter_negative").addEventListener("click", () => {
  image.negative();
});
 
/* Cuando presiono el boton FILTRO SEPIA*/ 
document.getElementById("filter_sepia").addEventListener("click", () => {
  image.sepia();
});
  
/* Cuando presiono el boton FILTRO BINARIZACION*/ 
document.getElementById("filter_binarization").addEventListener("click", () => {
  image.binarization();
});

/* Cuando presiono el boton FILTRO + BRILLO*/ 
document.getElementById("filter_more_brightness").addEventListener("click", () => {
  image.brigthness("more");
});

/* Cuando presiono el boton FILTRO - BRILLO*/ 
document.getElementById("filter_less_brightness").addEventListener("click", () => {
  image.brigthness(" ");
});

/* Cuando presiono el boton FILTRO SATURACION*/ 
document.getElementById("filter_saturation").addEventListener("click", () => {
  image.saturation();
});

/* Cuando presiono el boton FILTRO BORDES*/ 
document.getElementById("filter_border").addEventListener("click", () => {
  image.border();
});

/* Cuando presiono el boton FILTRO BLUR*/ 
document.getElementById("filter_blur").addEventListener("click", () => {
  image.blur();
});
