
$(document).ready(function(){
	var i = $("#selecionar").val();

	$("#selecionar").change(function(){
		var i = $("#selecionar").val();
	});

	$("#porNome").click(function(){
		$("#pesquisa").show();
	});
});

var http='http://star-api.herokuapp.com/api/v1/';

function selectCategoria(i){
	if (i != "selecionar"){
		selectFilter(i);
	}
	else {
		$("#pesquisa").hide();
	}
}

function selectFilter(i){
		switch (i){
			case "stars":
				estrelas(i);
				break;

			case "exo_planets":
				exoplanetas(i);
				break;

			case "local_groups":
				galaxias(i);
				break;

			case "open_cluster":
				open(i);
				break;
		}
}

function estrelas(i){

	$('#botaoPesquisa').click(function(){
		var j = $("#pesquisa").val();
		request(http+i+"/"+j);
	});
}

function exoplanetas(i){
	$('#botaoPesquisa').click(function(){
		var j = $("#pesquisa").val();
		request(http+i+"/"+j);
	});
}

function exoplanetas(i){
	$('#botaoPesquisa').click(function(){
		var j = $("#pesquisa").val();
		request(http+i+"/"+j);
	});
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
