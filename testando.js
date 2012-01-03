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

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.all('/testando', function(request, response) {
	
	/*var Characters = require('./../struct/Characters.js');
	var num = request.param('num');
	render_testando(request, response, num);*/
	response.send('wtf');
	console.log(request.url + " - depois: "+process.memoryUsage().heapUsed);
});