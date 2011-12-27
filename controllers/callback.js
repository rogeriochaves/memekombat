app.all('/callback', function(req, res) {
	console.log("===================================");
	console.log(req.query);
	console.log("===================================");
	console.log(req.body);
	console.log("===================================");
	console.log(req.param('method'));
	res.send('teste');
});