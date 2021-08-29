
/*

© 2012 by Rogério Chaves

Este é o código do aplicativo para facebook Meme Kombat
http://apps.facebook.com/meme_kombat

Este é o arquivo principal, que faz requisições dos outros, na pastas controller e struct
O html está na pasta views
Os arquivos estáticos em public
O esquema do banco em schema.js

*/

require('./lib/errors');

var everyauth = require('everyauth'); // módulo para autenticação do facebook
var express   = require('express'); // framework pra tratar as requisições do node, gerenciar cookies, sessions, etc
var cors = require("cors");
var http = require('http');
var https = require('https');
var MemoryStore = express.session.MemoryStore; // memória local para armazenar sessions, caso esteja em development
var FacebookClient = require('facebook-client').FacebookClient;
var bodyParser = require('body-parser');
var firebase = require("firebase-admin");
global.facebook = new FacebookClient();

if (!process.env.FIREBASE_CREDENTIALS) {
	throw ("FIREBASE_CREDENTIALS env var is not set, please set it to base64 encoded json credentials from firebase. " +
		   "You can generate credentials on firebase > Project Settings > Service accounts > Generate new private key")
}
var firebaseCredentials = new Buffer(process.env.FIREBASE_CREDENTIALS, 'base64').toString();
firebase.initializeApp({
	credential: firebase.credential.cert(JSON.parse(firebaseCredentials))
});

var https = require('https');
var fs = require('fs');

global.mongoose = require('mongoose'); // conexão com MongoDB
// objetos do MongoDB
global.Schema = mongoose.Schema;
global.ObjectId = Schema.ObjectId;

// definição dos esquemas do banco
require('./schema.js');

process.env.APP_URL = "https://memekombat.rchaves.app/";

// definindo valores de configuração
if(process.env.NODE_ENV == 'production'){

	// Configurações do app do facebook

	// CDN
	//process.env.CDN = 'https://d24yrm0vsffrow.cloudfront.net/';
	process.env.CDN = process.env.APP_URL;

	// Conexão com o banco
	mongoose.connect(process.env.MONGOLAB_URI);


}else{

	//require("v8-profiler"); // para tentar detectar memory leaks
	// Configurações do app do facebook de teste
	// process.env.FACEBOOK_APP_ID = '';
	// process.env.FACEBOOK_SECRET = '';
	process.env.CDN = "https://localhost:3000/";
	mongoose.connect('mongodb://localhost:27017/memekombat'); // db local

}

if(process.env.NODE_ENV == 'production'){
	var oneYear = 31557600000; // expiração dos arquivos estáticos
	// create an express webserver
	global.app = express();
	app.use(cors());
	app.use(express.errorHandler()); // lida com erros tentando não travar o processo
	//app.use(express.logger()); // logga tudo
	app.use(express.static(__dirname + '/public', { maxAge: oneYear })); // onde ficam os arquivos estáticos e seu tempo de expire
	app.use(express.cookieParser()); // utilizar cookies
	// configuração da session, conectando com Mongo
	app.use(express.session({
		secret: process.env.SESSION_SECRET,
		// TODO: maybe replace this with a redis store? But only if we scale the app or it dies too much
		store: new MemoryStore()
	}));
	// insert a middleware to set the facebook redirect hostname to http/https dynamically
	app.use(function(request, response, next) {
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
	});
	app.use(everyauth.middleware());
	app.use(require('./lib/facebook.js').Facebook());
	app.use(bodyParser.json());
	global.server = http.createServer(app);
}else{
	var ssl_keys = {
		key:  fs.readFileSync('ssl/ssl.key'),
	  cert: fs.readFileSync('ssl/ssl.crt')
	};

	global.app = express();
	app.use(cors());
	app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
	app.use(express.logger()); // logga tudo
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "localsecret",
		store: new MemoryStore()
	}));
	app.use(function(request, response, next) {
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
	});
	app.use(everyauth.middleware());
	app.use(require('./lib/facebook.js').Facebook());
	app.use(bodyParser.json());
	global.server = https.createServer(ssl_keys, app);
}
app.use(bodyParser.urlencoded({ extended: true }));

if(process.env.NODE_ENV == 'production'){ // habilita view cache para ganhar (muita) performance
	app.enable('view cache');
}

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log("Listening on " + port);
});
//https.createServer(https_options, app).listen(port);
//console.log("Listening on " + port);

global.firebaseAuth = (req) => {
	const sessionCookie = req.cookies.session || '';

	return firebase
		.auth()
		.verifySessionCookie(sessionCookie, true /** checkRevoked */);
}

global.authMiddleware = (req, res, next) => {
	firebaseAuth(req)
		.then((authToken) => {
			req.session.auth = authToken;

			req.session.auth.user = {
				uid: authToken.uid,
				locale: req.headers['accept-language'],
				name: authToken.name,
				provider: authToken.firebase.sign_in_provider
			};
			next();
		})
		.catch((_error) => {
			res.redirect('/');
		});
};

app.get('/', function (request, response) {
	const locale = request.headers['accept-language'];
	const portugues = locale && locale.indexOf('pt') >= 0;

	firebaseAuth(request)
		.then(() => {
			response.redirect('/index');
		}).catch(() => {
			response.render('home.ejs', { layout: false, portugues: portugues });
		});
});

app.post('/login', (req, res) => {
	const idToken = req.body.idToken.toString();
	const providerToken = req.body.providerToken.toString();
	const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

	firebase
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie("session", sessionCookie, options);
        res.cookie("providerToken", providerToken, options);
        res.redirect("/index");
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get('/signout', authMiddleware, function (request, response) {
	response.clearCookie('session');
	response.clearCookie('providerToken');

	response.redirect('/');
});

app.get('/test-error', function (request, response) {
	throw "Test error for checking Sentry error capture integration";
});

// recomendação do facebook para resolver alguns problemas de js cross-domain
app.all('/channel.html', function(req, res) {
	var cache_expire = 60 * 60 * 24 * 365;
	res.header('Pragma', 'public');
	res.header('Cache-Control', 'max-age=' + cache_expire);
	//res.header('Expires', 'public');
	res.render('channel.ejs', {layout: false});
});

const { getFriends } = require('./struct/Amizades');
// retorna os amigos que estão jogando (utilizado na página inicial, na arena e no ranking) e salva na session para não ficar retornando à API do Facebook
global.amigos_usando = function (request, _response, fn) {
	const user = request.session.auth.user;

	getFriends(user.uid).then(friendsMap => {
		const friends = Object.values(friendsMap).filter(x => x.relationship == 'friends');
		fn(friends);
	});
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
require('./controllers/realtime.js');
require('./controllers/ranking.js');
require('./controllers/campeonato.js');
require('./controllers/offline.js');
require('./controllers/tos_pp.js');
require('./controllers/testando.js');
require('./controllers/amizade.js');
