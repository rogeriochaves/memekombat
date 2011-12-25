app.all('/perfil', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			var socket_id = request.params.socket_id ? request.params.socket_id : uuid();

			session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
				
				var uid = request.params.uid ? request.params.uid : user.id;
				
				Personagem.findOne({uid: user.id}, function(err, data){
					if(data == null && request.params.uid){
						response.redirect('perfil');
					}else if(data == null){
						response.redirect('inicio');
					}else{
						var Characters = require('./../struct/Characters.js');
						var personagem = data;
						var session_erro = request.params.session_erro;
						var prox_nivel = Characters.exp_necessaria(personagem.level);
						
						response.render('perfil.ejs', {
				          layout:   false,
				          token:    token,
				          app:      app,
				          user:     user,
						  prox_nivel: prox_nivel,
						  personagem: personagem,
						  session_erro: session_erro,
						  portugues: (user.locale.indexOf('pt') >= 0),
				          socket_id: socket_id
				        });
						
						Characters.lutas_restantes(personagem._id, function(quant){
							socket_manager.send(socket_id, 'lutas_restantes', quant);
						});
					}
				});

		    });
			
		});

	}else{
		response.redirect('/');
	}

});