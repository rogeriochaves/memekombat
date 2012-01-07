app.all('/offline', function(request, response) {
	
	response.render('offline.ejs', {
	      layout:   false
	});
	
});