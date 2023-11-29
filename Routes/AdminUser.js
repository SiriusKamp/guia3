// routes/admin.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

require("../models/admin");
const Admin = mongoose.model("admins");
const passport = require("passport");

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true para 465, false para outros portos
  auth: {
    user: "sistemaalimentacao@hotmail.com", // Seu endereço de e-mail Hotmail
    pass: "FabricaDeSoftware", // Sua senha de e-mail Hotmail
  },
});

router.get("/registro", (req, res) => {
  res.render("../views/admin/adminregistro");
});
router.post("/registro", async (req, res) => {
  try {
    var erros = [];
    var anonasc = new Date(req.body.nascimento);
    anonasc = anonasc.getFullYear();
    var anoatual = new Date(Date.now());
    anoatual = anoatual.getFullYear();
    if (anonasc > anoatual || anonasc < anoatual - 100) {
      erros.push({ texto: "Namoral bota sua data de nascimento para de zoar" });
    }
    if (
      !req.body.nome ||
      typeof req.body.nome == undefined ||
      req.body.nome == null
    ) {
      erros.push({ texto: "Nome é obrigatorio" });
    }
    if (
      !req.body.email ||
      typeof req.body.email == undefined ||
      req.body.email == null
    ) {
      erros.push({ texto: "Email é obrigatorio" });
    }
    if (
      !req.body.senha ||
      typeof req.body.senha == undefined ||
      req.body.senha == null
    ) {
      erros.push({ texto: "Senha é obrigatorio" });
    }
    if (req.body.senha.length < 4)
      erros.push({ texto: "Senha Precisa ser maior que 4 digitos" });
    if (req.body.senha != req.body.senha2)
      erros.push({ texto: "As senhas estão diferentes, redigite" });

    if (erros.length > 0) {
      res.render("../views/admin/adminregistro", { erros: erros });
    } else {
      // Verifique se o e-mail já está registrado
      const existingAdmin = await Admin.findOne({ email: req.body.email });
      if (existingAdmin) {
        req.flash("error_msg", "Já existe uma conta com este e-mail");
        return res.redirect("/");
      } else {
        // Crie um token único
        const confirmationToken = crypto.randomBytes(20).toString("hex");

        const novoAdmin = new Admin({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha,
          nascimento: req.body.nascimento,
          confirmationToken: confirmationToken,
        });

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoAdmin.senha, salt, async (erro, hash) => {
            if (erro) {
              req.flash("error_msg", "Houve um erro na criação de usuário");
              res.redirect("/adminuser/registro");
            }

            novoAdmin.senha = hash;

            // Salve o novoAdmin no banco de dados
            await novoAdmin.save();

            // Envie o e-mail de confirmação
            const confirmationLink = `http://localhost:8081/adminuser/confirmar-email?token=${confirmationToken}`;
            const mailOptions = {
              from: "sistemaalimentacao@hotmail.com",
              to: req.body.email,
              subject: "Confirmação de E-mail",
              text: `Clique no link para confirmar seu e-mail: ${confirmationLink}`,
            };

            await transporter.sendMail(mailOptions);

            req.flash(
              "success_msg",
              "Usuário registrado com sucesso. Verifique seu e-mail para confirmar."
            );
            res.redirect("/");
          });
        });
      }
    }
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Houve um erro interno");
    res.redirect("/");
  }
});

router.get("/login", (req, res) => {
  res.render("../views/admin/login");
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/alimentacao",
    failureRedirect: "/adminuser/login",
    failureFlash: true,
  })(req, res, next);
});
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    req.flash("success_msg", "Deslogado");
    res.redirect("/");
  });
});
router.get("/confirmar-email", async (req, res) => {
  try {
    const token = req.query.token;

    // Busque o usuário pelo token
    const user = await Admin.findOne({ confirmationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Token de confirmação inválido ou expirado." });
    }

    // Marque a conta como confirmada
    user.isConfirmed = true;
    user.confirmationToken = undefined;
    await user.save();

    res.status(200).json({
      message: "E-mail confirmado com sucesso. Você pode fazer login agora.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});
router.get("/reenviartoken", (req, res) => {
  res.render("ReenvioToken");
});

router.post("/reenviartoken", async (req, res) => {
  try {
    const { email } = req.body;

    // Busque o usuário pelo email
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      req.flash("error_msg", "Usuário não encontrado");
      return res.redirect("/adminuser/reenviartoken");
    }

    // Verifique se o usuário já foi confirmado
    if (existingAdmin.isConfirmed) {
      req.flash("error_msg", "Usuário já confirmado");
      return res.redirect("/adminuser/reenviartoken");
    }

    // Envie o novo token por e-mail
    const novoConfirmationToken = crypto.randomBytes(20).toString("hex");
    existingAdmin.confirmationToken = novoConfirmationToken;
    await existingAdmin.save();

    const confirmationLink = `http://localhost:8081/adminuser/confirmar-email?token=${novoConfirmationToken}`;
    const mailOptions = {
      from: "sistemaalimentacao@hotmail.com",
      to: email,
      subject: "Reenvio de Confirmação de E-mail",
      text: `Clique no link para confirmar seu e-mail: ${confirmationLink}`,
    };

    await transporter.sendMail(mailOptions);

    req.flash("success_msg", "Confirmação reenviada com sucesso");
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Houve um erro no servidor");
    return res.redirect("/");
  }
});

module.exports = router;
