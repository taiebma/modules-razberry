/******************************************************************************

 PortailDevice Z-Way Home Automation module
 Version: 1.0.0
 (c) ZWave.Me, 2013

 -----------------------------------------------------------------------------
 Author: Gregory Sitnin <sitnin@z-wave.me>
 Description:
     This module listens given VirtualDevice (which MUSt be typed as switch)
     level metric update events and switches off device after configured
     timeout if this device has been switched on.

******************************************************************************/

//var request = require("../../request");

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------
/*
function PortailDevice(id, controller, zDeviceId, zInstanceId, zScaleId) {
	// Call superconstructor first (AutomationModule)
	PortailDevice.super_.call(this, id, controller, zDeviceId, zInstanceId);

	// Create instance variables

	this.zCommandClassId = 0x32;
	this.zSubTreeKey = zScaleId;

	this.deviceType = "probe";

	var self = this;
}

inherits(PortailDevice, VirtualDevice);
*/

//  Devait servir a mettre a jour le device mais loadJSON ne fonctionne pas a cet endroit
Portail.prototype.performCommand = function (command) {
	console.log("PortailDevice: --- PortailDevice.performCommand processing...");

	var handled = true;
	var self = this;

	//    console.log("PortailDevice: Etat du portail : " + zway.devices[18].instances[0].Basic.data.level.value);
	console.log("PortailDevice: Etat du portail : " + controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level"));
	self.vdev.set("metrics:level", controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level"));

	if ("openPartial" === command) {

		console.log("PortailDevice: Ouverture partielle du portail ");

		if (zway.devices[18].instances[0].Basic.data.level.value == false) {
			//  ouverture du store
			console.log("PortailDevice: OpenPartial");
			console.log("PortailDevice: Appel de l'URL : " + self.config.urlPortailPartial);

			http.request({
				method: 'GET',
				url: self.config.urlPortailPartial,
				data: {}
			});
		} else {
			console.log("PortailDevice: Deja ouvert");
		}

	} else if ("on" === command) {

		console.log("PortailDevice: Ouverture complete du portail");

		if (controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") == "off" 
			|| controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") == "") {
			//  ouverture du store
			console.log("PortailDevice: Open");
			console.log("PortailDevice: Appel de l'URL : " + self.config.urlPortailOpen);

			http.request({
				method: 'GET',
				url: self.config.urlPortailOpen,
				data: {}
			});

			//  On verifie qu'il est bien ouvert sinon on recommence
			self.timer = setTimeout(function () {
				if (controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") == "off" 
					|| controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") == "") {
					console.log("PortailDevice: Devait etre a moitie ouvert on ouvre");
					console.log("PortailDevice: Appel de l'URL : " + self.config.urlPortailOpen);

					http.request({
						method: 'GET',
						url: self.config.urlPortailOpen,
						data: {}
					});
				}

				self.timer = null;
			}, 40 * 1000);

			this.vdev.set("metrics:level", "on");
		} else {
			console.log("PortailDevice: Deja ouvert");
		}

	} else if ("off" === command) {

		console.log("PortailDevice: Fermeture du portail ");

		if (controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") == "on"
			|| controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") == "") {
			console.log("PortailDevice: Close");
			console.log("PortailDevice: Appel de l'URL : " + self.config.urlPortailClose);

			http.request({
				method: 'GET',
				url: self.config.urlPortailClose,
				data: {}
			});

			//  On verifie qu'il est bien ferme sinon on recommence
			self.timer = setTimeout(function () {
				if (controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") == "on"
					|| controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") == "") {
					console.log("PortailDevice: Devait etre a moitie ouvert on referme");
					console.log("PortailDevice: Appel de l'URL : " + self.config.urlPortailClose);

					http.request({
						method: 'GET',
						url: self.config.urlPortailClose,
						data: {}
					});
				}

				self.timer = null;
			}, 40 * 1000);

			this.vdev.set("metrics:level", "off");
		} else {
			console.log("PortailDevice: Deja ferme");
		}

	} else {
		handled = false;
	}

	return handled ? true : PortailDevice.super_.prototype.performCommand.call(this, command);
}


