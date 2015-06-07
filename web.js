
/*

© 2012 by Rogério Chaves

Este é o código do aplicativo para facebook Meme Kombat
http://apps.facebook.com/meme_kombat

Este é o arquivo principal, que faz requisições dos outros, na pastas controller e struct
O html está na pasta views
Os arquivos estáticos em public
O esquema do banco em schema.js

*/

var everyauth = require('everyauth'); // módulo para autenticação do facebook
var express   = require('express'); // framework pra tratar as requisições do node, gerenciar cookies, sessions, etc
var RedisStore = require('connect-redis')(express); // conexão com redis para armazenar sessions
var MemoryStore = express.session.MemoryStore; // memória local para armazenar sessions, caso esteja em development
var FacebookClient = require('facebook-client').FacebookClient;
global.facebook = new FacebookClient();

var https = require('https');
var fs = require('fs');
var https_options = {
  ca:   fs.readFileSync('ssl/sub.class1.server.ca.pem'),
  key:  fs.readFileSync('ssl/ssl.key'),
  cert: fs.readFileSync('ssl/ssl.crt')
};

global.mongoose = require('mongoose'); // conexão com MongoDB
// objetos do MongoDB
global.Schema = mongoose.Schema;
global.ObjectId = Schema.ObjectId;

// definição dos esquemas do banco
require('./schema.js');

// definindo valores de configuração
if(process.env.NODE_ENV == 'production'){

	// Configurações do app do facebook
	/*process.env.FACEBOOK_APP_ID = '282893221758514';
	process.env.FACEBOOK_SECRET = '***REMOVED***';
	process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattwo/';*/
	process.env.FACEBOOK_APP_ID = '183114805092475';
	process.env.FACEBOOK_SECRET = '***REMOVED***';
	process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/meme_kombat/';
	process.env.FACEBOOK_APP_HOME = 'https://memekombat.herokuapp.com/';

	// CDN
	//process.env.CDN = 'https://d24yrm0vsffrow.cloudfront.net/';
	process.env.CDN = process.env.FACEBOOK_APP_HOME;

	// Conexão com o banco
	mongoose.connect('mongodb://***REMOVED***/heroku_app2171098');


}else{

	//require("v8-profiler"); // para tentar detectar memory leaks
	// Configurações do app do facebook de teste
	process.env.FACEBOOK_APP_ID = '130619640386826';
	process.env.FACEBOOK_SECRET = '***REMOVED***';
	process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattest/';
	process.env.FACEBOOK_APP_HOME = 'https://localhost:3000/';
	process.env.CDN = process.env.FACEBOOK_APP_HOME;
	mongoose.connect('mongodb://localhost/memekombat'); // db local

}


// configura a autenticação do facebook
everyauth.facebook
  .appId(process.env.FACEBOOK_APP_ID)
  .appSecret(process.env.FACEBOOK_SECRET)
  .scope('user_friends')
  .entryPath('/game') // path que direcionará para autenticação
  .redirectPath(process.env.FACEBOOK_APP_URL) // após autenticação, retornar para url do jogo
  .findOrCreateUser(function() {
    return({});
  });

// ao encontrar um erro, apenas logga-lo, não travar o processo
everyauth.everymodule.moduleErrback( function (err) {
  console.log(err);
});

if(process.env.NODE_ENV == 'production'){
	var redis_url = process.env.REDISTOGO_URL
	  , redis = {
			host: (redis_url.split('@')[1].split(':')[0]),
			port: redis_url.split(':')[3].replace('/', ''),
			pass: redis_url.split(':')[2].split('@')[0],
			db: redis_url.split(':')[1].replace('//', ''),
			cookie: {maxAge: 60000 * 5}
		}
	var oneYear = 31557600000; // expiração dos arquivos estáticos
	// create an express webserver
	global.app = express.createServer(
		//express.logger(), // logga tudo
		express.errorHandler(), // lida com erros tentando não travar o processo
		express.static(__dirname + '/public', { maxAge: oneYear }), // onde ficam os arquivos estáticos e seu tempo de expire
		express.cookieParser(), // utilizar cookires
		// configuração da session, conectando com Redis
		express.session({
			secret: '***REMOVED***',
			store: new RedisStore(redis)
		}),

		// insert a middleware to set the facebook redirect hostname to http/https dynamically
		function(request, response, next) {
			// caso o jogador entre em um link de indicação de amigos
			if(request.param('request_ids')){
				// salva os parametros na session e faz a autenticação normalmente
				request.session.request_ids = request.param('request_ids').split(',');
			}
			// cada jogador recebe um link de indicação, que passa um parâmetro i com o uid da pessoa
			if(request.param('i')){
				// salva os parametros na session e faz a autenticação normalmente
				request.session.indicacao_uid = request.param('i');
			}
			// o link das lutas passa um parâmetro fight com o id da luta
			if(request.param('fight')){
				// salva os parametros na session e faz a autenticação normalmente
				request.session.fight = request.param('fight');
			}

			// autentica o usuário
		    var method = 'https';//request.headers['x-forwarded-proto'] || 'http';
		    everyauth.facebook.myHostname(method + '://' + request.headers.host);
		    next();
		},
		everyauth.middleware(),
		require('facebook').Facebook()
	);
}else{
	var ssl_keys = {
		key:  fs.readFileSync('ssl/ssl.key'),
	    cert: fs.readFileSync('ssl/ssl.crt')
	};

	global.app = express.createServer(ssl_keys,express.errorHandler(),express.static(__dirname + '/public', { maxAge: oneYear }),express.cookieParser(),express.session({
			secret: '***REMOVED***',
			store: process.env.SERVER == 'nodejitsu' ? new MemoryStore() : process.env.NODE_ENV == 'production' ? new RedisStore(redis) : new MemoryStore()
		}),function(request, response, next) {
			if(request.param('request_ids')){
				request.session.request_ids = request.param('request_ids').split(',');
			}
			if(request.param('i')){
				request.session.indicacao_uid = request.param('i');
			}
			if(request.param('fight')){
				request.session.fight = request.param('fight');
			}
		    var method = 'https';
		    everyauth.facebook.myHostname(method + '://' + request.headers.host);
		    next();
		},
		everyauth.middleware(),
		require('facebook').Facebook()
	);
}

if(process.env.NODE_ENV == 'production'){ // habilita view cache para ganhar (muita) performance
	app.enable('view cache');
}

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
//https.createServer(https_options, app).listen(port);
//console.log("Listening on " + port);

// redireciona usuário para autenticação do facebook
app.post('/game', function(request, response){
	var method = 'https';//request.headers['x-forwarded-proto'] || 'https';
	var host = method + '://' + request.headers.host;
	if (request.session.auth && request.session.logged){
		response.redirect(host + '/index');
	}else{
		request.session.logged = true;
		response.send('<script type="text/javascript">top.location.href = "'+host+'/game";</script>');
	}
});

// recomendação do facebook para resolver alguns problemas de js cross-domain
app.all('/channel.html', function(req, res) {
	var cache_expire = 60 * 60 * 24 * 365;
	res.header('Pragma', 'public');
	res.header('Cache-Control', 'max-age=' + cache_expire);
	//res.header('Expires', 'public');
	res.render('channel.ejs', {layout: false});
});

// página principal, geralmente o jogador só a vê entrando em memekombat.com
app.all('/', function(request, response){
	response.render('home.ejs', {layout: false});
});

// retorna os amigos que estão jogando (utilizado na página inicial, na arena e no ranking) e salva na session para não ficar retornando à API do Facebook
global.amigos_usando = function(request, response, fn){
	if(!request.session.auth){
		fn(undefined);
	}else{
		if(request.session.amigos){ // caso exista na session
			fn(request.session.amigos);
		}else{
			var token = request.session.auth.facebook.accessToken;
			facebook.getSessionByAccessToken(token)(function(session) { // consulta à API do facebook
				session.restCall('fql.query', {
					query: 'SELECT uid, name, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
					format: 'json'
				})(function(amigos) {
					request.session.amigos = amigos;
					fn(amigos);
					//amigos = null;
				});
			});
		}
	}
};

// requisita todos os controllers do jogo
require('./controllers/inicio.js');
require('./controllers/index.js');
require('./controllers/perfil.js');
require('./controllers/arena.js');
require('./controllers/_arena.js');
require('./controllers/achievements.js');
require('./controllers/luta.js');
require('./controllers/loja.js');
require('./controllers/callback.js');
require('./controllers/ranking.js');
require('./controllers/campeonato.js');
require('./controllers/offline.js');
require('./controllers/tos_pp.js');
require('./controllers/testando.js');