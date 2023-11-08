feedback = "Aqui esta um feedback sobre os aspectos da sua alimentação : </br>";
var total = 0;

btnAdd.onclick = function () {
  total = Number.parseInt(total);
feedback = "Aqui esta um feedback sobre os aspectos da sua alimentação : </br>";
  let checkparam13 = 0;
  let checkparam24 = 0;
  let feedback13 = "";
  let feedback24 = "";
  var ele13 = document.querySelectorAll(".opção1-13");
  var ele24 = document.querySelectorAll(".opção14-24");
  for (var i = 0; i < ele13.length; i++) {
    if (ele13[i].checked) {
      total += Number.parseInt(ele13[i].value);
      checkparam13++;
      if (ele13[i].value < 2)
        feedback13 +=
          ele13[i].name + " É um aspecto ruim da sua alimentação </br>";
      else if (ele13[i].value == 2)
        feedback13 +=
          ele13[i].name +
          " É um aspecto médio da sua alimentação, ainda não é perfeito </br>";
      else
        feedback13 +=
          ele13[i].name +
          " É um aspecto otimo da sua alimentação!! continue assim </br>";
    }
  }
    for (var i = 0; i < ele24.length; i++) {
    if (ele24[i].checked) {
      total += Number.parseInt(ele24[i].value);
      checkparam24++;
      if (ele24[i].value < 2)
        feedback24 +=
          ele24[i].name + " É um aspecto ruim da sua alimentação </br>";
      else if (ele24[i].value == 2)
        feedback24 +=
          ele24[i].name +
          " É um aspecto médio da sua alimentação, ainda não é perfeito </br>";
      else
        feedback24 +=
          ele24[i].name +
          " É um aspecto otimo da sua alimentação!! continue assim </br>";
    }
  }
  feedback += feedback13 + feedback24;
  if (checkparam13 >= 13 && checkparam24 >= 11) {
    if (total < 31){
      divdano.innerHTML =
        "Para ter uma alimentação saudável e prazerosa, você precisa mudar. Atenção às quatro recomendações apresentadas a seguir</br>";
        divfeed.innerHTML = feedback;
    }
    else if (total > 31 && total < 41){
      divdano.innerHTML =
        "Siga em frente! Você está no meio do caminho para uma alimentação saudável. Leia as quatro recomendações apresentadas a seguir e identifique os aspectos que você pode melhorar.</br>";
        divfeed.innerHTML = feedback;
    }
    else{
      divdano.innerHTML =
        "Excelente! Parece que você tem uma alimentação saudável, em diversos aspectos. Continue engajado, leia as quatro recomendações apresentadas a seguir e identifique os aspectos que você pode melhorar.</br>";
        divfeed.innerHTML = feedback;
    }
  } else
    divdano.innerHTML =
      "Você precisa selecionar pelo menos uma opção em cada pergunta";
};
