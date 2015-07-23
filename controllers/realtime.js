var httpRequest = require('request');
var itemList = {
  "https://memekombat.herokuapp.com/1-extra-fight.html": {extraFights: 1, price: 0.29},
  "https://memekombat.herokuapp.com/3-extra-fights.html": {extraFights: 3, price: 0.49},
  "https://memekombat.herokuapp.com/5-extra-fights.html": {extraFights: 5, price: 1.79}
}

app.get('/realtime', function(request, response) {
  if (request.param('hub.verify_token') === '***REMOVED***') {
    return response.send(request.param('hub.challenge'));
  }

  return response.type('text/plain').status(404).send('Cannot GET /realtime');
});

app.post('/realtime', function(request, response) {
  var payment_id = request.body.entry[0].id;

  var credentials = {
    client_id: '183114805092475',
    client_secret: '***REMOVED***',
    grant_type: 'client_credentials'
  };

  // Get app access_token
  httpRequest({url: 'https://graph.facebook.com/v2.3/oauth/access_token', qs: credentials, json: true}, function(err, res, body){
    if (err) return response.status(500).send("Error #1: " + err);
    var params = {access_token: body.access_token};

    // Get payment information
    httpRequest({url: 'https://graph.facebook.com/v2.3/' + payment_id, qs: params, json: true}, function(err, res, body){
      if (err) return response.status(500).send("Error #2: " + err);

      var actions = body.actions;
      var lastAction = actions[actions.length - 1];
      var item = itemList[body.items[0].product];
      var uid = body.user.id;

      // Check if payment was approved
      if (lastAction.type === 'charge' && lastAction.status === 'completed') { // approved
        Personagem.findOne({uid: uid}, function(err, personagem){
          if (err) return response.status(500).send("Error #3: " + err);

          // Add credits to the character to let he/she fight more battles
          c = new Credito({
            personagem_id: personagem._id,
            valor: item.price,
            quantidade: item.extraFights,
            payment_id: payment_id
          });
          c.save(function(err){
            if (err) return response.status(500).send("Error #4: " + err);

            response.send("ok");
          });
        });
      } else {
        response.send("nothing to do");
      }

    });
  });
});
