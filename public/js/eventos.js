function ativar_evento(acao) {
	var player = ".personagem[rel='"+acao[2]+"']";
	var enemy = ".personagem[rel='"+(acao[2] == 0 ? 1 : 0)+"']";
	var evento = ordem_eventos[acao[3][4]];
	if(evento == "orly"){
		sound("toasty");
		$("#luta").append('<div class="objeto"></div>');
		var orly = $("#luta .objeto:last");
		$(orly).css({
			background: "url(img/eventos/orly"+(acao[2] == 0 ? "" : "_mirror")+".png)",
			marginTop: "255px",
			marginLeft: (acao[2] == 0 ? 600 : 100) + "px",
			width: "79px",
			height: "71px"
		}).animate({
			marginTop: "184px"
		}).delay(500).animate({
			marginTop: "255px"
		}, function(){
			$(this).remove()
		});
	}
}