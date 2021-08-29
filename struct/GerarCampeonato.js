const { promisify } = require('util');

module.exports.get_campeonato = function(campeonato, chave_lv, fn){
	//Campeonato.findOne({_id: id}, function(err, campeonato){
		if(campeonato != null){
			var chaves = []
			  , lutas = []
			  , prox_luta = 0;

			Chave.find({
				campeonato_id: campeonato._id,
				$or: [
					{data_liberacao: {$lte: (new Date())}},
					{data_liberacao: undefined}
				],
				level: {$lte: chave_lv}}).sort('level num').exec(function(err, data){

				for(var i = 0, max = data.length; i < max; i++){
					var chave = data[i];
					var x = chave.level;
					var y = chave.num;
					if(typeof chaves[x] == "undefined") chaves[x] = [];
					chaves[x][y * 2] = {uid: chave.uid1, personagem_id: chave.personagem1_id};
					chaves[x][y * 2 + 1] = {uid: chave.uid2, personagem_id: chave.personagem2_id};

					var dt = chave.data_liberacao
					  , prox_luta;

					if(typeof dt == 'undefined'){
						prox_luta = 0;
					}else{
						prox_luta = (dt.getTime() - new Date().getTime());
					}

					if(chave_lv > chave.level){
						if(typeof lutas[x] == "undefined") lutas[x] = [];

						lutas[x][y] = {id: chave.luta_id};
						if(typeof lutas[x+1] == "undefined") chaves[x+1] = [];
						chaves[x + 1][y] = {uid: chave.vencedor_uid, personagem_id: chave.vencedor_id};
						prox_luta += 3 * 60 * 60;
					}
				};

				fn({campeonato: campeonato, chaves: chaves, lutas: lutas, proxima_luta: prox_luta});

			});

		}
	//});
};

module.exports.get_campeonato_livre = function(ranking_pos, fn){
	Campeonato.findOne({ranking_pos: ranking_pos, chaves_livres: { $gt: 0 }}, function(err, campeonato){
		if(campeonato != null){
			fn(campeonato);
		}else{
			var qtd_chaves = (ranking_pos == 1 ? 4 : (ranking_pos == 2 ? 8 : 16));
			var c = new Campeonato({
				ranking_pos: ranking_pos,
				qtd_chaves: qtd_chaves,
				chaves_livres: qtd_chaves * 2
			});
			c.save(function(err){
				fn(c);
			});
		}
	});
};

module.exports.inserir_personagem_no_campeonato = function(personagem, campeonato, fn){
	var pos = campeonato.qtd_chaves * 2 - campeonato.chaves_livres;
	var num = pos / 2;
	Chave.findOne({campeonato_id: campeonato._id, level: 0, uid2: undefined}, function(err, chave){
		if(chave != null){
			chave.personagem2_id = personagem._id;
			chave.uid2 = personagem.uid;
		}else{
			chave = new Chave({
				campeonato_id: campeonato._id,
				personagem1_id: personagem._id,
				uid1: personagem.uid,
				level: 0,
				num: num
			});
		}
		chave.save(function(err){
			campeonato.chaves_livres--;
			personagem.campeonato_id = campeonato._id;
			personagem.chave_lv = 0;
			personagem.save(function(err){
				campeonato.save(function(err){
					if(campeonato.chaves_livres == 0){
						gerar_lutas_campeonato(campeonato, function(err){
							fn();
							// if(err == null){
							// 	Chave.find({campeonato_id: campeonato._id, level: 0, uid2: undefined}).count(function(err, quant){
							// 		Chave.find({campeonato_id: campeonato._id, level:0, uid2: {$ne: undefined}}).count(function(err, quant2){
							// 			campeonato.chaves_livres = (campeonato.qtd_chaves * 2) - (quant2 * 2) - quant;
							// 			campeonato.save(function(err){
							// 				fn();
							// 			});
							// 		});
							// 	});
							// } else {
							// 	throw err;
							// }
						});
					}else{
						fn();
					}
				});
			});
		});
	});
};

async function gerar_chaves_lutas_i(i, levels, qtd_chaves, campeonato){
	while(i < levels){
		var num_chaves = parseInt(qtd_chaves / Math.pow(2, i));
		await gerar_chaves_lutas_k(i, 0, num_chaves, campeonato, levels);
		i++;
	}
}

async function gerar_chaves_lutas_k(i, k, max_k, campeonato, levels){
	while(k < max_k){
		var [vencedor1, i2, k2] = await criar_luta_campeonato(campeonato, i, k);
		if(i < levels - 1){
			var [vencedor2, i3, k3] = await criar_luta_campeonato(campeonato, i2, k2 + 1);

			await promisify(Chave.updateOne).call(Chave, {
				campeonato_id: campeonato._id,
				num: (k3 - 1) / 2,
				level: i3 + 1
			}, {
				personagem1_id: vencedor1._id,
				uid1: vencedor1.uid,
				personagem2_id: vencedor2._id,
				uid2: vencedor2.uid
			}, {
				upsert: true
			});
		}else{
			campeonato.vencedor_id = vencedor1._id,
			campeonato.vencedor_uid = vencedor1.uid
			await promisify(campeonato.save).call(campeonato);
		}
		k+=2;
	}
}


var gerar_lutas_campeonato = function(campeonato, fn){
	var qtd_chaves = campeonato.qtd_chaves
	  , levels = parseInt(Math.log(qtd_chaves) / Math.log(2) + 1); // 4 chaves = 3 levels, 8 chaves = 4 levels, 16 chaves = 5 levels


	gerar_chaves_lutas_i(0, levels, qtd_chaves, campeonato).then(fn);


};
module.exports.gerar_lutas_campeonato = gerar_lutas_campeonato;

var criar_luta_campeonato = function(campeonato, i, k){
	return new Promise(async function (resolve, reject) {
		try {
			var chave = await promisify(Chave.findOne).call(Chave, { campeonato_id: campeonato._id, level: i, num: k });
			var p1 = await promisify(Personagem.findOne).call(Personagem, { _id: chave.personagem1_id });
			var p2 = await promisify(Personagem.findOne).call(Personagem, { _id: chave.personagem2_id });

			var GerarLuta = require('./GerarLuta.js');
			GerarLuta.gerar_luta(p1, p2, campeonato, function (luta, luta_id, vencedor, perdedor, short_url) {
				chave.data_liberacao = new Date(new Date().getTime() + 3 * i * 60 * 60);
				chave.luta_id = luta_id;
				chave.vencedor_id = vencedor._id;
				chave.vencedor_uid = vencedor.uid;
				chave.save(function (err) {
					if (err) return reject(err);
					resolve([vencedor, i, k]);
				});
			});
		} catch(e) {
			reject(e);
		}
	});
}

module.exports.exp_ganha = function(personagem, chave_lv, fn){
	var qtd_pessoas = (chave_lv == 1 ? "1 meme" : chave_lv + " memes");
	var exp_ganha = chave_lv;
	var n = new Notificacao({
		personagem_id: personagem._id,
		tipo: 1,
		texto: "Você lutou contra " + qtd_pessoas + " no Campeonato. EXP +" + exp_ganha,
		texto_en: "You fought against " + qtd_pessoas + " on the Championist. EXP +" + exp_ganha
	});
	n.save();
	personagem.exp += exp_ganha;
	fn(personagem);
};