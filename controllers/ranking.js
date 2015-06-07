/*

Página que mostra o ranking de amigos e ranking geral

*/

app.all('/ranking', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {
		// passos de autorização
		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			var user = request.session.auth.facebook.user;

			// lista de amigos jogando o jogo
			amigos_usando(request, response, function(result){

				// faz uma array apenas com os uids dos amigos
				var amigos_uids = [];
				if(result && result.forEach){
					result.forEach(function(friend) {
						amigos_uids.push(friend.uid);
					});
				}

				// inclui o próprio personagem na lista de amigos
				amigos_uids.push(user.id);

				// seleciona os top 10 amigos
				Personagem.where('uid').in(amigos_uids).sort('level', -1).select('nome', 'uid', 'ranking_pos', 'level').limit(10).run(function(err, amigos){
					// seleciona os top 10 personagens
					Personagem.where().sort('level', -1).select('nome', 'uid', 'ranking_pos', 'level', 'meme_src').limit(10).run(function(err, jogadores){
						response.render('ranking.ejs', {
							layout:   false,
					          token:    token,
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
	}else{ // caso não esteja autenticado
		response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
	}
});