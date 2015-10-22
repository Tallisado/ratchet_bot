var net = require('net');
//rclient dockerX FWEB=feature/saas-1111,FDC=feature/saas-2222
RSERVER_IP   = "192.168.1.107"
RSERVER_PORT = 3030

var operationProfile = { host: RSERVER_IP, port: RSERVER_PORT, localAddress: RSERVER_IP }
operationProfile.action = "deploy"
operationProfile.vmname = process.argv[2]
operationProfile.features = process.argv[3]

console.log("Connection Params:");
console.log(operationProfile);

var stream = net.connect(operationProfile);

stream.on('data', function(data) {
	console.log('(Server Wrote): ' + data);
	stream.end()
})

stream.write(JSON.stringify({'action': operationProfile.action, 'features': operationProfile.features, 'vmname': operationProfile.vmname }))
