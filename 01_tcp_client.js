var net = require('net');
//rhub_client.js webui feature/1234

function getBranchProfile(arg) {
	switch (arg) {
		case 'webui': return { host: '192.168.1.104', port: 3030, localAddress: "192.168.1.104", device: arg, devbox: 'docker10.klipfolio.com', 'feature': ''}; break;
		case 'dpn': 	return { host: '167.114.160.168', port: 3030, localAddress: "192.168.200.10", device: arg}; break;
		default: console.log('Error: Invalid client connection id passed'); process.exit(1);
	}
}

var operationProfile = getBranchProfile(process.argv[2])
operationProfile.action = process.argv[3]
operationProfile.feature = process.argv[4]
operationProfile.extend = process.argv[5] || 0

console.log("Connection:");
console.log(operationProfile);

var stream = net.connect(operationProfile);
//stream.feature = operationProfile.feature;

stream.on('data', function(data) {
	console.log('(Server Wrote): ' + data);
	stream.end()
})

stream.write(JSON.stringify({'action': operationProfile.action, 'feature': operationProfile.feature, 'extend': operationProfile.extend}))
