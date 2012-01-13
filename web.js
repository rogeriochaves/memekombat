//try{
	require.paths.unshift(__dirname + '/lib');

	var everyauth = require('everyauth');
	var express   = require('express');
	var RedisStore = require('connect-redis')(express);
	var MemoryStore = express.session.MemoryStore;
	var FacebookClient = require('facebook-client').FacebookClient;
	global.facebook = new FacebookClient();

	global.uuid = require('node-uuid');



	global.mongoose = require('mongoose');
	global.Schema = mongoose.Schema;
	global.ObjectId = Schema.ObjectId;

	require('./schema.js');

	global.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
	if(process.env.NODE_ENV == 'production'){
		
		/*process.env.FACEBOOK_APP_ID = '282893221758514';
		process.env.FACEBOOK_SECRET = '***REMOVED***';
		process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattwo/';*/
		process.env.FACEBOOK_APP_ID = '183114805092475';
		process.env.FACEBOOK_SECRET = '***REMOVED***';
		process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/meme_kombat/';
		process.env.FACEBOOK_APP_HOME = 'https://memekombat.herokuapp.com/';
		//process.env.CDN = 'https://d24yrm0vsffrow.cloudfront.net/';
		process.env.CDN = process.env.FACEBOOK_APP_HOME;
		mongoose.connect('mongodb://***REMOVED***/heroku_app2171098');
		
		
	}else{
		
		//require("v8-profiler");
		process.env.FACEBOOK_APP_ID = '130619640386826';
		process.env.FACEBOOK_SECRET = '***REMOVED***';
		process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattest/';
		process.env.FACEBOOK_APP_HOME = 'http://localhost:3000/';
		process.env.CDN = process.env.FACEBOOK_APP_HOME;
		mongoose.connect('mongodb://localhost/memekombat');
		
	}


	// configure facebook authentication
	//try{
		everyauth.facebook
		  .appId(process.env.FACEBOOK_APP_ID)
		  .appSecret(process.env.FACEBOOK_SECRET)
		  .scope('publish_stream,publish_actions')
		  .entryPath('/')
		  .redirectPath(process.env.FACEBOOK_APP_URL)
		  .findOrCreateUser(function() {
		    return({});
		  });
		everyauth.everymodule.moduleErrback( function (err) {
		  console.log(err);
		});
		
	/*}catch(e){
		console.log(e.stack)
	}*/

	var oneYear = 31557600000;
	// create an express webserver
	global.app = express.createServer(
	  //express.logger(),
	  express.errorHandler(),
	  express.static(__dirname + '/public', { maxAge: oneYear }),
	  express.cookieParser(),
	  // set this to a secret value to encrypt session cookies
	
		express.session({ secret: '***REMOVED***', store: ((environment == 'development') ? new MemoryStore() : new RedisStore({
			  host: 'barracuda.redistogo.com',
			  port: '9210',
			  pass: '43c56adf34497a80bf6cfbc4c3052dd5',
			  db: 'redistogo',
			  cookie: {maxAge: 60000 * 5}
		  }))}),
	
	  // insert a middleware to set the facebook redirect hostname to http/https dynamically
	  function(request, response, next) {
		
		//try{
			console.log(request.url + " - Memory: "+process.memoryUsage().heapUsed);
			
			//if(process.env.NODE_ENV == 'production' && request.headers['x-forwarded-proto']!='https'){
			//    response.redirect('https://'+request.headers.host+request.url)
			//}else{
		
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

			//}
		
		//}catch(e){
		//	console.log(e.stack)
		//}
		
	  },
	  everyauth.middleware(),
	  require('facebook').Facebook()
	);
	
	if(process.env.NODE_ENV == 'production'){
		app.enable('view cache');
	}

	// listen to the PORT given to us in the environment
	var port = process.env.PORT || 3000;

	app.listen(port, function() {
	  console.log("Listening on " + port);
	});

	app.post('/', function(request, response){
		if (request.session.auth && request.session.logged){// || request.session.redir)) {
			response.redirect('/index');
		/*}else if(request.session.auth){
			request.session.redir = true;
			response.redirect(process.env.FACEBOOK_APP_URL);*/
		}else{
			var method = request.headers['x-forwarded-proto'] || 'http';
			var host = method + '://' + request.headers.host;
			request.session.logged = true;
			response.send('<script type="text/javascript">top.location.href = "'+host+'";</script>');
		}
	});

	app.all('/channel.html', function(req, res) {
		var cache_expire = 60 * 60 * 24 * 365;
		res.header('Pragma', 'public');
		res.header('Cache-Control', 'max-age=' + cache_expire);
		//res.header('Expires', 'public');
		res.render('channel.ejs', {layout: false});
	});

	global.amigos_usando = function(request, response, fn){
		if(!request.session.auth){
			fn(undefined);
		}else{
			if(request.session.amigos){
				fn(request.session.amigos);
			}else{
				var token = request.session.auth.facebook.accessToken;
				facebook.getSessionByAccessToken(token)(function(session) {
					session.restCall('fql.query', {
						query: 'SELECT uid, name, username, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
						format: 'json'
					})(function(amigos) {
						request.session.amigos = amigos;
						fn(amigos);
					});
				});
			}
		}
		
	};

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
	require('./controllers/campeonato.js');
	require('./controllers/offline.js');
	//require('./controllers/testando.js');
/*}catch(e){
	console.log(e.stack)
}*/