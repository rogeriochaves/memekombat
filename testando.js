var express   = require('express');
var MemoryStore = express.session.MemoryStore;

var app = express.createServer(
  //express.logger(),
  express.errorHandler(),
  express.static(__dirname + '/public'),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies

	express.session({ secret: '***REMOVED***', store: new MemoryStore()}),
	function(request, response, next) {
		console.log(request.url + " - antes: "+process.memoryUsage().heapUsed);
		next();
	}
);

process.env.FACEBOOK_APP_ID = '130619640386826';
process.env.FACEBOOK_SECRET = '***REMOVED***';
process.env.FACEBOOK_APP_HOME = 'http://localhost:3000/';

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.all('/channel.html', function(req, res) {
	var cache_expire = 60 * 60 * 24 * 365;
	res.header('Pragma', 'public');
	res.header('Cache-Control', 'max-age=' + cache_expire);
	//res.header('Expires', 'public');
	res.render('channel.ejs', {layout: false});
});

app.all('/', function(request, response) {
	
	/*var Characters = require('./../struct/Characters.js');
	var num = request.param('num');
	render_testando(request, response, num);*/
	//response.send('wtf');
	response.render('testando.ejs', {layout: false});
	console.log(request.url + " - depois: "+process.memoryUsage().heapUsed);
});