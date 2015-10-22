// arg list:
// feature (saas-2222)
// action (deploy, deployed, test_failure, finished)
// extend (10) / this is in minutes

var TIMEOUT_CLIENT = 1000 // 10s
var USER='superdave'
var PASS='Password1'
var IP='192.168.1.106'
var BUILDTYPEID='Test_BuildStuff'


var net = require('net');
var request = require('request');
var mongoose = require('mongoose');
var JSONStream = require('JSONStream');
var SlackBot = require('slackbots');

var bot = new SlackBot({
    token: 'xoxb-11660487557-claMDxXFYT94TEMSpxQH8lsI', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'Ratchet'
});

var bot_params = {
    icon_emoji: ':space_invader:'
};

var server = net.createServer(function (socket) {
    socket.on('error', function(err){
        // Handle the connection error.
    });
});
var port = 3030;

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

function buildUrl(buildType, keySets) {
  return parse( "http://%s:%s@%s:8111/httpAuth/action.html?add2Queue=%s&%s", USER, PASS, IP, buildType, keySets)
}

function gotEvent(actionObj) {
  switch (actionObj.action) {
    case "deploy":
      console.log("(ratchetbot) Feature deployed" + actionObj.features);
      bot.postMessageToGroup('tallis-ratchet', 'Deployment on ' + actionObj.vmname + '\n' + "Features: " + actionObj.features, bot_params);
      break;

  }
}
server.listen(port);
server.once('listening', function() {
  console.log('Server listening on port %d', port);
});

listenerSet = false;


server.on('connection', function(stream) {
  console.log('Client attached:');
  stream.id = Math.floor(Math.random() * 1000);
  var parser = JSONStream.parse();
  stream.pipe(parser);
  listenerSet = true
  parser.on('data', function (actionObj) {
    console.log('Client sending action:');
    console.log(actionObj);

    gotEvent(actionObj);
    stream.write("1");
  });
  //
  // stream.on('data', function(data) {
  //   console.log('Client sending task: ' + stream.id + ' ' + data)
  //   stream.write("Hello Mr." + stream.id + ' (reference):' + data);
  //   stream.device_name = ''+data; //needs to be a string, not byte array stream
  //   updateTask(stream, 'feature_deploy');
  // });

  // var interval =
  // setInterval(function() {
  //   peer.emit('ping', Date.now());
  // }, 1000);
  //
  // peer.on('pong', function(myTimestamp, hisTimestamp) {
  //   console.log('got pong from peer with args %d and %d', myTimestamp, hisTimestamp);
  // });
});


bot.on('start', function() {
    bot.postMessageToGroup('tallis-ratchet', 'Ratchet Online!', bot_params);
});

// timechill = (function () {
//     var lastCall = 0;
//     console.log('asdasd');
//     return function () {
//         if (new Date() - lastCall < 10000)
//             return false;
//         lastCall = new Date();
//         console.log('passed time');
//     }
// })();
