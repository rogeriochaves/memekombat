app.all('/_arena', function(request, response) {

	var method = 'https';//request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			var arena_uids = request.param('arena_uids') ? request.param('arena_uids').replace("'", '').split(',') : [];

				var user = request.session.auth.facebook.user;
				var busca = request.param('busca');

				Personagem.findOne({uid: user.id}, function(err, personagem){
					if(personagem != null){
						amigos_usando(request, response, function(friends){
							var amigos_uids = friends.map(function (friend) {
								return friend.id;
							});

							var requisicoes = parseInt(arena_uids.length / 8);

							Personagem
								.where('uid').in(amigos_uids)
								.where('uid').nin(arena_uids)
								.where('level').lt(personagem.level + requisicoes + 2)
								.sort('-level random').limit(5)
								.select('uid level nome meme_src genero')
								.exec(function(err, amigos){
									amigos.forEach(function(p){
										p.random = Math.random();
										p.save();
									});
									var limite = 10 - amigos.length;

									amigos_uids.push(user.id);

									Personagem
										.where('uid').nin(amigos_uids.concat(arena_uids))
										.where('level').lt(personagem.level + requisicoes + 2)
										.sort('-level random').limit(limite)
										.select('uid level nome meme_src genero')
										.exec(function(err, outros_jogadores){

											outros_jogadores.forEach(function(p){
												p.random = Math.random();
												p.save();
											});

											response.render('_arena.ejs', {
												layout:   false,
												token:    token,
												user:     user,
												players:  amigos.concat(outros_jogadores),
												portugues: (user.locale && user.locale.indexOf('pt') >= 0)/*,
												socket_id: socket_id*/
											});

										});

								});


						});


					}
				});
		});
	}else{
		response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
	}
});
