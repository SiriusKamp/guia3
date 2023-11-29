const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("../models/admin");
const Admin = mongoose.model("admins");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "senha" },
      (email, senha, done) => {
        Admin.findOne({ email: email }).then((user) => {
          if (!user) {
            return done(null, false, { message: "Esta conta não existe" });
          }
          bcrypt.compare(senha, user.senha, (erro, batem) => {
            if (batem) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Senha incorreta" });
            }
          });
        });
      }
    )
  );

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
};
