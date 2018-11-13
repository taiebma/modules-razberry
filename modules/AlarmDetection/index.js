/*** AlarmDetection HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Allumage des lampes du Salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function AlarmDetection (id, controller) {
    // Call superconstructor first (AutomationModule)
    AlarmDetection.super_.call(this, id, controller);

	this.alarmEnCours = false;
}

inherits(AlarmDetection, AutomationModule);

_module = AlarmDetection;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

AlarmDetection.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    AlarmDetection.super_.prototype.init.call(this, config);

    var self = this;
    self.alarmEnCours = false;

    this.controller.on('Alarme', function (id) {

	console.log("AlarmDetection : Alarme " + id + " declenchee");

	if (self.alarmEnCours == true) {
		console.log("AlarmDetection : Alarme deja en cours");
		return;
	} 

	//  Surveillance activee ?
	var surveillance = (controller.devices.get("SurveillanceDevice1").get("metrics:level") == "on")? true : false;
	console.log("AlarmDetection : Flag Surveillance : <" + surveillance +"> <" + controller.devices.get("SurveillanceDevice1").get("metrics:level") +">");
	if (!surveillance) {
		console.log("AlarmDetection : Surveillance desactivee");
		return;
	}

	//  Mode vacances
	self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on")?true:false;

	var curDate = new Date();
	console.log("AlarmDetection : Heure de surveillance entre " + self.config.heureDebut + "h et " + self.config.heureFin + "h");
	if ( (curDate.getHours() >= self.config.heureDebut && curDate.getHours() < self.config.heureFin) || self.modeVacances) {

		self.alarmEnCours = true;

		//  Allumage de toutes les lumieres
		Object.keys(zway.devices).forEach(function (deviceId) {
 			deviceId = parseInt(deviceId, 10);
			if (deviceId != 1) {
				var device = zway.devices[deviceId];

				Object.keys(device.instances).forEach(function (instanceId) {
 					instanceId = parseInt(instanceId, 10);
					var instance = device.instances[instanceId];

    					instance.commandClasses[37] && instance.commandClasses[37].Set(true);
    					instance.commandClasses[38] && instance.commandClasses[38].Set(255);
				});
			}
		});

		var eventString = 'Subject: HomeAlarmDetection';
    		try {
        		system(
            		"echo 'Subject: HomeAlarmDetection' | /usr/sbin/sendmail -f taiebma@free.fr gmtaiebma@gmail.com"
        		);
    		} catch(err) {
        		console.log("Failed to execute script system call mail: " + err);
    		}

		var zone = '224.0.1.100';
		var port = 8084;

    		try {
        		system(
            		"python /opt/z-way-server/automation/network_send_notif.py",
            		eventString,
            		zone,
            		port
        		);
    		} catch(err) {
        		debugPrint("Failed to execute script notif system call: " + err);
    		}


		//  On eteint les lumieres 
        	self.timer = setTimeout(function () {

                	console.log("AlarmDetection : On eteint les lumieres ");
                	self.controller.emit("ActivationSceneDoubleDimUpStop");

			self.alarmEnCours = false;

        	}, 5 * 60 *1000); // on attentends 10 minutes


	}

    });

};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

