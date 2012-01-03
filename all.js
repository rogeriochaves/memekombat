try{
	require.paths.unshift(__dirname + '/lib');

	var everyauth = require('everyauth');
	var express   = require('express');
	var RedisStore = require('connect-redis')(express);
	var MemoryStore = express.session.MemoryStore;
	var FacebookClient = require('facebook-client').FacebookClient;
	var facebook = new FacebookClient();

	var uuid = require('node-uuid');



	var mongoose = require('mongoose')  
	var Schema = mongoose.Schema
	var ObjectId = Schema.ObjectId;

	var ArquivamentoSchema = new Schema({
		titulo: String
	  , num: { type: Number, unique: true }
	  ,	descricao: String
	  , pontos: Number
	  , titulo_en: String
	  , descricao_en: String
	  , img: String
	  , texto_cima: String
	  , texto_baixo: String
	  , texto_cima_en: String
	  , texto_baixo_en: String
	  , url: String
	});
	mongoose.model('Arquivamentos', ArquivamentoSchema);

	var NotificacaoSchema = new Schema({
		tipo: Number
	  , texto: String
	  , texto_en: String
	  , data: { type: Date, default: Date.now }
	  , luta_id: ObjectId
	  , personagem2_id: ObjectId
	});

	var PersonagemSchema = new Schema({
		uid: {type: String, unique: true}
	  ,	meme_src: String
	  , level: Number
	  , hp: Number
	  , atq: Number
	  , vel: Number
	  , def: Number
	  , crit: Number
	  , indicacao_id: ObjectId
	  , nome: String
	  , exp: Number
	  , idioma: String
	  , genero: String
	  , username: String
	  , link_indicacao: String
	  , ranking_pos: Number
	  , campeonato_id: ObjectId
	  , chave_lv: Number
	  , vitorias: Number
	  , derrotas: Number
	  , arquivamentos: Array
	  , equipamentos: Array
	  , habilidades: Array
	  , notificacoes: [NotificacaoSchema]
	  , random: {type: Number, default: Math.random()}
	});
	mongoose.model('Personagens', PersonagemSchema);

	var CreditoSchema = new Schema({
		personagem_id: ObjectId
	  , valor: Number
	  , data: { type: Date, default: Date.now }
	  , pedido_id: ObjectId
	  , quantidade: Number
	});
	mongoose.model('Creditos', CreditoSchema);

	var PedidoSchema = new Schema({
		uid: String
	  , order_id: String
	  , tipo: Number
	  , quantidade: Number
	  , arma_num: Number
	  , data: { type: Date, default: Date.now }
	});
	mongoose.model('Pedidos', PedidoSchema);

	var EquipamentoSchema = new Schema({
		nome: String
	  , num: { type: Number, unique: true }
	  , atq: Number
	  , def: Number
	  , vel: Number
	  , crit: Number
	  , tipo: { type: Number, default: 0 }
	  , nivel_minimo: Number
	  , preco_creditos: { type: Number, default: 0 }
	});
	mongoose.model('Equipamentos', EquipamentoSchema);

	var HabilidadeSchema = new Schema({
		nome: String
	  , num: { type: Number, unique: true }
	  , dano: Number
	});
	mongoose.model('Habilidades', HabilidadeSchema);

	var LutaSchema = new Schema({
		personagem1_id: ObjectId
	  , personagem2_id: ObjectId
	  , personagem1_hp: Number
	  , personagem2_hp: Number
	  , personagem1_lv: Number
	  , personagem2_lv: Number
	  , data: { type: Date, default: Date.now }
	  , ganhador_id: ObjectId
	  , perdedor_id: ObjectId
	  , fb_total_count: {type: Number, default: 0}
	  , fb_like_count: {type: Number, default: 0}
	  , fb_comment_count: {type: Number, default: 0}
	  , fb_share_count: {type: Number, default: 0}
	  , fb_click_count: {type: Number, default: 0}
	  , credito: Boolean
	  , short_url: String
	  , campeonato: {type: Boolean, default: false}
	  , tweets: {type: Number, default: 0}
	  , movimentos: String
	});
	mongoose.model('Lutas', LutaSchema);

	var MemeSchema = new Schema({
		nome: String
	  ,	src: {type: String, unique: true}
	});
	mongoose.model('Memes', MemeSchema);

	var RankingSchema = new Schema({
		nome: String
	  , nome_en: String
	  ,	pos: {type: Number, unique: true}
	});
	mongoose.model('Rankings', RankingSchema);

	var CampeonatoSchema = new Schema({
		ranking_pos: Number
	  , vencedor_id: ObjectId
	  , vencedor_uid: String
	  , qtd_chaves: Number
	  , chaves_livres: Number
	  , data_inicio: { type: Date, default: Date.now }
	});
	mongoose.model('Campeonatos', CampeonatoSchema);

	var ChaveSchema = new Schema({
		campeonato_id: ObjectId
	  , personagem1_id: ObjectId
	  , personagem2_id: ObjectId
	  , uid1: String
	  , uid2: String
	  , num: Number
	  , level: Number
	  , data_liberacao: Date
	  , luta_id: ObjectId
	  , vencedor_id: ObjectId
	  , vencedor_uid: String
	});
	mongoose.model('Chaves', ChaveSchema);


	var Personagem = mongoose.model('Personagens');
	var Equipamento = mongoose.model('Equipamentos');
	var Habilidade = mongoose.model('Habilidades');
	var Arquivamento = mongoose.model('Arquivamentos');
	var Luta = mongoose.model('Lutas');
	var Credito = mongoose.model('Creditos');
	var Meme = mongoose.model('Memes');
	var Ranking = mongoose.model('Rankings');
	var Pedido = mongoose.model('Pedidos');
	var Chave = mongoose.model('Chaves');
	var Campeonato = mongoose.model('Campeonatos');


	var environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
	if(environment == 'development'){
		
		
		require("v8-profiler");
		process.env.FACEBOOK_APP_ID = '130619640386826';
		process.env.FACEBOOK_SECRET = '***REMOVED***';
		process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/memekombattest/';
		process.env.FACEBOOK_APP_HOME = 'http://localhost:3000/';
		mongoose.connect('mongodb://localhost/memekombat');
	}else{
		
		process.env.FACEBOOK_APP_ID = '183114805092475';
		process.env.FACEBOOK_SECRET = '***REMOVED***';
		process.env.FACEBOOK_APP_URL = 'https://apps.facebook.com/meme_kombat/';

		process.env.FACEBOOK_APP_HOME = 'https://memekombat.herokuapp.com/';
		mongoose.connect('mongodb://***REMOVED***/heroku_app2171098');
		
		
	}


	// configure facebook authentication
	try{
		everyauth.facebook
		  .appId(process.env.FACEBOOK_APP_ID)
		  .appSecret(process.env.FACEBOOK_SECRET)
		  .scope('publish_stream,publish_actions')
		  .entryPath('/')
		  .redirectPath('/index')
		  .findOrCreateUser(function() {
		    return({});
		  });
		everyauth.everymodule.moduleErrback( function (err) {
		  console.log(err);
		});
		
	}catch(e){
		console.log(e.stack)
	}

	var oneYear = 31557600000;
	// create an express webserver
	var app = express.createServer(
	  //express.logger(),
	  express.errorHandler(),
	  express.static(__dirname + '/public', { maxAge: oneYear }),
	  express.cookieParser(),
	  // set this to a secret value to encrypt session cookies
	
		express.session({ secret: '***REMOVED***', store: ((environment == 'development') ? new MemoryStore() : new RedisStore({
			  host: 'barracuda.redistogo.com',
			  port: '9210',
			  pass: '43c56adf34497a80bf6cfbc4c3052dd5',
			  db: 'redistogo',
			  cookie: {maxAge: 60000 * 5}
		  }))}),
	
	  // insert a middleware to set the facebook redirect hostname to http/https dynamically
	  function(request, response, next) {
		
		request.connection.setTimeout(10000);
		try{
			
			if(request.param('request_ids')){
				request.session.request_ids = request.param('request_ids').split(',');
			}
			if(request.param('i')){
				request.session.indicacao_uid = request.param('i');
			}
			if(request.param('fight')){
				request.session.fight = request.param('fight');
			}

		    var method = request.headers['x-forwarded-proto'] || 'http';
		    everyauth.facebook.myHostname(method + '://' + request.headers.host);
		    next();
		
		}catch(e){
			console.log(e.stack)
		}
		
	  },
	  everyauth.middleware(),
	  require('facebook').Facebook()
	);

	// listen to the PORT given to us in the environment
	var port = process.env.PORT || 3000;

	app.listen(port, function() {
	  console.log("Listening on " + port);
	});

	app.post('/', function(request, response){
		if (request.session.auth) {
			response.redirect('/index');
			return false;
		}else{
			var method = request.headers['x-forwarded-proto'] || 'http';
			var host = method + '://' + request.headers.host;
			response.send('<script type="text/javascript">top.location.href = "'+host+'";</script>');
		}
	});

	
	app.all('/_arena', function(request, response) {

		var method = request.headers['x-forwarded-proto'] || 'http';

		if (request.session.auth) {

			var token = request.session.auth.facebook.accessToken;
			facebook.getSessionByAccessToken(token)(function(session) {

				var socket_id = request.param('socket_id') ? request.param('socket_id') : uuid();
				var arena_uids = request.param('arena_uids') ? request.param('arena_uids').replace("'", '').split(',') : [];
				//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {

					var user = request.session.auth.facebook.user;
					var busca = request.param('busca');

					Personagem.findOne({uid: user.id}, function(err, personagem){
						if(personagem != null){
							session.restCall('fql.query', {
								query: 'SELECT uid FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
								format: 'json'
							})(function(result) {

								var amigos_uids = [];

								if(result && result.forEach){
									result.forEach(function(friend) {
										amigos_uids.push(friend.uid);
									});
								}



								var requisicoes = parseInt(arena_uids.length / 8);

								Personagem
									.where('uid').in(amigos_uids)
									.where('uid').nin(arena_uids)
									.where('level').lt(personagem.level + requisicoes + 2)
									.sort('level', -1, 'random', 1).limit(5)
									.select('uid', 'level', 'nome', 'meme_src', 'genero')
									.run(function(err, amigos){
										amigos.forEach(function(p){
											p.random = Math.random();
											p.save();
										});
										var limite = 10 - amigos.length;

										amigos_uids.push(user.id);

										Personagem
											.where('uid').nin(amigos_uids.concat(arena_uids))
											.where('level').lt(personagem.level + requisicoes + 2)
											.sort('level', -1, 'random', 1).limit(limite)
											.select('uid', 'level', 'nome', 'meme_src', 'genero')
											.run(function(err, outros_jogadores){

												outros_jogadores.forEach(function(p){
													p.random = Math.random();
													p.save();
												});

												response.render('_arena.ejs', {
													layout:   false,
													token:    token,
													user:     user,
													players:  amigos.concat(outros_jogadores),
													portugues: (user.locale.indexOf('pt') >= 0),
													socket_id: socket_id
												});

											});

									});


							});


						}
					});

				//});
			});
		}else{
			response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
		}
	});
	
	app.all('/achievements/:url', function(request, response) {

		if(!request.params.url){
			response.redirect('/');
		}else{
			Arquivamento.findOne({url: request.params.url}, function(err, data){
				if(data == null){
					response.redirect('/');
				}else{
					response.render('achievements.ejs', {
				      layout:   false,
					  app_home: process.env.FACEBOOK_APP_HOME,
					  app_id: process.env.FACEBOOK_APP_ID,
				      arquivamento: data
				    });
				}
			});
		}

	});
	
	var jogadores_arena = function(user, session, personagem, request, response, user){
		session.restCall('fql.query', {
			query: 'SELECT uid FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
			format: 'json'
		})(function(result) {
			var amigos_uids = [];
			if(result && result.forEach){
				result.forEach(function(friend) {
					amigos_uids.push(friend.uid);
				});
			}

				Personagem
					.where('uid').in(amigos_uids)
					.where('level').lt(personagem.level + 3)
					.sort('level', -1, 'random', 1).limit(5)
					.select('uid', 'level', 'nome', 'meme_src', 'genero')
					.run(function(err, amigos){
						amigos.forEach(function(p){
							//socket_manager.send(socket_id, 'player_arena', p);
							p.random = Math.random();
							p.save();
						});
						var limite = 10 - amigos.length;

						amigos_uids.push(user.id);

						Personagem
							.where('uid').nin(amigos_uids)
							.where('level').lt(personagem.level + 2)
							.where('level').gt(personagem.level - 1)
							.sort('random', 1, 'level', -1).limit(limite)
							.select('uid', 'level', 'nome', 'meme_src', 'genero')
							.run(function(err, outros_jogadores){
								outros_jogadores.forEach(function(p){
									//socket_manager.send(socket_id, 'player_arena', p);
									p.random = Math.random();
									p.save();
								});

								var Characters = require('./struct/Characters.js');
								Characters.lutas_restantes(personagem._id, function(quant){
									response.render('arena.ejs', {
							          layout:   false,
							          user:     user,
									  busca: '',
									  players: amigos.concat(outros_jogadores),
									  lutas_restantes: quant,
									  portugues: (user.locale.indexOf('pt') >= 0)
							        });
							    });

								/*if(amigos.length == 0 && outros_jogadores.length == 0){
									socket_manager.send(socket_id, 'nenhum_encontrado');
								}*/


							});

					});
				//}else{
				//	response.send('');
				//}


		});
	}

	var busca_jogadores_arena = function(user, session, personagem, busca, request, response, user){
		session.restCall('fql.query', {
			query: 'SELECT uid FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 AND strpos(lower(name), lower("'+busca.replace("'", "\\'")+'")) >= 0 ORDER BY rand() LIMIT 10',
			format: 'json'
		})(function(result) {
			var amigos_uids = [];
			if(result && result.forEach){
				result.forEach(function(friend) {
					amigos_uids.push(friend.uid);
				});
			}

			Personagem
				.where('uid').in(amigos_uids)
				.sort('level', -1, 'random', 1).limit(10)
				.select('uid', 'level', 'nome', 'meme_src', 'genero')
				.run(function(err, amigos){
					amigos.forEach(function(p){
						//socket_manager.send(socket_id, 'player_arena', p);
						p.random = Math.random();
						p.save();
					});
					var limite = 10 - amigos.length;

					if(limite > 0){
						amigos_uids.push(user.id);
						var IgnoraAcentos = require('./lib/ignora_acentos.js');

						Personagem
							.where('uid').nin(amigos_uids)
							.sort('level', -1, 'random', 1).limit(limite)
							.select('uid', 'level', 'nome', 'meme_src', 'genero')
							.find({nome: new RegExp(".*"+IgnoraAcentos.ignora_acentos(busca.replace(' ','.*'))+".*", 'i')}, function(err, outros_jogadores){

								outros_jogadores.forEach(function(p){

									p.random = Math.random();
									p.save();
								});

								var Characters = require('./struct/Characters.js');
								Characters.lutas_restantes(personagem._id, function(quant){
									response.render('arena.ejs', {
							          layout:   false,
							          user:     user,
									  busca:   busca,
									  players: amigos.concat(outros_jogadores),
									  lutas_restantes: quant,
									  portugues: (user.locale.indexOf('pt') >= 0)
							        });
							    });

								/*if(amigos.length == 0 && outros_jogadores.length == 0){
									socket_manager.send(socket_id, 'nenhum_encontrado');
								}*/


							});
					  }

				});

		});
	}

	app.all('/arena', function(request, response) {

		try{
		var method = request.headers['x-forwarded-proto'] || 'http';

		if (request.session.auth) {

			var token = request.session.auth.facebook.accessToken;
			facebook.getSessionByAccessToken(token)(function(session) {

				var socket_id = request.param('socket_id') ? request.param('socket_id') : uuid();
				//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {

					var user = request.session.auth.facebook.user;
					var busca = request.param('busca');

					Personagem.findOne({uid: user.id}, function(err, personagem){
						if(personagem != null){

							if(busca && busca.length > 0){
								busca_jogadores_arena(user, session, personagem, busca, request, response, user);
							}else{
								jogadores_arena(user, session, personagem, request, response, user);
							}

						}
					});

			    //});

			});

		}else{
			response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
		}
		}catch(e){
			console.log(e.stack)
		}

	});
	
	var valor_creditos = function(quant){
		if(quant == 1){
			return 1;
		}else if(quant == 3){
			return 2;
		}else if(quant == 5){
			return 3;
		}
		return 99999;
	}

	var desc_armas = function(num, lang){
		armas = {
			'pt': {
					13: {
						'title' : 'Le Espada de Fogo',
						'description' : 'Uma espada muito forte e muito maneira',
						'img' : 'fire_sword.gif'
					},
					18 : {
						'title' : 'Le Espada de Gelo',
						'description' : 'Uma espada tão maneira que dá calafrios',
						'img' : 'ice_sword.gif'
					},
					19 : {
						'title' : 'Le Espada Elétrica',
						'description' : 'Uma espada chocante',
						'img' : 'thunder_sword.gif'
					},
					33 : {
						'title' : 'Le Espada Obscura',
						'description' : 'Cuidado! Não seja consumido pelas trevas.',
						'img' : 'darkness_sword.gif'
					},
					36 : {
						'title' : 'Le Espada de Elite',
						'description' : 'Somente os verdadeiros guerreiros usam',
						'img' : 'knight_sword.png'
					},
					31 : {
						'title' : 'Le Espada Dragun',
						'description' : 'O coração do dragão pertence a esta espada.',
						'img' : 'dragun_sword.gif'
					}
				},
			'en' : {
					13 : {
						'title' : 'Le Fire Sword',
						'description' : 'A sword that burns like hell',
						'img' : 'fire_sword.gif'
					},
					18 : {
						'title' : 'Le Ice Sword',
						'description' : 'A very cool sword',
						'img' : 'ice_sword.gif'
					},
					19 : {
						'title' : 'Le Thunder Sword',
						'description' : 'A sword with a shocking cut',
						'img' : 'thunder_sword.gif'
					},
					33 : {
						'title' : 'Le Darkness Sword',
						'description' : 'Take Care! Dont be consumed by darkness.',
						'img' : 'darkness_sword.gif'
					},
					36 : {
						'title' : 'Le Elite Sword',
						'description' : 'Only the true warriors can use.',
						'img' : 'knight_sword.gif'
					},
					31 : {
						'title' : 'Le Dragun Sword',
						'description' : 'The heart of dragon is inside in this sword',
						'img' : 'dragun_sword.gif'
					}
				}
		};
		return armas[lang][num];
	}

	var valor_armas = function(num){
		armas = {
			13: 10,
			18: 10,
			19: 10,
			33: 15,
			36: 20,
			31: 20
		};
		return armas[num] ? armas[num] : 99999;
	}


	function parse_signed_request(signed_request, secret) {
		var base64url = require('b64url')
		  , crypto = require('crypto');
	    encoded_data = signed_request.split('.',2);
	    // decode the data
	    sig = encoded_data[0];
	    json = base64url.decode(encoded_data[1]);
	    data = JSON.parse(json); // ERROR Occurs Here!

	    // check algorithm - not relevant to error
	    if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
	        console.error('Unknown algorithm. Expected HMAC-SHA256');
	        return null;
	    }

	    // check sig - not relevant to error
	    expected_sig = crypto.createHmac('sha256',secret).update(encoded_data[1]).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace('=','');
	    if (sig !== expected_sig) {
	        console.error('Bad signed JSON Signature!');
	        return null;
	    }

	    return data;
	}

	var qs = require('querystring');

	app.all('/callback', function(request, response) {

		if (request.method == 'POST') {
	        var body = '';
	        request.on('data', function (data) {
	            body += data;
				if (body.length > 1e6) {
					request.connection.destroy();
				}
	        });
	        request.on('end', function () {
	            var data = qs.parse(body);
				console.log("==========");
				console.log(data);
				console.log("===========");

				signed_request = parse_signed_request(data.signed_request, process.env.FACEBOOK_SECRET);
				if(signed_request != null){

					if(data.method == 'payments_get_items'){

						var order_info = JSON.parse(data.order_info);
						var item = {};

						if(order_info.tipo == 0){ // Luta Adicional

							if (order_info.language == 'pt') {
								item.title = (order_info.quantidade == 1 ? 'Luta Adicional' : order_info.quantidade + ' Lutas Adicionais');
								item.description = (order_info.quantidade == 1 ? 'Lute mais uma vez hoje' : 'Lute mais ' + order_info.quantidade + ' vezes hoje');
							}else{
								item.title = (order_info.quantidade == 1 ? 'Extra Fight' : order_info.quantidade + ' Extra Fights');
								item.description = (order_info.quantidade == 1 ? 'Fight once more today' : 'Fight ' + order_info.quantidade + ' more times today');
							}

							item.price = valor_creditos(order_info.quantidade);
							item.image_url = process.env.FACEBOOK_APP_HOME + 'img/luta_adicional.png';
							item.product_url = process.env.FACEBOOK_APP_HOME + 'img/luta_adicional.png';

							var p = new Pedido({
								uid: data.receiver,
								order_id: data.order_id,
								tipo: order_info.tipo,
								quantidade: order_info.quantidade
							});
							p.save();

							response.send(JSON.stringify({
								content: [item],
								method: data.method
							}));

						}else if(order_info.tipo == 1){ // Armas
							var arma_num = order_info.arma
							  , arma = desc_armas(arma_num, order_info.language);
							item.title = arma.title;
							item.description = arma.description;
							item.price = valor_armas(arma_num);
							item.image_url = process.env.FACEBOOK_APP_HOME + 'img/loja/' + arma.img;
							item.product_url = process.env.FACEBOOK_APP_HOME + 'img/loja/' + arma.img;

							var p = new Pedido({
								uid: data.receiver,
								order_id: data.order_id,
								tipo: order_info.tipo,
								arma_num: arma_num
							});
							p.save();

							response.send(JSON.stringify({
								content: [item],
								method: data.method
							}));
						}


					}else if(data.method == 'payments_status_update' && data.status == 'placed'){


						var order_details = JSON.parse(data.order_details);
						var amount = order_details.amount;
						var resposta = {
							content: {
								status: 'settled',
								order_id: data.order_id
							},
							method: 'payments_status_update'
						};

						Personagem.findOne({uid: order_details.buyer.toString()}, function(err, personagem){
							Pedido.findOne({order_id: data.order_id}, function(err, pedido){
								if(pedido != null){
									if(pedido.tipo == 0 && amount == valor_creditos(pedido.quantidade)){
										c = new Credito({
											personagem_id: personagem._id,
											valor: amount,
											quantidade: pedido.quantidade,
											pedido_id: pedido._id
										});
										c.save(function(err){
											response.send(JSON.stringify(resposta));
										});
									}else if(pedido.tipo == 1){

										Equipamento.findOne({num: pedido.arma_num}, function(err, equip){
											var armas_compraveis = [13, 18, 19, 33, 36, 31];

											/*console.log(armas_compraveis.indexOf(equip.num));
											console.log(amount == equip.preco_creditos);
											console.log(personagem.equipamentos.indexOf(equip.num));*/

											if(amount == equip.preco_creditos && personagem.equipamentos.indexOf(equip.num) < 0){

												//var espadas_elementais = [13, 18, 19];
												//var possui_elemental = (personagem.equipamentos.indexOf(13) >= 0 || personagem.equipamentos.indexOf(18) >= 0 || personagem.equipamentos.indexOf(19) >= 0);
												//if(espadas_elementais.indexOf(equip.num) >= 0 && possui_elemental){
													personagem.equipamentos.push(equip.num);
													personagem.save(function(err){
														response.send(JSON.stringify(resposta));
													});
												/*}else{
													throw new Error('keyboard cat 1!');
												}*/

											}else{
												throw new Error('keyboard cat 2!');
											}
										});

									}else{
										throw new Error('keyboard cat 3!');
									}
								}else{
									throw new Error('keyboard cat 4!');
								}
							});
						});

					}

				}



	        });
	    }else{
			response.send('');
		}
	});
	
	function posicao(x, y, chaves, levels, portugues, fn){
		//console.log("======= chaves =========");
		//console.log(chaves);
		if(typeof chaves[x] != 'undefined' && typeof chaves[x][y] != 'undefined' && typeof chaves[x][y].uid != 'undefined' && chaves[x][y].uid != "" && chaves[x][y].uid != null){
			var ml = (-50 + 25 * x - 12 * (levels - 3));
			var img = '';
			if(x == 0 && y == 0){
				ml += 40;
				img = 'background-image:url(img/balao-perfil-l.png)';
			}
			if(x == 0 && y == Math.pow(2, levels) - 1){
				ml -= 40;
				img = 'background-image:url(img/balao-perfil-r.png)';
			}

			Personagem.findOne({_id: chaves[x][y].personagem_id}, function(err, p){
				var html = '<a class="player" href="perfil?uid='+chaves[x][y].uid+'">';
				html2 = '<div class="perfil" style="margin-left:'+ml+'px; '+img+'"> 						\
					<img src="https://graph.facebook.com/'+chaves[x][y].uid+'/picture?type=square" />		\
					<div class="info">																		\
						'+p.nome.split(' ')[0]+'<br />													    \
						'+(portugues ? "Nv " : "Lv ")+p.level+'												\
					</div>																					\
				</div></a>';
				if(x == levels){
					fn(html + '<img src="https://graph.facebook.com/'+chaves[x][y].uid+'/picture?type=normal" border="0">' + html2);
				}else{
					var size = parseInt(50 / Math.max(1, levels - x));
					mt = (x == 0 ? 40 : 0);
					fn(html + '<img src="https://graph.facebook.com/'+chaves[x][y].uid+'/picture?type=square" border="0" style="width:'+size+'px; height:'+size+'px; margin-top:'+mt+'px ">' + html2);
				}
			});
		}else if(x == 0){
			var size = parseInt(50 / Math.max(1, (levels - x)));
			var mt = (x == 0 ? 40 : 0);
			fn('<img src="https://graph.facebook.com/picture?type=square" border="0" style="width:'+size+'px; height:'+size+'px; margin-top:'+mt+'px ">');
		}else{
			fn("&nbsp;");
		}
	}

	function luta(x, y, lutas, levels){
		if(typeof lutas[x] != 'undefined' && typeof lutas[x][y] != 'undefined'){
			return '<a class="vs '+((x == 0 && levels >= 4) ? "mini" : "")+'" href="luta?id='+lutas[x][y].id+'&campeonato=true">&nbsp;&nbsp;&nbsp;&nbsp;</a>';
		}else{
			return "&nbsp;";
		}
	}

	function ver_se_perdeu(x, y, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem){
		if(!personagem_perdeu && typeof chaves[x] != 'undefined' && typeof chaves[x][y] != 'undefined'){
			var is_personagem = (chaves[x][y].uid == personagem.uid);
			if(x < ultimo_lv && is_personagem && personagem_ultima_vit == -1){
				personagem_perdeu = true;
			}
			if(ultimo_lv == -1){
				ultimo_lv = x;
			}
			if(is_personagem){
				personagem_ultima_vit = x;
			}
		}
		return [personagem_perdeu, ultimo_lv, personagem_ultima_vit];
	}

	function coluna_campeonato_html(i, k, m, max, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, levels, portugues, html, fn){
		//console.log("===k==="+k+"========");
		posicao(i, m, chaves, levels, portugues, function(h){
			html += '<td class="l">'+h+'</td>';

			res = ver_se_perdeu(i, m, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem);
			personagem_perdeu = res[0];
			ultimo_lv = res[1];
			personagem_ultima_vit = res[2];

			m++;
			for(c = 0; c < Math.max(0, Math.pow(2, i) - 1); c++){
				html += '<td class="h">&nbsp;</td>';
			}

			html += '<td class="t">'+luta(i, (m - 1) / 2, lutas, levels)+'</td>';
			for(c = 0; c < Math.max(0, Math.pow(2, i) - 1); c++){
				html += '<td class="h">&nbsp;</td>';
			}
			posicao(i, m, chaves, levels, portugues, function(h){
				html += '<td class="r">'+h+'</td>';
				res = ver_se_perdeu(i, m, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem);
				personagem_perdeu = res[0];
				ultimo_lv = res[1];
				personagem_ultima_vit = res[2];
				m++;
				if(k < max - 1){
					html += '<td colspan="' + (Math.pow(2, i + 1) - 1) + '">&nbsp;</td>';
				}

				k++;
				if(k < max){
					coluna_campeonato_html(i, k, m, max, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, levels, portugues, html, fn);
				}else{
					fn(html, personagem_perdeu, personagem_ultima_vit, ultimo_lv);
				}

			});

		});

	}

	function linha_campeonato_html(i, html, levels, num_chaves, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, portugues, fn){
		//console.log(html);
		//console.log("==i===="+i+"========");
			html += '<tr>';
			var espacos = Math.pow(2, i) - 1;
			if(i == levels){
				res = ver_se_perdeu(i, 0, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem);
				personagem_perdeu = res[0];
				ultimo_lv = res[1];
				personagem_ultima_vit = res[2];

				posicao(i, 0, chaves, levels, portugues, function(h){
					var vencedor = (h != "&nbsp;");
					espacos -= 2;

					html += '<td colspan="'+espacos+'">&nbsp;</td> <td class="v" colspan="5">'+(vencedor ? h : '<img src="img/vencedor-campeonato.gif" />')+'</td> <td colspan="'+espacos+'">&nbsp;</td></tr>';
					i--;
					if(i >= 0){
						linha_campeonato_html(i, html, levels, num_chaves, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, portugues, fn);
					}else{
						fn(html, personagem_perdeu);
					}

				});

			}else{
				if(espacos > 0) html += '<td colspan="'+espacos+'">&nbsp;</td>';
				var chaves_level = parseInt(num_chaves / Math.pow(2, i));

				coluna_campeonato_html(i, 0, 0, chaves_level, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, levels, portugues, html, function(html, personagem_perdeu, personagem_ultima_vit, ultimo_lv){
					i--;
					if(espacos > 0) html += '<td colspan="'+espacos+'">&nbsp;</td>';
					if(i >= 0){
						linha_campeonato_html(i, html, levels, num_chaves, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, portugues, fn);
					}else{
						fn(html, personagem_perdeu);
					}
				});
			}

	}

	function campeonato_html(levels, num_chaves, lutas, chaves, personagem, portugues, fn){
		var html = '<table border="0" cellpadding="0" cellspacing="0" class="chave" width="720">'
		  , personagem_perdeu = false
		  , ultimo_lv = -1
		  , personagem_ultima_vit = -1

		var i = levels;
		linha_campeonato_html(i, html, levels, num_chaves, lutas, personagem_perdeu, personagem_ultima_vit, ultimo_lv, chaves, personagem, portugues, function(html, personagem_perdeu){
			fn(html + '</table>', personagem_perdeu);
		});

	}


	function render_campeonato(request, response, user, personagem, campeonato){
		var campeonato_info = campeonato
		  , campeonato = campeonato.campeonato
		  , num_chaves = campeonato.qtd_chaves
		  , chaves = campeonato_info.chaves
		  , lutas = campeonato_info.lutas
		  , proxima_luta = campeonato_info.proxima_luta
		  , levels = parseInt(Math.log(num_chaves) / Math.log(2)) + 1
		  , portugues = (user.locale.indexOf('pt') >= 0);

		campeonato_html(levels, num_chaves, lutas, chaves, personagem, portugues, function(html, personagem_perdeu){

			if(request.param('finalizar') && personagem_perdeu){
				var GerarCampeonato = require('./struct/GerarCampeonato.js');
				GerarCampeonato.exp_ganha(personagem, personagem.chave_lv, function(personagem){
					personagem.chave_lv = 0;
					personagem.campeonato_id = null;
					personagem.save(function(err){
						var Upar = require('./struct/Upar.js');
						Upar.subir_level(personagem);
						response.redirect('/perfil');
					});
				});
			}else{

				Ranking.findOne({pos: campeonato.ranking_pos}, function(err, rank){

					response.render('campeonato.ejs', {
						layout:   false,
						user:     user,
						proxima_luta: proxima_luta,
						campeonato: campeonato,
						rank: rank,
						personagem: personagem,
						personagem_perdeu: personagem_perdeu,
						html: html,
						levels: levels,
						chaves: chaves,
						portugues: portugues
					});

				});

			}

		});


	}

	app.all('/campeonato', function(request, response) {

		var method = request.headers['x-forwarded-proto'] || 'http';

		if (request.session.auth) {
			var token = request.session.auth.facebook.accessToken;
			facebook.getSessionByAccessToken(token)(function(session) {

				var user = request.session.auth.facebook.user;

				Personagem.findOne({uid: user.id}, function(err, personagem){
					if(personagem == null){
						response.redirect('inicio');
					}else{
						var GerarCampeonato = require('./struct/GerarCampeonato.js');
						if(typeof personagem.campeonato_id == 'undefined' || personagem.campeonato_id == null){
							GerarCampeonato.get_campeonato_livre(personagem.ranking_pos, function(campeonato){
								GerarCampeonato.inserir_personagem_no_campeonato(personagem, campeonato, function(){
									GerarCampeonato.get_campeonato(campeonato, 0, function(camp){
										render_campeonato(request, response, user, personagem, camp);
									});
								});
							});
						}else{
							var chave_lv = personagem.chave_lv;
							Campeonato.findOne({_id: personagem.campeonato_id}, function(err, campeonato){

								if(request.param('finalizar') && campeonato.vencedor_id && campeonato.vencedor_id.toString() == personagem._id.toString()){
									var novo_ranking = Math.min(8, campeonato.ranking_pos + 1);
									Ranking.findOne({pos: novo_ranking}, function(err, rank){

										var GerarCampeonato = require('./struct/GerarCampeonato.js');
										GerarCampeonato.exp_ganha(personagem, personagem.chave_lv, function(personagem){
											if(personagem.ranking_pos != novo_ranking){
												personagem.notificacoes.push({
													tipo: 1,
													texto: "Parabéns! Você ganhou o campeonato e passou para o ranking <b>"+rank.nome+"</b>",
													texto_en: "Congratulations! You won the championist and became a <b>"+rank.nome_en+"</b>"
												});
												personagem.ranking_pos = novo_ranking;
											}else{
												personagem.notificacoes.push({
													tipo: 1,
													texto: "Parabéns! Você ganhou o campeonato",
													texto_en: "Congratulations! You won the championist"
												});
											}
											personagem.chave_lv = 0;
											personagem.campeonato_id = null;

											personagem.save(function(err){
												var Upar = require('./struct/Upar.js');
												Upar.subir_level(personagem);
												response.redirect('/perfil');
											});
										});



									});
								}else if(request.param('proxima_luta')){
									Chave.findOne({campeonato_id: campeonato._id, data_liberacao: {$lte: (new Date())}, level: personagem.chave_lv, $or: [{personagem1_id: personagem._id}, {personagem2_id: personagem._id}]}, function(err, chave){
										var levels = parseInt(Math.log(campeonato.qtd_chaves) / Math.log(2));
										if(chave != null && personagem.chave_lv <= levels){
											personagem.chave_lv++;
											personagem.save();
											response.redirect('/luta/'+chave.luta_id+'?campeonato=true');
										}else{
											response.redirect('/perfil');
										}
									});
								}else{
									GerarCampeonato.get_campeonato(campeonato, chave_lv, function(camp){
										render_campeonato(request, response, user, personagem, camp);
									});
								}


							});

						}
					}
				});
			});
		}else{
			response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
		}
	});
	
	var render_index = function(req, res, session, novo_personagem){

		var socket_id = uuid();
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
						  portugues: (user.locale.indexOf('pt') >= 0),
				          socket_id: socket_id
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

		try{

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

		}catch(e){
			console.log(e.stack)
		}

	});
	
	app.all('/inicio', function(request, response) {

		var method = request.headers['x-forwarded-proto'] || 'http';

		if (request.session.auth) {

			var token = request.session.auth.facebook.accessToken;
			facebook.getSessionByAccessToken(token)(function(session) {

				var socket_id = uuid();

				//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {

					session.restCall('fql.query', {
						query: 'SELECT uid, name, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
						format: 'json'
					})(function(amigos) {

						var user = request.session.auth.facebook.user;
				        // render the home page
				        response.render('inicio.ejs', {
				          layout:   false,
				          token:    token,
				          user:     user,
				 		  amigos: amigos,
						  portugues: (user.locale.indexOf('pt') >= 0),
				          home:     method + '://' + request.headers.host + '/',
				          redirect: method + '://' + request.headers.host + request.url,
				          socket_id: socket_id
				        });

					});



			    //});

				// Amigos que jogam
				/*session.restCall('fql.query', {
					query: 'SELECT uid, name, is_app_user FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
					format: 'json'
				})(function(result) {
					result.forEach(function(friend) {
						socket_manager.send(socket_id, 'friend_using_app', friend);
					});
				});*/

			});

		}else{
			response.redirect('/');
		}

	});
	
	app.all('/loja', function(request, response) {

		var method = request.headers['x-forwarded-proto'] || 'http';

		if (request.session.auth) {

			var token = request.session.auth.facebook.accessToken;
			facebook.getSessionByAccessToken(token)(function(session) {

				//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {

					var user = request.session.auth.facebook.user;

					Personagem.findOne({uid: user.id}, function(err, data){
						if(data == null){
							response.redirect('inicio');
						}else{

							var possui_elemental = (data.equipamentos.indexOf(13) >= 0 || data.equipamentos.indexOf(18) >= 0 || data.equipamentos.indexOf(19) >= 0);

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
				//});
			});
		}else{
			response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
		}
	});
	
	app.all('/luta/:id?', function(request, response) {

		try{
		var method = request.headers['x-forwarded-proto'] || 'http';

		if (request.session.auth) {
			var token = request.session.auth.facebook.accessToken;
			facebook.getSessionByAccessToken(token)(function(session) {
				var socket_id = request.param('socket_id') ? request.param('socket_id') : uuid();
				//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {

					var user = request.session.auth.facebook.user;
					var luta_id = request.params.id;

					Personagem.findOne({uid: user.id}, function(err, personagem){

						if(personagem != null){
							if(request.param('vs')){
								var vs = request.param('vs');
								if(vs == user.id){
									response.redirect('/arena');
								}else{

									var Characters = require('./struct/Characters.js');
									Characters.lutas_restantes(personagem._id, function(quant){
										if(quant <= 0){
											request.session.erro = (user.locale.indexOf('pt') >= 0) ? 'Você já lutou muitas vezes hoje e seu meme está cansado, <br />volte amanhã. Quer mais lutas? <a href="loja">Clique aqui</a>' : 'You\'ve fought too many times today and you meme is tired, <br />come back tomorrow. Want more? <a href="loja">Clique here</a>';
											response.redirect('/perfil');
										}else{

											Personagem.findOne({uid: vs}, function(err, p2){

												if(p2 != null){
													var GerarLuta = require('./struct/GerarLuta.js');
													GerarLuta.gerar_luta(personagem, p2, false, function(luta, luta_id, vencedor, perdedor, short_url){
														var Randomize = require('./struct/Randomize.js');
														var movimentos = Randomize.imprimir_movimentos(luta.movimentos);

														response.render('luta.ejs', {
												          layout:   false,
												          token:    token,
												          user:     user,
														  luta_id: luta_id,
														  p1: personagem,
														  p2: p2,
														  movimentos: movimentos,
														  is_friend: false,
														  campeonato: (request.param('campeonato') ? true : false),
														  vencedor: vencedor,
														  perdedor: perdedor,
														  lutas_restantes: quant,
														  app_url: process.env.FACEBOOK_APP_URL,
														  app_home: process.env.FACEBOOK_APP_HOME,
														  short_url: short_url,
														  portugues: (user.locale.indexOf('pt') >= 0),
												          socket_id: socket_id
												        });

													});


												}else{
													response.redirect('/arena');
												}

											});

										}
									});

								}


							}else if(request.param('id')){

								var luta_id = request.param('id');
								Luta.findOne({_id: luta_id}, function(err, luta){
									if(luta == null){
										response.redirect('/perfil');
									}else{

										Personagem.findOne({_id: luta.personagem1_id}, function(err, p1){

											Personagem.findOne({_id: luta.personagem2_id}, function(err, p2){
												if(p1 == null || p2 == null){
													response.redirect('/perfil');
												}else{
													var vencedor = (p1._id.toString() == luta.ganhador_id.toString() ? p1 : p2);
													var perdedor = (p1._id.toString() == luta.ganhador_id.toString() ? p2 : p1);

													var Characters = require('./struct/Characters.js');
													Characters.lutas_restantes(personagem._id, function(quant){
														response.render('luta.ejs', {
												          layout:   false,
												          token:    token,
												          app:      app,
												          user:     user,
														  luta_id: luta_id,
														  p1: p1,
														  p2: p2,
														  movimentos: luta.movimentos,
														  is_friend: false,
														  campeonato: (request.param('campeonato') ? true : false),
														  vencedor: vencedor,
														  perdedor: perdedor,
														  lutas_restantes: quant,
														  app_url: process.env.FACEBOOK_APP_URL,
														  app_home: process.env.FACEBOOK_APP_HOME,
														  short_url: luta.short_url,
														  portugues: (user.locale.indexOf('pt') >= 0),
												          socket_id: socket_id
												        });
													});

												}
											});

										});


									}
								});

							}else{
								response.redirect('/');
							}
						}

					});

				//});
			});
		}else{
			//response.redirect('/');
			response.send('<a href="http://apps.facebook.com/meme_kombat">Veja a luta no Meme Kombat</a>');
		}
		}catch(e){
			console.log(e.stack)
		}

	});
	
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
							var Characters = require('./struct/Characters.js');
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
			response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
			//response.redirect('/');
		}
		}catch(e){
			console.log(e.stack)
		}

	});
	
	app.all('/ranking', function(request, response) {

		try{
		var method = request.headers['x-forwarded-proto'] || 'http';

		if (request.session.auth) {

			var token = request.session.auth.facebook.accessToken;
			facebook.getSessionByAccessToken(token)(function(session) {

				//session.graphCall('/' + process.env.FACEBOOK_APP_ID)(function(app) {

					var user = request.session.auth.facebook.user;


					session.restCall('fql.query', {
						query: 'SELECT uid FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1 ORDER BY rand()',
						format: 'json'
					})(function(result) {
						var amigos_uids = [];
						if(result && result.forEach){
							result.forEach(function(friend) {
								amigos_uids.push(friend.uid);
							});
						}

						amigos_uids.push(user.id);

						Personagem.where('uid').in(amigos_uids).sort('level', -1).limit(10).run(function(err, amigos){
							Personagem.where().sort('level', -1).limit(10).run(function(err, jogadores){
								response.render('ranking.ejs', {
									layout:   false,
							          token:    token,
							          user:     user,
									  amigos: amigos,
									  jogadores: jogadores,
									  portugues: (user.locale.indexOf('pt') >= 0)
							    });
							});
						});

					});

				//});
			});
		}else{
			response.send('<script type="text/javascript">top.location.href = "'+process.env.FACEBOOK_APP_HOME+'";</script>');
		}
		}catch(e){
			console.log(e.stack)
		}
	});
	
	
	
	
	
}catch(e){
	console.log(e.stack)
}