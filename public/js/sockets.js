var socket = io.connect();

socket.on('connect', function() {

	// identify this socket with our auth token
	socket.emit('auth', socket_id);

	// when a friend is received from the backend, add it to the page
	socket.on('friend_using_app', function(friend) {
		$('.quem-mais').show().children('ul').append('          							  					         \
		<li>             						                                                                     \
		<a href="#" uid="'+friend.id+'" class="no-follow"> \
		<img src="https://graph.facebook.com/'+friend.id+'/picture?type=square" alt="' + friend.name + '" />      \
		</a> \
		</li>                                                                               						 \
		');
		$('.quem-mais').css({width: 55 * Math.max(3, $('.quem-mais ul li').length) });
	});

	socket.on('friend_not_using_app', function(friend) {
		$('.quem-deveria').show().children('ul').append('          							  					         \
		<li>             						                                                                     \
		<a href="#" uid="'+friend.id+'" class="no-follow"> \
		<img src="https://graph.facebook.com/'+friend.id+'/picture?type=square" alt="' + friend.name + '" />      \
		</a> \
		</li>                                                                               						 \
		');
		$('.quem-deveria').css({width: 55 * Math.max(4, $('.quem-deveria ul li').length) });
	});

	/*socket.on('lutas_restantes', function(lutas_restantes){
		var notice = $('.notice');
		if(!notice.is(':visible')){
			notice.html(portugues ? 'Você tem ' + lutas_restantes + (lutas_restantes == 1 ? ' luta restante' : ' lutas restantes' ) + '. <a href="arena">Ir para a arena</a>' : 'You have ' + lutas_restantes + (lutas_restantes == 1 ? ' fight' : ' fights' ) + ' remaining. <a href="arena">Go to arena</a>').show().css({fontFamily: "'Lucida Grande', sans-serif"});
		}
		ajaxizar_links();
		cache_page(pagina_atual, $('.conteudo').html());
	});*/

	socket.on('quant_pupilos', function(quant_pupilos){
		$('.quant_pupilos').html(quant_pupilos);
		$('.texto_quant_pupilos').html(quant_pupilos != 1 ? (portugues ? "pupilos" : "pupils") : (portugues ? "pupilo" : "pupil"));
		if(quant_pupilos > 6 && $('li.pupilos').length > 0){
			$('li.pupilos').html('<a href="pupilos">'+(portugues ? "Mais" : "More")+'</a>');
		}
		ajaxizar_links();
		cache_page(pagina_atual, $('.conteudo').html());
	});

	socket.on('arquivamento', function(arquivamento){
		$('.armas_habilidades .badges ul').append(
			$('<li>').html(
				$('<img>').attr({
						src: 'img/badges/icones/'+arquivamento.img,
						'class': 'small_badge',
						'data-img': arquivamento.img,
						'data-up' : (portugues ? arquivamento.texto_cima : arquivamento.texto_cima_en),
						'data-down': (portugues ? arquivamento.texto_baixo : arquivamento.texto_baixo_en),
						border: 0
				})
			)
		);
		cache_page(pagina_atual, $('.conteudo').html());
	});

	socket.on('pupilo', function(pupilo){
		$('.armas_habilidades .pupilos ul').append(
			$('<li>').html(
				'<a href="perfil?uid='+pupilo.uid+'"> \
					<img src="https://graph.facebook.com/'+pupilo.uid+'/picture?type=square" alt="'+pupilo.nome+'" /> \
				</a>'
			)
		);
		ajaxizar_links();
		cache_page(pagina_atual, $('.conteudo').html());
	});

	socket.on('lutas_restantes_arena', function(lutas_restantes){

	});

	socket.on('nenhum_encontrado', function(){
		if($('.memes-arena').length > 0){
			$('.arena-loading').remove();
			$('.memes-arena').html('<div class="nenhum-resultado" style="width:720px; text-align:center; padding:20px 0;">'+(portugues ? "Nenhum resultado econtrado" : "No results found" )+'</div>');
			ajaxizar_links();
			cache_page('arena', $('.conteudo').html());
		}else{
			delete cached_pages['arena'];
		}
	});

	socket.on('player_arena', function(player){
		if($('.memes-arena').length > 0){
			$('.arena-loading').remove();
			$('.memes-arena').append(
				'<li> 																							\
					<a href="luta?vs='+player.uid+'" class="link_luta">&nbsp;</a>								\
					<div class="perfil">																		\
						<div style="width:500px; height:21px">													\
								<a href="perfil?uid='+player.uid+'">											\
									'+player.nome+'																\
								</a>																			\
						</div>																					\
					</div>																						\
					<div class="meme '+player.meme_src+' '+(player.genero == 'female' ? 'derpina' : '')+'" style="border:1px solid #CCC"></div>																								\
					<div class="foto">																			\
						<img src="https://graph.facebook.com/'+player.uid+'/picture?type=large" border="0" />	\
					</div>																						\
					<div class="level">																			\
						'+(portugues ? 'Nv' : 'Lv')+' '+(player.level)+'										\
					</div>																						\
				</li>'
			);
			if(typeof arena_uids == 'undefined') arena_uids = [];
			arena_uids.push(player.uid);
			ajaxizar_links();
			cache_page('arena', $('.conteudo').html());
		}else{
			delete cached_pages['arena'];
		}

	});

});
