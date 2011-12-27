app.all('/callback', function(req, res) {
	console.log("===================================");
	console.log(req);
	console.log("===================================");
	console.log(req.param('method'));
	res.send('teste');
});