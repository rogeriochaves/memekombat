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
				var order_info = JSON.parse(data.order_info);

				var p = new Pedido({
					uid: data.receiver,
					order_id: data.order_id,
					tipo: order_info.tipo
				});
				console.log("====2=====");
				console.log(order_info);

				response.send(data);
			}
			
			

        });
    }
});