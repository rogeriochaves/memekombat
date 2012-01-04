app.all('/ranking', function(request, response) {

	//try{
	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
				
				
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
					
					amigos_uids.push(user.id);

					Personagem.where('uid').in(amigos_uids).sort('level', -1).select('nome', 'uid', 'ranking_pos', 'level').limit(10).run(function(err, amigos){
						Personagem.where().sort('level', -1).select('nome', 'uid', 'ranking_pos', 'level').limit(10).run(function(err, jogadores){
							response.render('ranking.ejs', {
								layout:   false,
						          token:    token,
						          user:     user,
								  amigos: amigos,
								  jogadores: jogadores,
								  portugues: (user.locale.indexOf('pt') >= 0)
						    });
						});
					});
					
				});
				
			//});
		});
	}else{
		response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
	}
	//}catch(e){
	//	console.log(e.stack)
	//}
});