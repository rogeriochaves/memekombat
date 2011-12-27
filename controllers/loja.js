app.all('/loja', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
				
				Personagem.findOne({uid: user.id}, function(err, data){
					if(data == null){
						response.redirect('inicio');
					}else{
						
						response.render('loja.ejs', {
							layout:   false,
					          token:    token,
					          app:      app,
					          user:     user,
							  espadas_elementais: false,
							  darkness_sword: false,
							  knigt_sword: false,
							  dragun_sword: false,
							  rank: true,
							  portugues: (user.locale.indexOf('pt') >= 0)
					    });
					}
				});
			});
		});
	}else{
		response.redirect('/');
	}
});