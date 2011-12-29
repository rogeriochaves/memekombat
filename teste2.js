/*var redis = require("redis").createClient('9210', 'barracuda.redistogo.com');

redis.auth('43c56adf34497a80bf6cfbc4c3052dd5', function(a, b){
	console.log(a);
	console.log(b);
});*/

var express   = require('express');
var RedisStore = require('connect-redis')(express);
var MemoryStore = express.session.MemoryStore;
var url = require('url');
var sessionStore = new MemoryStore();

//var redisUrl = url.parse(process.env.REDISTOGO_URL),
//        redisAuth = redisUrl.auth.split(':');

    /*app.set('redisHost', redisUrl.hostname);
    app.set('redisPort', redisUrl.port);
    app.set('redisDb', redisAuth[0]);
    app.set('redisPass', redisAuth[1]);*/

	var redisHost = 'barracuda.redistogo.com'
      , redisPort = '9210'
      , redisDb = 'redistogo'
      , redisPass = '43c56adf34497a80bf6cfbc4c3052dd5';


var oneYear = 31557600000;
var app = express.createServer(
  //express.logger(),
  express.static(__dirname + '/public', { maxAge: oneYear }),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies

	express.session({ secret: 'l1k3@b055',
        store: new RedisStore({
            host: redisHost,
            port: redisPort,
            db: redisDb,
            pass: redisPass
        })
    })
	//express.session({store: sessionStore, key: 'express.sid', secret: (process.env.SESSION_SECRET || 'secret123') })
);

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.all('/sess', function(request, response) {

	request.session.x = 'y';
	response.redirect('teste');
	
});

app.all('/teste', function(request, response) {

	response.send('aew ' +request.session.x);
	
});