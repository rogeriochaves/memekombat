app.all('/achievements/:url', function(request, response) {

	if(!request.params.url){
		response.redirect('/');
	}else{
		Arquivamento.findOne({url: request.params.url}, function(err, data){
			if(data == null){
				response.redirect('/');
			}else{
				response.render('achievements.ejs', {
			      layout:   false,
				  app_home: process.env.FACEBOOK_APP_HOME,
				  app_id: process.env.FACEBOOK_APP_ID,
			      arquivamento: data
			    });
			}
		});
	}

});