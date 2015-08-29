global.mongoose = require('mongoose');
global.Schema = mongoose.Schema;
global.ObjectId = Schema.ObjectId;

require('./schema.js');

global.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
if(environment == 'development'){
	mongoose.connect('mongodb://localhost/memekombat');
}else{
	mongoose.connect(process.env.MONGOLAB_URI);
}

console.log('Começou limpeza');
Luta.find({

	fb_total_count: {$lt: 3},
	campeonato: false,
	$or: [{credito: false}, {credito: undefined}],
	data: {$lt: new Date((new Date()) - 1000 * 60 * 60 * 24 * 3)}

}).remove(function(err, data){
	console.log('Limpou Lutas');
	Notificacao.find({

		data: {$lt: new Date((new Date()) - 1000 * 60 * 60 * 24 * 5)}

	}).remove(function(err, data){
		console.log('Limpou Notificações');
		mongoose.disconnect();
	});
});

