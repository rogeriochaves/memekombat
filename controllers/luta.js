app.all('/luta/:id?', function(request, response) {

	//try{
	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) {
		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {
			//var socket_id = request.param('socket_id') ? request.param('socket_id') : uuid();
			//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
				
				var user = request.session.auth.facebook.user;
				var luta_id = request.params.id ? request.params.id : (request.param('id') ? request.param('id') : undefined);
				
				Personagem.findOne({uid: user.id}, function(err, personagem){
					
					if(personagem != null){

						amigos_usando(request, response, function(amigos){

							if(request.param('vs')){
								var vs = request.param('vs');
								if(vs == user.id){
									response.redirect('/arena');
								}else{
								
									var Characters = require('./../struct/Characters.js');
									Characters.lutas_restantes(personagem._id, function(quant){
										if(quant <= 0){
											request.session.erro = (user.locale.indexOf('pt') >= 0) ? 'Você já lutou muitas vezes hoje e seu meme está cansado, <br />volte amanhã. Quer mais lutas? <a href="loja">Clique aqui</a>' : 'You\'ve fought too many times today and you meme is tired, <br />come back tomorrow. Want more? <a href="loja">Clique here</a>';
											response.redirect('/perfil');
										}else{
											
											Personagem.findOne({uid: vs}, function(err, p2){
												
												if(p2 != null){
													var GerarLuta = require('./../struct/GerarLuta.js');
													GerarLuta.gerar_luta(personagem, p2, false, function(luta, luta_id, vencedor, perdedor, short_url){
														var Randomize = require('./../struct/Randomize.js');
														var movimentos = Randomize.imprimir_movimentos(luta.movimentos);

														var is_friend = false;
														if(vencedor.uid == user.id){
															for(var i = amigos.length; i--;){
																if(perdedor.uid == amigos[i].uid){
																	is_friend = true;
																	break;
																}
															}
														}
														
														response.render('luta.ejs', {
												          layout:   false,
												          user:     user,
														  luta_id: luta_id,
														  p1: personagem,
														  p2: p2,
														  movimentos: movimentos,
														  is_friend: is_friend,
														  campeonato: (request.param('campeonato') ? true : false),
														  vencedor: vencedor,
														  perdedor: perdedor,
														  lutas_restantes: quant,
														  app_url: process.env.FACEBOOK_APP_URL,
														  app_home: process.env.FACEBOOK_APP_HOME,
														  short_url: short_url,
														  portugues: (user.locale.indexOf('pt') >= 0)
												        });

												        // garbage collect
														user = null;
														session = null;
														p1 = null;
														p2 = null;
														personagem = null;
														vencedor = null;
														perdedor = null;
														movimentos = null;
														
													});
													
													
												}else{
													response.redirect('/arena');
												}
												
											});
											
										}
									});
								
								}
							
							
							}else if(luta_id){
								
								Luta.findOne({_id: luta_id}, function(err, luta){
									if(luta == null){
										response.redirect('/perfil');
									}else{
										
										Personagem.findById(luta.personagem1_id).select('_id', 'nome', 'uid', 'hp', 'genero', 'level', 'meme_src').run(function(err, p1){
											
											Personagem.findById(luta.personagem2_id).select('_id', 'nome', 'uid', 'hp', 'genero', 'level', 'meme_src').run(function(err, p2){
												
												if(p1 == null || p2 == null){
													response.redirect('/perfil');
												}else{
													var vencedor = (p1._id.toString() == luta.ganhador_id.toString() ? p1 : p2);
													var perdedor = (p1._id.toString() == luta.ganhador_id.toString() ? p2 : p1);
													
													var is_friend = false;
													if(vencedor.uid == user.id){
														for(var i = amigos.length; i--;){
															if(perdedor.uid == amigos[i].uid){
																is_friend = true;
																break;
															}
														}
													}

													var Characters = require('./../struct/Characters.js');
													Characters.lutas_restantes(personagem._id, function(quant){
														response.render('luta.ejs', {
												          layout:   false,
												          app:      app,
												          user:     user,
														  luta_id: luta_id,
														  p1: p1,
														  p2: p2,
														  movimentos: luta.movimentos,
														  is_friend: is_friend,
														  campeonato: (request.param('campeonato') ? true : false),
														  vencedor: vencedor,
														  perdedor: perdedor,
														  lutas_restantes: quant,
														  app_url: process.env.FACEBOOK_APP_URL,
														  app_home: process.env.FACEBOOK_APP_HOME,
														  short_url: luta.short_url,
														  portugues: (user.locale.indexOf('pt') >= 0)
												        });

												        // garbage collect
														user = null;
														session = null;
														p1 = null;
														p2 = null;
														personagem = null;
														vencedor = null;
														perdedor = null;
														movimentos = null;
												        
													});
													
												}
											});
											
										});
										
										
									}
								});
							
							}else{
								response.redirect('/');
							}
						});
					}else{
						response.send('');
					}
					
				});
				
			//});
		});
	}else{
		//response.redirect('/');
		response.send('<a href="http://apps.facebook.com/meme_kombat">Veja a luta no Meme Kombat</a>');
	}
	//}catch(e){
	//	console.log(e.stack)
	//}
	
});