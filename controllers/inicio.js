/*

Após ser autenticado, caso o jogador ainda não tenha um personagem no jogo,
ele será redirecionado para esta página

*/

app.all('/inicio', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) { // caso tenha sido autenticado

		var token = request.session.auth.facebook.accessToken; // token de acesso
		facebook.getSessionByAccessToken(token)(function(session) { // usuário autenticado
				
			// requisita os amigos que já estão jogando
			session.restCall('fql.query', {
				query: 'SELECT uid, name, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
				format: 'json'
			})(function(amigos) {
				
				var user = request.session.auth.facebook.user;
		        // renderiza a página
		        response.render('inicio.ejs', {
		          layout:   false,
		          token:    token,
		          user:     user,
		 		  amigos: amigos,
				  portugues: (user.locale.indexOf('pt') >= 0),
		          home:     method + '://' + request.headers.host + '/',
		          redirect: method + '://' + request.headers.host + request.url,
		          //socket_id: socket_id
		        });
				
			});
				
		});

	}else{
		response.redirect('/');
	}

});