/*

Página que mostra o ranking de amigos e ranking geral

*/

app.all('/ranking', authMiddleware, function(request, response) {

	var user = request.session.auth.user;

	// lista de amigos jogando o jogo
	amigos_usando(request, response, function(result){

		// faz uma array apenas com os uids dos amigos
		var amigos_uids = [];
		if(result && result.forEach){
			result.forEach(function(friend) {
				amigos_uids.push(friend.id);
			});
		}

		// inclui o próprio personagem na lista de amigos
		amigos_uids.push(user.uid);

		// seleciona os top 10 amigos
		Personagem.where('uid').in(amigos_uids).sort('-level').select('nome avatar uid ranking_pos level meme_src genero').limit(10).exec(function(err, amigos){
			// seleciona os top 10 personagens
			Personagem.where().sort('-level').select('nome avatar uid ranking_pos level meme_src genero').limit(10).exec(function(err, jogadores){
				response.render('ranking.ejs', {
					layout:   false,
						user:     user,
						amigos: amigos,
						jogadores: jogadores,
						portugues: (user.locale && user.locale.indexOf('pt') >= 0)
				});

				// garbage collect
				user = null;
				session = null;
				amigos = null;
				jogadores = null;
			});
		});

	});

});
