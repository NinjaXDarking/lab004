const database = require('../config/database');
const mysql2 = require('mysql2')
// crud
/* 
Aqui se usa para leer los datos 
*/

const readMortalidad = (req, res) => {
  const readQuery = `
  SELECT mortalidad.*, empleados.Nombre, empleados.Apellido
  FROM mortalidad
  INNER JOIN empleados ON mortalidad.idEmpleado = empleados.idEmpleado;
`;
    // const {idTrazabilidad, Fecha, Cantidad, idEmpleado, Observacion} = req.body; // para extraer el parametro de la ruta de la solicitud
    // const readQuery = `SELECT * FROM mortalidad;`;
    // const  query = mysql2.format(readQuery, [idTrazabilidad, Fecha, Cantidad, idEmpleado, Observacion]);

    database.query(readQuery,(err,result)=>{
        if (err) throw err;
        if (result.length !== 0){
            res.json(result);
        }else{
            res.json({message: 'Registro no encontrado'})
        }
        
    });
};
//aqui es para obtener por id
const readMortalidadId = (req, res) => {
    const { id } = req.params;
    // const { Fecha,Encargado,EspeciePescado,Cantidad,PilaIngreso,Proveedor,LoteProveedor,PilaProveedor } = req.body; // para extraer el parametro de la ruta de la solicitud
    const readQuery = `SELECT * FROM mortalidad where idMortalidad = ?;`;
    const  query = mysql2.format(readQuery, [id]);

    database.query(query,(err,result)=>{
        if (err) throw err;
        if (result.length !== 0){
            res.json(result);
            console.log(result);
        }else{
            res.json({message: 'Registro no encontrado'})
        }
    });
};
/*
Aui para crear o insertar un usuario a la base de datos 
*/
const createMortalidad = (req, res) => {
    const {idTrazabilidad, Fecha, Cantidad, idEmpleado, Observacion} = req.body;
  
    if (!idTrazabilidad || !Fecha || !Cantidad || !idEmpleado || !Observacion) {
      res.status(400).send({ error: "Faltan campos requeridos" });
      console.log(idTrazabilidad, Fecha, Cantidad, idEmpleado, Observacion);
      return;
    }
  
    const createQuery = `INSERT INTO  mortalidad (idTrazabilidad, Fecha, Cantidad,idEmpleado, Observacion ) VALUES (?, ?, ?, ?, ?)`;
    const query = mysql2.format(createQuery, [idTrazabilidad, Fecha, Cantidad, idEmpleado, Observacion]);
  
    database.query(query, (err, result) => {
      if (err) {
        console.error("Error al registrar Mortalidad:", err);
        res.status(500).send({ error: "Error en el servidor" });
      } else {
        console.log(result);
        res.send({ message: "Mortalidad registrada" });
      }
    });
  };
  
// /*
// Aqui se actualiza 
// */
const updateMortalidad = (req, res) => {
    const { id } = req.params;
  
    const selectQuery = `SELECT * FROM mortalidad WHERE idMortalidad = ?;`;
    const query = mysql2.format(selectQuery, [id]);
  
    try {
      database.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: 'Error al obtener los datos de la base de datos' });
          return;
        }
  
        if (result.length === 0) {
          res.status(404).json({ message: 'Mortalidad no encontrado' });
          return;
        }
  
        const mortalidadActual = result[0];
  
        const campos = ['idTrazabilidad','Fecha', 'Cantidad', 'idEmpleado', 'Observacion'];
  
        const valoresModificados = campos.reduce((acc, campo) => {
          if (req.body[campo] && req.body[campo] !== mortalidadActual[campo]) {
            acc[campo] = req.body[campo];
          }
          return acc;
        }, {});
  
        if (Object.keys(valoresModificados).length === 0) {
          res.status(400).json({ message: 'No se a realizado ningún cambio' });
          return;
        }
  
        const updateQuery = `UPDATE mortalidad SET ? WHERE idMortalidad = ?;`;
        const updateValues = [valoresModificados, id];
        const updateQueryFormatted = mysql2.format(updateQuery, updateValues);
  
        database.query(updateQueryFormatted, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error al actualizar el registro' });
            return;
          }
  
          // console.log(result);
          res.json({ message: 'Registro actualizado' });
        });
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  
/*
aqui se elimina
*/
const deleteMortalidad = (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
  
      const deleteQuery = `DELETE FROM mortalidad WHERE idMortalidad = ?`;
      const query = mysql2.format(deleteQuery, [id]);
  
      database.query(query, (err, result) => {
        if (err) {
          console.error("Error al eliminar el registro:", err);
          res.status(500).send({ error: "Error en el servidor" });
        } else {
          // console.log(result);
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
    readMortalidad,
    readMortalidadId,
    createMortalidad,
    updateMortalidad,
    deleteMortalidad,  
};