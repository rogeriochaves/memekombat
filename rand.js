require.paths.unshift(__dirname + '/lib');

global.mongoose = require('mongoose')  
global.Schema = mongoose.Schema
global.ObjectId = Schema.ObjectId;

require('./schema.js');

global.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
if(environment == 'edevelopment'){
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

Personagem.find({}, function(personagens){
	personagens.forEach(function(p){
		p.random = parseInt(Math.random() * 100);
		p.save();
	});
});

