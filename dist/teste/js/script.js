var http="http://star-api.herokuapp.com/api/v1/";
var fracas="min%5Babsmag%5D=0&max%5Babsmag%5D=10";
var fortes="min%5Babsmag%5D=-10&max%5Babsmag%5D=-3";
var diam1 = "min[diam]=-1&max[diam]=6";
var diam2 = "min[diam]=6&max[diam]=11";
var diam3 = "min[diam]=11&max[diam]=21";
var diam4 = "min[diam]=21&max[diam]=101";
var diam5 = "min[diam]=101";

$(document).ready(function(){
	$("#selecionar").change(function(){
		var i = $("#selecionar").val();
		$(".radio").show();
		if (i == "selecionar"){
			$("#pesquisa").hide();
			$(".radio").hide();
			$("#botaoPesquisa").hide();
			$(".conteudoTodos").hide();
		}
	});

	$("#porNome").click(function(){
		var i = $("#selecionar").val();
		selectCategoria(i);
		$("#cor").val("cor");
		$("#brilho").val("brilho");
		$("#distancia").val("distancia");
		$(".conteudoTodos").hide();
		$("#selecionar").change(function(){
			var i = $("#selecionar").val();
			selectCategoria(i);
		});
	});

	$("#todos").click(function(){
		var i = $("#selecionar").val();
		$("#pesquisa").hide();
		$("#pesquisa").val('');
		if (i == "stars"){$(".estrelasTodos").show();$(".exoplanetas").hide();$(".conteudoTodos").show();$(".open_cluster").hide();}
		else if (i == "exo_planets"){$(".exoplanetas").show(); $(".estrelasTodos").hide();$(".conteudoTodos").show();$(".open_cluster").hide();}
		else if (i == "open_cluster"){$(".open_cluster").show(); $(".exoplanetas").hide(); $(".estrelasTodos").hide();$(".conteudoTodos").show();}
		$("#botaoPesquisa").show();
	});

	$('#botaoPesquisa').click(function(){
		var i = $("#selecionar").val();
		var j = $("#pesquisa").val();
		if (j != ""){
			request(http+i+"/"+j);
		}

		if (j == "" && i == "stars"){
			var cor = $("#cor").val();
			var distancia = $("#distancia").val();
			var brilho = $("#brilho").val();
			testeUrlEstrelas(i, cor, distancia, brilho);
		}

		else if (j == "" && i == "exo_planets"){
			var numplanets = $("#numplanetas").val();
			var distancia = $("#distance").val();
			testeUrlExoplanets(i, numplanets, distancia);
		}

		else if (j == "" && i == "open_cluster"){
			var diametro = $("#diametroOp").val();
			var distanciaOp = $("#distanciaOp").val();
			testeUrlOp(i, diametro, distanciaOp);
		}
	});
});

function testeUrlOp(i, diametro, distanciaOp){
	data = testeValor(0, 0, 0, distanciaOp);
	/*switch(diametro){
		case "zeroAcinco":
			var diamUrl = diam1;
		break;
		case "cincoAdez":
			var diamUrl = diam2;
		break;
		case "dezAvinte":
			var diamUrl = diam3;
		break;
		case "vinteAcem":
			var diamUrl = diam4;
		break;
		case "maisCem":
			var diamUrl = diam5;
		break;
	}*/

	if (data.posicaoMinima == ""){
		var distUrl = "min[distly]="+data.posicaoMaxima;
	}
	else if(data.posicaoMinima != ""){
		var distUrl = "min[distly]="+data.posicaoMinima+"&max[distly]="+data.posicaoMaxima;
	}

	request(http+i+"?"+diamUrl+"&"+distUrl);
}

function selectCategoria(i){
	if (i != "selecionar"){
		$("#pesquisa").show();
		$("#botaoPesquisa").show();
	}
}

function testeValor(distancia, cor, brilho, distanciaOp){
	if (cor == ""){var parametro = distancia;}
	else if (distancia == ""){var parametro = cor;}
		var letraMaiscula = parametro.indexOf("A");
		var posicaoTotal = parametro.length;
		var posicaoMinima = parametro.substring(0,letraMaiscula);
		var posicaoMaxima = parametro.substring(letraMaiscula+1,posicaoTotal);
		var data = [
			posicaoMinima,
			posicaoMaxima
		]
	return data;
}

function testeUrlExoplanets(i, numplanets, distancia){
	if (numplanets != "exo_planets"){
		var numPlanets = parseInt(numplanets);
		if (numplanets == 1){
			var minimo = numPlanets-2;
			var maximo = numPlanets+1;
		}
		else {
			var minimo = numPlanets-1;
			var maximo = numPlanets+1;
		}
		var numUrl = "min[numplanets]="+minimo+"&max[numplanets]="+maximo;
	}

	data = testeValor(distancia, 0, 0, 0);
	if (data.posicaoMinima == ""){
		var distUrl = "min[distance]="+data.posicaoMaxima;
	}
	else if(data.posicaoMinima != ""){
		var distUrl = "min[distance]="+data.posicaoMinima+"&max[distance]="+data.posicaoMaxima;
	}
	request(http+i+"?"+numUrl+"&"+distUrl);
}

function testeUrlEstrelas(i, cor, distancia, brilho){
	var brilhoUrl;
	data = testeValor(0, cor, 0, 0);
	var corUrl = "min[colorb_v]="+data.posicaoMinima+"&max[colorb_v]="+data.posicaoMaxima;
	
	var anosUrl = "max[distly]="+distancia;

	if (brilho == "0A10"){brilhoUrl = fracas}
	else if (brilho == "-10A-3"){brilhoUrl = fortes}

	request(http+i+"?"+brilhoUrl+"&"+anosUrl+"&"+corUrl);
}

function request(url){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function (){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var myArr = JSON.parse(xmlhttp.responseText);
			console.log(myArr);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}