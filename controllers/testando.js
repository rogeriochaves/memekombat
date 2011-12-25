render_testando = function(request, response){
	response.render('testando.ejs', {
      layout:   false
	});
}

app.all('/testando', function(request, response) {
	
	var Characters = require('./../struct/Characters.js');
	
	render_testando(request, response);
});