// arg list:
// feature (saas-2222)
// action (deployed, tests_failed, finished)
// extend (10) / this is in minutes

var TIMEOUT_CLIENT = 1000 // 10s
var USER='superdave'
var PASS='Password1'
var IP='192.168.1.106'
var BUILDTYPEID='Test_BuildStuff'


var net = require('net');
var request = require('request');
var mongoose = require('mongoose'),
  JSONStream = require('JSONStream');

mongoose.connect('mongodb://localhost/ratchetdb');

var Vm = require('./app/models/vm');
var Deployment = require('./app/models/vm');

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

function updateDeployment(actionObj) {
  Deployment.findOne({feature : actionObj.feature}, function (err, depItem) {
    if (err) throw err;
    if (depItem){
      switch (actionObj.action) {
        case "deployed":
          console.log("(ratchetbot) Updating the feature to deployed: " + actionObj.feature);
          // udpate the deployment
          depItem.deployed = true;
            depItem.save(function(err){
              console.log("(ratchetbot) Updated the feature to deployed: " + actionObj.feature);
          });
          break;
        // update test to fail
        case "test_failed":
          console.log("(ratchetbot) Updating the feature that tests failed: " + actionObj.feature);
          // udpate the deployment
          depItem.tests_failed = true;
            depItem.save(function(err){
              console.log("(ratchetbot) Updated the featured that tests failed: " + actionObj.feature);
          });
          break;
        case "finished":
          console.log("(ratchetbot) Updating the featured to finished: " + actionObj.feature);
          // udpate the deployment
          depItem.finished = true;
            depItem.save(function(err){
              console.log("(ratchetbot) Updated the featured to finished: " + actionObj.feature);
          });
          break;
      }
    } else {
      if (actionObj.action != "deploy") {
        console.log("(ratchetbot) tried to act on a feature that is not registered");
        return;
      }
      var deployment = new Deployment({
        feature: actionObj.feature
      });
      // call the built-in save method to save to the database
      deployment.save(function(err) {
        if (err) throw err;
        console.log("(ratchetbot) Creating new deployment: " + actionObj.feature);
        callTeamCityAPI("Test_BuildStuff", "name=fweb&value=saas-2222")
      });
    }
  });
}

function callTeamCityAPI(buildId, keySets) {
  var url = buildUrl(buildId, keySets)
  console.log("REQEST TIME: " + url)
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
       // Show the HTML for the Google homepage.
      console.log(body) // Show the HTML for the Google homepage.
    } else {
      console.log(error)
    }
  })
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

    updateDeployment(actionObj);
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
