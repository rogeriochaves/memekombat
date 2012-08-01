/*
	Arquivo para rodar o servidor do node utilizando Forever
*/

var forever = require('forever');

var child = new (forever.Monitor)('web.js', {
  max: 3,
  silent: false,
  options: [],
  killTree: true
});

//child.on('exit', this.callback);
child.start();

forever.startServer(child);