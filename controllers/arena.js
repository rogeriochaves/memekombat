var jogadores_arena = function(user, session, personagem, request, response, user){
	session.restCall('fql.query', {
		query: 'SELECT uid FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
		format: 'json'
	})(function(result) {
		var amigos_uids = [];
		if(result && result.forEach){
			result.forEach(function(friend) {
				amigos_uids.push(friend.uid);
			});
		}

			Personagem
				.where('uid').in(amigos_uids)
				.where('level').lt(personagem.level + 3)
				.sort('level', -1, 'random', 1).limit(5)
				.select('uid', 'level', 'nome', 'meme_src', 'genero')
				.run(function(err, amigos){
					amigos.forEach(function(p){
						//socket_manager.send(socket_id, 'player_arena', p);
						p.random = Math.random();
						p.save();
					});
					var limite = 10 - amigos.length;

					amigos_uids.push(user.id);

					Personagem
						.where('uid').nin(amigos_uids)
						.where('level').lt(personagem.level + 3)
						.sort('level', -1, 'random', 1).limit(limite)
						.select('uid', 'level', 'nome', 'meme_src', 'genero')
						.run(function(err, outros_jogadores){
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
								  portugues: (user.locale.indexOf('pt') >= 0)
						        });
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

var busca_jogadores_arena = function(user, session, personagem, busca, request, response, user){
	session.restCall('fql.query', {
		query: 'SELECT uid FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 AND strpos(lower(name), lower("'+busca.replace("'", "\\'")+'")) >= 0 ORDER BY rand() LIMIT 10',
		format: 'json'
	})(function(result) {
		var amigos_uids = [];
		result.forEach(function(friend) {
			amigos_uids.push(friend.uid);
		});
		
		Personagem
			.where('uid').in(amigos_uids)
			.sort('level', -1, 'random', 1).limit(10)
			.select('uid', 'level', 'nome', 'meme_src', 'genero')
			.run(function(err, amigos){
				amigos.forEach(function(p){
					//socket_manager.send(socket_id, 'player_arena', p);
					p.random = Math.random();
					p.save();
				});
				var limite = 10 - amigos.length;

				if(limite > 0){
					amigos_uids.push(user.id);
					var IgnoraAcentos = require('./../lib/ignora_acentos.js');
				
					Personagem
						.where('uid').nin(amigos_uids)
						.sort('level', -1, 'random', 1).limit(limite)
						.select('uid', 'level', 'nome', 'meme_src', 'genero')
						.find({nome: new RegExp(".*"+IgnoraAcentos.ignora_acentos(busca.replace(' ','.*'))+".*", 'i')}, function(err, outros_jogadores){

							outros_jogadores.forEach(function(p){
								
								p.random = Math.random();
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
								  portugues: (user.locale.indexOf('pt') >= 0)
						        });
						    });

							/*if(amigos.length == 0 && outros_jogadores.length == 0){
								socket_manager.send(socket_id, 'nenhum_encontrado');
							}*/


						});
				  }
				
			});
		
	});
}

app.all('/arena', function(request, response) {

	try{
	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			var socket_id = request.param('socket_id') ? request.param('socket_id') : uuid();
			//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
				var busca = request.param('busca');
				
				Personagem.findOne({uid: user.id}, function(err, personagem){
					if(personagem != null){
						
						if(busca && busca.length > 0){
							busca_jogadores_arena(user, session, personagem, busca, request, response, user);
						}else{
							jogadores_arena(user, session, personagem, request, response, user);
						}
						
					}
				});

		    //});
			
		});

	}else{
		response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
	}
	}catch(e){
		console.log(e.stack)
	}

});