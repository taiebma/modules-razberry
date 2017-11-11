/*** SwitchAllOff HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Allumage des lampes du Salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function SwitchAllOff (id, controller) {
    // Call superconstructor first (AutomationModule)
    SwitchAllOff.super_.call(this, id, controller);

}

inherits(SwitchAllOff, AutomationModule);

_module = SwitchAllOff;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

SwitchAllOff.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    SwitchAllOff.super_.prototype.init.call(this, config);

    var self = this;

    this.controller.on('ActivationSceneDoubleDimUpStop', function () {

    	//  Extinction des feux
    	console.log("SwitchAllOff : Extrinction des devices");

	Object.keys(zway.devices).forEach(function (deviceId) {
 		deviceId = parseInt(deviceId, 10);
		if (deviceId != 1) {

			var device = zway.devices[deviceId];

			Object.keys(device.instances).forEach(function (instanceId) {
 				instanceId = parseInt(instanceId, 10);
				var instance = device.instances[instanceId];

    				instance.commandClasses[37] && instance.commandClasses[37].Set(false);
    				instance.commandClasses[38] && instance.commandClasses[38].Set(0);
			});
		}
	});

    });

};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

