/*** MTScenes module ********************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB
Copyright: 
     Module de gestion des devices de scene

******************************************************************************/


// Concrete module constructor

function MTScenes (id, controller) {
    MTScenes.super_.call(this, id, controller);

}

// Module inheritance and setup

inherits(MTScenes, AutomationModule);

_module = MTScenes;

MTScenes.prototype.init = function (config) {
    MTScenes.super_.prototype.init.call(this, config);

    var self = this;

    // Load abstract MTScenesDevice device class
    //executeFile(this.moduleBasePath()+"/VacancesDevice.js");
    //executeFile(this.moduleBasePath()+"/SurveillanceDevice.js");

    this.vdevVacances = this.controller.devices.create({
        deviceId: "VacancesDevice1",
        defaults: {
            deviceType: "switchBinary",
            probeType: "scene",
            metrics: {
                probeTitle: "Control",
                icon: "switch",
                title: 'Vacances Device ' + this.id,
        		level: "off"
            }
        },
        overlay: {},
        handler: function (command) {

    		if ("on" === command) {
        		console.log("VacancesDevice: Mode vacances on");
        		self.vdevVacances.set( "metrics:level", "on");
        		self.activeVacances("on");
    		} else if ("off" === command) {
        		console.log("VacancesDevice: Mode vacances off");
        		self.vdevVacances.set( "metrics:level", "off");
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

    this.vdevSurveillance = this.controller.devices.create({
        deviceId: "SurveillanceDevice1",
        defaults: {
            deviceType: "switchBinary",
            probeType: "scene",
            metrics: {
               probeTitle: "Control",
               title: 'Surveillance Device ' + this.id,
                level: "on",
                icon: "switch"
            }
        },
        overlay: {},
        handler: function (command) {

                if ("on" === command) {
                        console.log("SurveillanceDevice: Surveillance on");
                        self.vdevSurveillance.set("metrics:level", "on");
                        self.activeSurveillance("on");
                } else if ("off" === command) {
                        console.log("SurveillanceDevice: Surveillance off");
                        self.vdevSurveillance.set("metrics:level", "off");
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

        console.log("MTScenes: Evt Mode Vacances");

        if ( self.vdevVacances.get("metrics:level") == "on" ) {
                console.log("MTScenes: Mode Vacances stoped");
            self.vdevVacances.performCommand("off");
        } else {
                console.log("MTScenes: Mode Vacances activated");
            self.vdevVacances.performCommand("on");
        }
    });

    this.controller.on('SurveillanceDesactivee', function () {

        console.log("MTScenes: Evt Surveillance desactivee");

        if ( self.vdevSurveillance.get("metrics:level") == "on" ) {
                console.log("MTScenes: Mode surveilance stoped");
            self.vdevSurveillance.performCommand("off");
        } else {
                console.log("MTScenes: Mode surveilance activated");
            self.vdevSurveillance.performCommand("on");
        }
    });

};

MTScenes.prototype.stop = function () {
    var self = this;
    self.controller.devices.remove("VacancesDevice1");
    self.controller.devices.remove("SurveillanceDevice1");
};

MTScenes.prototype.activeVacances = function ( output)
{
        try {
                system("/usr/local/bin/activscene", "vacances",  output);
        }
        catch(err) {
                console.log("VacancesDevice : Failed to store scene status : " + err);
        }
}

MTScenes.prototype.activeSurveillance = function ( output)
{
        try {
                system("/usr/local/bin/activscene", "surveillance",  output);
        }
        catch(err) {
                console.log("SurveillanceDevice : Failed to store scene status : " + err);
        }
}

