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
	process.env.FACEBOOK_APP_ID = '282893221758514';
	process.env.FACEBOOK_SECRET = '***REMOVED***';
	process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattwo/';
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

// create an express webserver
global.app = express.createServer(
  //express.logger(),
  express.static(__dirname + '/public'),
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
var io = require('socket.io').listen(app);

// wrap socket.io with basic identification and message queueing
// code is in lib/socket_manager.js
global.socket_manager = require('socket_manager').create(io);

// use xhr-polling as the transport for socket.io
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set('log level', 1);
});

// respond to GET /home
app.get('/home', function(request, response) {

  // detect the http method uses so we can replicate it on redirects
  var method = request.headers['x-forwarded-proto'] || 'http';

  // if we have facebook auth credentials
  if (request.session.auth) {

    // initialize facebook-client with the access token to gain access
    // to helper methods for the REST api
    var token = request.session.auth.facebook.accessToken;
    facebook.getSessionByAccessToken(token)(function(session) {

      // generate a uuid for socket association
      var socket_id = uuid();

      // query 4 friends and send them to the socket for this socket id
      session.graphCall('/me/friends&limit=4')(function(result) {
        result.data.forEach(function(friend) {
          socket_manager.send(socket_id, 'friend', friend);
        });
      });

      // query 16 photos and send them to the socket for this socket id
      session.graphCall('/me/photos&limit=16')(function(result) {
        result.data.forEach(function(photo) {
          socket_manager.send(socket_id, 'photo', photo);
        });
      });

      // query 4 likes and send them to the socket for this socket id
      session.graphCall('/me/likes&limit=4')(function(result) {
        result.data.forEach(function(like) {
          socket_manager.send(socket_id, 'like', like);
        });
      });

      // use fql to get a list of my friends that are using this app
      session.restCall('fql.query', {
        query: 'SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1',
        format: 'json'
      })(function(result) {
        result.forEach(function(friend) {
          socket_manager.send(socket_id, 'friend_using_app', friend);
        });
      });

      // get information about the app itself
      session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {

        // render the home page
        response.render('home.ejs', {
          layout:   false,
          token:    token,
          app:      app,
          user:     request.session.auth.facebook.user,
          home:     method + '://' + request.headers.host + '/',
          redirect: method + '://' + request.headers.host + request.url,
          socket_id: socket_id
        });

      });
    });

  } else {

    // not authenticated, redirect to / for everyauth to begin authentication
    response.redirect('/');

  }
});

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