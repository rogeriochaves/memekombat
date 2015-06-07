var sl = function subir_level(personagem, fn) {

	var Characters = require('./Characters.js');
	var prox_level = Characters.exp_necessaria(personagem.level);
	console.log('personagem.exp', personagem.exp);
	console.log('prox_level', prox_level);

	while(personagem.exp >= prox_level){
		personagem.level++;
		personagem.hp += parseInt(Math.random() * 4) + 2;
		personagem.atq += parseInt(Math.random() * 6);
		personagem.vel += parseInt(Math.random() * 6);
		personagem.def += parseInt(Math.random() * 6);
		personagem.crit += parseInt(Math.random() * 2);
		personagem.exp -= prox_level;
		prox_level = Characters.exp_necessaria(personagem.level);

		var n = new Notificacao({
			personagem_id: personagem._id,
			tipo: 1,
			texto: "Parabéns! Você passou para o nível "+personagem.level,
			texto_en: "Congratulations, you are now level "+personagem.level
		});
		n.save();

		Personagem.where('level').gt(personagem.level - 1).exec(function(err, data){
			if(data == null || data.length <= 1){
				var Arquivamentos = require('./Arquivamentos.js');
				Arquivamentos.postar_arquivamento('first_rank', personagem);
			}
		});

		var rand_ganhar = parseInt(Math.random() * 101);
		var nada = 0;
		if(rand_ganhar <= Characters.chance_ganhar_habilidade_nova(personagem.habilidades.length, personagem.level)){

			Habilidade.where('num').nin(personagem.habilidades).exec(function(err, habils){
				if(habils != null && habils.length > 0){
					habils_rand = [];
					habils.forEach(function(habil){
						habils_rand.push({habil: habil, random: Math.random()});
					});
					habil = habils_rand.sort(function(a, b){
						return a.random - b.random
					})[0].habil;
					personagem.habilidades.push(habil.num);
				}
				personagem.save(function(err){
					if(typeof fn != 'undefined') fn();
				});
			});

		}else{
			nada++;
		}
		if(rand_ganhar <= Characters.chance_ganhar_arma_nova(personagem.equipamentos.length, personagem.level)){
			Equipamento.where('num').nin(personagem.equipamentos).exec(function(err, armas){
				if(armas != null && armas.length > 0){
					armas_rand = [];
					armas.forEach(function(arma){
						armas_rand.push({arma: arma, random: Math.random()});
					});
					arma = armas_rand.sort(function(a, b){
						return a.random - b.random
					})[0].arma;
					personagem.equipamentos.push(arma.num);
				}
				personagem.save(function(err){
					if(typeof fn != 'undefined') fn();
				});
			});
		}else{
			nada++;
		}
		if(nada==2){
			personagem.save(function(err){
				if(typeof fn != 'undefined') fn();
			});
		}

		if(typeof personagem.indicacao_id != 'undefined' && personagem.indicacao_id != null){
			Personagem.findOne({_id: personagem.indicacao_id}, function(err, mestre){
				if(mestre != null){
					mestre.exp++;
					var n = new Notificacao({
						personagem_id: mestre._id,
						tipo: 1,
						texto: "Seu pupilo "+personagem.nome+" passou de nível. EXP + 1",
						texto_en: "Your pupil "+personagem.nome+" upped a level. EXP + 1"
					});
					n.save();
					mestre.save();
					subir_level(mestre);
				}
			});
		}

	}


};

module.exports.subir_level = sl;