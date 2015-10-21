var HTTPS = require('https');

var botID = process.env.BOT_ID;
var safeFromPurge = [];

// Request attributes
// {"attachments":[],
// "avatar_url":"http://i.groupme.com/200x132.jpeg.45cfd3ac5ba242648f3961b89ce19c68",
// "created_at":1445374076,
// "group_id":"17311868",
// "id":"144537407603506323",
// "name":"Branden Rodgers",
// "sender_id":"21769018",
// "sender_type":"user",
// "source_guid":"9f0deb7bfc9b2d62919bff16c7828c09",
// "system":false,
// "text":"brobot?",
// "user_id":"21769018"}

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var statusCheck = /^purgebot\?/i;
  var avoidPurge = /^spare me/i;
  var startPurge = /^activate purge countdown/i;

  // statusCheck
  if (request.text && statusCheck.test(request.text)) {
    this.res.writeHead(200);
    postMessage("I WILL KILL YOU ALL");
    this.res.end();
  } else if (request.text && startPurge.test(request.text)) {
    this.res.writeHead(200);
    postMessage("PURGE COUNTDOWN INITIATED");
    postMessage("5");
    postMessage("4");
    postMessage("3");
    postMessage("2");
    postMessage("1");
    postMessage("jk");
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(message) {
  var botResponse = message;
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;