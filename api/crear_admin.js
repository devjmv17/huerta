const { crearUsuario } = require('./db');

(async () => {
  const usuario = await crearUsuario('admin', '2020', 'admin');
  console.log('Usuario admin creado:', usuario);
  process.exit();
})();