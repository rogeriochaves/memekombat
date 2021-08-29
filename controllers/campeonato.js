function posicao(x, y, chaves, levels, personagem, portugues, fn){
	//console.log("======= chaves =========");
	//console.log(chaves);
	if(typeof chaves[x] != 'undefined' && typeof chaves[x][y] != 'undefined' && typeof chaves[x][y].uid != 'undefined' && chaves[x][y].uid != "" && chaves[x][y].uid != null){
		var ml = (-50 + 25 * x - 12 * (levels - 3));
		var img = '';
		if(x == 0 && y == 0){
			ml += 40;
			img = 'background-image:url(img/balao-perfil-l.png)';
		}
		if(x == 0 && y == Math.pow(2, levels) - 1){
			ml -= 40;
			img = 'background-image:url(img/balao-perfil-r.png)';
		}

		Personagem.findOne({_id: chaves[x][y].personagem_id}, function(err, p){
			if(p != null){
				var html = '<a class="player '+(p.uid == personagem.uid ? 'me' : '')+'" href="perfil?uid='+chaves[x][y].uid+'">';
				html2 = '<div class="perfil" style="margin-left:'+ml+'px; '+img+'"> 						\
					<img src="'+p.avatar+'" />		\
					<div class="info">																		\
						'+p.nome.split(' ')[0]+'<br />													    \
						'+(portugues ? "Nv " : "Lv ")+p.level+'												\
					</div>																					\
				</div></a>';
				if(x == levels){
					fn(html + '<img src="'+p.avatar+'" style="width: 96px" border="0">' + html2);
				}else{
					var size = parseInt(50 / Math.max(1, levels - x));
					mt = (x == 0 ? 45 : 0);
					fn(html + '<img src="'+p.avatar+'" border="0" style="width:'+size+'px; height:'+size+'px; margin-top:'+mt+'px ">' + html2);
				}
			}else{
				fn('');
			}
		});
	}else if(x == 0){
		var size = parseInt(50 / Math.max(1, (levels - x)));
		var mt = (x == 0 ? 45 : 0);
		fn('<div style="border: 1px solid #999; vertical-align: middle; background: #FFF; display: inline-block; width:'+size+'px; height:'+size+'px; margin-top:'+mt+'px "></div>');
	}else{
		fn("&nbsp;");
	}
}

function luta(x, y, lutas, levels){
	if(typeof lutas[x] != 'undefined' && typeof lutas[x][y] != 'undefined'){
		return '<a class="vs '+((x == 0 && levels >= 4) ? "mini" : "")+'" href="luta?id='+lutas[x][y].id+'&campeonato=true">&nbsp;&nbsp;&nbsp;&nbsp;</a>';
	}else{
		return "&nbsp;";
	}
}

function ver_se_perdeu(x, y, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem){
	if(!personagem_perdeu && typeof chaves[x] != 'undefined' && typeof chaves[x][y] != 'undefined'){
		var is_personagem = (chaves[x][y].uid == personagem.uid);
		if(x < ultimo_lv && is_personagem && personagem_ultima_vit == -1){
			personagem_perdeu = true;
		}
		if(ultimo_lv == -1){
			ultimo_lv = x;
		}
		if(is_personagem){
			personagem_ultima_vit = x;
		}
	}
	return [personagem_perdeu, ultimo_lv, personagem_ultima_vit];
}

function coluna_campeonato_html(i, k, m, max, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, levels, portugues, html, fn){
	//console.log("===k==="+k+"========");
	posicao(i, m, chaves, levels, personagem, portugues, function(h){
		html += '<td class="l">'+h+'</td>';

		res = ver_se_perdeu(i, m, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem);
		personagem_perdeu = res[0];
		ultimo_lv = res[1];
		personagem_ultima_vit = res[2];

		m++;
		for(c = 0; c < Math.max(0, Math.pow(2, i) - 1); c++){
			html += '<td class="h">&nbsp;</td>';
		}

		html += '<td class="t">'+luta(i, (m - 1) / 2, lutas, levels)+'</td>';
		for(c = 0; c < Math.max(0, Math.pow(2, i) - 1); c++){
			html += '<td class="h">&nbsp;</td>';
		}
		posicao(i, m, chaves, levels, personagem, portugues, function(h){
			html += '<td class="r">'+h+'</td>';
			res = ver_se_perdeu(i, m, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem);
			personagem_perdeu = res[0];
			ultimo_lv = res[1];
			personagem_ultima_vit = res[2];
			m++;
			if(k < max - 1){
				html += '<td colspan="' + (Math.pow(2, i + 1) - 1) + '">&nbsp;</td>';
			}

			k++;
			if(k < max){
				coluna_campeonato_html(i, k, m, max, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, levels, portugues, html, fn);
			}else{
				fn(html, personagem_perdeu, personagem_ultima_vit, ultimo_lv);
			}

		});

	});

}

function linha_campeonato_html(i, html, levels, num_chaves, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, portugues, fn){
	//console.log(html);
	//console.log("==i===="+i+"========");
		html += '<tr>';
		var espacos = Math.pow(2, i) - 1;
		if(i == levels){
			res = ver_se_perdeu(i, 0, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem);
			personagem_perdeu = res[0];
			ultimo_lv = res[1];
			personagem_ultima_vit = res[2];

			posicao(i, 0, chaves, levels, personagem, portugues, function(h){
				var vencedor = (h != "&nbsp;");
				espacos -= 2;

				html += '<td colspan="'+espacos+'">&nbsp;</td> <td class="v" colspan="5">'+(vencedor ? h : '<img src="img/vencedor-campeonato.gif" />')+'</td> <td colspan="'+espacos+'">&nbsp;</td></tr>';
				i--;
				if(i >= 0){
					linha_campeonato_html(i, html, levels, num_chaves, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, portugues, fn);
				}else{
					fn(html, personagem_perdeu);
				}

			});

		}else{
			if(espacos > 0) html += '<td colspan="'+espacos+'">&nbsp;</td>';
			var chaves_level = parseInt(num_chaves / Math.pow(2, i));

			coluna_campeonato_html(i, 0, 0, chaves_level, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, levels, portugues, html, function(html, personagem_perdeu, personagem_ultima_vit, ultimo_lv){
				i--;
				if(espacos > 0) html += '<td colspan="'+espacos+'">&nbsp;</td>';
				if(i >= 0){
					linha_campeonato_html(i, html, levels, num_chaves, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, portugues, fn);
				}else{
					fn(html, personagem_perdeu);
				}
			});
		}

}

function campeonato_html(levels, num_chaves, lutas, chaves, personagem, portugues, fn){
	var html = '<table border="0" cellpadding="0" cellspacing="0" class="chave" width="720">'
	  , personagem_perdeu = false
	  , ultimo_lv = -1
	  , personagem_ultima_vit = -1

	var i = levels;
	linha_campeonato_html(i, html, levels, num_chaves, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, portugues, function(html, personagem_perdeu){
		fn(html + '</table>', personagem_perdeu);
	});

}


function render_campeonato(request, response, user, personagem, campeonato){
	var campeonato_info = campeonato
	  , campeonato = campeonato.campeonato
	  , num_chaves = campeonato.qtd_chaves
	  , chaves = campeonato_info.chaves
	  , lutas = campeonato_info.lutas
	  , proxima_luta = campeonato_info.proxima_luta
	  , levels = parseInt(Math.log(num_chaves) / Math.log(2)) + 1
	  , portugues = (user.locale && user.locale.indexOf('pt') >= 0);

	campeonato_html(levels, num_chaves, lutas, chaves, personagem, portugues, function(html, personagem_perdeu){

		if(request.param('finalizar') && personagem_perdeu){
			var GerarCampeonato = require('./../struct/GerarCampeonato.js');
			GerarCampeonato.exp_ganha(personagem, personagem.chave_lv, function(personagem){
				personagem.chave_lv = 0;
				personagem.campeonato_id = null;
				personagem.save(function(err){
					var Upar = require('./../struct/Upar.js');
					Upar.subir_level(personagem);
					response.redirect('/perfil');
				});
			});
		}else{

			Ranking.findOne({pos: campeonato.ranking_pos}, function(err, rank){
				try{
					response.render('campeonato.ejs', {
						layout:   false,
						user:     user,
						proxima_luta: proxima_luta,
						campeonato: campeonato,
						rank: rank,
						personagem: personagem,
						personagem_perdeu: personagem_perdeu,
						html: html,
						levels: levels,
						chaves: chaves,
						portugues: portugues
					});

					// garbage collect
					user = null;
					session = null;
					campeonato = null;
					personagem = null;
					html = null;
					levels = null;
					chaves = null;

				}catch(e){}

			});

		}

	});


}

app.all('/campeonato', authMiddleware, function(request, response) {

	var user = request.session.auth.user;

	Personagem.findOne({uid: user.uid}, function(err, personagem){
		if(personagem == null){
			response.redirect('inicio');
		}else{
			var GerarCampeonato = require('./../struct/GerarCampeonato.js');
			if(typeof personagem.campeonato_id == 'undefined' || personagem.campeonato_id == null){
				GerarCampeonato.get_campeonato_livre(personagem.ranking_pos, function(campeonato){
					GerarCampeonato.inserir_personagem_no_campeonato(personagem, campeonato, function(){
						GerarCampeonato.get_campeonato(campeonato, 0, function(camp){
							render_campeonato(request, response, user, personagem, camp);
						});
					});
				});
			}else{
				var chave_lv = personagem.chave_lv;
				Campeonato.findOne({_id: personagem.campeonato_id}, function(err, campeonato){

					if(request.param('finalizar') && campeonato.vencedor_id && campeonato.vencedor_id.toString() == personagem._id.toString()){
						var novo_ranking = Math.min(8, campeonato.ranking_pos + 1);
						Ranking.findOne({pos: novo_ranking}, function(err, rank){

							var GerarCampeonato = require('./../struct/GerarCampeonato.js');
							GerarCampeonato.exp_ganha(personagem, personagem.chave_lv, function(personagem){
								if(personagem.ranking_pos != novo_ranking){

									var n = new Notificacao({
										personagem_id: personagem._id,
										tipo: 1,
										texto: "Parabéns! Você ganhou o campeonato e passou para o ranking <b>"+rank.nome+"</b>",
										texto_en: "Congratulations! You won the championist and became a <b>"+rank.nome_en+"</b>"
									});
									n.save();

									personagem.ranking_pos = novo_ranking;
								}else{

									var n = new Notificacao({
										personagem_id: personagem._id,
										tipo: 1,
										texto: "Parabéns! Você ganhou o campeonato",
										texto_en: "Congratulations! You won the championist"
									});
									n.save();
								}
								personagem.chave_lv = 0;
								personagem.campeonato_id = null;

								personagem.save(function(err){
									var Upar = require('./../struct/Upar.js');
									Upar.subir_level(personagem);
									response.redirect('/perfil');
								});
							});



						});
					}else if(request.param('proxima_luta')){
						Chave.findOne({campeonato_id: campeonato._id, data_liberacao: {$lte: (new Date())}, level: personagem.chave_lv, $or: [{personagem1_id: personagem._id}, {personagem2_id: personagem._id}]}, function(err, chave){
							var levels = parseInt(Math.log(campeonato.qtd_chaves) / Math.log(2));
							if(chave != null && personagem.chave_lv <= levels){
								personagem.chave_lv++;
								personagem.save();
								response.redirect('/luta/'+chave.luta_id+'?campeonato=true');
							}else{
								response.redirect('/perfil');
							}
						});
					}else{
						GerarCampeonato.get_campeonato(campeonato, chave_lv, function(camp){
							render_campeonato(request, response, user, personagem, camp);
						});
					}


				});

			}
		}
	});

});