app.all('/tos', function(request, response) {
	
	response.render('tos.ejs', {
	      layout:   false
	});
	
});

app.all('/pp', function(request, response) {
	
	response.render('pp.ejs', {
	      layout:   false
	});
	
});