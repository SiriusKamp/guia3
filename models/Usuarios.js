const db = require("./DB");

const Usuarios = db.sequelize.define("cadastrados", {
  Email: { type: db.Sequelize.STRING },
  Nascimento: { type: db.Sequelize.DATE },
});

//Usuarios.sync({ force: true });
//apenas rodar uma vez
module.exports = Usuarios;
