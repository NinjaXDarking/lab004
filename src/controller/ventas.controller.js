const database = require('../config/database');
const mysql2 = require('mysql2')
// crud
/* 
Aqui se usa para leer los datos 
*/
const readVentas = (req, res) => {
  // const readQuery = `
  //   SELECT ventas.*, empleados.idEmpleado, empleados.Nombre, empleados.Apellido, productos.idProductos, productos.Producto
  //   FROM ventas
  //   INNER JOIN empleados ON ventas.Encargado = empleados.IdEmpleado
  //   INNER JOIN productos ON ventas.Producto = productos.idProductos;
  // `;

  // database.query(readQuery, (err, result) => {
  //   if (err) throw err;
  //   if (result[0] !== undefined) {
  //     res.json(result);
  //   } else {
  //     res.json({ message: 'Venta no encontrada' })
  //   }
  // });

  res.json({
    OK:"Pinguino",
    msj:"Todo chill hermanos "
});



};

const readVentasId = (req, res) => {
    const { id } = req.params;
    // const { Fecha,Encargado,EspeciePescado,Cantidad,PilaIngreso,Proveedor,LoteProveedor,PilaProveedor } = req.body; // para extraer el parametro de la ruta de la solicitud
    // const readQuery = `SELECT * FROM ventas WHERE idVentas = ?;`;
    const readQuery = `SELECT * FROM ventas WHERE idVentas = ?;`;

    const  query = mysql2.format(readQuery, [id]);

    database.query(query, (err, result) => {
        if (err) throw err;
        if (result[0] !== undefined) {
          res.json(result);
        } else {
          res.json({ message: 'Venta no encontrado' })
        }
      });
};
/*
Aui para crear o insertar un usuario a la base de datos 
*/
const createVenta = (req, res) => {
  try {
    const { Fecha, Encargado, Producto, kilos, Pila, Lote, Subtotal, IVA, Total, metodoPago, Observaciones } = req.body; /*destructuring, req.body se utiliza para acceder a los datos enviados en el cuerpo de la solicitud.*/
    
  if (!Fecha || !Encargado || !Producto || !kilos || !Pila || !Lote || !Subtotal || !IVA || !Total || !metodoPago || !Observaciones) {
    res.send({ error: "Faltan campos requeridos" });
    console.log(Fecha, Encargado, Producto, Kilos, Pila, Lote, Subtotal, IVA, Total, metodoPago, Observaciones);
    return;
  }
console.log(metodoPago);
  const createQuery = `INSERT INTO ventas (Fecha,Encargado,Producto,kilos,Pila,Lote,Subtotal,IVA,Total,metodoPago,Observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const query = mysql2.format(createQuery, [Fecha, Encargado, Producto, kilos, Pila, Lote, Subtotal, IVA, Total, metodoPago, Observaciones]);
  database.query(query, (err, result) => {
    if (err) {
      
      console.error("Error al registrar el ingreso de alevines:", err);
      res.send({ error: "No se puede completar el registro" });
    } else {
      console.log(result);
      res.send({ message: "Ingreso de venta registrado" });
    }
  });

  } catch (error) {
    
    console.error("Error en el servidor:", error);
      res.status(500).send({ error: "Error en el servidor" });
  }

  
  }


  
/*
Aqui se actualiza 
*/
const updateVenta = (req, res) => {
  try {
    const { id } = req.params; // para extraer el parametro de la ruta de la solicitud 
  const { Fecha, Encargado, Producto, Kilos, Pila, Lote, Subtotal, IVA, Total, metodoPago, Observaciones } = req.body;

  console.log(Encargado);
  if (!Fecha || !Encargado || !Producto || !Kilos || !Pila || !Lote || !Subtotal || !IVA || !Total || !metodoPago || !Observaciones) {
    res.status(400).json({ message: 'No se pueden actualizar los campos vacíos' });
    return;
  }

  const updateQuery = `UPDATE ventas SET Fecha = ?, Encargado = ?, Producto = ?, Kilos = ?, Pila = ?, Lote = ?, Subtotal = ?, IVA = ?, Total = ?, metodoPago = ? ,Observaciones = ? WHERE idVentas=?;`;
  const query = mysql2.format(updateQuery, [Fecha, Encargado, Producto, Kilos, Pila, Lote, Subtotal, IVA, Total, metodoPago, Observaciones, id]);

  database.query(query, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Se actualizo correctamente el muestreo' })
    console.log(result);
  });
    
  } catch (error) {
    console.error("Error en el servidor:", error);
      res.status(500).send({ error: "Error en el servidor" });
  }
  
};




/*
aqui se elimina
*/
const deleteVenta = (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteQuery = `DELETE FROM ventas WHERE idVentas=?`;
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
    readVentas,
    readVentasId,
    createVenta,
    updateVenta,
    deleteVenta,
};