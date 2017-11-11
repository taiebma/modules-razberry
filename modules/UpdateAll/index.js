/*** UpdateAll HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Allumage des lampes du Salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function UpdateAll (id, controller) {
    // Call superconstructor first (AutomationModule)
    UpdateAll.super_.call(this, id, controller);

}

inherits(UpdateAll, AutomationModule);

_module = UpdateAll;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

UpdateAll.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    UpdateAll.super_.prototype.init.call(this, config);

    console.log("Mise a jour des devices a " + this.config.heureUpdate + ":" + this.config.minuteUpdate);

    this.controller.emit("cron.addTask", "UpdateAll.poll", {
        	minute: this.config.minuteUpdate,
        	hour: this.config.heureUpdate,
        	weekDay: this.config.weekDay,
        	day: null,
        	month: null
    });

    var self = this;

    this.controller.on('UpdateAll.poll', function () {

        //  Arret du cron
        self.controller.emit("cron.removeTask", "UpdateAll.poll" );

    	//  Extinction des feux
    	console.log("UpdateAll : Refresh des devices");

	//  On lance la mise a jour de l'état des devices
	self.controller.emit("UpdateDevicesStates");

	//  Mise en place d'une tempo sinon il ne s'arrete plus
	self.timer = setTimeout(function () {

		console.log("UpdateAll : Reprogrammation pour le lendemain");
    		self.controller.emit("cron.addTask", "UpdateAll.poll", {
        		minute: self.config.minuteUpdate,
        		hour: self.config.heureUpdate,
        		weekDay: self.config.weekDay,
        		day: null,
        		month: null
    		});
		self.timer = null;
	}, 60 *1000);
    });

    this.controller.on('UpdateDevicesStates', function () {

	Object.keys(zway.devices).forEach(function (deviceId) {
 		deviceId = parseInt(deviceId, 10);
		if (deviceId != 1) {

			var device = zway.devices[deviceId];

			Object.keys(device.instances).forEach(function (instanceId) {
 				instanceId = parseInt(instanceId, 10);
				var instance = device.instances[instanceId];

    				instance.commandClasses[37] && instance.commandClasses[37].Get();
				instance.commandClasses[38] && instance.commandClasses[38].Get();
				instance.commandClasses[48] && instance.commandClasses[48].Get();
			});
		}
	});

    });

};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

