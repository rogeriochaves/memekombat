/*

Loja onde o jogador pode comprar lutas extras e armas

*/

app.all('/loja', authMiddleware, function(request, response) {

	var user = request.session.auth.user;

	Personagem.findOne({uid: user.id}, function(err, data){ // encontra o personagem
		if(data == null){
			response.redirect('inicio');
		}else{

			// verifica se ele possui alguma das espadas elementais (pois ele só pode comprar uma delas)
			var possui_elemental = (data.equipamentos.indexOf(13) >= 0 || data.equipamentos.indexOf(18) >= 0 || data.equipamentos.indexOf(19) >= 0);

			// renderiza a loja
			response.render('loja.ejs', {
				layout:   false,
					user:     user,
					espadas_elementais: possui_elemental,
					darkness_sword: false,
					knigt_sword: false,
					dragun_sword: false,
					rank: true,
					portugues: (user.locale && user.locale.indexOf('pt') >= 0)
			});
		}
	});

});