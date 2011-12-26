app.all('/arena', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			var socket_id = request.param('socket_id') ? request.param('socket_id') : uuid();
			session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
				var uid = request.param('uid') ? request.param('uid') : user.id;
				
				response.render('arena.ejs', {
		          layout:   false,
		          token:    token,
		          app:      app,
		          user:     user,
				  portugues: (user.locale.indexOf('pt') >= 0),
		          socket_id: socket_id
		        });
		
				Personagem.findOne({uid: user.id}, function(err, personagem){
					if(personagem != null){
						
						session.restCall('fql.query', {
							query: 'SELECT uid FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
							format: 'json'
						})(function(result) {
							var amigos_uids = [];
							result.forEach(function(friend) {
								amigos_uids.push(friend.uid);
							});

							//var arena_uids = request.param('arena_uids') ? request.param('arena_uids').split(',') : [];
							//var requisicoes = parseInt(arena_uids.length / 8);

							//amigos_uids.push(user.id);

							Personagem
								.where('uid').in(amigos_uids)
								.where('level').lt(personagem.level + 3)
								.sort('random', 1).limit(5)
								.select('uid', 'level', 'nome', 'meme_src', 'genero')
								.run(function(err, amigos){
									amigos.forEach(function(p){
										socket_manager.send(socket_id, 'player_arena', p);
										p.random = Math.random();
										p.save();
									});
									var limite = 10 - amigos.length;
									
									amigos_uids.push(user.id);
									
									Personagem
										.where('uid').nin(amigos_uids)
										.where('level').lt(personagem.level + 3)
										.sort('random', 1).limit(limite)
										.select('uid', 'level', 'nome', 'meme_src', 'genero')
										.run(function(err, outros_jogadores){
										
											outros_jogadores.forEach(function(p){
												socket_manager.send(socket_id, 'player_arena', p);
											});
											
											if(amigos.length == 0 && outros_jogadores.length == 0){
												socket_manager.send(socket_id, 'nenhum_encontrado');
											}
											
											
										});
									
								});

							//var limit = 12 - Math.max(3, result.length);



						});
						
					}
				});
		
				
		
		

		    });
			
		});

	}else{
		response.redirect('/');
	}

});