var http="http://star-api.herokuapp.com/api/v1/";
var cabecalho={
 listaestrelas:'<table class="table table-striped table-bordered" border="1"><tr><th>Id</th><th>Nome</th><th>Cor</th></tr>',
 listaexo: '<table class="table table-striped table-bordered" border="1"><tr><th>Id</th><th>Nome</th><th>Numplanets</th></tr>'
}

$(document).ready(function(){
	$("#selecionar").change(function(){
		conteudo = recebeConteudo();

		if (conteudo == "selecionar"){
			esconde(['#pesquisa','.radio','#botaoPesquisa','.conteudoTodos']);
		}

		else mostra(['.radio']);
	});

	$("#porNome").click(function(){
		conteudo = recebeConteudo();
		selectCategoria(conteudo);
		limpaSelect();
		esconde(['.conteudoTodos']);

		$("#selecionar").change(function(){
			conteudo = recebeConteudo();
			selectCategoria(conteudo);
		});
	});

	$("#todos").click(function(){
		conteudo = recebeConteudo();
		limpaSelect();
		esconde(['#pesquisa','#conteudo']);
		mostra(['#botaoPesquisa']);
		
		if (conteudo == "stars"){
			mostra([".estrelasTodos",".conteudoTodos"]);
			esconde([".exoplanetas",".open_cluster"]);
		}
		else if (conteudo == "exo_planets"){
			mostra(['.exoplanetas','.conteudoTodos']);
			esconde(['.estrelasTodos','.open_cluster']);
		}
		else if (conteudo == "open_cluster"){
			mostra(['.open_cluster','.conteudoTodos']);
			esconde(['.exoplanetas','.estrelasTodos']);
		}
	});

	$('#botaoPesquisa').click(function(){
		var i = $("#selecionar").val();
		var j = $("#pesquisa").val();
		if (j != ""){
			request(http+i+"/"+j);
		}

		else if (j == ""){
			if (i == "stars"){
				var cor = $("#cor").val();
				var distancia = $("#distancia").val();
				var brilho = $("#brilho").val();
				testeUrlEstrelas(i, cor, distancia, brilho);
			}

			else if (i == "exo_planets"){
				var numplanets = $("#numplanetas").val();
				var distancia = $("#distance").val();
				testeUrlExoplanets(i, numplanets, distancia);
			}

			else if (i == "open_cluster"){
				var diametro = $("#diametroOp").val();
				var distanciaOp = $("#distanciaOp").val();
				testeUrlOp(i, diametro, distanciaOp);
			}
		}
	});
});

function recebeConteudo(){
	var conteudo;
	var i = $("#selecionar").val();
	
	conteudo = [i];

	return conteudo;
}


function selectCategoria(i){
	if (i != "selecionar"){
		$("#pesquisa").show();
		$("#botaoPesquisa").show();
	}
}

function splitValue(parametro){
	var letraMaiscula = parametro.indexOf("A");
	var posicaoTotal = parametro.length;
	var posicaoMinima = parametro.substring(0,letraMaiscula);
	var posicaoMaxima = parametro.substring(letraMaiscula+1,posicaoTotal);
	return {"min":posicaoMinima, "max":posicaoMaxima};
}

function testeValor(distancia, cor, brilho, distanciaOp, diametro){
	var data;
	if (distancia != ""){
		var distancia = splitValue(distancia);
		data = [distancia]
	}
	else if (cor != "" || brilho != ""){
		var cor = splitValue(cor);
		var brilho = splitValue(brilho);
		data = [cor, brilho]
		console.log (data);
	}
	else if (distanciaOp != "" || diametro != ""){
		var distanciaOp = splitValue(distanciaOp);
		var diametro = splitValue(diametro);
		data = [distanciaOp, diametro]
	}
	return data;
}

function testeUrlEstrelas(i, cor, distancia, brilho){
	data = testeValor('', cor, brilho, '', '');
	if (data[0].min == "" && data[0].max == "cor"){
		corUrl = "undefined";
	}

	else if (data[0].min != "" && data[0].max != "cor") {
		var corUrl = "min[colorb_v]="+data[0].min+"&max[colorb_v]="+data[0].max;
	}

	if (data[1].min == "" && data[1].max == "brilho"){
		brilhoUrl = "undefined";
	}
	else if (data[1].min != "" && data[1].max != "brilho"){
		var brilhoUrl = "min[absmag]="+data[1].min+"&max[absmag]="+data[1].max;
	}

	if (distancia == ""){
		anosUrl = "undefined";
	}
	else if (distancia != ""){
		var anosUrl = "max[distly]="+distancia;
	}
	
	request(http+i+"?"+brilhoUrl+"&"+anosUrl+"&"+corUrl);
}

function testeUrlOp(i, diametro, distanciaOp){
	data = testeValor('','', '', distanciaOp, diametro);

	if (data[1].min == "") {
		var diamUrl = "min[diam]="+data[1].max;
	}

	else if (data[1].min != ""){
		var diamUrl = "min[diam]="+data[1].min+"&max[diam]="+data[1].max;
	}

	if (data[0].min == ""){
		var distUrl = "min[distly]="+data[0].max;
	}
	else if(data[0].min!= ""){
		var distUrl = "min[distly]="+data[0].min+"&max[distly]="+data[0].max;
	}
	request(http+i+"?"+diamUrl+"&"+distUrl);
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

	data = testeValor(distancia, '', '', '', '');
	if (data[0] == ""){
		var distUrl = "min[distance]="+data[1];
	}
	else if(data[0] != ""){
		var distUrl = "min[distance]="+data[0]+"&max[distance]="+data[1];
	}
	request(http+i+"?"+numUrl+"&"+distUrl);
}



function request(url){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function (){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var myArr = JSON.parse(xmlhttp.responseText);
			tabela(myArr);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function tabela(myArr){
	var result = "";
	conteudo = recebeConteudo();
	if (conteudo == "stars"){
		result+= cabecalho.listaestrelas; 
		result += '<tr><td>'+ myArr.id + '</td>';
		result += '<td>'+ myArr.label + '</td>';
		result += '<td>'+ myArr.colorb_v + '</td></tr>'
	}
	else if (conteudo == "exo_planets"){
		result+= cabecalho.listaexo;
		result += '<tr><td>'+ myArr.id + '</td>';
		result += '<td>'+ myArr.label + '</td>';
		result += '<td>'+ myArr.numplanets + '</td></tr>'
	}
	$("#conteudo").show();

	document.getElementById("conteudo").innerHTML = result;		
}


function esconde (array){
	for (var x=0; x<array.length; x++){
		$(array[x]).hide();
	}
}

function mostra (array){
	for (var x=0; x<array.length; x++){
		$(array[x]).show();
	}
}

function limpaSelect(){
	$("#cor").val("cor");
	$("#brilho").val("brilho");
	$("#distancia").val("distancia");
	$("#numplanetas").val("numplanetas");
	$("#distance").val("distancia");
	$("#diametroOp").val("diametroOp");
	$("#distanciaOp").val("distanciaOp");
	$("#pesquisa").val('');
}