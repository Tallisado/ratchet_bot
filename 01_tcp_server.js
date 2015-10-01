var TIMEOUT_CLIENT = 1000 // 10s
var USER='superdave'
var PASS='Password1'
var IP='192.168.1.106'
var BUILDTYPEID='Test_BuildStuff'


var net = require('net');
var request = require('request');

var nodes = [
  {name:'docker9', inuse: false},
  {name:'docker10', inuse: false}
]

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

var client_list = []
function updateTask(stream_obj, task) {
  console.log(task);
  switch (task) {
    case 'feature_deploy': {
      var is_new = true;
      client_list.filter(function(v) {
          if (v.feature == stream_obj.feature) {
            console.log('feature_deploy collision: ' + stream_obj.feature)
            var is_new = false;
          }
      });
      if (is_new) {
        console.log("ADDING NEW");
        client_list.push({ 'feature': stream_obj.feature, 'id': stream_obj.id, 'state': 'deploying', 'date': (new Date()-0) });
        callTeamCityAPI("Test_BuildStuff", "name=fweb&value=saas-2222")
        break;
      }
      break;
    }
    case 'updatedPassedTest': {
      var is_new = true;
      client_list.filter(function(v) {
          if (v.feature == stream_obj.feature) {
            console.log('UPDATED TEST')
            var is_new = false;
          }
      });
      if (is_new) {
        console.log("No update.. feature??");
      }
      break;
    }
    // case 'delete': {
    //   for (var i = 0; i < client_list.length; i++) {
    //     if (client_list[i].date < (new Date() - 10000)) {
    //       client_list[i].state = 'offline';
    //     }
    //   }
    //   break;
    // }
  }
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

server.on('connection', function(stream) {
  stream.id = Math.floor(Math.random() * 1000);
  stream.on('data', function(data) {
    console.log('Client is requesting task: ' + stream.id + ' ' + data)
    stream.write("Hello Mr." + stream.id + ' (reference):' + data);
    stream.device_name = ''+data; //needs to be a string, not byte array stream
    updateTask(stream, 'feature_deploy');
  });

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
