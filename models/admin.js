// models/admin.js
const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;

const AdminSquema = new Schema({
  nome: {
    type: "String",
    required: true,
  },
  email: {
    type: "String",
    required: true,
  },
  nascimento: {
    type: Date,
    required: true,
  },
  senha: { type: "String", required: true },
  permitions: {
    type: "Number",
    default: 0,
  },
  pontuacao: { type: "Number", default: 0 },
  confirmationToken: String,
  isConfirmed: {
    type: Boolean,
    default: false,
  },
});

mongoose.model("admins", AdminSquema);
