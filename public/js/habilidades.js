function habilidade(acao){
	var player = ".personagem[rel='"+acao[2]+"']";
	var player_arma = ".arma[rel='"+acao[2]+"']";
	var enemy = ".personagem[rel='"+(acao[2] == 0 ? 1 : 0)+"']";
	var enemy_arma = ".arma[rel='"+(acao[2] == 0 ? 1 : 0)+"']";
	var habilidade = ordem_habilidades[acao[3][3]];
	mudar_posicao(player, "pegando_arma");
	mudar_posicao(player_arma, "pegando");
	
	if(habilidade == "nyan-cat"){
		
		sound("nyan-cat");
		
		$("#luta").append('<div class="objeto"></div>');
		var nyan = $("#luta .objeto:last");
		$("#luta").append('<div class="objeto"></div>');
		var rainbow = $("#luta .objeto:last");
		$(enemy + "," + enemy_arma).css({
			zIndex: 4
		});
		if(get_pos(enemy)[1] < get_pos(player)[1]){
			$(player + "," + player_arma).css({
				zIndex: 4
			});
		}
		
		$(nyan).css({
			marginTop: get_pos(enemy)[1] + 16 + "px",
			marginLeft: acao[2] == 0 ? "-103px" : "883px",
			width: "103px",
			height: "64px",
			zIndex: 3,
			background: acao[2] == 0 ? 'url(img/habilidades/nyan-cat.gif)' : 'url(img/habilidades/nyan-cat_mirror.gif)'
		});
		$(rainbow).css({
			marginTop: get_pos(enemy)[1] + 18 + "px",
			marginLeft: acao[2] == 0 ? "-103px" : "883px",
			zIndex: 2,
			width: "46px",
			height: "54px",
			background: 'url(img/habilidades/nyan-cat-rainbow.gif)'
		});
		$(rainbow).animate({
			width: "960px",
			marginLeft: "-103px"
		}, 1600).animate({
			opacity: 0
		}, 800, function(){
			$(enemy + "," + enemy_arma + "," + player + "," + player_arma).css({
				zIndex: 0
			});
			$(rainbow).remove();
		});
		setTimeout(function(){
			mudar_posicao(enemy, "caindo");
			dar_dano(acao);
		}, 950);
		setTimeout(function(){
			mudar_posicao(player + "," + player_arma, "parado");
		}, 300);
		$(nyan).animate({
			marginLeft: acao[2] == 0 ? "840px" : "-150px"
		}, 1600, function(){
			$(nyan).remove();
		});
	}else if(habilidade == "pedobear"){
		$("#luta").append('<img src="img/habilidades/pedobear'+(acao[2] == 0 ? "" : "_mirror")+'.gif" class="objeto"></img>');
		var pedobear = $("#luta .objeto:last");
		for(var i = 0; i < 20; i++){
			if(i % 2 == 0){
				setTimeout(function(){
					$(pedobear).attr("src", "img/habilidades/pedobear.gif");
				}, i * 400);
			}else{
				setTimeout(function(){
					$(pedobear).attr("src", "img/habilidades/pedobear_mirror.gif");
				}, i * 400);
			}
		}
		$(enemy + "," + enemy_arma).css({
			zIndex: 4
		});
		var marginTop = get_pos(enemy)[1];
		setTimeout(function(){
			sound("ai");
			mudar_posicao(enemy, "caindo");
			dar_dano(acao);
		}, 2000);
		setTimeout(function(){
			mudar_posicao(player + "," + player_arma, "parado");
		}, 600);
		setTimeout(function(){
			sound("queda");
			mudar_posicao(enemy_arma, "caido");
			mudar_posicao(enemy, "caido");
		}, 3800);
		setTimeout(function(){
			mudar_posicao(enemy_arma, "parado");
			$(enemy_arma).css({
				marginTop: $(enemy).css("margin-top")
			});
			mudar_posicao(enemy, "levantando");
			$(enemy + "," + enemy_arma).css({
				zIndex: 0
			});
		}, 4800);
		$(enemy).delay(2000).animate({
			marginTop: "-=250px"
		}).delay(1000).animate({
			marginTop: marginTop + "px"
		});
		$(enemy_arma).delay(2000).animate({
			marginTop: "-=200px"
		}).delay(1000).animate({
			marginTop: marginTop + 30 + "px"
		});
		$(pedobear).css({
			width: "5px",
			height: "9px",
			marginTop: get_pos(enemy)[1] + 15 + "px",
			marginLeft: get_pos(enemy)[0] + (acao[2] == 0 ? 200 : -200) + "px"
		}).animate({
			marginTop: "-=15px",
			marginLeft: (acao[2] == 0 ? "-=180px" : "+=200px"),
			width: "50px",
			height: "90px"
		}, 2000).animate({
			marginTop: "+=15px",
			marginLeft: (acao[2] == 0 ? "+=180px" : "-=200px"),
			width: "5px",
			height: "9px"
		}, 2000, function(){
			$(pedobear).remove();
		});
	}else if(habilidade == "domokun"){
		$("#luta").append('<div class="objeto"></div>');
		var domo = $("#luta .objeto:last");
		setTimeout(function(){
			mudar_posicao(player + "," + player_arma, "parado");
		}, 600);
		setTimeout(function(){
			sound("rugido");
		}, 600);
		setTimeout(function(){
			sound("rugido2");
		}, 4000);
		$(domo).css({
			background: 'url(img/habilidades/domo'+(acao[2] == 0 ? "" : "_mirror")+'.gif)',
			width: "421px",
			height: "191px",
			marginTop: "-191px",
			marginLeft: "150px",
			zIndex: 3
		}).animate({
			marginTop: "0px"
		}, 5000).animate({
			marginTop: "-191px"
		}, 100, function(){
			$(this).css({
				backgroundPosition: "-421px 0",
				width: "273px",
				height: "228px",
				marginLeft: get_pos(enemy)[0] - 50 + (acao[2] == 0 ? 0 : -80) + "px"
			}).animate({
				marginTop: get_pos(enemy)[1] - 140 + "px"
			}, 100, function(){
				sound("terremoto");
				mudar_posicao(enemy_arma, "caido");
				$(enemy_arma).css({
					marginTop: "+=30px"
				});
				mudar_posicao(enemy, "caido");
				setTimeout(function(){
					mudar_posicao(enemy_arma, "parado");
					$(enemy_arma).css({
						marginTop: $(enemy).css("margin-top")
					});
					mudar_posicao(enemy, "levantando");
				}, 1500);
				$('#luta').animate({marginTop: "+=8px"}, 100).animate({marginTop: "-=6px"}, 150).animate({marginTop: "+=4px"}, 200).animate({
					marginTop: "-=2px"}, 250).animate({marginTop: "0"}, 300); // tremer tela
				dar_dano(acao);
			}).delay(200).animate({
				marginTop: "-228px"
			}, 400);
		});
	}else if(habilidade == "over9000"){
		mudar_posicao(player + "," + player_arma, "parado");
		$("#luta").append('<div class="objeto"></div>');
		var visor = $("#luta .objeto:last");
		$(visor).css({
			background: 'url(img/habilidades/visor'+(acao[2] == 0 ? "" : "_mirror")+'.gif)',
			marginLeft: (get_pos(enemy)[0] + (acao[2] == 0 ? 35 : 10)) + "px",
			marginTop: "-22px",
			width: "29px",
			height: "22px"
		}).animate({
			marginTop: get_pos(enemy)[1] + 8 + "px"
		});
		$(enemy_arma).css({
			zIndex: 2
		});
		$("#luta").append('<div class="objeto"></div>');
		var ki = $("#luta .objeto:last");
		$(ki).css({
			background: 'url(img/habilidades/ki.png)',
			marginLeft: get_pos(player)[0] + (acao[2] == 0 ? 5 : 0) + "px",
			marginTop: get_pos(player)[1] + 7 + "px",
			width: "75px",
			height: "80px",
			opacity: 0
		}).animate({
			opacity: 1
		}, 500);
		sound("ki");
		$("#luta").append('<div class="objeto"></div>');
		var texto = $("#luta .objeto:last");
		$(texto).css({
			marginLeft: get_pos(enemy)[0] - 80 + "px",
			marginTop: get_pos(enemy)[1] - 20 + "px",
			width: "240px",
			textAlign: "center"
		});
		if(lingua.indexOf("pt") >= 0){
			setTimeout(function(){
				sound("maisdeoitomil");
			}, 800);
			setTimeout(function(){
				$(texto).append("Mais");
				setTimeout(function(){
					$(texto).append(" de");
					setTimeout(function(){
						$(texto).append(" 8000!?");
					}, 500);
				}, 500);
			}, 1000);
		}else{
			setTimeout(function(){
				sound("overninethousand");
			}, 500);
			setTimeout(function(){
				$(texto).append("It's");
				setTimeout(function(){
					$(texto).append(" over");
					setTimeout(function(){
						$(texto).append(" NINE");
						setTimeout(function(){
							$(texto).append(" THOU");
						}, 500);
						setTimeout(function(){
							$(texto).append("SA");
						}, 600);
						setTimeout(function(){
							$(texto).append("A");
						}, 800);
						setTimeout(function(){
							$(texto).append("A");
						}, 1000);
						setTimeout(function(){
							$(texto).append("A");
						}, 1200);
						setTimeout(function(){
							$(texto).append("A");
						}, 1400);
						setTimeout(function(){
							$(texto).append("ND!");
						}, 1600);
					}, 200);
				}, 400);
			}, 600);
		}
		
		for(i = 0; i < 100; i++){
			setTimeout(function(){
				try{
					pos = parseInt($(ki).css("background-position").split("%")[0].split("px")[0]) + 75;
					$(ki).css({
						backgroundPosition: pos + "px 0"
					});
				}catch(e){
					// do nothing
				}
			}, 50 * (i + 1));
		}
		setTimeout(function(){
			mudar_posicao(player + "," + player_arma, "correndo");
			sound("teleport");
			$(ki).animate({opacity: 0}, 200, function(){
				$(this).remove();
			});
			if($(player_arma).length > 0 && get_sprite(player_arma)['distancia'] != true){
				$(player_arma).animate({
					marginTop: get_pos(enemy)[1] + "px",
					marginLeft: get_pos(enemy)[0] + (acao[2] == 0 ? -40 : 40) + "px"
				}, 200);
			}
			$(player).animate({
				marginTop: get_pos(enemy)[1] + "px",
				marginLeft: get_pos(enemy)[0] + (acao[2] == 0 ? -40 : 40) + "px"
			}, 200, function(){
				$(visor).animate({opacity: 0}, 200, function(){
					$(enemy_arma).css({
						zIndex: 2
					});
					$(this).remove();
				});
				$(texto).animate({opacity: 0}, 200, function(){
					$(this).remove();
				});
				if($(player_arma).length > 0){
					mudar_posicao(player, "arma1");
					if(get_sprite(player_arma)['distancia'] != true) mudar_posicao(player_arma, "batendo");
				}else{
					mudar_posicao(player, "soco2");
				}
				mudar_posicao(enemy + "," + enemy_arma, "tomando");
				dar_dano(acao);
				setTimeout(function(){
					andar(acao[2], false);
					mudar_posicao(enemy + "," + enemy_arma, "parado");
					setTimeout(function(){
						mudar_posicao(player + "," + player_arma, "parado");
					}, tempo_corrida);
				}, 200);
			});
		}, 3000);
	}
}