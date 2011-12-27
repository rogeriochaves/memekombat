app.all('/inicio', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			var socket_id = uuid();

			session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
		        // render the home page
		        response.render('inicio.ejs', {
		          layout:   false,
		          token:    token,
		          app:      app,
		          user:     user,
				  portugues: (user.locale.indexOf('pt') >= 0),
		          home:     method + '://' + request.headers.host + '/',
		          redirect: method + '://' + request.headers.host + request.url,
		          socket_id: socket_id
		        });

		    });

			// Amigos que jogam
			/*session.restCall('fql.query', {
				query: 'SELECT uid, name, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
				format: 'json'
			})(function(result) {
				result.forEach(function(friend) {
					socket_manager.send(socket_id, 'friend_using_app', friend);
				});
			});*/
			
		});

	}else{
		response.redirect('/');
	}

});