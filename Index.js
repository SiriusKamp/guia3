const express = require("express");
require("./models/admin");
const app = express();
const path = require("path");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require("./Routes/admin");
const session = require("express-session");
const flash = require("connect-flash");
const adminuser = require("./Routes/AdminUser");
const passport = require("passport");
require("./config/auth");
const Admin = mongoose.model("admins");
//configure
// sessão
app.use(
  session({
    secret: "Sirius",
    resave: true,
    saveUninitialized: true,
  })
);
//passport
app.use(passport.initialize());
app.use(passport.session());
//flash
app.use(flash());
//middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
// Helper para condição if
const hbs = handlebars.create({
  // ... outras configurações ...
  helpers: {
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case "==":
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case "===":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case "!==":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
    // ... outros helpers ...
  },
});

app.engine(
  "handlebars",
  handlebars.engine({
    extname: "handlebars",
    defaultlayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
      cache: false,
    },
    helpers: {
      ifCond: hbs.helpers.ifCond,
    },
  })
);

app.set("view engine", "handlebars");

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//public
app.use(express.static(path.join(__dirname, "public")));
//mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/usuarios")
  .then(() => {
    console.log("connection established");
  })
  .catch((err) => {
    console.error("erro ao conectar : " + err);
  });

//configuração das rotas
app.use("/admin", admin);
app.use("/AdminUser", adminuser);

app.get("/", function (req, res) {
  res.render("home");
});

const perguntas = [
  {
    pergunta:
      "Ao fazer lanchinhos ao longo do dia você costuma comer alimentos como frutas ou grãos como castanhas ?",
    opcoes: [
      {
        texto: "Nunca",
        valor: 0,
        imagem: { src: "/img/x.jpg" },
      },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/aveia 3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/aveia.jpg" },
      },
      { texto: "Muitas Vezes", valor: 2, imagem: { src: "/img/aveia 2.jpg" } },
    ],
  },
  {
    pergunta:
      "Quando escolhemos frutas, verduras e legumes, dou preferência para aqueles que são de produção local.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/LocalFarmer3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/LocalFarmer1.jpg" },
      },
      {
        texto: "Muitas Vezes",
        valor: 2,
        imagem: { src: "/img/LocalFarmer2.jpg" },
      },
    ],
  },
  {
    pergunta: "Em casa comemos mais alimentos orgânicos.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/Oganico3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/Oganico1.jpg" },
      },
      {
        texto: "Muitas Vezes",
        valor: 2,
        imagem: { src: "/img/Organico2.jpg" },
      },
    ],
  },
  {
    pergunta:
      "Costumo levar algum alimento comigo em caso de sentir fome ao longo do dia.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/criancafruta3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/criancafruta.jpg" },
      },
      {
        texto: "Muitas Vezes",
        valor: 2,
        imagem: { src: "/img/criancafruta2.jpg" },
      },
    ],
  },
  {
    pergunta: "Costumo planejar as refeições que farei no dia.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/planejar3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/planejar.jpg" },
      },
      {
        texto: "Muitas Vezes",
        valor: 2,
        imagem: { src: "/img/planejar2.jpg" },
      },
    ],
  },
  {
    pergunta:
      "Costumo variar o consumo de feijão por ervilha, lentilha ou grão de bico.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/grãos.avif" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/grãos.avif" },
      },
      { texto: "Muitas Vezes", valor: 2, imagem: { src: "/img/grãos.avif" } },
    ],
  },
  {
    pergunta: "Na minha casa usamos farinha de trigo integral",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/farinha3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/farinha.jpg" },
      },
      { texto: "Muitas Vezes", valor: 2, imagem: { src: "/img/farinha2.jpg" } },
    ],
  },
  {
    pergunta: "Costumo comer fruta no café da manhã.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/fruta3.avif" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/fruta1.avif" },
      },
      { texto: "Muitas Vezes", valor: 2, imagem: { src: "/img/fruta2.jpg" } },
    ],
  },
  {
    pergunta: "Procuro realizar as refeições com calma. ",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/comendo0.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/comendo3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/comendo1.jpg" },
      },
      {
        texto: "Muitas Vezes",
        valor: 2,
        imagem: { src: "/img/comendo2.avif" },
      },
    ],
  },
  {
    pergunta: "Costumo participar do preparo dos alimentos na minha casa.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/participar3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/participar.jpg" },
      },
      {
        texto: "Muitas Vezes",
        valor: 2,
        imagem: { src: "/img/participar2.jpg" },
      },
    ],
  },
  {
    pergunta:
      "Na minha casa compartilhamos as tarefas que envolvem o preparo e consumo das refeições.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/participar3.jpg" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/participar.jpg" },
      },
      {
        texto: "Muitas Vezes",
        valor: 2,
        imagem: { src: "/img/participar2.jpg" },
      },
    ],
  },
  {
    pergunta:
      "Em minha casa é comum comprar alimentos em feiras livres ou feiras de rua.",
    opcoes: [
      { texto: "Nunca", valor: 0, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 3, imagem: { src: "/img/feira.avif" } },
      {
        texto: "Raramente",
        valor: 1,
        imagem: { src: "/img/feira.avif" },
      },
      {
        texto: "Muitas Vezes",
        valor: 2,
        imagem: { src: "/img/feira.avif" },
      },
    ],
  },
  {
    pergunta:
      "Aproveito o horário das refeições para resolver outras coisas e acabo deixando de comer. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/brincando.jpg" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/brincando.jpg" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/brincando.jpg" },
      },
    ],
  },
  {
    pergunta: "Costumo fazer as refeições à minha mesa de trabalho ou estudo. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/comendomesa.jpg" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/comendomesa.jpg" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/comendomesa.jpg" },
      },
    ],
  },
  {
    pergunta:
      "Costumo fazer minhas refeições sentado(a) no sofá da sala ou na cama. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/comendosofa1.jpg" } },
      {
        texto: "Raramente",
        valor: 2,
        imagem: { src: "/img/comendosofa2.png" },
      },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/comendocama.jpg" },
      },
    ],
  },
  {
    pergunta:
      "Costumo pular pelo menos uma das refeições principais (almoço e/ou jantar). ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/brincando.jpg" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/jogando.jpg" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/jogandofut.jpg" },
      },
    ],
  },
  {
    pergunta: "Costumo comer balas, chocolates e outras guloseimas. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/doce3.avif" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/doce1.avif" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/doce2.avif" },
      },
    ],
  },
  {
    pergunta:
      "Costumo beber sucos industrializados, como de caixinha, em pó, garrafa ou lata. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/sucoind.jpeg" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/sucoind.png" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/sucoind3.jfif" },
      },
    ],
  },
  {
    pergunta: "Costumo frequentar restaurantes fast-food ou lanchonetes. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/fastfood3.jpg" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/fastfood1.png" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/fastfood2.avif" },
      },
    ],
  },
  {
    pergunta: "Tenho o hábito de “beliscar” no intervalo entre as refeições. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/salgadinho.jpg" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/pirulito.avif" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/balas.png" },
      },
    ],
  },
  {
    pergunta: "Costumo comer balas, chocolates e outras guloseimas. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/doce3.avif" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/chocolate.avif" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/doce2.avif" },
      },
    ],
  },
  {
    pergunta: "Costumo beber refrigerante. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/refri3.jpg" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/refri.jpg" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/refri 2.jpg" },
      },
    ],
  },
  {
    pergunta:
      "Costumo trocar a comida do almoço ou jantar por sanduíches, salgados ou pizza. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/pizza.avif" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/sanduiche.jpg" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/salgado.jpg" },
      },
    ],
  },
  {
    pergunta: "Quando bebo café ou chá, costumo colocar açúcar. ",
    opcoes: [
      { texto: "Nunca", valor: 3, imagem: { src: "/img/X.jpg" } },
      { texto: "Sempre", valor: 0, imagem: { src: "/img/açucar3.jpg" } },
      { texto: "Raramente", valor: 2, imagem: { src: "/img/açucar.jpg" } },
      {
        texto: "Muitas Vezes",
        valor: 1,
        imagem: { src: "/img/açucar2.jpg" },
      },
    ],
  },
  // Adicione as outras perguntas...
];

var resultado = [];
const MAX_PERGUNTAS = perguntas.length;

// Middleware para verificar se a pergunta é válida
function validarPergunta(req, res, next) {
  const perguntaId = parseInt(req.params.perguntaId);
  if (isNaN(perguntaId) || perguntaId < 0 || perguntaId >= MAX_PERGUNTAS) {
    return res.redirect("/quiz/0"); // Redireciona para a primeira pergunta se a ID for inválida
  }
  next();
}

app.get("/quiz/:perguntaId", validarPergunta, (req, res) => {
  const perguntaId = parseInt(req.params.perguntaId);
  const perguntaAtual = perguntas[perguntaId];
  if (perguntaId == 0) resultado = [];
  res.render("quiz", {
    pergunta: perguntaAtual,
    perguntaid: perguntaId,
    PerguntaAnterior: perguntaId - 1,
    proximaPerguntaId: perguntaId + 1,
    progresso: ((perguntaId + 1) / MAX_PERGUNTAS) * 100,
    MAX_PERGUNTAS: MAX_PERGUNTAS,
  });
});

app.post("/quiz/:perguntaId", validarPergunta, async (req, res) => {
  const perguntaId = parseInt(req.params.perguntaId);
  const respostaUsuario = req.body.resposta;

  resultado.push(respostaUsuario);
  console.log(resultado);

  const proximaPerguntaId = perguntaId + 1;

  if (proximaPerguntaId < 24) res.redirect(`/quiz/${proximaPerguntaId}`);
  else {
    if (resultado.length < 24) {
      req.flash("error_msg", "Responda todas as perguntas");
      res.redirect("/quiz/0");
    } else if (req.user != null && req.user != undefined) {
      let Fresultado = resultado.reduce(
        (count, elem) => count + parseInt(elem),
        0
      );
      console.log(Fresultado);

      try {
        const idDoUsuario = req.user._id;

        const usuario = await Admin.findByIdAndUpdate(
          idDoUsuario,
          { pontuacao: Fresultado },
          { new: true } // Para retornar o documento atualizado
        );

        if (!usuario) {
          console.error("Usuário não encontrado");
          req.flash("error_msg", "Usuário não encontrado");
          return res.redirect("/");
        }

        res.render("feedback", { resultado: Fresultado });
        resultado = [];
      } catch (err) {
        console.error("Erro ao atualizar pontuação do usuário:", err);
        req.flash("error_msg", "Erro ao salvar pontuação");
        res.redirect("/");
      }
    } else {
      req.flash("error_msg", "Conte-nos quem você é antes de responder :");
      res.redirect("/");
    }
  }
});

app.post("/quiz/:perguntaId/voltar", validarPergunta, (req, res) => {
  const perguntaId = parseInt(req.params.perguntaId);

  resultado.pop();
  console.log(resultado);

  res.redirect(`/quiz/${perguntaId}`);
});

//ultima coisa no index
app.listen(8081, () => {
  console.log("Servidor rodando na URL http://localhost:8081");
});

//app.get("/parametros/:Nome/:Cargo", function (req, res) {
//    res.send("<h1>Ola " + req.params.Nome + "</h1>");
// })
