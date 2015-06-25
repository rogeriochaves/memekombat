var request = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('realtime', function () {
  it("should respond with foo when the verify_token is correct", function(done) {
    params = {
      'hub.mode': 'subscribe',
      'hub.challenge': 'foo',
      'hub.verify_token': '***REMOVED***'
    }
    request({url: "https://localhost:3000/realtime", qs: params}, function(error, response, body){
      expect(body).toEqual('foo');
      done();
    });
  });

  it("should not respond when the verify_token is correct", function(done) {
    params = {
      'hub.mode': 'subscribe',
      'hub.challenge': 'foo',
      'hub.verify_token': 'abc'
    }
    request({url: "https://localhost:3000/realtime", qs: params}, function(error, response, body){
      expect(body).toEqual('');
      done();
    });
  });
});
