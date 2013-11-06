/*

Após ser autenticado o jogador é redirecionado para este controller,
nele é carregado o personagem do jogador, ou criado um novo, caso ainda não exista

*/

// renderiza o index.ejs, esta função é chamada após encontrar / criar novo personagem do usuário
var render_index = function(req, res, session, novo_personagem){
	
	var token = req.session.auth.facebook.accessToken;
	var user = req.session.auth.facebook.user;
	
	require('date-utils');
	var hora_servidor = (new Date()).toFormat('HH24:MI:SS'); // hora do servidor que aparece no rodapé

		// Amigos que jogam
		amigos_usando(req, res, function(fu){
			
			friends_using = [];
			if(fu && fu.forEach){
				fu.forEach(function (f){
					if(friends_using.length < 6) friends_using.push(f);
				});
			}
			var limit = 12 - Math.max(3, friends_using.length);

			// Busca amigos que ainda não jogam
			session.restCall('fql.query', {
				query: 'SELECT uid, name, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 0 ORDER BY rand() LIMIT '+limit,
				format: 'json'
			})(function(friends_not_using) {

					// caso seja um link de uma luta, vai direto pra luta e o id é deletado da sessão
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
					
					// garbage collect
					user = null;
					//friends_using = null;
					friends_not_using = null;
					session = null;

			});

		});
		
        

    //});

}

// cria o personagem do usuário
var criar_personagem = function(request, response, session, mestre_id){
	
	var user = request.session.auth.facebook.user;
	
	var p = new Personagem();
	p.uid = user.id;
	p.indicacao_id = mestre_id; // caso ele tenha entrado por indicação
	p.meme_src = request.param('meme'); // meme escolhido
	p.level = 1;
	// randomização dos atributos
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
	p.ranking_pos = 1; // pintinho
	p.vitorias = 0;
	p.derrotas = 0;
	p.equipamentos = [];
	p.habilidades = [];
	p.atributos = [];
	
	p.save(function(){
		
		// notificação de boas vindas
		var n = new Notificacao({
			personagem_id: p._id,
			tipo: 0,
			texto: "Seja bem vindo ao Meme Kombat",
			texto_en: "Welcome to le Meme Kombat"
		});
		n.save();
		
		// caso o personagem tenha um mestre, este ganha +1 de EXP por ter convidado um pupilo
		if(typeof mestre_id != 'undefined'){
			Personagem.findOne({_id: mestre_id}, function(err, mestre){
				if(mestre != null){
					var n = new Notificacao({
						personagem_id: mestre._id,
						tipo: 0,
						texto: user.name + " agora é seu pupilo. EXP + 1",
						texto_en: user.name + " is now your pupil. EXP + 1",
						personagem2_id: p._id
					});
					n.save();
					mestre.exp += 1;
					//var subir_level = require('./struct/upar.js');
					//subir_level(mestre);
				}
			});
		}
	});
	// renderiza a index
	render_index(request, response, session, true);
}

// rota para index
app.all('/index', function(request, response) {

	var method = 'https';// request.headers['x-forwarded-proto'] || 'http';

	delete request.session.logged;
	if (request.session.auth){ // caso esteja logado

		var token = request.session.auth.facebook.accessToken; // pega token do facebook
		facebook.getSessionByAccessToken(token)(function(session) { // pega session autorizada

			var user = request.session.auth.facebook.user; // pega o usuário logado no facebook
			
			Personagem.findOne({uid: user.id}, function(err, data){ // encontra o personagem dele
				if(data == null && request.param('meme')){ // caso não tenha nenhum personagem com esse uid e ele tenha selecionado um meme
					
					var portugues = (user.locale.indexOf('pt') >= 0);
					
					// define uma mensagem para ser postada no mural do jogador
					var message = {
						message: (portugues ? "Estou jogando Meme Kombat! Venha me desafiar!" : "I'm playing Meme Kombat, challenge me, I dare you!"),
						picture: process.env.FACEBOOK_APP_HOME + 'img/logo_post.png',
						link: process.env.FACEBOOK_APP_HOME,
						name: 'Meme Kombat',
						caption: (portugues ? 'Ui! Estou jogando Meme Kombat' : 'Y U NO PLAYING MEME KOMBAT YET?'),
						description: (portugues ? "O jogo mais Fuck Yea já feito" : "The most Fuck Yea game ever made"),
						source: process.env.FACEBOOK_APP_HOME
					}
					// posta no mural que ele está jogando
					session.graphCall('/' + user.id + '/feed', message, 'POST')(function(result){
						// callback
					});
					
					var indicacao;
					var pe = data;
					if(request.session.request_ids){ // verifica se há um convite pelo facebook
						var mestre_request_id = request.session.request_ids[0];
						
						// requisita o objeto de convite
						var http = require('https');
						var options = {
						  host: 'graph.facebook.com',
						  port: 443,
						  path: '/' + mestre_request_id + "_" + user.id + "?access_token=" + token + '&app_id' + process.env.FACEBOOK_APP_ID,
						  method: 'GET'
						};
						
						session.graphCall('/' + mestre_request_id)(function(result){
							
							if(result && result != null && result.from){ // caso haja este convite
								Personagem.findOne({uid: result.from.id}, function(err, data){ // encontra o personagem que o convidou
									if(data != null){
										criar_personagem(request, response, session, data._id); // cria o personagem como pupilo de quem o convidou (mestre)
									}
								});
								// deleta o convite
								request.session.request_ids.forEach(function(req_id){
									session.graphCall('/' + req_id + '_' + user.id, {}, 'DELETE')(function(){
										// callback
									});
								});
								
							}else{
								criar_personagem(request, response, session); // cria o personagem sem mestre
							}
							
						});
					}else if(request.session.indicacao_uid){ // caso seja por link de indicação
						Personagem.findOne({uid: request.session.indicacao_uid}, function(err, data){
							if(data != null){ // procura o mestre
								criar_personagem(request, response, session, data._id); // cria o personagem como pupilo deste mestre
							}else{
								criar_personagem(request, response, session); // cria personagem normalmente
							}
						});
					}else{
						criar_personagem(request, response, session); // cria personagem normalmente
					}
				}else if(data == null){
					response.redirect('/inicio'); // redireciona para a tela de seleção de memes
				}else{
					
					p = data;
					render_index(request, response, session); // renderiza a index
					
				}
			});
			
			
		});
	}else{ // usuário não está logado
		response.redirect('/'); // redireciona para a página inicial para autenticação
	}

});