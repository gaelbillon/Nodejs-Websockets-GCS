'use strict';

/* Controllers */

function AppCtrl($scope, socket, $timeout) {

	// Spoof airspeed for testing without mavlink
	$scope.message = {};
	$scope.timeInMs = 0;
	var countUp = function() {
	    $scope.timeInMs+= 500;
	    $timeout(countUp, 500);
	    var rand = Math.random() * 360;
	    rand = rand - (rand % 10);
	    if ( rand < 180 ) { rand = undefined };
	    $scope.$apply(function () {
	        $scope.message.airspeed = rand;
	    });
	}
	$timeout(countUp, 500);

	// When we have a new mavlik message
	socket.on('SYS_STATUS', function(data) {
		console.log(data);
	});
	socket.on('mavlinkMessageEvent', function(data) {
		// List of autopilotes
		var autopilotType = ['Generic autopilot, full support for everything', 'PIXHAWK autopilot', 'SLUGS autopilot', 'ArduPilotMega / ArduCopter', 'OpenPilot', 'Generic autopilot only supporting simple waypoints', 'Generic autopilot supporting waypoints and other simple navigation commands', 'Generic autopilot supporting the full mission command set', 'No valid autopilot, e.g. a GCS or other MAVLink component', 'PPZ UAV', 'UAV Dev Board', 'FlexiPilot', 'PX4 Autopilot', 'SMACCMPilot', 'MAV_AUTOPILOT_AUTOQUAD'];
		var vehicleType = ['Generic micro air vehicle.', 'Fixed wing aircraft.', 'Quadrotor', 'Coaxial helicopter', 'Normal helicopter with tail rotor.', 'Ground installation', 'Operator control unit / ground control station', 'Airship, controlled', 'Free balloon, uncontrolled', 'Rocket', 'Ground rover', 'Surface vessel, boat, ship', 'Submarine', 'Hexarotor', 'Octorotor', 'Octorotor', 'Flapping wing', 'MAV_TYPE_KITE'];
		var systemStatus = ['Uninitialized system, state is unknown.', 'System is booting up.', 'System is calibrating and not flight-ready.', 'System is grounded and on standby. It can be launched any time.', 'System is active and might be already airborne. Motors are engaged.', 'System is in a non-normal flight mode. It can however still navigate.', 'System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.', 'MAV_STATE_POWEROFF'];
		// Parameters displayed in app
		var parametersInMavlink = ['airspeed', 'groundspeed', 'heading', 'throttle', 'lat', 'lon', 'alt', 'nav_roll', 'nav_pitch', 'nav_bearing', 'climb', 'xacc', 'yacc', 'zacc', 'xgyro', 'ygyro', 'zgyro', 'xmag', 'ymag', 'zmag', 'target_bearing', 'wp_dist','vcc', 'time_boot_ms', 'mavlink_version', 'relative_alt', 'autopilot', 'type', 'system_status'];
		// Retrieve mavlink data from the view and reinject if 
		// data wasn't present in the latest mavlik message.
		// It will prevent flickering of data in the app
		var dataFromView = $scope.$$watchers;
		var valuesFromView = [];
		for (var i in dataFromView) {
			var split = (dataFromView[i].last).split(' : ');
			valuesFromView[split[0]] = typeof(split[1]) === 'string' ? split[1] : parseFloat(split[1]);
		}
		// $scope will be used to update the view
		$scope.message = {};
		for (var key in parametersInMavlink) {
			if (data[parametersInMavlink[key]] === undefined) {
				$scope.message[parametersInMavlink[key]] = valuesFromView[parametersInMavlink[key]];
			} else {
				$scope.message[parametersInMavlink[key]] = data[parametersInMavlink[key]];
				if (parametersInMavlink[key] === 'autopilot') {
					$scope.message.autopilot = autopilotType[data[parametersInMavlink[key]]];
				}
				if (parametersInMavlink[key] === 'type') {
					$scope.message.type = vehicleType[data[parametersInMavlink[key]]];
				}
				if (parametersInMavlink[key] === 'system_status') {
					$scope.message.system_status = systemStatus[data[parametersInMavlink[key]]-1];
				}

			}
		}
	});
}

function CompassCtrl($scope, socket, $timeout) {
	// Spoof compass for testing without mavlink
	$scope.timeInMs = 0;
	var countUp = function() {
	    $scope.timeInMs+= 500;
	    $timeout(countUp, 500);
	    var rand = Math.random() * 360;
	    rand = rand - (rand % 10);
	    $scope.$apply(function () {
	        $scope.heading = rand;
	    });
	}
	$timeout(countUp, 500);

	// socket.on('mavlinkMessageEvent', function(data) {
	// 	if (data.heading) {
	// 		$scope.heading = data.heading;
	// 	}
	// });
}

function d3Ctrl($scope, $timeout) {
	$scope.timeInMs = 0;
	var countUp = function() {
	    $scope.timeInMs+= 500;
	    $timeout(countUp, 500);
	    var rand = Math.random() * 360;
	    rand = rand - (rand % 10);
	    // if ( rand < 180 ) { rand = undefined };
	    $scope.$apply(function () {
	        $scope.dat = rand;
	    });
	}
	$timeout(countUp, 500);
}

function GoogleMapCtrl($scope, $timeout, $log, socket) {

	// Enable the new Google Maps visuals until it gets enabled by default.
	// See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
	google.maps.visualRefresh = true;

	angular.extend($scope, {

		mapTypeId: google.maps.MapTypeId.SATELLITE,

		position: {
			coords: {
				latitude: 45.1733987,
				longitude: 5.802457899999999
			}
		},

		/** the initial center of the map */
		centerProperty: {
			latitude: 45.1733987,
			longitude: 5.802457899999999
		},

		/** the initial zoom level of the map */
		zoomProperty: 20,

	});

	// Move marker on new mavlink message
	socket.on('mavlinkMessageEvent', function(data) {
		if (data.lat && data.lon) {
			angular.extend($scope, {
				markersProperty: [{
						latitude: data.lat / 10000000,
						longitude: data.lon / 10000000
					}
				],
			});
		}
	});
}
GoogleMapCtrl.$inject = ['$scope', '$timeout', '$log', 'socket'];