module.exports.lutas_restantes = function(personagem_id, fn) {

	Credito.find({personagem_id: personagem_id}, function(err, results){
		var total = 0;
		results.forEach(function(result){
			total += result.quantidade;
		});

		hoje = new Date();
		hoje.setHours(0);
		hoje.setMinutes(0);
		hoje.setSeconds(0);

		Luta.find()
			.or({personagem1_id: personagem_id, campeonato: false, credito: true},
				{personagem1_id: personagem_id, campeonato: false, credito: false, data: { $gt: hoje }})
			.count(function(total_gratis){
				fn(total - total_gratis + 3);
			});

	});

};

module.exports.lutas_comuns_restantes = function(personagem_id, fn) {

	hoje = new Date();
	hoje.setHours(0);
	hoje.setMinutes(0);
	hoje.setSeconds(0);

	Luta.find({personagem1_id: personagem_id, campeonato: false, credito: false, data: { $gt: hoje }})
		.count(function(total){
			fn(3 - total);
		});

};

module.exports.calcular_dano = function(atq, def, critico) {

	if(critico){
		return dano_critico(atq);
	}else{
		dano = atq / 2 - def / 4;
	 	return Math.max((parseInt(Math.random() * 4) > 3 ? 2 : 1), parseInt(dano + dano * parseInt(Math.random() * 100) / 100));
	}

};

module.exports.exp_necessaria = function(level){
	return 2 * level + 1;
};

var chance_critico = function(crit){
	return parseInt(Math.random() * 100) <= crit;
};

var dano_critico = function(atq){
	return Math.max(2, parseInt(atq / 2 + atq / 2 * parseInt(Math.random() * 100) / 100));
};

var sortear_speed = function(speed){
	return parseInt(Math.random() * speed) + parseInt(Math.random() * 50);
};

var dano_habilidade = function(dano, level){
	dano = dano + dano * level / 100;
	return parseInt(Math.random() * parseInt(dano * 1.1)) + dano;
};

var chance_usar_habilidade = function(quant_usadas){ // de 0 a 100
	return parseInt(1 + 15 / (quant_usadas + 1));
};

var chance_pegar_arma = function(turnos){
	return Math.min(80, 100 - (80 - turnos * 10));
};

var chance_jogar_arma_fora = function(quant_armas){
	return Math.min(70, Math.max(10, 10 * quant_armas));
};

var chance_ganhar_arma_nova = function(quant_armas, level){
	return Math.max(1, 3 * Math.pow(level, 2) - 50 * quant_armas);
};

var chance_ganhar_habilidade_nova = function(quant_habilidades, level){
	return Math.max(1, 2 * Math.pow(level, 2) - 50 * quant_habilidades);
};

/*function consulta_habilidades($atributo_id){
	$habilidades = array();
	foreach(consulta(sprintf(
		"SELECT Habilidades.* FROM HabilidadesAtributos LEFT JOIN Habilidades ON Habilidades.id = HabilidadesAtributos.habilidade_id WHERE HabilidadesAtributos.atributo_id = %s", $atributo_id
	)) as $habilidade){
		array_push($habilidades, array(
			'id' => $habilidade['id'],
			'dano' => $habilidade['dano']
		));
	}
	return $habilidades;
}

function consulta_armas($atributo_id){
	$armas = array();
	foreach(consulta(sprintf(
		"SELECT Equipamentos.* FROM EquipamentosAtributos LEFT JOIN Equipamentos ON Equipamentos.id = EquipamentosAtributos.equipamento_id WHERE EquipamentosAtributos.atributo_id = %s", $atributo_id
	)) as $arma){
		array_push($armas, array(
			'id' => $arma['id'],
			'atq' => intval($arma['atq']),
			'def' => intval($arma['def']),
			'vel' => intval($arma['vel']),
			'crit' => intval($arma['crit'])
		));
	}
	return $armas;
}*/