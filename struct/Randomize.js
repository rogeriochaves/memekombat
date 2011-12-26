module.exports.gerar_luta = function(player1, player2, fn) {
	
	var Characters = require('./Characters.js');
	
	var p1 = {
		pos: 0,
		meme: player1.meme_src,
		genero: player1.genero,
		_id: player1._id,
		nome: player1.nome,
		uid: player1.uid,
		level: player1.level,
		hp: player1.hp,
		atq: player1.atq,
		vel: player1.vel + 500,
		def: player1.def,
		crit: player1.crit
	}
	
	var p2 = {
		pos: 1,
		meme: player2.meme_src,
		genero: player2.genero,
		_id: player2._id,
		nome: player2.nome,
		uid: player2.uid,
		level: player2.level,
		hp: player2.hp,
		atq: player2.atq,
		vel: player2.vel + 500,
		def: player2.def,
		crit: player2.crit
	}
	
	Characters.consulta_habilidades(player1.habilidades, function(habilidades){
		p1.habilidades = habilidades;
		Characters.consulta_habilidades(player2.habilidades, function(habilidades){
			p2.habilidades = habilidades;
			p1.habilidades_usadas = 0;
			p2.habilidades_usados = 0;
			
			Characters.consulta_armas(player2.equipamentos, function(armas){
				p1.armas = armas;
				Characters.consulta_armas(player2.equipamentos, function(armas){
					p2.armas = armas;
					p1.arma_atual = -1;
					p2.arma_atual = -1;
					var movimentos = [];
					p1.speed_buffer = p1.vel;
					p2.speed_buffer = p2.vel;
					var turnos = 0;
					
					while(p1.hp > 0 && p2.hp > 0 && turnos < 1000){
						turnos++;
						var tipo = 0
						  , equipamento_id = 0
						  , habilidade_id = 0
						  , evento_id = 0
						  , dano = 0
						  , critico = false
						  , atacante = p1
						  , defensor = p2;
						
						var speed_rand_p1 = Characters.sortear_speed(p1.speed_buffer);
						var speed_rand_p2 = Characters.sortear_speed(p2.speed_buffer);
						  
						if(speed_rand_p1 > speed_rand_p2){ // Jogador 1 que irá se mover
							atacante = p1;
							defensor = p2;
							p1.speed_buffer -= p1.vel * 0.1;
							p2.speed_buffer = p2.vel;
						}else if(speed_rand_p2 > speed_rand_p1){ // Jogador 2 que irá se mover
							atacante = p2;
							defensor = p1;
							p1.speed_buffer = p1.vel;
							p2.speed_buffer -= p2.vel * 0.1;
						}else{ // Jogador 1 ou 2 aleatoriamente
							pos = parseInt(Math.random() * 2);
							atacante = (pos == 0 ? p1 : p2);
							defensor = (pos == 0 ? p2 : p1);
							p1.speed_buffer = p1.vel;
							p2.speed_buffer = p2.vel;
						}
						
						
						if(turnos > 1){
							if(parseInt(Math.random() * 100) <= 5){ // 5% de chance de aparecer
								movimentos.push([defensor.pos, 7, 0, 0, 1, 0, 0]);
							}
						}

						var rand_acao = parseInt(Math.random() * 100);
						if(atacante.habilidades.length > 0 &&
						   rand_acao <= Characters.chance_usar_habilidade(atacante.quant_habilidades_usadas)){ // usar habilidade
							
							atacantequant_habilidades_usadas++;
							rand_habilidade = parseInt(Math.random() * atacante.habilidades.length);
							habilidade = atacante.habilidades[rand_habilidade];
							dano = Characters.dano_habilidade(habilidade.dano, atacante.level);
							movimentos.push([atacante.pos, 5, 0, habilidade.num, 0, dano, 0]);
							defensor.hp -= dano;
							if(defensor.hp <= 0) break;
							atacante.habilidades.splice(rand_habilidade, 1);
						}else{
							pegou_arma = false;
							if(atacante.armas.length > 0 && atacante.arma_atual == -1 && rand_acao <= Characters.chance_pegar_arma(turnos)){ // pegar arma
								rand_arma = parseInt(Math.random() * atacante.armas.length);
								arma = atacante.armas[rand_arma];
								movimentos.push([atacante.pos, 4, arma.num, 0, 0, 0, 0]);
								atacante.atq += arma.atq;
								atacante.vel += arma.vel;
								atacante.def += arma.def;
								atacante.crit += arma.crit;
								atacante.arma_atual = rand_arma;
								pegou_arma = true;
							}
							if(!pegou_arma && atacante.arma_atual != -1 && rand_acao <= Characters.chance_jogar_arma_fora(atacante.armas.length)){ // jogar arma fora
								arma = atacante.armas[atacante.arma_atual];
								movimentos.push([atacante.pos, 6, 0, 0, 0, 0, 0]);
								atacante.atq -= arma.atq;
								atacante.vel -= arma.vel;
								atacante.def -= arma.def;
								atacante.crit -= arma.crit;
								atacante.armas.splice(atacante.arma_atual, 1);
								atacante.arma_atual = -1;
							}

							tipo = 0;
							critico = Characters.chance_critico(atacante.crit);
							dano = Characters.calcular_dano(atacante.atq, defensor.def, critico);
							
							if(Characters.sortear_speed(defensor.speed_buffer) > Characters.sortear_speed(atacante.speed_buffer)){ // se o defensor tiver maior velocidade que o atacante no momento, ele pode contra-atacar, defender ou esquivar
								speed_rand_1 = Characters.sortear_speed(atacante.speed_buffer);
								speed_rand_2 = Characters.sortear_speed(defensor.speed_buffer);
								if(speed_rand_2 > speed_rand_1){
									dano = 0;
									movimentos.push([atacante.pos, tipo, equipamento_id, habilidade_id, evento_id, dano, (critico ? 1 : 0)]);
									if(speed_rand_2 > speed_rand_1 * 2){ // contra-ataque
										critico = Characters.chance_critico(defensor.crit);
										dano = Characters.calcular_dano(defensor.atq, atacante.def, critico);
										movimentos.push([defensor.pos, 1, 0, 0, 0, dano, (critico ? 1 : 0)]);
										atacante.hp -= dano;
										if(atacante.hp <= 0) break;
									}else if(parseInt(Math.random() * 2) == 0){ // esquiva
										movimentos.push([defensor.pos, 2, 0, 0, 0, 0, 0]);
									}else{ // defesa
										movimentos.push([defensor.pos, 3, 0, 0, 0, 0, 0]);
									}
								}
							}else{
								movimentos.push([atacante.pos, tipo, equipamento_id, habilidade_id, evento_id, dano, (critico ? 1 : 0)]);
								defensor.hp -= dano;
								if(defensor.hp <= 0) break;
							}
							
						}
						
					}
					
					fn({movimentos: movimentos, vencedor: (p1.hp < p2.hp ? 1 : 0)});
					
				});
			});
		});
	});
	
	
}


module.exports.imprimir_movimentos = function(matriz){
	var linhas = [];
	for(var i = 0; i < matriz.length; i++){
		linhas.push("[" + matriz[i].join(',') + "]");
	}
	return linhas.join(',');
}