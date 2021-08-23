/*

Após ser autenticado o jogador é redirecionado para este controller,
nele é carregado o personagem do jogador, ou criado um novo, caso ainda não exista

*/

var crypto = require("crypto");
var fetch = require('node-fetch');

// renderiza o index.ejs, esta função é chamada após encontrar / criar novo personagem do usuário
var render_index = function(req, res, novo_personagem){

	var user = req.session.auth.user;

	require('date-utils');
	var hora_servidor = (new Date()).toFormat('HH24:MI:SS'); // hora do servidor que aparece no rodapé

	// caso seja um link de uma luta, vai direto pra luta e o id é deletado da sessão
	session_fight = req.session.fight;
	delete req.session.fight;

	// render the home page
	res.render('index.ejs', {
		layout:   false,
		user:     user,
		hora_servidor: hora_servidor,
		session_fight: session_fight,
		novo_personagem: (novo_personagem ? true : false),
		portugues: (user.locale && user.locale.indexOf('pt') >= 0)
	});

}

var getPicture = async function(providerToken, authToken) {
	let picture = authToken.picture;
	if (!picture) {
		if (!authToken.email) {
			throw "Neither picture nor email available for " + JSON.stringify(authToken);
		}
		const gravatarHash = crypto.createHash('md5').update(authToken.email).digest("hex");
		picture = "https://www.gravatar.com/avatar/" + gravatarHash + "?s=200&d=retro";
	}
	if (authToken.firebase.sign_in_provider == "twitter.com") {
		picture = picture.replace("_normal.", ".");
	}
	if (providerToken && authToken.firebase.sign_in_provider == "facebook.com") {
		const result = await fetch(picture + "?type=large&access_token=" + providerToken);
		picture = result.url;
	}

	return picture;
}

// cria o personagem do usuário
var criar_personagem = async function(request, response, mestre_id){
	var authToken = await firebaseAuth(request);
	var providerToken = request.cookies.providerToken;
	var picture = await getPicture(providerToken, authToken);

	var user = request.session.auth.user;

	var p = new Personagem();
	p.uid = user.id;
	p.indicacao_id = mestre_id; // caso ele tenha entrado por indicação
	p.meme_src = request.param('meme').replace(" derpina", ""); // meme escolhido
	p.avatar = picture;
	p.level = 1;
	// randomização dos atributos
	p.hp = parseInt(Math.random() * 10) + 10;
	p.atq = parseInt(Math.random() * 3) + 2;
	p.vel = parseInt(Math.random() * 3) + 2;
	p.def = parseInt(Math.random() * 3) + 2;
	p.crit = parseInt(Math.random() * 3) + 2;
	p.nome = user.name;
	p.exp = 0;
	p.idioma = user.locale && user.locale;
	p.genero = request.param('meme').indexOf("derpina") >= 0 ? "female" : "male";
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
	render_index(request, response, true);
}

// rota para index
app.all('/index', authMiddleware, function(request, response) {

  var user = request.session.auth.user; // pega o usuário logado no facebook

  Personagem.findOne({uid: user.id}, function(err, data){ // encontra o personagem dele
    if(data == null && request.param('meme')){ // caso não tenha nenhum personagem com esse uid e ele tenha selecionado um meme
      if(request.session.request_ids){ // verifica se há um convite pelo facebook
        var mestre_request_id = request.session.request_ids[0];

        session.graphCall('/' + mestre_request_id)(function(result){

          if(result && result != null && result.from){ // caso haja este convite
            Personagem.findOne({uid: result.from.id}, function(err, data){ // encontra o personagem que o convidou
              if(data != null){
                criar_personagem(request, response, data._id); // cria o personagem como pupilo de quem o convidou (mestre)
              }
            });
            // deleta o convite
            request.session.request_ids.forEach(function(req_id){
              session.graphCall('/' + req_id + '_' + user.id, {}, 'DELETE')(function(){
                // callback
              });
            });

          }else{
            criar_personagem(request, response); // cria o personagem sem mestre
          }

        });
      }else if(request.session.indicacao_uid){ // caso seja por link de indicação
        Personagem.findOne({uid: request.session.indicacao_uid}, function(err, data){
          if(data != null){ // procura o mestre
            criar_personagem(request, response, data._id); // cria o personagem como pupilo deste mestre
          }else{
            criar_personagem(request, response); // cria personagem normalmente
          }
        });
      }else{
        criar_personagem(request, response); // cria personagem normalmente
      }
    }else if(data == null){
      var method = 'https';//request.headers['x-forwarded-proto'] || 'https';
      var host = method + '://' + request.headers.host;
      response.redirect(host + '/inicio'); // redireciona para a tela de seleção de memes
    }else{

      render_index(request, response); // renderiza a index

    }
  });

});
