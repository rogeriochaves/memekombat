function andar(p, aproximar, callback){
	var player = $('.personagem[rel="'+p+'"]');
	var enemy = $('.personagem[rel="'+(p == 0 ? 1 : 0)+'"]');
	var arma = $('.arma[rel="'+p+'"]');
	
	var sprite_player = get_sprite(player);
	var sprite_enemy = get_sprite(enemy);
	var nao_mover = false;
	if(arma.length > 0){
		var sprite_arma = get_sprite(arma);
		nao_mover = sprite_arma['distancia'] == true;
	}
	
	x_player = parseInt($(player).css('margin-left').split("px")[0]);
	x_enemy = parseInt($(enemy).css('margin-left').split("px")[0]);
	y_player = parseInt($(player).css('margin-top').split("px")[0]);
	y_enemy = parseInt($(enemy).css('margin-top').split("px")[0]);
	
	if(aproximar){
		x = x_enemy + (p == 0 ? 0 - (sprite_player['size'][0] / 2) : sprite_enemy['size'][0] / 2);
		y = y_enemy;
	}else{
		inverter(player);
		if(!nao_mover && arma.length > 0) inverter(arma);
		rand_x = parseInt((Math.random() * 30) * (parseInt(Math.random() * 2) == 1 ? 1 : -1))
		x = (p == 0 ? init_x_p1 : init_x_p2) + rand_x;
		x = p == 0 ? (x < init_x_p1 ? init_x_p1 : x) : (x > init_x_p2 ? init_x_p2 : x);
		y = parseInt(y_player + (Math.random() * 30) * (parseInt(Math.random() * 2) == 1 ? 1 : -1))
	}
	y = y > 140 ? 140 : y < 70 ? 70 : y;
	distancia = x_player - x;
	
	if(aproximar){
		mover_ate(player, x, y, callback);
		if(arma.length > 0 && !nao_mover){
			mover_ate(arma, x, y, callback);
		}
	}else{
		mover_ate(player, x, y, function(){
			inverter(player);
		});
		if(arma.length > 0 && !nao_mover){
			mover_ate(arma, x, y, function(){
				inverter(arma);
			});
		}
	}
}

function mover(movimento){
	tipo = movimento[1];
	
	var player = $('.personagem[rel="'+movimento[0]+'"]');
	var enemy = $('.personagem[rel="'+(movimento[0] == 0 ? 1 : 0)+'"]');
	arma = $('.arma[rel="'+movimento[0]+'"]');
	
	sprite_player = get_sprite(player);
	sprite_enemy = get_sprite(enemy);
	if(arma.length > 0) sprite_arma = get_sprite(arma);
	
	if((tipo == 0 || tipo == 1) && arma.length > 0){
		movimentar(player, sprite_arma['tipo'] > 0 ? ("arma" + sprite_arma['tipo']) : "soco1");
		movimentar(arma, "batendo");
		if($(arma).attr("sprite") == "faca"){
			$(arma).css({marginLeft: movimento[0] == 0 ? "+=13px" : "-=13px"});
			setTimeout(function(){
				$(arma).css({marginLeft: movimento[0] == 0 ? "-=13px" : "+=13px"})
			}, 200);
		}
	}else if(tipo == 0 || tipo == 1){ // Ataque Normal
		movimentar(player, "soco1");
	}
}

function inverter(elem){
	$(elem).toggleClass("mirror");
	
	set_sprite(elem);
}

function mover_ate(elem, x, y, callback){
	jogador2 = $(elem).attr("rel") == "1";
	margin = parseInt($(elem).css("margin-left").split("px")[0]);
	movimento = (margin > x ? "-=" + (margin - x) : "+=" + (x - margin)) + "px";
	mudar_posicao(elem, "correndo");

	$(elem).animate({
		marginLeft: movimento,
		marginTop: y
	}, tempo_corrida, callback);
	
}

function mudar_posicao(elem, st){
	if($(elem).length <= 0) return false;
	var sprite = get_sprite(elem);
	
	var status = sprite[st];
	if(st != $(elem).attr("status")){
		$(elem).attr('pos', 0);
		$(elem).attr('status', st);
		var pos = 0;
	}else{
		var pos = $(elem).attr('pos');
	}
	var width = status.length == 5 ? status[3] : status.length == 6 ? status[4] : sprite['size'][0];
	var height = status.length == 5 ? status[4] : status.length == 6 ? status[5] : sprite['size'][1];
	var spacing = sprite['spacing'];
	var x = (status[0] + (width + spacing) * pos) * -1;
	var y = (status[1] * -1);
	if($(elem).hasClass("mirror")){
		x = (sprite['width'] - status[0] - width - ((width + spacing) * pos)) * -1;
	}
	$(elem).css({
		backgroundPosition: x + "px " + y + "px"
	});
	
}

function movimentar(elem, st, callback){
	var sprite = get_sprite(elem);
	var status = sprite[st];
	var speed = (status.length == 4 || status.length == 6) ? status[3] : sprite['speed'];
	mudar_posicao(elem, st);
	if(callback != undefined) setTimeout(callback, (speed * status[2]));
}

function mostrar_dano(jogador, qtd, defesa, s, critical){
	var player = $(".personagem[rel='"+jogador+"']");
	var marginLeft = parseInt($(player).css("margin-left").split("px")[0]);
	var marginTop = parseInt($(player).css("margin-top").split("px")[0]);
	var critical = critical == undefined ? false : critical;
	
	if (critical) {
		$("#luta").append('<div class="dano"><small>'+(lingua.indexOf("pt") < 0 ? "Critical" : "Crítico")+'</small><br />'+qtd+'</div>');
	}else{
		$("#luta").append('<div class="dano">'+qtd+'</div>');
	}
	var dano = $("#luta .dano:last");
	$(dano).css({
		marginLeft: marginLeft + 30,
		marginTop: marginTop
	}).animate({
		marginTop: "-=20px",
		marginLeft: jogador == 0 ? "-=30px" : "+=30px",
		opacity: 0.5
	}, 500).animate({
		marginLeft: jogador == 0 ? "-=5px" : "+=5px",
		opacity: 0.4
	}, 50).animate({
		marginTop: "+=30px",
		marginLeft: jogador == 0 ? "-=20px" : "+=20px",
		opacity: 0
	}, 500, function(){
		$(dano).remove();
	});
	if(s != undefined && s != null){
		sound(s);
	}else if(defesa != undefined && defesa){
		sound("defesa");
	}else if(qtd > 0){
		sound("hit");
	}else{
		sound("esquiva");
	}
	
	if(!isNaN(qtd)){
		players[jogador]['hp'] -= qtd
		var p = players[jogador];
		var prct = p['hp'] / p['hp_max'] * 100;
		var width = parseInt(258 * prct / 100);
		width = isNaN(width) ? 0 : width < 0 ? 0 : width;
		$('.hp[rel="'+jogador+'"] .bar').css({
			width: width + "px"
		});
		if(jogador == 1){
			$('.hp[rel="1"] .bar').css({
				marginLeft: 258 - width + 22 + "px",
				backgroundPosition: "-" + (258 - width) + "px 0" 
			});
		}
	}
	/*setTimeout(function(){
		if (players[jogador]['hp'] <= 0) {
			mudar_posicao(".personagem[rel='"+jogador+"']", "caido");
		}
	}, 400);*/
	
}

acao_atual = 0;
finalizou = false;
setTimeout(function(){
	setInterval(function(){
		$('.personagem').each(function() {
			sprite = sprites[$(this).attr('sprite')];
			sprite = sprite['default'] == true ? sprites['default'] : sprite;

			var status = sprite[$(this).attr("status")];
			var speed = (status.length == 4 || status.length == 6) ? status[3] : sprite['speed'];

			if(parseInt($(this).attr("frame")) >= speed){
				var pos = $(this).attr("pos") >= status[2] - 1 ? 0 : parseInt($(this).attr("pos")) + 1;
				$(this).attr('pos', pos);
				$(this).attr("frame", "0");

				mudar_posicao(this, $(this).attr('status'));

			}else{
				$(this).attr("frame", parseInt($(this).attr("frame")) + fps);
			}
		});

		$('.arma').each(function() {
			arma = armas[$(this).attr('sprite')];
			arma = arma['default'] == true ? armas['default'] : arma;

			var status = arma[$(this).attr("status")];
			if (status){
				var speed = (status.length == 4 || status.length == 6) ? status[3] : sprite['speed'];

				if(parseInt($(this).attr("frame")) >= speed){
					var pos = $(this).attr("pos") >= status[2] - 1 ? 0 : parseInt($(this).attr("pos")) + 1;
					$(this).attr('pos', pos);
					$(this).attr("frame", "0");

					mudar_posicao(this, $(this).attr('status'));

				}else{
					$(this).attr("frame", parseInt($(this).attr("frame")) + fps);
				}
			}
		});
		
		if(!finalizou){
			for(i = acao_atual; i < acoes.length; i++){
				acao = acoes[i];
				if(acao[0] <= frame_atual){
					var player = $(".personagem[rel='"+acao[2]+"']");
					var arma = $(".arma[rel='"+acao[2]+"']");
					if(acao[1] == "parar"){
						mudar_posicao(player, "parado");
						if(arma.length > 0) mudar_posicao(arma, "parado");
					}else if(acao[1] == "aproximar"){
						andar(acao[2], true);
					}else if(acao[1] == "afastar"){
						andar(acao[2], false);
					}else if(acao[1] == "atacar" || acao[1] == "contra-atacar"){
						if($(arma).length > 0){
							usar_arma(acao);
						}else{
							mover(acao[3]);
							dar_dano(acao);
						}
					}else if(acao[1] == "pegar equipamento"){
						var player = $(".personagem[rel='"+acao[2]+"']");
						mudar_posicao(player, "pegando_arma");
						$("#luta").append('<div class="arma '+(acao[2] == 0 ? "" : "mirror")+'" sprite="'+equipamentos[acao[3][2]]+'" status="pegando" frame="'+$(player).attr("frame")+'" pos="'+$(player).attr("pos")+'" rel="'+acao[2]+'"></div>');
						var arma = $(".arma[rel='"+acao[2]+"']");
						var x_plus = 0;
						var y_plus = 0;
						set_sprite(arma);
						var sprite = get_sprite(arma);
						if(sprite['x_plus'] != undefined) x_plus = sprite['x_plus'];
						if(sprite['y_plus'] != undefined) y_plus = sprite['y_plus'];
						var pos = get_pos(player);
						$(arma).css({
							marginTop: "-80px",
							marginLeft: pos[0] + x_plus * (acao[2] == 0 ? 1 : -1)
						});
						$(arma).animate({
							marginTop: pos[1] + y_plus
						}, 500);
					}else if(acao[1] == "jogar equipamento fora"){
						var arma = $(".arma[rel='"+acao[2]+"']");
						nao_mover = get_sprite(arma)['distancia'] == true;
						if(!nao_mover){
							mudar_posicao(arma, "soltando");
							setTimeout(function(){
								mudar_posicao(arma, "caido");
							}, 100);
							var marginLeft = acao[2] == 0 ? "-=80px" : "+=80px";
							var marginLeft2 = acao[2] == 0 ? "-=30px" : "+=30px";
							$(arma).attr("rel", "");
							$(arma).animate({
								marginLeft: marginLeft,
								marginTop: "-=30px"
							}, 300).animate({
								marginLeft: marginLeft2,
								marginTop: "+=60px"
							}, 300).delay(500).animate({opacity:0}, 500, function(){
								$(this).remove();
							});
						}else{
							$(arma).attr("rel", "");
							$(arma).animate({
								opacity:0
							}, 500, function(){
								$(this).remove();
							});
						}
					}else if(acao[1] == "tomar"){
						mudar_posicao(player, "tomando");
						if(arma.length > 0) mudar_posicao(arma, "tomando");
					}else if(acao[1] == "defender"){
						mudar_posicao(player, "defendendo");
						if(arma.length > 0) mudar_posicao(arma, "defendendo");
					}else if(acao[1] == "esquivar"){
						$(player).animate({
							marginTop: "-=20px",
							marginLeft: acao[2] == 0 ? "-=30px" : "+=30px"
						}, 50).animate({
							marginTop: "+=20px",
							marginLeft: acao[2] == 0 ? "-=30px" : "+=30px"
						}, 50);
						if(arma.length > 0){
							$(arma).animate({
								marginTop: "-=20px",
								marginLeft: acao[2] == 0 ? "-=30px" : "+=30px"
							}, 50).animate({
								marginTop: "+=20px",
								marginLeft: acao[2] == 0 ? "-=30px" : "+=30px"
							}, 50);
							mudar_posicao(arma, "esquivando");
						}
						mudar_posicao(player, "esquivando");
					}else if(acao[1] == "habilidade"){
						habilidade(acao);
					}else if(acao[1] == "evento"){
						ativar_evento(acao);
					}else if(acao[1] == "acabar luta"){
						var ganhador = ".personagem[rel='0']";
						var perdedor = ".personagem[rel='1']";
						var ganhador_arma = ".arma[rel='0']";
						var perdedor_arma = ".arma[rel='1']";
						if (players[0]['hp'] < players[1]['hp']) {
							ganhador = ".personagem[rel='1'],.arma[rel='1']";
							perdedor = ".personagem[rel='0'],.arma[rel='0']";
							ganhador_arma = ".arma[rel='1']";
							perdedor_arma = ".arma[rel='0']";
						}
						setTimeout(function(){
							$('.venceu').fadeIn();
						}, 500);
						mudar_posicao(perdedor + "," + perdedor_arma, "caido");
						mudar_posicao(ganhador, "ganhando");
						$(perdedor_arma).css({marginTop: "+=40px"});
					}
					acao_atual = i + 1;
				}
				if(acao_atual >= acoes.length) finalizou = true;
			}
		}
		frame_atual += 25;
	}, fps);
}, 1000);