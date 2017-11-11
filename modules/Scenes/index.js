/*** Scenes module ********************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB
Copyright: 
     Module de gestion des devices de scene

******************************************************************************/


// Concrete module constructor

function Scenes (id, controller) {
    Scenes.super_.call(this, id, controller);

}

// Module inheritance and setup

inherits(Scenes, AutomationModule);

_module = Scenes;

Scenes.prototype.init = function (config) {
    Scenes.super_.prototype.init.call(this, config);

    var self = this;

    // Load abstract ScenesDevice device class
    //executeFile(this.moduleBasePath()+"/VacancesDevice.js");
    //executeFile(this.moduleBasePath()+"/SurveillanceDevice.js");

    this.vdevVacances = this.controller.devices.create({
        deviceId: "VacancesDevice1",
        defaults: {
            deviceType: "switchBinary",
            metrics: {
                title: 'Vacances Device ' + this.id,
		level: "false",
                icon: ""
            }
        },
        overlay: {},
        handler: function (command) {

    		if ("on" === command) {
        		console.log("VacancesDevice: Mode vacances on");
        		self.vdevVacances.set( "metrics:level", true);
        		self.activeVacances("on");
    		} else if ("off" === command) {
        		console.log("VacancesDevice: Mode vacances off");
        		self.vdevVacances.set( "metrics:level", false);
        		self.activeVacances("off");
    		}
        },
        moduleId: this.id
    });
    var filePath = this.moduleBasePath() + "/vacances.json";
    var persistantConfig = fs.loadJSON( filePath);
    console.log("VacancesDevice : persistantConfig = " + persistantConfig);
    this.vdevVacances.set("metrics:level", persistantConfig.vacances);

    console.log("Enregistrement de VacancesDevice : " + this.vdevVacances.id);

    //this.vdevSurveillance = new SurveillanceDevice("SurveillanceDevice1", this.controller, this.moduleBasePath());
    //this.vdevSurveillance.init();
    //this.controller.registerDevice(this.vdevSurveillance);

    this.vdevSurveillance = this.controller.devices.create({
        deviceId: "SurveillanceDevice1",
        defaults: {
            deviceType: "switchBinary",
            metrics: {
                title: 'Surveillance Device ' + this.id,
                level: "true",
                icon: ""
            }
        },
        overlay: {},
        handler: function (command) {

                if ("on" === command) {
                        console.log("SurveillanceDevice: Surveillance on");
                        self.vdevSurveillance.set("metrics:level", true);
                        self.activeSurveillance("on");
                } else if ("off" === command) {
                        console.log("SurveillanceDevice: Surveillance off");
                        self.vdevSurveillance.set("metrics:level", false);
                        self.activeSurveillance("off");
                }
        },
        moduleId: this.id
    });
    var filePath = this.moduleBasePath() + "/surveillance.json";
    var persistantConfig = fs.loadJSON( filePath);
    console.log("SurveillanceDevice : persistantConfig = " + persistantConfig);
    this.vdevSurveillance.set("metrics:level", persistantConfig.surveillance);

    console.log("Enregistrement de SurveillanceDevice : " + this.vdevSurveillance.id);


    this.controller.on('ModeVacances', function () {

        console.log("Scenes: Evt Mode Vacances");

	if ( self.vdevVacances.get("metrics:level") == true ) {
        	console.log("Scenes: Mode Vacances stoped");
		self.vdevVacances.performCommand("off");
	} else {
        	console.log("Scenes: Mode Vacances activated");
		self.vdevVacances.performCommand("on");
	}
    });

    this.controller.on('SurveillanceDesactivee', function () {

        console.log("Scenes: Evt Surveillance desactivee");

	if ( self.vdevSurveillance.get("metrics:level") == true ) {
        	console.log("Scenes: Mode surveilance stoped");
		self.vdevSurveillance.performCommand("off");
	} else {
        	console.log("Scenes: Mode surveilance activated");
		self.vdevSurveillance.performCommand("on");
	}
    });

};

Scenes.prototype.stop = function () {
    var self = this;
    self.controller.devices.remove("VacancesDevice1");
    self.controller.devices.remove("SurveillanceDevice1");
};

Scenes.prototype.activeVacances = function ( output)
{
        try {
                system("/usr/local/bin/activscene", "vacances",  output);
        }
        catch(err) {
                console.log("VacancesDevice : Failed to store scene status : " + err);
        }
}

Scenes.prototype.activeSurveillance = function ( output)
{
        try {
                system("/usr/local/bin/activscene", "surveillance",  output);
        }
        catch(err) {
                console.log("SurveillanceDevice : Failed to store scene status : " + err);
        }
}

