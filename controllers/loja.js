/*

Loja onde o jogador pode comprar lutas extras e armas

*/

app.all('/loja', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) { // caso usuário esteja autenticado

		var token = request.session.auth.facebook.accessToken; // token de acesso
		facebook.getSessionByAccessToken(token)(function(session) { // usuário autenticado

			var user = request.session.auth.facebook.user;
			
			Personagem.findOne({uid: user.id}, function(err, data){ // encontra o personagem
				if(data == null){
					response.redirect('inicio');
				}else{
					
					// verifica se ele possui alguma das espadas elementais (pois ele só pode comprar uma delas)
					var possui_elemental = (data.equipamentos.indexOf(13) >= 0 || data.equipamentos.indexOf(18) >= 0 || data.equipamentos.indexOf(19) >= 0);
					
					// renderiza a loja
					response.render('loja.ejs', {
						layout:   false,
				          token:    token,
				          user:     user,
						  espadas_elementais: possui_elemental,
						  darkness_sword: false,
						  knigt_sword: false,
						  dragun_sword: false,
						  rank: true,
						  portugues: (user.locale.indexOf('pt') >= 0)
				    });
				}
			});

		});
	}else{
		response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
	}
});