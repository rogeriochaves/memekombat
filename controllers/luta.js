/*

Página da luta, caso seja passado um parâmetro ID, é porque está revendo uma luta antiga,
caso seja um parâmetro VS, é pq está desafiando alguém

*/

app.all('/luta/:id?', function(request, response) {

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth) { // se o usuário estiver logado
		var token = request.session.auth.facebook.accessToken; // token de acesso
		facebook.getSessionByAccessToken(token)(function(session) { // usuario autenticado
				
			var user = request.session.auth.facebook.user;
			// id da luta, passado por url ou por parâmetro
			var luta_id = request.params.id ? request.params.id : (request.param('id') ? request.param('id') : undefined);
			
			Personagem.findOne({uid: user.id}, function(err, personagem){ // seleciona o personagem
				
				if(personagem != null){

					amigos_usando(request, response, function(amigos){ // seleciona os amigos utilizando o app

						if(request.param('vs')){ // caso haja um param vs, é porque está desafiando alguém
							var vs = request.param('vs');
							if(vs == user.id){ // caso ele desafie ele mesmo
								response.redirect('/arena'); // redireciona para a arena
							}else{
							
								var Characters = require('./../struct/Characters.js');
								Characters.lutas_restantes(personagem._id, function(quant){ // verifica se o jogador possui lutas disponíveis
									if(quant <= 0){ // se não possuir lutas disponíveis
										request.session.erro = (user.locale.indexOf('pt') >= 0) ? 'Você já lutou muitas vezes hoje e seu meme está cansado, <br />volte amanhã. Quer mais lutas? <a href="loja">Clique aqui</a>' : 'You\'ve fought too many times today and you meme is tired, <br />come back tomorrow. Want more? <a href="loja">Clique here</a>';
										response.redirect('/perfil'); // o redireciona para o perfil com uma mensagem
									}else{ // se possuir
										Personagem.findOne({uid: vs}, function(err, p2){ // consulta o personagem desafiado
											
											if(p2 != null){ // caso ele exista
												var GerarLuta = require('./../struct/GerarLuta.js');
												// gera a luta entre o jogador e o player desafiado
												GerarLuta.gerar_luta(personagem, p2, false, function(luta, luta_id, vencedor, perdedor, short_url){
													var Randomize = require('./../struct/Randomize.js');
													// transforma a array de movimentos em uma string para repassar ao client
													var movimentos = Randomize.imprimir_movimentos(luta.movimentos);

													// verifica se é amigo do desafiado (para mostrar um botão postar no mural de fulano)
													var is_friend = false;
													if(vencedor.uid == user.id){
														for(var i = amigos.length; i--;){
															if(perdedor.uid == amigos[i].uid){
																is_friend = true;
																break;
															}
														}
													}
													
													// renderiza a página
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
												
												
											}else{ // se o jogador desafiado não existir
												response.redirect('/arena');
											}
											
										});
										
									}
								});
							
							}
						
						
						}else if(luta_id){ // caso esteja revendo uma luta que já aconteceu
							
							Luta.findOne({_id: luta_id}, function(err, luta){ // busca a luta
								if(luta == null){ // redireciona para o perfil caso ela não exista
									response.redirect('/perfil');
								}else{
									// seleciona o player1 e o player2 da luta
									Personagem.findById(luta.personagem1_id).select('_id', 'nome', 'uid', 'hp', 'genero', 'level', 'meme_src').run(function(err, p1){
										
										Personagem.findById(luta.personagem2_id).select('_id', 'nome', 'uid', 'hp', 'genero', 'level', 'meme_src').run(function(err, p2){
											
											if(p1 == null || p2 == null){ // caso um dos dois não exista, redireciona
												response.redirect('/perfil');
											}else{
												// encontra qual dos dois é o vencedor e qual é o perdedor
												var vencedor = (p1._id.toString() == luta.ganhador_id.toString() ? p1 : p2);
												var perdedor = (p1._id.toString() == luta.ganhador_id.toString() ? p2 : p1);
												
												// verifica se o vencedor é amigo do perdedor
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
												// consulta a quantidade de lutas restantes do personagem (para ao final da luta decidir se mostrará um botão de voltar ao perfil, ou voltar à arena)
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
						
						}else{ // caso não tenha nem ID nem VS
							response.redirect('/');
						}
					});
				}else{ // caso não haja personagem
					response.send('');
				}
				
			});
		});
	}else{ // caso não esteja autenticado
		response.send('<a href="http://apps.facebook.com/meme_kombat">Veja a luta no Meme Kombat</a>');
	}
	
});