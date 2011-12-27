module.exports.gerar_luta = function(p1, p2, campeonato, fn) {
	
	var Randomize = require('./Randomize.js');
	var Arquivamentos = require('./Arquivamentos.js');
	var Characters = require('./Characters.js');
	var Upar = require('./Upar.js');
	
	Randomize.gerar_luta(p1, p2, function(luta){
		var luta = luta;
		
		var vencedor = luta.vencedor == 0 ? p1 : p2;
		var perdedor = luta.vencedor == 0 ? p2 : p1;
		
		/*var vencedor_id = luta.vencedor == 0 ? p1._id : p2._id;
		var vencedor_nome = luta.vencedor == 0 ? p1.nome : p2.nome;
		var vencedor_uid = luta.vencedor == 0 ? p1.uid : p2.uid;
		var perdedor_id = luta.vencedor == 0 ? p2._id : p1._id;
		var perdedor_nome = luta.vencedor == 0 ? p2.nome : p1.nome;
		var perdedor_uid = luta.vencedor == 0 ? p2.uid : p1.uid;*/
		
		Characters.lutas_comuns_restantes(p1._id, function(quant){
			var l = new Luta({
				personagem1_id: p1._id,
				personagem2_id: p2._id,
				personagem1_hp: p1.hp,
				personagem2_hp: p2.hp,
				personagem1_lv: p1.hp,
				personagem2_lv: p2.hp,
				ganhador_id: vencedor._id,
				perdedor_id: perdedor._id,
				credito: (campeonato ? false : (quant <= 0 ? true : false)),
				campeonato: (campeonato ? true : false),
				movimentos: Randomize.imprimir_movimentos(luta.movimentos)
			});
			l.save(function(err){
				vencedor.vitorias++;
				perdedor.derrotas++;

				var exp_ganha = (vencedor._id == p1._id ? 2 : 1);
				if(p1.level - 3 > p2.level){
					exp_ganha = 0;
				}else if(p1.level > p2.level){
					exp_ganha -= 1;
				}
				p1.exp += exp_ganha;

				var palavras_win = ['massacrou', 'aniquilou', 'humilhou', 'destruiu', 'explodiu', 'finalizou'];
				var palavras_win_en = ['massacred', 'destroyed', 'humbled', 'exploded', 'finished', 'crumbled'];

				var palavras_lost = ['massacrado', 'aniquilado', 'humilhado', 'destruído', 'explodido', 'finalizado'];
				var palavras_lost_en = ['were massacred', 'have been annihilated', 'have been humiliated', 'have been destroyed', 'have been blown', 'were crumbled'];

				var palavra = parseInt(Math.random() * 6);

				vencedor.notificacoes.push({
					tipo: 1,
					luta_id: l._id,
					personagem2_id: perdedor._id,
					texto: "Você " + palavras_win[palavra] + " o meme de " + perdedor.nome + (vencedor._id == p1._id ? ". EXP +" + exp_ganha : ""),
					texto_en: "You " + palavras_win_en[palavra] + " " + perdedor.nome + "'s meme" + (vencedor._id == p1._id ? ". EXP +" . exp_ganha : "")
				});
				
				if(p1.uid == vencedor.uid){
					p1.notificacoes = vencedor.notificacoes; 
				}else{
					p2.notificacoes = vencedor.notificacoes;
				}
				
				perdedor.notificacoes.push({
					tipo: 2,
					luta_id: l._id,
					personagem2_id: vencedor._id,
					texto: "Você foi " + palavras_lost[palavra] + " pelo meme de " + vencedor.nome + (perdedor._id == p1._id ? ". EXP +" . exp_ganha : ""),
					texto_en: "You " + palavras_lost_en[palavra] + " by " + vencedor.nome + "'s meme" + (perdedor._id == p1._id ? ". EXP +" . exp_ganha : "")
				});
				
				//console.log("====================");
				//console.log(p1.notificacoes.length);
				p1.notificacoes.reverse().splice(8, p1.notificacoes.length);
				//console.log(p1.notificacoes.length);
				p2.notificacoes.reverse().splice(8, p2.notificacoes.length);
				
				p1.save(function(err){
					
					p2.save(function(err){
						
						Upar.subir_level(p1);

						// Arquivamentos

						Luta.find({ganhador_id: vencedor._id}).count(function(err, quant){
							if(quant == 1){
								Arquivamentos.postar_arquivamento('first_win', vencedor);
							}else if(quant >= 99){
								Arquivamentos.postar_arquivamento('winner_like_a_boss', vencedor);
							}
						});

						Luta.where().or({ganhador_id: vencedor._id}, {perdedor_id: vencedor._id}).limit(4).run(function(err, data){
							var cont = 1;
							data.forEach(function(l){
								if(l.ganhador_id == vencedor._id) cont++;
							});
							if(cont == 5) Arquivamentos.postar_arquivamento('win_5_row', vencedor);
						});

						Luta.where().or({ganhador_id: perdedor._id}, {perdedor_id: perdedor._id}).limit(4).run(function(err, data){
							var cont = 1;
							data.forEach(function(l){
								if(l.perdedor_id == vencedor._id) cont++;
							});
							if(cont == 5) Arquivamentos.postar_arquivamento('lose_5_row', perdedor);
						});
						
					});
					
				});
				
				
				
				var short_url = null;
				
				fn(luta, l._id, vencedor, perdedor, short_url);
				
				
				
				
				
			});
		});
		
		
		
		
		
	});


};