app.all('/ranking', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
				
				
				session.restCall('fql.query', {
					query: 'SELECT uid FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
					format: 'json'
				})(function(result) {
					var amigos_uids = [];
					result.forEach(function(friend) {
						amigos_uids.push(friend.uid);
					});
					amigos_uids.push(user.id);

					Personagem.where('uid').in(amigos_uids).sort('level', -1).limit(10).run(function(err, amigos){
						Personagem.where().sort('level', -1).limit(10).run(function(err, jogadores){
							response.render('ranking.ejs', {
								layout:   false,
						          token:    token,
						          app:      app,
						          user:     user,
								  amigos: amigos,
								  jogadores: jogadores,
								  portugues: (user.locale.indexOf('pt') >= 0)
						    });
						});
					});
					
				});
				
			});
		});
	}else{
		response.redirect('/');
	}
});