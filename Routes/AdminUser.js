const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/admin");
const Admin = mongoose.model("admins");
const passport = require("../config/auth");

router.post("/registro", async (req, res) => {
  try {
    const erros = [];
    const anonasc = new Date(req.body.nascimento);
    const anoNascimento = anonasc.getFullYear();
    const anoAtual = new Date().getFullYear();

    if (anoNascimento > anoAtual || anoNascimento < anoAtual - 100) {
      erros.push({ texto: "Coloque uma data de nascimento válida" });
    }

    // Verifique se o campo de nome contém pelo menos duas palavras
    const nome = req.body.nome;
    const palavrasNoNome = nome
      .split(" ")
      .filter((palavra) => palavra.trim() !== "");

    if (palavrasNoNome.length < 3) {
      erros.push({ texto: "O nome deve conter pelo menos tres palavras" });
    }

    if (erros.length > 0) {
      res.render("../views/home", { erros: erros });
    } else {
      // Verifique se o e-mail já está registrado
      const existingAdmin = await Admin.findOne({ nome: req.body.nome });

      if (existingAdmin) {
        req.flash("error_msg", "Você Ja Respondeu o Quiz");
        return res.redirect("/");
      }

      // Crie um novo admin
      const novoAdmin = new Admin({
        nome: req.body.nome,
        nascimento: req.body.nascimento,
      });

      // Salve o novoAdmin no banco de dados
      await novoAdmin.save();
      req.login(novoAdmin, function (err) {
        if (err) {
          console.error(err);
          req.flash("error_msg", "Houve um erro ao autenticar o usuário");
          return res.redirect("/");
        }

        req.flash("success_msg", "Usuário registrado e logado com sucesso.");
        res.redirect("/quiz/0");
        console.log(req.user);
      });
    }
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Houve um erro ao registrar o usuário");
    res.redirect("/");
  }
});

router.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    req.flash("success_msg", "Deslogado");
    res.redirect("/");
  });
});

module.exports = router;
