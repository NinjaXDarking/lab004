//importamos
const app = require('../../app');
const { Router } = require('express');

//Importamos el crud desde user.controller

const {
    readInventarioId,
    readInventario,
    createInventario,
    updateInventario,
    deleteInventario,    
}= require('../controller/inventario.controller');

const router = Router();


//endpoint rutas
//recibe una peticion y el servidor siempre da una respuesta 

router.get('/', readInventario);
router.get('/:id', readInventarioId);
router.post('/', createInventario);
router.put('/:id', updateInventario);
router.delete('/:id', deleteInventario);



//Exportamos las endpoints
module.exports = router;