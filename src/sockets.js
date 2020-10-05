/*En este script se gestionan los middlewares para la conexion socket.io
Creo una funcion y le paso la conexión (io)*/

module.exports = io => {
  let var_history= [];

  /*Agrego un listener para io (conexion del socket iniciada en src/index.js) el evento
  'connection' y el handler que recibe 'socket' desde index.js*/
  io.on('connection', socket =>{
    console.log('New user connected');

    for (i in var_history) {
      socket.emit('draw_line', {line: var_history[i]})
    }

    socket.on('draw_line', data=> {
      var_history.push(data.line);
      io.emit('draw_line', data);
    })

    socket.on('eraser', (data)=> {
      var_history.splice(0, var_history.length-1)
      io.emit('eraser', {})
    })
  })
}
