

	var redisHost = 'barracuda.redistogo.com'
      , redisPort = '9210'
      , redisDb = 'redistogo'
      , redisPass = '43c56adf34497a80bf6cfbc4c3052dd5';

var redis = require("redis").createClient(redisPort, redisHost);

	redis.auth(redisPass, function(){
		redis.flushall();
	});

