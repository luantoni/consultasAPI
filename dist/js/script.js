var http="http://star-api.herokuapp.com/api/v1/";
var cabecalho={
 listaestrelas:'<table class="table table-bordered" border="1"><tr><th>Id</th><th>Nome</th><th>Cor</th></th><th>Luminosidade</th></th><th>Distância</th></tr>',
 listaexo: '<table class="table table-bordered" border="1"><tr><th>Id</th><th>Nome</th><th>Número Planetas</th><th>Distância</th></tr>',
 listaopen: '<table class="table table-bordered" border="1"><tr><th>Id</th><th>Nome</th><th>Diâmetro</th><th>Distância</th></tr>',
 listatodos: '<table class="table table-bordered" border="1"><tr><th>Id</th><th>Nome</th></tr>'
}

$(document).ready(function(){

	$("#selecionar").change(function(){
		conteudo = recebeConteudo();
		if (conteudo == "selecionar"){
			$('.conteudo').css('backgroundImage','url(constelacao.jpg)');
			esconde(['#pesquisa','.radio','#botaoPesquisa','.conteudoTodos']);
		}
		else {
			$("#pesquisa").val('');
			esconde(['#conteudo']);
			mostra(['.radio']);
			if ($("#todos").is(':checked')){
				teste();
			}
			if (conteudo == "stars"){
				$('.conteudo').css('backgroundImage','url(estrelas.jpg)');
			}
			else if (conteudo == "exo_planets"){
				$('.conteudo').css('backgroundImage','url(exoplanet.jpg)');
				//mostraExo();
			}
			else if (conteudo == "open_cluster"){
				$('.conteudo').css('backgroundImage','url(openstar.jpg)');
				//mostraOpen();
			}
		}
	});

	$("#porNome").click(function(){
		conteudo = recebeConteudo();
		limpaSelect();
		esconde(['.conteudoTodos']);

		$("#selecionar").change(function(){
			conteudo = recebeConteudo();
		});
		selectCategoria(conteudo);
	});

	$("#todos").click(function(){
		limpaSelect();
		esconde(['#pesquisa','#conteudo']);
		mostra(['#botaoPesquisa']);
		teste();
	});

	$('#botaoPesquisa').click(function(){
		conteudo = recebeConteudo();
		var j = $("#pesquisa").val();

		if (j == ""){
			if (conteudo == "stars"){
				var cor = $("#cor").val();
				var distancia = $("#distancia").val();
				var brilho = $("#brilho").val();
				testeUrlEstrelas(conteudo, cor, distancia, brilho);
			}

			else if (conteudo == "exo_planets"){
				var numplanets = $("#numplanetas").val();
				var distancia = $("#distance").val();
				testeUrlExoplanets(conteudo, numplanets, distancia);
			}

			else if (conteudo == "open_cluster"){
				var diametro = $("#diametroOp").val();
				var distanciaOp = $("#distanciaOp").val();
				testeUrlOp(conteudo, diametro, distanciaOp);
			}
		}

		else {porNome();}
	});
});

function teste(){
	conteudo = recebeConteudo();
	if (conteudo == "stars") mostraEstrela();
	else if (conteudo == "open_cluster") mostraOpen();
	else if (conteudo == "exo_planets") mostraExo();
}
function porNome(){
	conteudo = recebeConteudo();
	var j = $("#pesquisa").val();
	var nbsp = j.replace('%20',' ');
	if (j != ""){
		request(http+conteudo+"/"+j);
	}
}

function recebeConteudo(){
	var conteudo;
	var i = $("#selecionar").val();
	
	conteudo = [i];

	return conteudo;
}


function selectCategoria(conteudo){
	if (conteudo != "selecionar"){
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
	var distUrl;
	var diamUrl;
	data = testeValor('','', '', distanciaOp, diametro);

	if (data[0].min == ""){
		if (data[0].max == "distanciaOp") distUrl = "undefined";
		else if (data[0].max == "60001") distUrl = "min[distly]="+data[0].max;
	}

	else if(data[0].min!= "" && data[0].max != "" ){
		distUrl = "min[distly]="+data[0].min+"&max[distly]="+data[0].max;
	}

	if (data[1].min == ""){
		if (data[1].max == "diametroOp") diamUrl = "undefined";
		else if (data[1].max == "100") diamUrl = "min[diam]="+data[1].max;
	}

	else if (data[1].min != "" && data[1].max != "" ){
		 diamUrl = "min[diam]="+data[1].min+"&max[diam]="+data[1].max;
	}
	request(http+i+"?"+diamUrl+"&"+distUrl);
}


function testeUrlExoplanets(i, numplanets, distancia){
	var distUrl;
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
		console.log(data[0].min);
		console.log(data[0].max);
	if (data[0].min == ""){
		if (data[0].max == "1001")distUrl = "min[distance]="+data[0].max;
		else if (data[0].max == "distancia") distUrl = "undefined"; 
	}

	else if(data[0].min != "") distUrl = "min[distance]="+data[0].min+"&max[distance]="+data[0].max;

	request(http+i+"?"+numUrl+"&"+distUrl);
}


function request(url){
	$.getJSON(url, function (myArr){
	conteudo = recebeConteudo();
	var j = $("#pesquisa").val();
	var result = "";
		/*var oi = Object.keys(myArr.lum).length;
		console.log(oi);'*/
	if (j != ""){
		if (conteudo == "stars"){
			result+= cabecalho.listaestrelas; 
			result += '<tr><td>'+ myArr.id + '</td>';
			result += '<td>'+ myArr.label + '</td>';
			result += '<td>'+ myArr.colorb_v + '</td>';
			result += '<td>'+ myArr.lum + '</td>';
			result += '<td>'+ myArr.distly + '</td></tr>';
		}

		else if (conteudo == "exo_planets"){
			result+= cabecalho.listaexo;
			result += '<tr><td>'+ myArr.id + '</td>';
			result += '<td>'+ myArr.label + '</td>';
			result += '<td>'+ myArr.numplanets + '</td>';
			result += '<td>'+ myArr.distance + '</td></tr>'
		}

		else if (conteudo == "open_cluster"){
			result+= cabecalho.listaopen;
			result += '<tr><td>'+ myArr.id + '</td>';
			result += '<td>'+ myArr.label + '</td>';
			result += '<td>'+ myArr.diam + '</td>';
			result += '<td>'+ myArr.distly + '</td></tr>';
		}
	}
	else{
		result+= cabecalho.listatodos;
		for (i=0; i < 10; i++){
			result += '<tr><td>'+ myArr[i].id + '</td>';
			result += '<td>'+ myArr[i].label + '</td>';
		}
	}
	$("#conteudo").show();
	$('#conteudo').html(result);	
	})
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

function mostraEstrela(){
	mostra([".estrelasTodos",".conteudoTodos"]);
	esconde([".exoplanetas",".open_cluster"]);
}

function mostraExo(){
	mostra(['.exoplanetas','.conteudoTodos']);
	esconde(['.estrelasTodos','.open_cluster']);
}

function mostraOpen(){
	mostra(['.open_cluster','.conteudoTodos']);
	esconde(['.exoplanetas','.estrelasTodos']);
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