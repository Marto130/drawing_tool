
//La aplicacion se iniciará una vez que se haya renderizado todo el contenido del DOM.
document.addEventListener('DOMContentLoaded', ()=>{

//Creo 'mouse' para mantener actualizado el estado de sus propiedades.
  const mouse = {
    click: false,
    move: false,
    pos: {x:0, y:0},
    pos_prev: false
  }

  //canvas
  const canvas= document.querySelector('#drawing');
  const width= window.innerWidth;
  const height= window.innerHeight;

//Ancho y largo del vanvas relativo a la medida del la ventana del navegador.
  canvas.width= width;
  canvas.height= height;

//Indico el contexto 2D para el canvas.
  const context= canvas.getContext('2d');

  /* socket es la conexion del cliente con el socket. La ejecucion de io() no corresponde
  a la conexion incializada en src/index.js sino a la ejecucion de una variable que se crear
  dentro del navegador (llamada io) y que permite la conexion de este con el server.
  Esta es la conexión que voy a usar para enviar datos desde el cliente.
  */
  const socket= io();

//Listener para el front que detectan el click y la posicion del mouse.
  canvas.addEventListener('mousedown', (e)=>{
    mouse.click= true;
  })

  canvas.addEventListener('mouseup', (e)=> {
    mouse.click= false;
  })

  canvas.addEventListener('mousemove', (e)=> {
    mouse.pos.x= e.clientX / (width);
    mouse.pos.y= e.clientY / (height);
    mouse.move= true;
  })

/*Agergo un listener a socket para el evento 'draw_line' y el handler que recibe 'e'
el cual proviene de la funcion mainLoop.
Por medio de este listener se obtiene la informacion necesaria para trazar las lineas.
*/
  socket.on('draw_line', (e) =>{
    const line= e.line;
    context.beginPath();
    context.lineWidth = 2;

    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke()
    context.strokeStyle= 'red';
  })

  socket.on('eraser', ()=> {
    context.clearRect(0, 0, width, height);
  })

  const erase= document.querySelector('#btn-eraser')
  erase.addEventListener('click', (e)=> {
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('eraser');
  })

/*La funcion mainLoop (recursiva) detecta si se cumplen las condiciones para comenzar un trazo
de linea y recolecta la informacion necesaria para poder generarla.*/
  function mainLoop(){
    if(mouse.click && mouse.move && mouse.pos_prev){
      /*socket emite un evento 'draw_line' con un objeto que contiene los datos de la
      posicion actual del mouse y de la posicion previa. Este evento será recibido
      por el listener socket.on definido mas arriba*/
        socket.emit('draw_line', {line: [mouse.pos, mouse.pos_prev]})
        mouse.move= false;
    }

    //Se actualiza el estado de por_prev con la ultima posicion registrada.
    mouse.pos_prev= {x: mouse.pos.x, y: mouse.pos.y}
    //Se vuelve a llamar a la funcion mainLoop
    setTimeout(mainLoop, 25);
  }
  mainLoop();
})
