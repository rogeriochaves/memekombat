function usar_arma(acao) {
	var s = undefined;
	var arma = ".arma[rel='"+acao[2]+"']";
	var player = ".personagem[rel='"+acao[2]+"']";
	var enemy = ".personagem[rel='"+(acao[2] == 0 ? 1 : 0)+"']";
	var enemy_arma = ".arma[rel='"+(acao[2] == 0 ? 1 : 0)+"']";
	s = armas[$(arma).attr("sprite")]['sound'];
	s = s != undefined ? s.split(",")[0] : undefined;
	sprite = $(arma).attr("sprite");
	
	if(sprite == "catapulta"){
		var pedra = $('<div>').addClass('objeto');
		$("#luta").append(pedra);
		$(pedra).css({
			background: "url(img/armas/pedra.gif)",
			marginTop: "-30px",
			marginLeft: get_pos(arma)[0] + (acao[2] == 0 ? 6 : 46) + "px",
			width: "30px",
			height: "30px"
		}).animate({
			marginTop: get_pos(arma)[1] + 30 + "px"
		}, 500, function(){
			sound('catapulta');
			var distancia_total = Math.abs((get_pos(enemy)[0] + (acao[2] == 0 ? 10 : 30)) - get_pos(pedra)[0]);
			for(i = 0; i < parseInt(distancia_total / 10); i++){
				setTimeout(function(){
					var distancia = Math.abs((get_pos(enemy)[0] + (acao[2] == 0 ? 10 : 30)) - get_pos(pedra)[0]);
					var subir = parseInt((distancia - distancia_total / 2) / 20);
					$(pedra).css({
						marginLeft: (acao[2] == 0 ? "+=10px" : "-=10px"),
						marginTop: (subir > 0 ? "-" : "+") + "=" + Math.abs(subir) + "px"
					});
				}, i * 25);
			}
			setTimeout(function(){
				$(pedra).animate({
					marginLeft: acao[2] == 0 ? "-=30px" : "+=30px",
					marginTop: "+=25px"
				}, 300).animate({
					opacity:0
				});
				if(acao[4]){
					if(acao[4][1] == 2){
						$(enemy + "," + enemy_arma).animate({
							marginTop: "-=20px",
							marginLeft: acao[2] == 0 ? "+=30px" : "-=30px"
						}, 50).animate({
							marginTop: "+=20px",
							marginLeft: acao[2] == 0 ? "+=30px" : "-=30px"
						}, 50);
						mudar_posicao(enemy + "," + enemy_arma, "esquivando");
						dar_dano(acao, "esquiva");
					}else if(acao[4][1] == 3){
						mudar_posicao(enemy + "," + enemy_arma, "defendendo");
						dar_dano(acao, "defesa");
					}else{
						mudar_posicao(enemy + "," + enemy_arma, "tomando");
						dar_dano(acao, s);
					}
				}else{
					mudar_posicao(enemy + "," + enemy_arma, "tomando");
					dar_dano(acao, s);
				}
				
				setTimeout(function(){
					mudar_posicao(enemy + "," + enemy_arma, "parado");
				}, 300);
			}, 25 * parseInt(distancia_total / 10) + 50);
		});
		setTimeout(function(){
			mudar_posicao(arma, "batendo");
			setTimeout(function(){
				mudar_posicao(arma, "parado");
			}, 400);
		}, 500);
		
	}else{
		mover(acao[3]);
		dar_dano(acao, s)
	}
}