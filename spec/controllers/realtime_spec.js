var request = require('request');
var realtimeUrl = 'https://localhost:3000/realtime';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('realtime verification', function () {
  it("should respond with foo when the verify_token is correct", function(done) {
    params = {
      'hub.mode': 'subscribe',
      'hub.challenge': 'foo',
      'hub.verify_token': '***REMOVED***'
    }
    request({url: realtimeUrl, qs: params}, function(error, response, body){
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
    request({url: realtimeUrl, qs: params}, function(error, response, body){
      expect(response.statusCode).toBe(404);
      done();
    });
  });
});

describe('realtime post', function () {
  it('updates a payment object', function () {
    var payload = {
      "object": "payments",
      "entry": [
        {
          "id": "679477058849455",
          "time": 1347996346,
          "changed_fields": [
            "actions"
          ]
        }
      ]
    };

    request({url: realtimeUrl, method: 'post', body: payload, json: true}, function(error, response, body){
      console.log(body);
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
