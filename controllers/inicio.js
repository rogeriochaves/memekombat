/*

Após ser autenticado, caso o jogador ainda não tenha um personagem no jogo,
ele será redirecionado para esta página

*/

app.all('/inicio', authMiddleware, function(request, response) {

	// requisita os amigos que já estão jogando
	amigos_usando(request, response, function(amigos){

		var user = request.session.auth.user;
		// renderiza a página
		response.render('inicio.ejs', {
			layout:   false,
			user:     user,
				amigos: amigos,
				portugues: (user.locale && user.locale.indexOf('pt') >= 0),
			//socket_id: socket_id
		});

	});

});
