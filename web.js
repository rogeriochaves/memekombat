try{
	require.paths.unshift(__dirname + '/lib');

	var everyauth = require('everyauth');
	var express   = require('express');

	var FacebookClient = require('facebook-client').FacebookClient;
	global.facebook = new FacebookClient();

	global.uuid = require('node-uuid');


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
		/*process.env.FACEBOOK_APP_ID = '282893221758514';
		process.env.FACEBOOK_SECRET = '***REMOVED***';
		process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattwo/';*/
		process.env.FACEBOOK_APP_ID = '183114805092475';
		process.env.FACEBOOK_SECRET = '***REMOVED***';
		process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/meme_kombat/';

		process.env.FACEBOOK_APP_HOME = 'https://memekombat.herokuapp.com/';
		mongoose.connect('mongodb://***REMOVED***/heroku_app2171098');
	}


	// configure facebook authentication
	everyauth.facebook
	  .appId(process.env.FACEBOOK_APP_ID)
	  .appSecret(process.env.FACEBOOK_SECRET)
	  .scope('publish_stream,publish_actions')
	  .entryPath('/')
	  .redirectPath('/index')
	  .findOrCreateUser(function() {
	    return({});
	  });

	var oneYear = 31557600000;
	// create an express webserver
	global.app = express.createServer(
	  //express.logger(),
	  express.static(__dirname + '/public', { maxAge: oneYear }),
	  express.cookieParser(),
	  // set this to a secret value to encrypt session cookies
	  express.session({ secret: process.env.SESSION_SECRET || 'secret123' }),
	  // insert a middleware to set the facebook redirect hostname to http/https dynamically
	  function(request, response, next) {
		if(request.param('request_ids')){
			request.session.request_ids = request.param('request_ids').split(',');
		}
		if(request.param('i')){
			request.session.indicacao_uid = request.param('i');
		}
		if(request.param('fight')){
			request.session.fight = request.param('fight');
		}

	    var method = request.headers['x-forwarded-proto'] || 'http';
	    everyauth.facebook.myHostname(method + '://' + request.headers.host);
	    next();
	  },
	  everyauth.middleware(),
	  require('facebook').Facebook()
	);

	// listen to the PORT given to us in the environment
	var port = process.env.PORT || 3000;

	app.listen(port, function() {
	  console.log("Listening on " + port);
	});

	app.post('/', function(request, response){

		if (request.session.auth) {
			response.redirect('/index');
			return false;
		}else{
			var method = request.headers['x-forwarded-proto'] || 'http';
			var host = method + '://' + request.headers.host;
			response.send('<script type="text/javascript">top.location.href = "'+host+'";</script>');
		}
	});

	// create a socket.io backend for sending facebook graph data
	// to the browser as we receive it
	/*var io = require('socket.io').listen(app);

	// wrap socket.io with basic identification and message queueing
	// code is in lib/socket_manager.js
	global.socket_manager = require('socket_manager').create(io);

	// use xhr-polling as the transport for socket.io
	io.configure(function () {
	  io.set("transports", ["xhr-polling"]);
	  io.set("polling duration", 10);
	  io.set('log level', 1);
	});*/


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
	require('./controllers/testando.js');
}catch(e){
	console.log(e.stack)
}