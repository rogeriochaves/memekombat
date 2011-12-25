var socket = io.connect();

socket.on('connect', function() {

	// identify this socket with our auth token
	socket.emit('auth', socket_id);

	// when a friend is received from the backend, add it to the page
	socket.on('friend_using_app', function(friend) {
		$('.quem-mais').show().children('ul').append('          							  					         \
		<li>             						                                                                     \
		<a href="#" uid="'+friend.uid+'" class="no-follow"> \
		<img src="https://graph.facebook.com/'+friend.uid+'/picture?type=square" alt="' + friend.name + '" />      \
		</a> \
		</li>                                                                               						 \
		');
		$('.quem-mais').css({width: 55 * Math.max(3, $('.quem-mais ul li').length) });
	});
	
	socket.on('friend_not_using_app', function(friend) {
		$('.quem-deveria').show().children('ul').append('          							  					         \
		<li>             						                                                                     \
		<a href="#" uid="'+friend.uid+'" class="no-follow"> \
		<img src="https://graph.facebook.com/'+friend.uid+'/picture?type=square" alt="' + friend.name + '" />      \
		</a> \
		</li>                                                                               						 \
		');
		$('.quem-deveria').css({width: 55 * Math.max(4, $('.quem-deveria ul li').length) });
	});
	
	socket.on('lutas_restantes', function(lutas_restantes){
		var notice = $('.notice');
		if(!notice.is(':visible')){
			notice.html(portugues ? 'Você tem ' + lutas_restantes + (lutas_restantes == 1 ? ' luta restante' : ' lutas restantes' ) + '. <a href="arena">Ir para a arena</a>' : 'You have ' + lutas_restantes + (lutas_restantes == 1 ? ' fight' : ' fights' ) + ' remaining. <a href="arena">Go to arena</a>').show();
		}
	});
	
	socket.on('quant_pupilos', function(quant_pupilos){
		$('.quant_pupilos').html(quant_pupilos);
		$('.texto_quant_pupilos').html(quant_pupilos != 1 ? (portugues ? "pupilos" : "pupils") : (portugues ? "pupilo" : "pupil"));
		if(quant_pupilos > 6 && $('li.pupilos').length > 0){
			$('li.pupilos').html('<a href="pupilos">'+(portugues ? "Mais" : "More")+'</a>');
		}
	});
	
});