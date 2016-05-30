var http="http://star-api.herokuapp.com/api/v1/";
var azul="min[colorb_v]=-1&max[colorb_v]=0";
var vermelho="min[colorb_v]=0&max[colorb_v]=1";
var fracas="min%5Babsmag%5D=0&max%5Babsmag%5D=10";
var fortes="min%5Babsmag%5D=-10&max%5Babsmag%5D=-3";
var cemAnos="max[distly]=100";		
var quinhentosAnos = "max[distly]=500";
var distancia1 = "min[distance]=10&max[distance]=100";
var distancia2 = "min[distance]=101&max[distance]=300";
var distancia3 = "min[distance]=301&max[distance]=500";
var distancia4 = "min[distance]=501&max[distance]=1000";
var distancia5 = "min[distance]=1001";
var diam1 = "min[diam]=-1&max[diam]=6";
var diam2 = "min[diam]=6&max[diam]=11";
var diam3 = "min[diam]=11&max[diam]=21";
var diam4 = "min[diam]=21&max[diam]=101";
var diam5 = "min[diam]=101";
var distOp1 = "min[distly]=100&max[distly]=1000"
var distOp2 = "min[distly]=1001&max[distly]=2000";
var distOp3 = "min[distly]=2001&max[distly]=3000"
var distOp4 = "min[distly]=3001&max[distly]=4000"
var distOp5 = "min[distly]=4001&max[distly]=5000"
var distOp6 = "min[distly]=5001&max[distly]=6000"
var distOp7 = "min[distly]=60001"
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
	switch(diametro){
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
	}
	switch(distanciaOp){
		case "menosAnos":
			var distUrl = distOp1;
		break;
		case "milAnos":
			var distUrl = distOp2;
		break;

		case "doisAnos":
			var distUrl = distOp3;
		break;
		case "tresAnos":
			var distUrl = distOp4;
		break;
		case "quatroAnos":
			var distUrl = distOp5;
		break;
		case "cincoAnos":
			var distUrl = distOp6;
		break;
		case "maisAnos":
			var distUrl = distOp7;
		break;
	}
	request(http+i+"?"+diamUrl+"&"+distUrl);
}

function selectCategoria(i){
	if (i != "selecionar"){
		$("#pesquisa").show();
		$("#botaoPesquisa").show();
	}
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
	
	switch(distancia){
		case "dezAcem":
			var distUrl = distancia1;
		break;
		case "cemAtrezentos":
			var distUrl = distancia2;
		break;
		case "trezentosAquinhentos":
			var distUrl = distancia3;
		break;
		case "quinhentosAmil":
			var distUrl = distancia4;
		break;
		case "maisMil":
			var distUrl = distancia5;
		break;
	}
	request(http+i+"?"+numUrl+"&"+distUrl);
}

function testeUrlEstrelas(i, cor, distancia, brilho){
	switch(cor){
		case "azul":
			var corUrl = azul;
		break;

		case "vermelho":
			var corUrl = vermelho;
		break;
	}
	switch(distancia){
		case "cemAnos":
			var anosUrl = cemAnos;
		break;

		case "quinhentosAnos":
			var anosUrl = quinhentosAnos;
		break;
	}
	switch(brilho){
		case "fracas":
			var brilhoUrl = fracas;
		break;

		case "fortes":
			var brilhoUrl = fortes;
		break;
	}
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