/******************************************************************************

 SurveillanceDevice Z-Way Home Automation module
 Version: 1.0.0
 (c) ZWave.Me, 2013

 -----------------------------------------------------------------------------
 Author: Gregory Sitnin <sitnin@z-wave.me>
 Description:
     This module listens given VirtualDevice (which MUSt be typed as switch)
     level metric update events and switches off device after configured
     timeout if this device has been switched on.

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

SurveillanceDevice = function (id, controller, basePath) {
    // Call superconstructor first (AutomationModule)
    SurveillanceDevice.super_.call(this, id, controller);

    // Create instance variables
    this.zCommandClassId = 0x2b;

    this.deviceType = "virtual";
    this.deviceSubType = "SceneActivation";
    this.widgetClass = "SceneWidget";

    var filePath = basePath + "/surveillance.json";
    var persistantConfig = loadJSON( filePath);
    console.log("SurveillanceDevice : persistantConfig = " + persistantConfig);
    this.surveillance = persistantConfig.surveillance;
    this.setMetricValue("surveillance", this.surveillance);

    var self = this;
}

inherits(SurveillanceDevice, VirtualDevice);

SurveillanceDevice.prototype.deviceTitle = function () {
    return "SceneSansSurveillance";
}


//  Devait servir a mettre a jour le device mais loadJSON ne fonctionne pas a cet endroit
SurveillanceDevice.prototype.performCommand = function (command) {
    console.log("--- SurveillanceDevice.performCommand processing...");

    var handled = true;
    var self = this;

    if ("on" === command) {
	console.log("SurveillanceDevice: Surveillance on");
    	self.setMetricValue("surveillance", "on");
	self.surveillance = true;
	activeSurbeillance("on");
    } else if ("off" === command) {
	console.log("SurveillanceDevice: Surveillance off");
    	self.setMetricValue("surveillance", "off");
	self.surveillance = false;
	activeSurbeillance("off");
    } else {
	handled = false;
    }

    return handled ? true : SurveillanceDevice.super_.prototype.performCommand.call(this, command);
}


SurveillanceDevice.prototype.getMetricValue = function (param) {
    	console.log("--- SurveillanceDevice.getMetricValue processing...");
	return this.surveillance;
}

SurveillanceDevice.prototype.getStatut = function (param) {
    	console.log("--- SurveillanceDevice.getStatut processing...");
	return this.surveillance;
}

function activeSurbeillance( output)
{
        try {
                system("/usr/local/bin/activscene", "surveillance",  output);
        }
        catch(err) {
                console.log("SurveillanceDevice : Failed to store scene status : " + err);
        }
}

