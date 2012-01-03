require.paths.unshift(__dirname + '/lib');
var memcache = require('memcache');

var client = new memcache.Client(11211, 'mc9.ec2.northscale.net');
//client.username = 'app2171098@heroku.com';
//client.password = 'mtXrOCx4o8dQZ9UJ';

client.on('connect', function(){
	client.get('ranking', function(error, result){
		if(result == null){
			client.set('ranking', JSON.stringify({x: 'd'}), function(error, result){

			    console.log("stored");
				client.close();

			}, 10);
			
		}else{
			console.log("found");
			console.log(JSON.parse(result));
			client.close();
		}
		
	});
    
});

client.connect();