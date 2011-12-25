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
Personagem.find().or({vitorias: 388, level: 14}, {derrotas: 1, level: 14}).run(function(err, results){
	console.log(results);
	mongoose.disconnect();
});

/*var meme = mongoose.model('Meme');
meme.findOne({nome: "Rage"}, function(err, res){
	console.log(res);
});*/