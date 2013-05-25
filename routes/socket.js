/*
 * Serve content over a socket
 */

module.exports = function(socket) {

var serialport = require("serialport"),
	SerialPort = serialport.SerialPort,
	// mavlink = require('mavlink_ardupilotmega_v1.0');
	mavlink = require('mavlink');

	// Serial port communication stuff
	var sp = new SerialPort("/dev/tty.usbserial-A6023L0J", {
		baudrate: 57600
	});
	// var mavlinkParser = new MAVLink();
	var mavlinkParser = new mavlink(1,1);

	mavlinkParser.on("ready", function() {
		sp.on("data", function(data) {
			// mavlinkParser.parseBuffer(data);
			mavlinkParser.parse(data);
		});

		// mavlinkParser.on('message', function(message) {
		// 	socket.emit('mavlinkMessageEvent', message);
		// 	console.log(message);
		// });
		mavlinkParser.on('HEARTBEAT', function(message, fields) {
			console.log('Got a heartbeat message!');
		    console.log(fields);
		});
		mavlinkParser.on("ATTITUDE", function(message, fields) {
			socket.emit('ATTITUDE', fields);
		    console.log(fields);
		});
		mavlinkParser.on("VFR_HUD", function(message, fields) {
			socket.emit('VFR_HUD', fields);
		    console.log(fields);
		});
		mavlinkParser.on("SYS_STATUS", function(message, fields) {
			socket.emit('SYS_STATUS', fields);
		    console.log(fields);
		});
		mavlinkParser.on("RADIO", function(message, fields) {
			socket.emit('RADIO', fields);
		    console.log(fields);
		});
		mavlinkParser.on("GPS_STATUS", function(message, fields) {
			socket.emit('GPS_STATUS', fields);
		    console.log(fields);
		});
		mavlinkParser.on("SCALED_PRESSURE", function(message, fields) {
			socket.emit('SCALED_PRESSURE', fields);
		    console.log(fields);
		});
		mavlinkParser.on("ATTITUDE", function(message, fields) {
			socket.emit('ATTITUDE', fields);
		    console.log(fields);
		});
		mavlinkParser.on("BATTERY_STATUS", function(message, fields) {
			socket.emit('BATTERY_STATUS', fields);
		    console.log(fields);
		});
		
		
		
		


		
	});
};