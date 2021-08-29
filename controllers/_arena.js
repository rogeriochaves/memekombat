app.all('/_arena', authMiddleware, function(request, response) {
	var arena_uids = request.param('arena_uids') ? request.param('arena_uids').replace("'", '').split(',') : [];

	var user = request.session.auth.user;
	// TODO: fix busca load more
	var busca = request.param('busca');

	Personagem.findOne({uid: user.uid}, function(err, personagem){
		if(personagem != null){
			amigos_usando(request, response, function(friends){
				var amigos_uids = friends.map(function (friend) {
					return friend.uid;
				});

				var requisicoes = parseInt(arena_uids.length / 8);

				Personagem
					.where('uid').in(amigos_uids)
					.where('uid').nin(arena_uids)
					.where('level').lt(personagem.level + requisicoes + 2)
					.sort('-level random').limit(5)
					.select('uid avatar level nome meme_src genero')
					.exec(function(err, amigos){
						amigos.forEach(function(p){
							p.random = Math.random();
							p.save();
						});
						var limite = 10 - amigos.length;

						amigos_uids.push(user.uid);

						Personagem
							.where('uid').nin(amigos_uids.concat(arena_uids))
							.where('level').lt(personagem.level + requisicoes + 2)
							.sort('-level random').limit(limite)
							.select('uid avatar level nome meme_src genero')
							.exec(function(err, outros_jogadores){

								outros_jogadores.forEach(function(p){
									p.random = Math.random();
									p.save();
								});

								response.render('_arena.ejs', {
									layout:   false,
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
