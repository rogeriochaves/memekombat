/*

Quando vou fazer uma manutenção prolongada, coloco os outros controllers para redirecionar para este,
que exibe uma mensagem de manutenção

*/

app.all('/offline', function(request, response) {
	
	response.render('offline.ejs', {
	      layout:   false
	});
	
});