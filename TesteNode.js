const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const Usuario = require("./models/Usuarios");
//configure
// Template engine
app.engine(
  "handlebars",
  handlebars.engine({
    defaultlayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configuração das rotas
app.get("/", function (req, res) {
  res.send("seja bem vindo ao meu app");
});
app.get("/login", function (req, res) {
  res.render("Formulario");
});
app.post("/add", function (req, res) {
  Usuario.create({
    Email: req.body.email,
    Nascimento: req.body.nascimento,
  })
    .then(function () {
      res.redirect("/alimentacao");
    })
    .catch(function (err) {
      res.send(err.message);
    });
});
app.get("/alimentacao", function (req, res) {
  res.render("index");
});
app.get("/homeadm", function (req, res) {
  Usuario.findAll({ order: [["id", "DESC"]] }).then(function (usuarios) {
    console.log(usuarios);
    res.render("homeadm", { usuarios: usuarios });
  });
});
app.get("/delete/:id", function (req, res) {
  Usuario.destroy({ where: { id: req.params.id } })
    .then(function (usuarios) {
      res.send("Deletado");
    })
    .catch(function (err) {
      res.send("esse user n existe");
    });
});

//ultima coisa no index
app.listen(8081, function () {
  console.log("Servidor rodando na URL http://localhost:8081");
});

//app.get("/parametros/:Nome/:Cargo", function (req, res) {
//    res.send("<h1>Ola " + req.params.Nome + "</h1>");
// });
