const database = require('../config/database');
const mysql2 = require('mysql2')
// crud
/* 
Aqui se usa para leer los datos 
*/

const readInventario = (req, res) => {
    const readQuery = `
  SELECT inventario.*, productos.Producto
  FROM inventario
  INNER JOIN productos ON productos.idProductos = inventario.idProductos;
`;

    database.query(readQuery, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
            res.json(result);
        } else {
            res.json({ message: 'Registro no encontrado' })
        }

    });
};
//aqui es para obtener por id
const readInventarioId = (req, res) => {
    const { id } = req.params;
    // const { Fecha,Encargado,EspeciePescado,Cantidad,PilaIngreso,Proveedor,LoteProveedor,PilaProveedor } = req.body; // para extraer el parametro de la ruta de la solicitud
    const readQuery = `SELECT * FROM inventario where idProductos = ?;`;
    const query = mysql2.format(readQuery, [id]);

    database.query(query, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
            res.json(result);
            console.log(result);
        } else {
            res.json({ message: 'Registro no encontrado' })
        }
    });
};
/*
Aui para crear o insertar un usuario a la base de datos 
*/
const createInventario = (req, res) => {
    const { idProductos, Categoria, PrecioAnterior, PrecioActual, ExistenciaInicial, StockMinimo, Entradas, Salidas, StockActual } = req.body;

    if (!idProductos || !Categoria || !PrecioAnterior || !PrecioActual || !ExistenciaInicial || !StockMinimo || !Entradas || !Salidas || !StockActual) {
        res.status(400).send({ error: "Faltan campos requeridos" });
        console.log(idProductos, Categoria, PrecioAnterior, PrecioActual, ExistenciaInicial, StockMinimo, Entradas, Salidas, StockActual);
        return;
    }
    const precioPromedio = (PrecioAnterior + PrecioActual) / 2;
    console.log(precioPromedio);

    const createQuery = `INSERT INTO  inventario (idProductos, Categoria, PrecioAnterior, PrecioActual, PrecioPromedio, ExistenciaInicial, StockMinimo, Entradas, Salidas, StockActual ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const query = mysql2.format(createQuery, [idProductos, Categoria, PrecioAnterior, PrecioActual, precioPromedio, ExistenciaInicial, StockMinimo, Entradas, Salidas, StockActual]);

    database.query(query, (err, result) => {
        if (err) {
            console.error("Error al registrar en el inventario:", err);
            res.status(500).send({ error: "Error en el servidor" });
        } else {
            console.log(result);
            res.send({ message: "Inventario registrado" });
        }
    });
};

// /*
// Aqui se actualiza 
// */
const updateInventario = (req, res) => {
    const { id } = req.params;

    const selectQuery = `SELECT * FROM inventario WHERE idInventario = ?;`;
    const query = mysql2.format(selectQuery, [id]);

    try {
        database.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Error al obtener los datos de la base de datos' });
                return;
            }

            if (result.length === 0) {
                res.status(404).json({ message: 'Registro no encontrado' });
                return;
            }

            const inventarioActual = result[0];

            const campos = ['idProductos', 'Categoria', 'PrecioAnterior', 'PrecioActual', 'PrecioPromedio', 'ExistenciaInicial', 'StockMinimo', 'Entradas', 'Salidas', 'StockActual'];

            const valoresModificados = campos.reduce((acc, campo) => {
                if (req.body[campo] && req.body[campo] !== inventarioActual[campo]) {
                    acc[campo] = req.body[campo];
                }
                return acc;
            }, {});

            if (Object.keys(valoresModificados).length === 0) {
                res.status(400).json({ message: 'No se a realizado ningún cambio' });
                return;
            }

            const updateQuery = `UPDATE inventario SET ? WHERE idInventario = ?;`;
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
const deleteInventario = (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const deleteQuery = `DELETE FROM inventario WHERE idInventario = ?`;
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
    readInventarioId,
    readInventario,
    createInventario,
    updateInventario,
    deleteInventario,
};