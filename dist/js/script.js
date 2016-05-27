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
	});

	$("#todos").click(function(){
		$("#pesquisa").hide();
		$(".conteudoTodos").show();
		$("#botaoPesquisa").show();
		var i = $("#selecionar").val();
		selectFilter(i);
	});
});

var http="http://star-api.herokuapp.com/api/v1/";
var azul='min[colorb_v]=-1&max[colorb_v]=0';
var vermelho='min[colorb_v]=0&max[colorb_v]=1';
var fracas="min[absmag]=10&max[absmag]=-3";
var fortes="min[appmag]=-2.5&max[appmag]=6.5";
var cemAnos="max[distly]=100";	
var quinhentosAnos = "max[distly]=500";

function selectCategoria(i){
	if (i != "selecionar"){
		console.log(i);
		$("#pesquisa").show();
		$("#botaoPesquisa").show();
	}
}

function selectFilter(i){
	switch(i){
		case "stars":
			$("#botaoPesquisa").click(function(){
				var cor = $("#cor").val();
				var distancia = $("#distancia").val();
				var brilho = $("#brilho").val();
				requisi(i, cor, distancia, brilho);
			});
		break;
	}
}

function requisi(i, cor, distancia, brilho){
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