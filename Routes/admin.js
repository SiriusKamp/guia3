const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const { format, parseISO, getYear } = require("date-fns");
const ptBR = require("date-fns/locale/pt-BR");
require("../models/admin");
const Admin = mongoose.model("admins");

router.get("/exportar-admins", async (req, res) => {
  try {
    // Verifique se uma data de criação foi fornecida
    const { datacriacao } = req.query;
    let filtro = {};

    if (datacriacao) {
      // Converta a data fornecida para uma data no formato ISO
      const [dia, mes, ano] = datacriacao.split("/");
      const dataInicio = new Date(ano, mes - 1, dia); // Mês em JavaScript é 0-indexed
      const dataFim = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

      // Filtre pelo intervalo de datas
      filtro = {
        datacriacao: {
          $gte: dataInicio,
          $lte: dataFim,
        },
      };
    }

    // Busque os admins no banco de dados usando o filtro
    const admins = await Admin.find(filtro).sort({ datacriacao: "desc" });

    // Crie um novo workbook Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Admins");

    // Adicione cabeçalhos
    const cabecalhos = ["Data de Nascimento", "Pontuação", "Data de Criação"];
    sheet.addRow(cabecalhos);

    // Adicione dados
    admins.forEach((admin) => {
      const linha = [
        format(new Date(admin.nascimento), "dd/MM/yyyy", { locale: ptBR }),
        admin.pontuacao,
        format(new Date(admin.datacriacao), "dd/MM/yyyy", { locale: ptBR }),
      ];
      sheet.addRow(linha);
    });

    // Crie um stream e envie o arquivo para o cliente
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=admins.xlsx");
    await workbook.xlsx.write(res);

    console.log("Exportação concluída com sucesso");
  } catch (err) {
    req.flash("error_msg", "coloque a data no formato aa/mm/aaaa");
    res.redirect("/admin/");
  }
});

router.get("/", function (req, res) {
  Admin.find()
    .sort({ datacriacao: "desc" })
    .then((admins) => {
      // Mapeia os admins formatando a data de criação
      const formattedAdmins = admins.map((admin) => ({
        ...admin._doc,
        nascimento: format(new Date(admin.nascimento), "dd/MM/yyyy", {
          locale: ptBR,
        }),
        datacriacao: format(new Date(admin.datacriacao), "dd/MM/yyyy", {
          locale: ptBR,
        }),
      }));

      res.render("admin/homeadm", { admins: formattedAdmins });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar os usuários");
      res.redirect("/admin/");
      console.log(err);
    });
});

router.post("/homeadm/delete", async function (req, res) {
  const adminId = req.body.id;
  console.log(adminId);
  try {
    // Use deleteOne em vez de remove
    const result = await Admin.deleteOne({ _id: adminId });

    if (result.deletedCount === 0) {
      req.flash("error_msg", "Este usuário não existe");
    } else {
      req.flash("success_msg", "Admin deletado com sucesso");
    }

    res.redirect("/admin/");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Erro ao excluir admin");
    res.redirect("/admin/");
  }
});

router.post("/excluir-usuarios-negativos", async function (req, res) {
  try {
    // Use deleteMany para excluir vários documentos que atendem ao critério
    const result = await Admin.deleteMany({ pontuacao: -1 });

    if (result.deletedCount === 0) {
      req.flash(
        "error_msg",
        "Não foram encontrados usuários com -1 ponto para excluir"
      );
    } else {
      req.flash(
        "success_msg",
        "Usuários com -1 ponto foram excluídos com sucesso"
      );
    }

    res.redirect("/admin/");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Erro ao excluir usuários com -1 ponto");
    res.redirect("/admin/");
  }
});

module.exports = router;
