var render_index = function(req, res, session, novo_personagem){
	
	var token = req.session.auth.facebook.accessToken;
	var user = req.session.auth.facebook.user;
	
	require('date-utils');
	var hora_servidor = (new Date()).toFormat('HH24:MI:SS');

	//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {
		
		// Amigos que jogam
		session.restCall('fql.query', {
			query: 'SELECT uid, name, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand() LIMIT 6',
			format: 'json'
		})(function(friends_using) {
			/*result.forEach(function(friend) {
				socket_manager.send(socket_id, 'friend_using_app', friend);
			});*/

			var limit = 12 - Math.max(3, friends_using.length);

			session.restCall('fql.query', {
				query: 'SELECT uid, name, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 0 ORDER BY rand() LIMIT '+limit,
				format: 'json'
			})(function(friends_not_using) {
				//if(friends_not_using){
					/*result.forEach(function(friend) {
						socket_manager.send(socket_id, 'friend_not_using_app', friend);
					});*/
					session_fight = req.session.fight;
					delete req.session.fight;
					
					// render the home page
			        res.render('index.ejs', {
			          layout:   false,
			          token:    token,
			          user:     user,
					  hora_servidor: hora_servidor,
					  session_fight: session_fight,
					  novo_personagem: (novo_personagem ? true : false),
					  friends_using: friends_using,
					  friends_not_using: friends_not_using,
					  portugues: (user.locale.indexOf('pt') >= 0)
			        });

					delete req.session.fight;
					
					
				//}

			});

		});
		
        

    //});

}

var criar_personagem = function(request, response, session, mestre_id){
	
	var user = request.session.auth.facebook.user;
	
	var p = new Personagem();
	p.uid = user.id;
	p.indicacao_id = mestre_id;
	p.meme_src = request.param('meme');
	p.level = 1;
	p.hp = parseInt(Math.random() * 10) + 10;
	p.atq = parseInt(Math.random() * 3) + 2;
	p.vel = parseInt(Math.random() * 3) + 2;
	p.def = parseInt(Math.random() * 3) + 2;
	p.crit = parseInt(Math.random() * 3) + 2;
	p.nome = user.name;
	p.exp = 0;
	p.idioma = user.locale;
	p.genero = user.gender;
	p.username = user.username;
	p.ranking_pos = 1;
	p.vitorias = 0;
	p.derrotas = 0;
	p.equipamentos = [];
	p.habilidades = [];
	p.atributos = [];
	p.notificacoes = [];
	p.notificacoes.push({
		tipo: 0,
		texto: "Seja bem vindo ao Meme Kombat",
		texto_en: "Welcome to le Meme Kombat"
	});
	p.save(function(){
		if(typeof mestre_id != 'undefined'){
			Personagem.findOne({_id: mestre_id}, function(err, mestre){
				if(mestre != null){
					mestre.notificacoes.push({
						tipo: 0,
						texto: user.name + " agora é seu pupilo. EXP + 1",
						texto_en: user.name + " is now your pupil. EXP + 1",
						personagem2_id: p._id
					});
					mestre.exp += 1;
					//var subir_level = require('./struct/upar.js');
					//subir_level(mestre);
				}
			});
		}
	});
	
	render_index(request, response, session, true);
}

app.all('/index', function(request, response) {

	//try{

	var method = request.headers['x-forwarded-proto'] || 'http';

	if (request.session.auth && request.session.redir) {
		
		var token = request.session.auth.facebook.accessToken;
		facebook.getSessionByAccessToken(token)(function(session) {

			var user = request.session.auth.facebook.user;
			
			Personagem.findOne({uid: user.id}, function(err, data){
				if(data == null && request.param('meme')){
					var indicacao;
					var pe = data;
					if(request.session.request_ids){
						var mestre_request_id = request.session.request_ids[0];
						
						
						var http = require('https');
						var options = {
						  host: 'graph.facebook.com',
						  port: 443,
						  path: '/' + mestre_request_id + "_" + user.id + "?access_token=" + token + '&app_id' + process.env.FACEBOOK_APP_ID,
						  method: 'GET'
						};
						
						session.graphCall('/' + mestre_request_id)(function(result){
							
							if(result && result != null && result.from){
								Personagem.findOne({uid: result.from.id}, function(err, data){
									if(data != null){
										criar_personagem(request, response, session, data._id);
									}
								});
								request.session.request_ids.forEach(function(req_id){
									session.graphCall('/' + req_id + '_' + user.id, {}, 'DELETE')(function(){
										//
									});
								});
								
							}else{
								criar_personagem(request, response, session);
							}
							
							//response.send("fim");
							//criar_personagem(request, response, session);
							
						});
					}else if(request.session.indicacao_uid){
						Personagem.findOne({uid: request.session.indicacao_uid}, function(err, data){
							if(data != null){
								criar_personagem(request, response, session, data._id);
							}else{
								criar_personagem(request, response, session);
							}
						});
					}else{
						criar_personagem(request, response, session);
					}
				}else if(data == null){
					var http = require('http');
					var options = {
					  host: (environment == 'development' ? 'localhost' : 'memekombat.phpfogapp.com'),
					  port: 80,
					  path: (environment == 'development' ? '/MemeKombat' : '') + '/personagem.php?uid='+user.id,
					  method: 'GET'
					};

					// uid, meme_src, level, hp, atq, vel, def, crit, nome, exp, idioma, genero, username, ranking_pos, vitorias, derrotas
					http.request(options, function(res) {
					  res.setEncoding('utf8');
					  res.on('data', function (full_data) {
						
						if(full_data == 'NULL'){
							
							response.redirect('/inicio');
							
						}else{
							
					  		var full_data = full_data.split('|');
							var	pdata = full_data[0].split(',');
						
							var p = new Personagem();
						  	p.uid = pdata[0];
							p.meme_src = pdata[1];
							p.level = pdata[2];
							p.hp = pdata[3];
							p.atq = pdata[4];
							p.vel = pdata[5];
							p.def = pdata[6];
							p.crit = pdata[7];
							p.nome = pdata[8];
							p.exp = pdata[9];
							p.idioma = pdata[10];
							p.genero = pdata[11];
							p.username = pdata[12];
							p.ranking_pos = pdata[13];
							p.vitorias = pdata[14];
							p.derrotas = pdata[15];
							p.equipamentos = [];
							p.habilidades = [];
							p.atributos = [];
						
							var equipamentos = {};
							Equipamento.find(function(err, data){
								data.forEach(function(equip){
									equipamentos[equip.num] = equip;
								});
								
								try{
									var	edata = full_data[1].split(',');
									edata.forEach(function(equipamento_id){
										var equip = equipamentos[parseInt(equipamento_id)];
										if(typeof equip != 'undefined'){
											p.equipamentos.push(equip.num);
										}
									});
								}catch(e){}
							
							
								var habilidades = {};
								Habilidade.find(function(err, data){
									data.forEach(function(habil){
										habilidades[habil.num] = habil;
									});
								
									try{
										var	hdata = full_data[2].split(',');
										hdata.forEach(function(habilidade_id){
											var habil = habilidades[parseInt(habilidade_id)];
											if(typeof habil != 'undefined'){
												p.habilidades.push(habil.num);
											}
										});
									}catch(e){}
								
									var arquivamentos = {};
									Arquivamento.find(function(err, data){
										data.forEach(function(arquiv){
											arquivamentos[arquiv.num] = arquiv;
										});

										try{
											var	adata = full_data[3].split(',');
											adata.forEach(function(arquivamento_id){
												var arquiv = arquivamentos[parseInt(arquivamento_id)];
												if(typeof arquiv != 'undefined'){
													p.arquivamentos.push(arquiv._id);
												}
											});
										}catch(e){}
									
									
										p.save();
										render_index(request, response, session);
									
									
									});
								
								});
							});
						}
						
					  });
					}).end();
					
					
				}else{
					
					p = data;
					render_index(request, response, session);
					
				}
			});
			
			
		});

	}else if(request.session.auth){
		request.session.redir = true;
		response.redirect(process.env.FACEBOOK_APP_URL);
	}else{
		response.redirect('/');
	}
	
	//}catch(e){
	//	console.log(e.stack)
	//}

});