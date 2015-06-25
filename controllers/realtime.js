app.get('/realtime', function(request, response) {
  if (request.param('hub.verify_token') === '***REMOVED***') {
    return response.send(request.param('hub.challenge'));
  }

  return response.send('');
});
