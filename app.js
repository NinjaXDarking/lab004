//aqui se importa express
const express = require('express');
const cors = require ('cors');

const loginRoutes = require('./src/routes/login.routes');
const ingresoAlevinesRoutes = require('./src/routes/ingresoAlevines.routes');
const proveedoresRoutes = require('./src/routes/proveedores.routes');
const pilasRoutes = require('./src/routes/pilas.routes');
const trazabilidadRoutes = require('./src/routes/trazabilidad.routes');
const mortalidadRoutes = require('./src/routes/mortalidad.routes');
const muestreoRoutes = require('./src/routes/muestreo.routes');
const alimentacionRoutes = require('./src/routes/alimentacion.routes');
const productosCompraRoutes = require('./src/routes/productosCompra.routes');
const empleadosRoutes = require('./src/routes/empleados.routes');
const ventasRoutes = require('./src/routes/ventas.routes');
const registroRoutes = require('./src/routes/registro.routes');
const productosRoutes = require('./src/routes/productos.routes');
const inventarioRoutes = require('./src/routes/inventario.routes');
const verifyToken = require('./src/routes/validate-token.routes');


//crear un servidor
const app = express();

// middlewares
app.use(express.urlencoded({extended:true}));  // Middleware para analizar el cuerpo de URL codificada
app.use(express.json());//PARA PARSEAR LA INFORMACION // Middleware para analizar el cuerpo JSON de las solicitudes
app.use(cors());



//endpoints
app.use('/login', loginRoutes);
app.use('/ingresoAlevine', verifyToken,ingresoAlevinesRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/pilas', pilasRoutes);
app.use('/trazabilidad', trazabilidadRoutes);
app.use('/mortalidad', mortalidadRoutes);
app.use('/muestreo', muestreoRoutes);
app.use('/alimentacion', alimentacionRoutes);
app.use('/productosCompra', productosCompraRoutes );
app.use('/empleados', empleadosRoutes );
app.use('/ventas', ventasRoutes);
app.use('/registro', registroRoutes);
app.use('/productos', productosRoutes);
app.use('/inventario', inventarioRoutes);
//Exportamos app 
module.exports = app;