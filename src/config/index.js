//Importamos app y database  para establecer la conexion

const app = require('../../app');
const database = require('./database');


// //invocamos a dotenv
const dotenv=require('../../env/config')
// console.log(process.env.PORT);
const PORT=process.env.PORT || 3000;

// creamos un metodo main para establecer la conexion con la base de datos y que escuche el puerto
const main = () => {
    //database.connect((err) => {
      // if (err) {
      //   console.error('Error al conectar a la base de datos:', err);
      //   return;
      // }
      // console.log('Base de datos conectada');
  
      app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
      });


    //});
  };

  
// Llamamos el metodo main para ejecutarlo
main();