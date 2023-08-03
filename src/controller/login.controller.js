const database = require('../config/database');
const mysql2 = require('mysql2')
const jwt = require('jsonwebtoken');
require('../../env/config')

// crud
/* 
Aqui se usa para leer los datos por id
*/
const readLogin = (req, res) => {
  const { id } = req.params; // para extraer el parametro de la ruta de la solicitud
  const readQuery = `SELECT * FROM User WHERE id=?;`;
  const query = mysql2.format(readQuery, [id]);

  database.query(query, (err, result) => {
    if (err) throw err;
    if (result[0] !== undefined) {
      res.json(result[0]);
    } else {
      res.json({ message: 'Usuario no encontrado' })
    }
  });
};
const readallLogin = (req, res) => {
  const { Cedula, contrasena } = req.body;
  //const { id } = req.params; // para extraer el parametro de la ruta de la solicitud
  const readQuery = `SELECT * FROM login;`;
  const query = mysql2.format(readQuery, [Cedula, contrasena]);

  database.query(query, (err, result) => {
    if (err) throw err;
    if (result[0] !== undefined) {
      res.json(result);
    } else {
      res.json({ message: 'Usuario no encontrado' })
    }
  });
};
/*
Aui para crear o insertar un usuario a la base de datos 
*/
const createLogin = (req, res) => {
  const { Cedula, contrasena } = req.body;//destructuring, req.body se utiliza para acceder a los datos enviados en el cuerpo de la solicitud./

  const createQuery = `INSERT INTO login(Cedula, contrasena) VAlUEs(?, ?)`;
  const query = mysql2.format(createQuery, [Cedula, contrasena]);

  database.query(query, (err, result) => {
    if (err) throw err;
    // console.log(result);

    res.send({ message: 'Usuario Registrado' });
  });
};

/*
Aqui se actualiza 
*/
const updateLogin = (req, res) => {
  const { id } = req.params; // para extraer el parametro de la ruta de la solicitud 
  const { Nombre, Apellido } = req.body;

  if (!Nombre || !Apellido) {
    res.status(400).json({ message: 'No se pueden actualizar los campos vacíos' });
    return;
  }

  const updateQuery = `UPDATE User SET Nombre=?, Apellido=? WHERE id=?;`;
  const query = mysql2.format(updateQuery, [Nombre, Apellido, id]);

  database.query(query, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Usuario Actualizado' })

  });
};
/*
aqui se elimina
*/
const deleteLogin = (req, res) => {
  const { id } = req.params; // para extraer el parametro de la ruta de la solicitud

  const deleteQuery = `DELETE FROM User WHERE id=?`;
  const query = mysql2.format(deleteQuery, [id]);

  database.query(query, (err, result) => {
    if (err) throw err;
    // console.log(result);
    if (result.affectedRows > 0) {
      res.send({ message: 'Usuario Eliminado' });
    } else {
      res.send({ message: 'El usuario no existe en la base de datos' });
    }
  })
};

//validar login
const validarLogin = (req, res) => {
  const { Cedula, contrasena } = req.body;

  // Verificar si se proporcionaron la cédula y la contraseña
  if (!Cedula || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Realizar la validación en la base de datos

  const selectQuery = `
    SELECT e.idEmpleado, r.TipoRol, e.Cedula, e.Nombre, e.Apellido, e.Telefono, l.contrasena
    FROM roles r
    INNER JOIN empleados e ON r.idRol = e.idRol
    INNER JOIN login l ON r.idRol = l.idRol
     WHERE l.Cedula = ? AND l.contrasena = ? and l.Cedula=e.Cedula;
  `;

  const query = mysql2.format(selectQuery, [Cedula, contrasena]);

  database.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Usuario autenticado correctamente
    // Generar el token con todos los datos del empleado
    const token = jwt.sign({
      idEmpleado: result[0].idEmpleado,
      Rol: result[0].TipoRol,
      Cedula: result[0].Cedula,
      Nombre: result[0].Nombre,
      Apellido: result[0].Apellido
    }, process.env.JWT_SECRET, { expiresIn: '60m' }); // Utiliza la clave secreta de la variable de entorno
    // console.log(process.env.JWT_SECRET);
    // res.status(200).json({ token });
    res.header('auth-token', token).json({
      error: null,
      data: { token },
      message: `Ingresando como : ${result[0].Nombre} ${result[0].Apellido}`
    })
  });
};





// Aqui se exporta el crud 
module.exports = {
  readLogin,
  readallLogin,
  createLogin,
  updateLogin,
  deleteLogin,
  validarLogin,
};