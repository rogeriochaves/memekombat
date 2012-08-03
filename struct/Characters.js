module.exports.lutas_restantes = function(personagem_id, fn) {

	Credito.find({personagem_id: personagem_id}).select('quantidade').run(function(err, results){
		var total = 0;
		results.forEach(function(result){
			total += result.quantidade;
		});

		var hoje = new Date();
		hoje.setHours(0);
		hoje.setMinutes(0);
		hoje.setSeconds(0);

		var amanha = new Date(hoje.getTime() + 24 * 60 * 60 * 1000);
		
		Luta.find()
			.or([{personagem1_id: personagem_id, campeonato: false, credito: true},
				{personagem1_id: personagem_id, campeonato: false, credito: false, data: { $gt: hoje, $lt: amanha }}])
			.select('_id')
			.count(function(err, total_gratis){
				fn(total - total_gratis + 3);
			});

	});

};

module.exports.lutas_comuns_restantes = function(personagem_id, fn) {

	var hoje = new Date();
	hoje.setHours(0);
	hoje.setMinutes(0);
	hoje.setSeconds(0);

	var amanha = new Date(hoje.getTime() + 24 * 60 * 60 * 1000);

	Luta.find({personagem1_id: personagem_id, campeonato: false, credito: false, data: { $gt: hoje, $lt: amanha }})
		.count(function(err, total){
			fn(3 - total);
		});

};

module.exports.calcular_dano = function(atq, def, critico) {

	if(critico){
		return dano_critico(atq);
	}else{
		dano = atq / 2 - def / 4;
	 	return parseInt(Math.max((parseInt(Math.random() * 4) > 3 ? 2 : 1), parseInt(dano + dano * parseInt(Math.random() * 100) / 100)));
	}

};

module.exports.exp_necessaria = function(level){
	return 2 * level + 1;
};

var chance_critico = function(crit){
	return parseInt(Math.random() * 100) <= crit;
};
module.exports.chance_critico = chance_critico;

var dano_critico = function(atq){
	return Math.max(2, parseInt(atq / 2 + atq / 2 * parseInt(Math.random() * 100) / 100));
};
module.exports.dano_critico = dano_critico;

var sortear_speed = function(speed){
	return parseInt(Math.random() * speed) + parseInt(Math.random() * 50);
};
module.exports.sortear_speed = sortear_speed;

var dano_habilidade = function(dano, level){
	dano = parseInt(dano + dano * level / 100);
	return parseInt(Math.random() * parseInt(dano * 1.1)) + dano;
};
module.exports.dano_habilidade = dano_habilidade;

var chance_usar_habilidade = function(quant_usadas){ // de 0 a 100
	return parseInt(1 + 15 / (quant_usadas + 1));
};
module.exports.chance_usar_habilidade = chance_usar_habilidade;

var chance_pegar_arma = function(turnos){
	return Math.min(80, 100 - (80 - turnos * 10));
};
module.exports.chance_pegar_arma = chance_pegar_arma;

var chance_jogar_arma_fora = function(quant_armas){
	return Math.min(70, Math.max(10, 10 * quant_armas));
};
module.exports.chance_jogar_arma_fora = chance_jogar_arma_fora;

var chance_ganhar_arma_nova = function(quant_armas, level){
	return Math.max(1, 3 * Math.pow(level, 2) - 50 * quant_armas);
};
module.exports.chance_ganhar_arma_nova = chance_ganhar_arma_nova;

var chance_ganhar_habilidade_nova = function(quant_habilidades, level){
	return Math.max(1, 2 * Math.pow(level, 2) - 50 * quant_habilidades);
};
module.exports.chance_ganhar_habilidade_nova = chance_ganhar_habilidade_nova;

module.exports.consulta_habilidades = function(habilidades, fn){
	Habilidade.where('num').in(habilidades).run(function(err, data){
		fn(data);
	});
}

module.exports.consulta_armas = function(armas, fn){
	Equipamento.where('num').in(armas).run(function(err, data){
		fn(data);
	});
}