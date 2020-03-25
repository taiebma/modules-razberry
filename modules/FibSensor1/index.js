/*** FibSensor1 HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Fibaro Senso 1

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function FibSensor1 (id, controller) {
    // Call superconstructor first (AutomationModule)
    FibSensor1.super_.call(this, id, controller);

   this.modeNuit = false;
   this.attribute = [];
   this.attribute["temperature"] = 0;
   this.attribute["luminosite"] = 0;
}

inherits(FibSensor1, AutomationModule);

_module = FibSensor1;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

FibSensor1.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    FibSensor1.super_.prototype.init.call(this, config);

    var self = this;
    
    console.log("FibSensor1 : Seuil de luminosite =" + self.config.seuilLuminosite);


	//  Evenement de mise a jour d'evement
	this.metricUpdated = function (vDev) {
		var id = vDev.id;
		var name = vDev.name;
		var value = vDev.get("metrics:level");
	
		console.log("FibSensor1 : update de " + id + " name = " + name + " value = " + value);
		if (id === self.config.luminosite) {
			self.attribute["luminosite"] = value;
   			console.log("FibSensor1 : Sonde de luminosite " + self.attribute["luminosite"] );
			if (value > self.config.seuilLuminosite) {
				if (self.modeNuit) {
					self.modeNuit = false;
					self.controller.emit("ModeJour", value);
   					console.log("FibSensor1 : Mode nuit = " + self.modeNuit);
				}
			}
			else {
				if (!self.modNuit) {
					self.modeNuit = true;

					self.controller.emit("ModeNuit", value);
   					console.log("FibSensor1 : Mode nuit = " + self.modeNuit);
				}
			}
		} 
		if (id === self.config.alarme) {
			if (value == "on") {
				self.controller.emit("Alarme", 1);
   				console.log("FibSensor1 : Alarme d�clench�e en zone 1");
			}
			else {
				self.controller.emit("AlarmeOff", 1);
   				console.log("FibSensor1 : Alarme en zone 1 terminee");
			}
		}
		if (id === self.config.temperature) {
			self.attribute["temperature"] = value;
   			console.log("FibSensor1 : Temperature = " + self.attribute["temperature"]);
		}

		if (id === self.config.PortailDev) {
			if (value == "on") {
				console.log("FibSensor1 : Portail ouvert");
				self.controller.emit("AlarmPortailOuvert");
			} else {
				console.log("FibSensor1 : Portail ferme");
				self.controller.emit("AlarmPortailFerme");
			}
		}
	};

    this.controller.devices.on('change:metrics:level', self.metricUpdated);

	////////////
    //  Evenement notification push
    // notice = {
    //    id: ,
    //    timestamp: ,
    //    level: ,
    //    message: ,
    //    type: ,
    //    source: ,
    //    redeemed:
    ////////////
    this.controller.on('notifications.push', function (notice) {
        console.log("FibSensor1 : Notification " + notice.source + ' msg:' + notice.message);
        if (notice.source === 'PortailDevice') {
			if (notice.message.l == "on") {
				console.log("FibSensor1 : Portail ouvert");
				self.controller.emit("AlarmPortailOuvert");
			} else {
				console.log("FibSensor1 : Portail ferme");
				self.controller.emit("AlarmPortailFerme");
			}
		}
    });

};


FibSensor1.prototype.GetValue = function (name) {
	var self = this;
	return self.attribute[name];
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

