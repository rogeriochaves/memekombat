module.exports.postar_arquivamento = function(arquivamento_url, personagem, fn) {
	if(environment == 'development'){
		return false;
	}
	
	console.log("=========A=========");
	
	Arquivamento.findOne({url: arquivamento_url}, function(err, arquivamento){
		if(arquivamento != null && personagem.arquivamentos.indexOf(arquivamento.num) == -1){
			
			console.log("=========B=========");

			var http = require('http');
			var options = {
			  host: 'graph.facebook.com',
			  port: 443,
			  path: '/oauth/access_token&client_id='+process.env.FACEBOOK_APP_ID+'&client_secret='+process.env.FACEBOOK_SECRET+'&grant_type=client_credentials',
			  method: 'POST'
			};

			// uid, meme_src, level, hp, atq, vel, def, crit, nome, exp, idioma, genero, username, ranking_pos, vitorias, derrotas
			http.request(options, function(res) {
				
				console.log("=========B2=========");
				console.log(res);
				
				res.setEncoding('utf8');
				res.on('data', function (data) {
					
					console.log("=========C=========");
				
					var app_access_token = data.split('access_token=')[1];
					var achievement = process.env.FACEBOOK_APP_HOME + 'achievements/?url=' + arquivamento.url;
					var achievement_display_order = 1;
					var score = 10;
					var achievement_registration_URL = '/' + process.env.FACEBOOK_APP_ID + '/achievements&achievement=' + achievement + '&display_order=' + achievement_display_order + '&access_token=' + app_access_token;
				
					options.path = achievement_registration_URL;
				
					http.request(options, function(res) {
						res.setEncoding('utf8');
						res.on('data', function (data) {
							
							console.log("=========D=========");
							
							var achievement_URL = '/' + personagem.uid + '/achievements&achievement=' + achievement + '&access_token=' + app_access_token;
							
							options.path = achievement_URL;
							http.request(options, function(res) {
								res.setEncoding('utf8');
								res.on('data', function (data) {
									
									console.log("=========E=========");
						
									personagem.arquivamentos.push(arquivamento.num);
									personagem.notificacoes.push({
										texto: "Você conseguiu a insígnia <b>" + arquivamento.titulo + "</b>",
										texto_en: "You achieved the <b>" + arquivamento.titulo + "</b> badge",
										tipo: 1
									});
									personagem.save(function(err){
										if(typeof fn != 'undefined') fn();
									});
						
								});
								
							});
							
						});
					
					});
					
				});
				
			});
		}
	});

}