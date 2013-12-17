app.all('/game/testando', function(request, response) {
	
	response.render('testando.ejs', {
	      layout:   false
	});
	
});