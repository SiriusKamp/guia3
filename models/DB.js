const Sequelize = require("sequelize");

const sequelize = new Sequelize("usuarios", "root", "HiTrUsKcA112004", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(function () {
    console.log("conectado ");
  })
  .catch(function (erro) {
    console.log("falha ao se conectar " + erro);
  });

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};
