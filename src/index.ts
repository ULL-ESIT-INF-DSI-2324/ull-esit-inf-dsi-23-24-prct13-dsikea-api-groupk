import { app } from "./app.js";
/**
 * Puerto en el que escucha el servidor
 * @const port
 * @type {number}
 * 
 */
const port = process.env.PORT || 3000;
/**
 * Inicia el servidor en el puerto especificado
 * @function app.listen
 * @param {number} port - Puerto en el que escucha el servidor
 * @param {Function} callback - Función que se ejecuta al iniciar el servidor
 * 
 */
app.listen(port, () => {
  console.log("Server listening on", port);
});
