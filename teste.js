require.paths.unshift(__dirname + '/lib');

global.mongoose = require('mongoose')  
global.Schema = mongoose.Schema
global.ObjectId = Schema.ObjectId;

require('./schema.js');

global.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
if(environment == 'development'){
	process.env.FACEBOOK_APP_ID = '130619640386826';
	process.env.FACEBOOK_SECRET = '***REMOVED***';
	process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattest/';
	process.env.FACEBOOK_APP_HOME = 'http://localhost:3000/';
	mongoose.connect('mongodb://localhost/memekombat');
}else{
	process.env.FACEBOOK_APP_ID = '282893221758514';
	process.env.FACEBOOK_SECRET = '***REMOVED***';
	process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattwo/';
	process.env.FACEBOOK_APP_HOME = 'https://memekombat.herokuapp.com/';
	mongoose.connect('mongodb://***REMOVED***/heroku_app2171098');
}

//var Personagem = mongoose.model('Personagens');

/*var Upar = require('./struct/Upar.js');

Personagem.where().count(function(err, p){
	console.log(p);
	/*p.exp += 30;
	Upar.subir_level(p, function(){
		//mongoose.disconnect();
	});*/
//});


/*var http = require('http');
var options = {
  host: 'graph.facebook.com',
  port: 443,
  path: '/oauth/access_token&client_id='+process.env.FACEBOOK_APP_ID+'&client_secret='+process.env.FACEBOOK_SECRET+'&grant_type=client_credentials',
  method: 'POST'
};

// uid, meme_src, level, hp, atq, vel, def, crit, nome, exp, idioma, genero, username, ranking_pos, vitorias, derrotas
http.request(options, function(res) {
	res.setEncoding('utf8');
	res.on('data', function (full_data) {
		console.log(full_data);
	});
}).end();*/



/*Equipamento.find(function(err, armas){
	armas_rand = [];
	armas.forEach(function(arma){
		armas_rand.push({arma: arma, random: Math.random()});
	});
	arma = armas_rand.sort(function(a, b){
		return a.random - b.random
	})[0].arma;
	console.log(arma);
	mongoose.disconnect();
});*/

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




/*var Randomize = require('./struct/Randomize.js');

Personagem.findOne({}, function(err, p){
	Randomize.gerar_luta(p, p, function(luta){
		console.log(Randomize.imprimir_movimentos(luta.movimentos));
		mongoose.disconnect();
	});
});*/

var IgnoraAcentos = require('./lib/ignora_acentos.js');

var busca = IgnoraAcentos.ignora_acentos('rogé');
console.log(busca);
Personagem.find({nome: new RegExp(".*"+busca+".*", "i")}, function(err, ps){
	ps.forEach(function(p){
		console.log(p.nome);
	});
	mongoose.disconnect();
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