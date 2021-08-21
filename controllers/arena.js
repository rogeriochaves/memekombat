var jogadores_arena = function(user, personagem, request, response, user){
	amigos_usando(request, response, function(result){
		var amigos_uids = [];
		if(result && result.forEach){
			result.forEach(function(friend) {
				amigos_uids.push(friend.id);
			});
		}

			Personagem
				.where('uid').in(amigos_uids)
				.where('level').lt(personagem.level + 3)
				.sort('-level random').limit(5)
				.select('uid level nome meme_src genero')
				.exec(function(err, amigos){
					amigos.forEach(function(p){
						//socket_manager.send(socket_id, 'player_arena', p);
						p.random = parseInt(Math.random() * 100);
						p.save();
					});
					var limite = 10 - amigos.length;

					amigos_uids.push(user.id);

					Personagem
						.where('uid').nin(amigos_uids)
						.where('level').lt(personagem.level + 2)
						.where('level').gt(personagem.level - 1)
						.sort('random -level').limit(limite)
						.select('uid level nome meme_src genero')
						.exec(function(err, outros_jogadores){
							outros_jogadores.forEach(function(p){
								//socket_manager.send(socket_id, 'player_arena', p);
								p.random = Math.random();
								p.save();
							});

							var Characters = require('./../struct/Characters.js');
							Characters.lutas_restantes(personagem._id, function(quant){
								response.render('arena.ejs', {
						          layout:   false,
						          user:     user,
								  busca: '',
								  players: amigos.concat(outros_jogadores),
								  lutas_restantes: quant,
								  portugues: (user.locale && user.locale.indexOf('pt') >= 0)
						        });

						        // garbage collect
								user = null;
								session = null;
								amigos = null;
								outros_jogadores = null;
						    });

							/*if(amigos.length == 0 && outros_jogadores.length == 0){
								socket_manager.send(socket_id, 'nenhum_encontrado');
							}*/


						});

				});
			//}else{
			//	response.send('');
			//}


	});
}

var busca_jogadores_arena = function(user, personagem, busca, request, response, user){
	amigos_usando(request, response, function(friends){
		var amigos_uids = friends.filter(function (friend) {
			return friend.name.indexOf(busca) >= 0
		}).map(function (friend) {
			return friends.id
		}).slice(0, 10);

		Personagem
			.where('uid').in(amigos_uids)
			.sort('-level random').limit(10)
			.select('uid level nome meme_src genero')
			.exec(function(err, amigos){
				amigos.forEach(function(p){
					//socket_manager.send(socket_id, 'player_arena', p);
					p.random = parseInt(Math.random() * 100);
					p.save();
				});
				var limite = 10 - amigos.length;

				if(limite > 0){
					amigos_uids.push(user.id);
					var IgnoraAcentos = require('./../lib/ignora_acentos.js');

					Personagem
						.where('uid').nin(amigos_uids)
						.sort('-level random').limit(limite)
						.select('uid level nome meme_src genero')
						.find({nome: new RegExp(".*"+IgnoraAcentos.ignora_acentos(busca.replace(' ','.*'))+".*", 'i')}, function(err, outros_jogadores){

							outros_jogadores.forEach(function(p){
								p.random = parseInt(Math.random() * 100);
								p.save();
							});

							var Characters = require('./../struct/Characters.js');
							Characters.lutas_restantes(personagem._id, function(quant){
								response.render('arena.ejs', {
						          layout:   false,
						          user:     user,
								  busca:   busca,
								  players: amigos.concat(outros_jogadores),
								  lutas_restantes: quant,
								  portugues: (user.locale && user.locale.indexOf('pt') >= 0)
						        });
						        // garbage collect
								user = null;
								session = null;
								amigos = null;
								outros_jogadores = null;
						    });

							/*if(amigos.length == 0 && outros_jogadores.length == 0){
								socket_manager.send(socket_id, 'nenhum_encontrado');
							}*/


						});
				  }

			});

	});
}

app.all('/arena', authMiddleware, function(request, response) {
	var user = request.session.auth.user;
	var busca = request.param('busca');

	Personagem.findOne({uid: user.id}, function(err, personagem){
		if(personagem != null){

			if(busca && busca.length > 0){
				busca_jogadores_arena(user, personagem, busca, request, response, user);
			}else{
				jogadores_arena(user, personagem, request, response, user);
			}

		}
	});
});
