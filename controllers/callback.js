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
						  , arma = desc_armas(arma_id, order_info.language);
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
					
					
				}else if(data.method == 'payments_status_update'){
					
					
					
				}
				
			}
			
			

        });
    }else{
		response.send('');
	}
});