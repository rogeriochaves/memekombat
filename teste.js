require.paths.unshift(__dirname + '/lib');

global.mongoose = require('mongoose')  
global.Schema = mongoose.Schema
global.ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://localhost/memekombat');

require('./schema.js');

var Personagem = mongoose.model('Personagens');
/*Personagem.findOne({uid: '123'}, function(err, data){
	console.log(err);
	mongoose.disconnect();
});*/
/*Personagem.find().or({vitorias: 388, level: 14}, {derrotas: 1, level: 14}).run(function(err, results){
	console.log(results);
	mongoose.disconnect();
});*/

/*var meme = mongoose.model('Meme');
meme.findOne({nome: "Rage"}, function(err, res){
	console.log(res);
});*/

Personagem.findOne({}, function(err, p){
	/*Equipamento.where('_id').in(data.equipamentos).find(function(err, equips){
		equips.forEach(function(equip){
			console.log(equip.num);
		});
		mongoose.disconnect();
	});*/
	/*p.notificacoes.push({
		tipo: 0,
		texto: "Seja bem vindo ao Meme Kombat",
		texto_en: "Welcome to le Meme Kombat"
	});
	p.save();*/
	
});

/*Equipamento.where().sort({}).find(function(err, data){
	data.forEach(function(d){
		console.log(d.num);
	});
	mongoose.disconnect();
});*/

/*Equipamento.find({_id: ObjectId('4ef726a6c70ce91814000004') }, function(data){
	console.log(data);
	//if(equips != null)
		/*equips.forEach(function(equip){
			console.log(equip);
		});*/
		/*mongoose.disconnect();
});*/

/*Equipamento.where('_id').in([ '4ef726a6c70ce91814000004', '4ef726a6c70ce9181400000d', '4ef726a6c70ce91814000012' ]).run(function(equips){
	//if(equips != null)
		equips.forEach(function(equip){
			console.log(equip);
		});
		mongoose.disconnect();
});*/