var http="http://star-api.herokuapp.com/api/v1/";
var azul="min[colorb_v]=-1&max[colorb_v]=0";
var vermelho="min[colorb_v]=0&max[colorb_v]=1";
var fracas="min%5Babsmag%5D=0&max%5Babsmag%5D=10";
var fortes="min%5Babsmag%5D=-10&max%5Babsmag%5D=-3";
var cemAnos="max[distly]=100";		
var quinhentosAnos = "max[distly]=500";

$(document).ready(function(){
	$("#selecionar").change(function(){
		var i = $("#selecionar").val();
		$(".radio").show();
		if (i == "selecionar"){
			$("#pesquisa").hide();
			$(".radio").hide();
			$("#botaoPesquisa").hide();
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
		$("#pesquisa").hide();
		$("#pesquisa").val('');
		$(".conteudoTodos").show();
		$("#botaoPesquisa").show();
	});

	$('#botaoPesquisa').click(function(){
		var i = $("#selecionar").val();
		var j = $("#pesquisa").val();
		if (j !=""){
			request(http+i+"/"+j);
		}

		if (j == ""){
			console.log("olaaa");
			var cor = $("#cor").val();
			var distancia = $("#distancia").val();
			var brilho = $("#brilho").val();
			testeUrl(i, cor, distancia, brilho);
		}
	});
});



function selectCategoria(i){
	if (i != "selecionar"){
		$("#pesquisa").show();
		$("#botaoPesquisa").show();
	}
}

function testeUrl(i, cor, distancia, brilho){
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