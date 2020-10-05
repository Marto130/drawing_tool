const express = require('express'); // crear servidor
const path = require('path'); // estandarizar rutas
const socketIO = require('socket.io'); // crear conexiones en tiempo real
const http = require('http'); // crear rutas y server (si bien uso express, lo solicita socket.io).-


//initialization
const app = express();

//creo el servidor http y le paso los datos del servidor creado con express (socket.io requiere un servidor http para inicializarse.
const server = http.createServer(app);

//Inicio la conexion para los sockets.
const io = socketIO(server);

/*Establezco el puerto para el servidor.
Si el so no tiene un puerto por defecto, entonces se usa el 3000*/
app.set('port', process.env.PORT || 3000)

/* para servir el contenido estatico agrego el middleware a la pila (app.use)
express.static y especifico la ruta a 'public' usando path.join (este modulo perimite estandarizar la ruta
para cualquier sistema operativo) */
app.use(express.static(path.join(__dirname, 'public')));

//Inicio el servidor (requests GET)
server.listen(app.get('port'), ()=>{
  console.log('server on port: 3000');
})

//importo sockets.js y ejecuto io;
require('./sockets')(io);
