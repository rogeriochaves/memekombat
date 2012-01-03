require.paths.unshift(__dirname + '/lib');
var memcache = require('memcache');

var client = new memcache.Client(11211, 'localhost');

client.on('connect', function(){
	client.get('ranking', function(error, result){
		if(result == null){
			client.set('ranking', {x: 'd'}, function(error, result){

			    console.log("stored");
				client.close();

			}, 10);
			
		}else{
			console.log("found");
			console.log(result);
			client.close();
		}
		
	});
    
});

client.connect();