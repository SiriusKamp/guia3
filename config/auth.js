// passport.js

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const Admin = mongoose.model("admins");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Admin.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new LocalStrategy(
    { usernameField: "nome", passwordField: false },
    (nome, done) => {
      console.log("Entrando na estratégia de autenticação");
      Admin.findOne({ nome: nome })
        .then((user) => {
          console.log("Encontrou usuário:", user);
          if (!user) {
            return done(null, false, { message: "Usuário não encontrado." });
          }

          // Lógica para autenticar sem senha, se necessário

          console.log("Autenticado com sucesso");
          return done(null, user);
        })
        .catch((err) => {
          console.error("Erro na autenticação:", err);
          done(err, null);
        });
    }
  )
);

module.exports = passport;
