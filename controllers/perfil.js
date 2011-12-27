app.all('/perfil', function(request, response) {

	try{
	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {

		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			var socket_id = request.param('socket_id') ? request.param('socket_id') : uuid();

			//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
				
				var uid = request.param('uid') ? request.param('uid') : user.id;
				
				Personagem.findOne({uid: uid}, function(err, data){
					if(data == null && request.params.uid){
						response.redirect('perfil');
					}else if(data == null){
						response.redirect('inicio');
					}else{
						var Characters = require('./../struct/Characters.js');
						var personagem = data;
						var session_erro = request.session.erro;
						var prox_nivel = Characters.exp_necessaria(personagem.level);
						
						if(request.session.erro) delete request.session.erro;
						
						
						
							
							Arquivamento
								.where('_id')
								.in(personagem.arquivamentos)
								.select('img', 'texto_cima', 'texto_baixo', 'texto_cima_en', 'texto_baixo_en')
								.find(function(err, arquivamentos){
								
									if(uid == user.id){
										Personagem.where().select('nome', 'uid').find({indicacao_id: personagem._id}, function(err, pupilos){

											var quant_pupilos = pupilos.length;
											if(quant_pupilos > 6){
												pupilos = pupilos.splice(0, 6);
											}
											
											Characters.lutas_restantes(personagem._id, function(quant){
												response.render('perfil.ejs', {
										          layout:   false,
										          token:    token,
										          user:     user,
												  prox_nivel: prox_nivel,
												  lutas_restantes: quant,
												  personagem: personagem,
												  arquivamentos: arquivamentos,
												  pupilos: pupilos,
												  quant_pupilos: quant_pupilos,
												  session_erro: session_erro,
												  portugues: (user.locale.indexOf('pt') >= 0),
										          socket_id: socket_id
										        });
											});
											
										});
									}else{
										Personagem.find({indicacao_id: personagem._id}).count(function(err, quant_pupilos){
											response.render('perfil.ejs', {
									          layout:   false,
									          token:    token,
									          user:     user,
											  prox_nivel: prox_nivel,
											  personagem: personagem,
											  quant_pupilos: quant_pupilos,
											  arquivamentos: arquivamentos,
											  session_erro: session_erro,
											  portugues: (user.locale.indexOf('pt') >= 0),
									          socket_id: socket_id
									        });
										});
									}
								
							});
						
						
						/*Arquivamento
							.where('_id')
							.in(personagem.arquivamentos)
							.select('img', 'texto_cima', 'texto_baixo', 'texto_cima_en', 'texto_baixo_en')
							.find(function(err, arquivs){
								arquivs.forEach(function(arquiv){
									socket_manager.send(socket_id, 'arquivamento', arquiv);
								});
						});*/
						
						/*Personagem.where().limit(6).select('nome', 'uid').find({indicacao_id: personagem._id}, function(err, pupilos){
							pupilos.forEach(function(pupilo){
								socket_manager.send(socket_id, 'pupilo', pupilo);
							});
						});*/
						
						/*Personagem.find({indicacao_id: personagem._id}).count(function(err, quant){
							socket_manager.send(socket_id, 'quant_pupilos', quant);
						});*/
						
						
					}
				});

		    //});
			
		});

	}else{
		response.redirect('/');
	}
	}catch(e){
		console.log(e.stack)
	}

});