render_testando = function(request, response, num){
	response.render('testando.ejs', {
      layout:   false,
		num: num
	});
}

app.all('/testando', function(request, response) {
	
	var Characters = require('./../struct/Characters.js');
	var num = request.param('num');
	render_testando(request, response, num);
});