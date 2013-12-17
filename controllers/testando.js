app.all('/testando', function(request, response) {
	
	response.render('testando.ejs', {
	      layout:   false
	});
	
});