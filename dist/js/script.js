var http="http://star-api.herokuapp.com/api/v1/";


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

function testeUrlOp(i, diametro, distanciaOp){
	data = testeValor(0, 0, 0, distanciaOp, diametro);

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
		console.log(data);
	}
	else if (distanciaOp != "" || diametro != ""){
		var distanciaOp = splitValue(distanciaOp);
		var diametro = splitValue(diametro);
		data = [distanciaOp, diametro]
	}
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

	data = testeValor(distancia, 0, 0, 0, 0);
	if (data[0] == ""){
		var distUrl = "min[distance]="+data[1];
	}
	else if(data[0] != ""){
		var distUrl = "min[distance]="+data[0]+"&max[distance]="+data[1];
	}
	request(http+i+"?"+numUrl+"&"+distUrl);
}

function testeUrlEstrelas(i, cor, distancia, brilho){
	data = testeValor(0, cor, brilho, 0, 0);

	var corUrl = "min[colorb_v]="+data[0].min+"&max[colorb_v]="+data[0].max;

	var anosUrl = "max[distly]="+distancia;

	var brilhoUrl = "min%5Babsmag%5D="+data[1].min+"&max%5Babsmag%5D="+data[1].max;
	
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