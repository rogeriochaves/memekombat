var qs = require('querystring');

app.all('/callback', function(request, response) {
	
	if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var data = qs.parse(body);
			console.log("==========");
			console.log(data);
			console.log("===========");
			response.send(data);

        });
    }

});