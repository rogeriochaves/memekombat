app.all('/callback', function(req, res) {
	console.log("===================================");
	console.log(req.param('credits'));
	console.log("===================================");
	console.log(req.param('signed_request'));
	res.send('teste');
});