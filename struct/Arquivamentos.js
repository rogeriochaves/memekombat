module.exports.postar_arquivamento = function(arquivamento_url, personagem, fn) {
	if(process.env.NODE_ENV != 'production'){
		return false;
	}

	Arquivamento.findOne({url: arquivamento_url}, function(err, arquivamento){
		if(arquivamento != null && personagem.arquivamentos.indexOf(arquivamento._id) == -1){

			var http = require('https');
			var options = {
			  host: 'graph.facebook.com',
			  port: 443,
			  path: '/oauth/access_token&client_id='+process.env.FACEBOOK_APP_ID+'&client_secret='+process.env.FACEBOOK_SECRET+'&grant_type=client_credentials',
			  method: 'GET'
			};

			// uid, meme_src, level, hp, atq, vel, def, crit, nome, exp, idioma, genero, username, ranking_pos, vitorias, derrotas
			var req = http.request(options, function(res) {


				res.setEncoding('utf8');
				res.on('data', function (data) {


					var app_access_token = data.split('access_token=')[1];
					var achievement = process.env.APP_URL + 'achievements/' + arquivamento.url;
					var achievement_display_order = 1;
					var score = 10;
					var achievement_registration_URL = '/' + process.env.FACEBOOK_APP_ID + '/achievements&achievement=' + achievement + '&display_order=' + achievement_display_order + '&access_token=' + app_access_token;

					options.path = achievement_registration_URL;
					options.method = 'POST';

					var req2 = http.request(options, function(res) {
						res.setEncoding('utf8');
						res.on('data', function (data) {


							var achievement_URL = '/' + personagem.uid + '/achievements&achievement=' + achievement + '&access_token=' + app_access_token;

							options.path = achievement_URL;
							var req3 = http.request(options, function(res) {
								res.setEncoding('utf8');
								res.on('data', function (data) {


									personagem.arquivamentos.push(arquivamento._id);
									var n = new Notificacao({
										personagem_id: personagem._id,
										texto: "Você conseguiu a insígnia <b>" + arquivamento.titulo + "</b>",
										texto_en: "You achieved the <b>" + arquivamento.titulo + "</b> badge",
										tipo: 1
									});
									n.save();
									personagem.save(function(err){
										if(typeof fn != 'undefined') fn();
									});

								});

							});
							req3.end();
							req3.on('error', function(e) {
							  console.error(e);
							});
						});

					});
					req2.end();
					req2.on('error', function(e) {
					  console.error(e);
					});
				});

			});
			req.end();
			req.on('error', function(e) {
			  console.error(e);
			});
		}
	});

}