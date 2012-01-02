var forever = require('forever');

var child = new (forever.Monitor)('web.js', {
  max: 5,
  silent: false,
  options: []
});

//child.on('exit', this.callback);
child.start();

forever.startServer(child);