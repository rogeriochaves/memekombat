app.get('/realtime', function(request, response) {
  if (request.param('hub.verify_token') === '***REMOVED***') {
    return response.send(request.param('hub.challenge'));
  }

  return response.type('text/plain').status(404).send('Cannot GET /realtime');
});

app.post('/realtime', function(request, response) {
  var id = request.body.entry[0].id;

  var p = new Pedido({
    uid: '123',
    order_id: id,
    tipo: 2,
    quantidade: 1
  });

  p.save(function(err){
    console.log('err', err);
    response.send(id);
  });
});
