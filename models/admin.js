// models/admin.js
const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;

const AdminSquema = new Schema({
  nome: {
    type: "String",
    required: true,
  },
  nascimento: {
    type: Date,
    required: true,
  },
  pontuacao: { type: "Number", default: -1 },
  datacriacao: { type: Date, default: Date.now() },
});

mongoose.model("admins", AdminSquema);
