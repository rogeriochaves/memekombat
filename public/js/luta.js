function get_pos(elem){
	return [parseInt($(elem).css('margin-left').split("px")[0]), parseInt($(elem).css('margin-top').split("px")[0])];
}

function get_sprite(elem){
	var spts = $(elem).hasClass("personagem") ? sprites : armas;
	var sprite = spts[$(elem).attr('sprite')];
	if(!sprite){
		return $(elem).hasClass("personagem") ? sprites['default'] : armas['default'];
	}
	sprite = sprite['default'] == true ? spts['default'] : sprite;
	return sprite;
}

function get_mirror(img){
	return img.split(".")[0] + "_mirror." + img.split(".")[1]
}

function get_sprite_img(elem){
	var spts = $(elem).hasClass("personagem") ? sprites : armas;
	var sprite = spts[$(elem).attr('sprite')];
	return sprite;
}

function set_sprite(elem){
	var tipo = $(elem).hasClass("personagem") ? 0 : 1;
	if(tipo == 0){
		sprite = sprites[$(elem).attr('sprite')];
		sprite_img = sprites[$(elem).attr('sprite')];
		sprite = sprite['default'] == true ? sprites['default'] : sprite;
	}else if(tipo == 1){
		sprite = armas[$(elem).attr('sprite')];
		sprite_img = armas[$(elem).attr('sprite')];
		sprite = sprite['default'] == true ? sprites['default'] : sprite;
	}

	mirror = $(elem).hasClass("mirror");
	img = mirror ? sprite_img['image'].split(".")[0] + "_mirror." + sprite_img['image'].split(".")[1] : sprite_img['image'];
	$(elem).css({
		backgroundImage: 'url('+cdn+'img/'+(tipo == 0 ? "personagens" : "armas")+'/'+img+')',
		backgroundPosition: (mirror ? ((sprite['width'] - sprite['size'][0]) * -1) + "px 0px" : "0px 0px"),
		width: sprite['size'][0],
		height: sprite['size'][1]
	});
}

function dar_dano(acao, s){
	if(acao.length > 3){
		if(acao[3][6] == 1){
			dano = acao[3][5] > 0 ? acao[3][5] : miss;
			mostrar_dano((acao[2] == 0 ? 1 : 0), dano, false, s, true);
		}else{
			dano = acao[3][5] > 0 ? acao[3][5] : (acao[4] && acao[4][1]) == 3 ? block : miss;
			mostrar_dano((acao[2] == 0 ? 1 : 0), dano, (acao[3][5] > 0 ? false : (acao[4] && acao[4][1] == 3)), s);
		}
	}else{
		dano = acao[3][5] > 0 ? acao[3][5] : miss;
		mostrar_dano((acao[2] == 0 ? 1 : 0), dano, false, s);
	}
}

acoes = []; // [delay, acao, jogador, movimento, prox_movimento]
delay = 0;
perto = false;
frame_atual = 0;

function parar_luta(){
	delay = 0;
	perto = false;
	acoes = [];
	frame_atual = 0;
	acao_atual = 0;
	arma_atual = [];
	finalizou = false;
}

function iniciar(){
	p1 = '.personagem[rel="0"]';
	p2 = '.personagem[rel="1"]';
	players[0]['hp'] = players[0]['hp_max'];
	players[1]['hp'] = players[1]['hp_max'];
	$(p1).css('margin','120px 0 0 '+init_x_p1+'px');
	$(p1).removeClass("mirror");
	$(p2).css('margin','120px 0 0 '+init_x_p2+'px');
	$(p2).addClass("mirror");
	$(p1 + ", " + p2).attr({
		frame: 0,
		pos: 0,
		status: "parado"
	});
	$('.hp.player .bar').animate({
		width: "257px"
	});
	$('.hp.enemy .bar').animate({
		width: "258px",
		marginLeft: "22px",
		backgroundPosition: "0 0"
	});

	$('.personagem').each(function() {
		$(this).stop();

		set_sprite(this);
	});
	$('.arma').remove();
	$('.objeto').remove();

	delay = 0;
	perto = false;
	//arma = false;
	acoes = [];
	frame_atual = 0;
	acao_atual = 0;
	arma_atual = [];
	finalizou = false;

	for(i = 0; i <= movimentos.length; i++){

		if (i == movimentos.length) {
			acoes.push([delay, "acabar luta"]);
			continue;
		}

		var movimento = movimentos[i];
		if(movimento[1] == 2 || movimento[1] == 3 || (movimento[1] == 7 && eventos[ordem_eventos[movimento[4]]]['antes'] == true)) continue;
		var prox_movimento = undefined;
		if(i + 1 < movimentos.length) prox_movimento = movimentos[i + 1];
		var distancia = false;
		var programado = false;
		var delay_arma = 0;
		if((movimento[1] == 0 || movimento[1] == 1) && arma_atual[movimento[0]] != undefined){
			var sprite_arma = armas[equipamentos[arma_atual[movimento[0]]]];
			if(sprite_arma['default'] != true){
				distancia = sprite_arma['distancia'];
				programado = sprite_arma['programado'] == true ? true : false;
				delay_arma = sprite_arma['delay'] != undefined ? sprite_arma['delay'] : 0;
			}
		}

		if((!distancia || movimento[1] == 1) && !perto && (movimento[1] == 0 || movimento[1] == 1)){
			acoes.push([delay, "aproximar", movimento[1] == 1 ? (movimento[0] == 0 ? 1 : 0) : movimento[0], movimento]);
			perto = true;
			delay += tempo_corrida;
		}
		tipo = ["atacar", "contra-atacar", "esquivar", "defender", "pegar equipamento", "habilidade", "jogar equipamento fora", "evento"][movimento[1]]

		/*if(movimento[1] == 4){
			arma = true;
		}else if(movimento[1] == 6){
			arma = false;
		}*/
		acoes.push([delay, tipo, movimento[0], movimento, prox_movimento]);

		if(prox_movimento != undefined && prox_movimento[1] == 7 && eventos[ordem_eventos[prox_movimento[4]]]['antes'] == true){
			acoes.push([delay, "evento", prox_movimento[0], prox_movimento]);
		}

		if(tipo == "pegar equipamento"){
			arma_atual[movimento[0]] = movimento[2];
			delay += 300;
			acoes.push([delay + 200, "parar", movimento[0], movimento]);
		}else if(tipo == "jogar equipamento fora"){
			arma_atual[movimento[0]] = undefined;
		}
		if(tipo == "habilidade"){
			delay += habilidades[ordem_habilidades[movimento[3]]]['delay'];
		}
		if(tipo == "evento"){
			delay += eventos[ordem_eventos[movimento[4]]]['delay'];
		}
		if(!programado && (prox_movimento == undefined || ((movimento[1] == 0 || movimento[1] == 1) && prox_movimento[1] != 2 && prox_movimento[1] != 3))){
			acoes.push([delay, "tomar", movimento[0] == 0 ? 1 : 0, movimento]);
		}else if(prox_movimento != undefined && prox_movimento[1] == 2 && !programado){
			acoes.push([delay, "esquivar", movimento[0] == 0 ? 1 : 0, movimento]);
		}else if(prox_movimento != undefined && prox_movimento[1] == 3 && !programado){
			acoes.push([delay, "defender", movimento[0] == 0 ? 1 : 0, movimento]);
		}
		delay += 200 + delay_arma;//arma ? 200 : 200;
		acoes.push([delay, "parar", (movimento[0] == 0 ? 1 : 0), movimento]);
		if(tipo == "contra-atacar"){
			acoes.push([delay, "parar", movimento[0], movimento]);
		}
		if(prox_movimento != undefined && prox_movimento[1] == 1){
			acoes.push([delay, "parar", movimento[0], movimento]);
			delay += 100;
		}

		if(perto && (i + 1 == movimentos.length || (prox_movimento != undefined && ((prox_movimento[0] != movimento[0] && prox_movimento[1] == 0) || (movimento[1] == 1 && prox_movimento[0] == movimento[0]) || prox_movimento[1] != 0) && prox_movimento[1] != 1))){
			if(movimento[1] == 1){
				acoes.push([delay, "afastar", movimento[0] == 0 ? 1 : 0, movimento]);
				perto = false;
				delay += tempo_corrida;
				acoes.push([delay, "parar", movimento[0] == 0 ? 1 : 0, movimento]);
			}else if(!distancia){
				acoes.push([delay, "afastar", movimento[0], movimento]);
				perto = false;
				delay += tempo_corrida;
				acoes.push([delay, "parar", movimento[0], movimento]);
			}
		}
	}
}

function preload(callback){
	$('#luta .loading').show();
	var preloads = [cdn+"img/loading.gif"];
	$(".personagem").each(function(){
		var sprite = get_sprite_img(this);
		if($.inArray(cdn+"img/personagens/"+sprite['image'], preloads) == -1){
			preloads.push(cdn+"img/personagens/"+sprite['image']);
			preloads.push(cdn+"img/personagens/"+get_mirror(sprite['image']));
		}
	});
	for(i = 0; i < movimentos.length; i++){
		var movimento = movimentos[i];
		if(movimento[2] > 0){
			var sprite = armas[equipamentos[movimento[2]]];
			if($.inArray(cdn+"img/armas/"+sprite['image'], preloads) == -1){
				preloads.push(cdn+"img/armas/"+sprite['image']);
				preloads.push(cdn+"img/armas/"+get_mirror(sprite['image']));
			}
			if(sprite['sound'] != undefined){
				var sounds = sprite['sound'].split(",");
				for(p = 0; p < sounds.length; p++){
					var s = sounds[p];
					if(s != undefined && $(".sound[name='"+s+"']").length == 0){
						$('#sounds').append('<div class="sound" name="'+s+'"></div>');
					}
				}
			}
		}else if(movimento[3] > 0){
			var sprite = habilidades[ordem_habilidades[movimento[3]]];
			var images = sprite['images'];
			images = images == undefined ? undefined : images.split(',');
			for(p = 0; p < images.length; p++){
				var mirror = movimento[0] == 1 && images[p].indexOf('[mirror]') > -1;
				var img = images[p].split('[mirror]')[0];
				img = mirror ? get_mirror(img) : img;
				if($.inArray(cdn+"img/habilidades/"+img, preloads) == -1){
					preloads.push(cdn+"img/habilidades/"+img);
				}
			}
			if(sprite['sound'] != undefined){
				var sounds = sprite['sound'].split(",");
				for(p = 0; p < sounds.length; p++){
					var s = sounds[p];
					if(s != undefined && s == "maisdeoitomil" && lingua.indexOf("pt") < 0){
						s = "overninethousand"
					}
					if(s != undefined && $(".sound[name='"+s+"']").length == 0){
						$('#sounds').append('<div class="sound" name="'+s+'"></div>');
					}
				}
			}


		}else if(movimento[4] > 0){
			var sprite = eventos[ordem_eventos[movimento[4]]];
			var images = sprite['images'];
			images = images == undefined ? undefined : images.split(',');
			for(p = 0; p < images.length; p++){
				var mirror = movimento[0] == 1 && images[p].indexOf('[mirror]') > -1;
				var img = images[p].split('[mirror]')[0];
				img = mirror ? get_mirror(img) : img;
				if($.inArray(cdn+"img/eventos/"+img, preloads) == -1){
					preloads.push(cdn+"img/eventos/"+img);
				}
			}
			if(sprite['sound'] != undefined){
				var sounds = sprite['sound'].split(",");
				for(p = 0; p < sounds.length; p++){
					var s = sounds[p];
					if(s != undefined && $(".sound[name='"+s+"']").length == 0){
						$('#sounds').append('<div class="sound" name="'+s+'"></div>');
					}
				}
			}
		}
	}
	$.preLoadImages(preloads, function(){
		$('#luta .loading').hide();
   	callback();
  });
	$('.sound').each(function(){
		carrega_som(this);
	});
}
