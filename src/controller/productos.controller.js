const database = require('../config/database');
const mysql2 = require('mysql2')
// crud
/* 
Aqui se usa para leer los datos 
*/

//AQUIE LEEMOS TODOS LOS EMPLEADOS LISTO PARA ENVIARLOS!
const readProductos = (req, res) => {
    //const { id } = req.params; // para extraer el parametro de la ruta de la solicitud
    const readQuery = `SELECT * FROM productos;`;
  
    database.query(readQuery, (err, result) => {
      if (err) throw err;
      if (result[0] !== undefined) {
        res.json(result);
      } else {
        res.json({ message: 'Producto no encontrado' })
      }
    });
  };

 const readProductosId = (req, res) => {
     const { id } = req.params;
     const readQuery = `SELECT * FROM productos where idProductos=?;`;
     const  query = mysql2.format(readQuery, [id]);

     database.query(query,(err,result)=>{
         if (err) throw err;
         if (result.length !== undefined){
             res.json(result);
             console.log(result);
         }else{
             res.json({message: 'Registro no encontrado'})
         }
     });
 };


const createProductos = (req, res) => {
  const { Fecha,Producto, Descripcion,Cantidad, Precio,Iva } = req.body;
  
  if (!Fecha ||!Producto || !Precio || !Cantidad) {
    res.send({ error: "Faltan campos requeridos" });
    return;
  }


  const createQuery = `INSERT INTO productos (Fecha, Producto, Descripcion, Cantidad, Precio, Iva) VALUES (?, ?, ?, ?, ?, ?)`;
  const query = mysql2.format(createQuery, [Fecha, Producto, Descripcion, Cantidad, Precio, Iva]);

  database.query(query, (err, result) => {
    if (err) {
      console.error("Error al registrar el producto:", err);
      res.send({ error: "No se puede completar el registro" });
    } else {
      console.log(result);
      res.send({ message: "Ingreso de Producto registrado" });
    }
  });
};
  
/*
Aqui se actualiza 
*/
const updateProductos = (req, res) => {
  const { id } = req.params;

  const selectQuery = `SELECT * FROM productos WHERE idProductos = ?;`;
  const query = mysql2.format(selectQuery, [id]);

  try {
    database.query(query, (err, result) => {
      // console.log(result);
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener los datos de la base de datos' });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
      }

      const productoActual = result[0];

      const campos = ['Fecha' ,'Producto', 'Descripcion', 'Cantidad', 'Precio', 'Iva'];

      let datosModificados = false; // Inicializar como false

      const valoresModificados = campos.reduce((acc, campo) => {
        if (req.body[campo] && req.body[campo] !== productoActual[campo]) {
          acc[campo] = req.body[campo];
        }
        return acc;
      }, {});

      if (Object.keys(valoresModificados).length === 0) {
        res.status(400).json({ message: 'No es necesario realizar la actualización' });
        return;
      }
      const updateQuery = `UPDATE productos SET ? WHERE idProductos= ?;`;
      const updateValues = [valoresModificados, id]; // Copia de los valores de req.body
      const updateQueryFormatted = mysql2.format(updateQuery, updateValues);

      database.query(updateQueryFormatted, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: 'Error al actualizar el registro' });
          return;
        }

        console.log(result);
        res.json({ message: 'Registro actualizado' });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


/*
aqui se elimina
*/
const deleteProductos = (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteQuery = `DELETE FROM productos WHERE idProductos=?`;
      const query = mysql2.format(deleteQuery, [id]);
  
      database.query(query, (err, result) => {
        if (err) {
          console.error("Error al eliminar el registro:", err);
          res.status(500).send({ error: "Error en el servidor" });
        } else {
          console.log(result);
          res.send({ message: "Registro eliminado" });
        }
      });
    } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).send({ error: "Error en el servidor" });
    }
    
  };
// Aqui se exporta el crud 
module.exports = {
    readProductos,
    readProductosId,
    createProductos,
    updateProductos,
    deleteProductos,
};