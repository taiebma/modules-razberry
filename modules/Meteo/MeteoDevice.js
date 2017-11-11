/******************************************************************************

 MeteoDevice Z-Way Home Automation module
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

function MeteoDevice (id, controller, zDeviceId, zInstanceId, zScaleId) {
    // Call superconstructor first (AutomationModule)
    MeteoDevice.super_.call(this, id, controller, zDeviceId, zInstanceId);

    // Create instance variables
//    this.deviceType = "virtual";
//    this.deviceSubType = "luminosity";
    //this.caps = ["customWidget"];

    this.zCommandClassId = 0x32;
    this.zSubTreeKey = zScaleId;

    this.deviceType = "probe";

    this.sensorTypeString = "int";
    this.scaleString = "1";

    this.setMetricValue("probeTitle", this.sensorTypeString);
    this.setMetricValue("scaleTitle", this.scaleString);

    this.setMetricValue("luminosity", 0);
    this.setMetricValue("tempInt", 20);
    this.setMetricValue("tempExt", 20);
    this.setMetricValue("tempCave", 20);
    this.setMetricValue("forecast_summary", "Couvert");
    this.setMetricValue("forecast_temperature", 20);

    var self = this;
}

inherits(MeteoDevice, VirtualDevice);

//  Devait servir a mettre a jour le device mais loadJSON ne fonctionne pas a cet endroit
MeteoDevice.prototype.performCommand = function (command) {
    console.log("--- MeteoDevice.performCommand processing...");

    var handled = true;
    var self = this;

    if ("update" === command) {
	console.log("Nouveau releve luminosite : " + self.metrics["luminosity"] );
	console.log("Nouveau releve temperature interieure : " + self.metrics["tempInt"] );
	console.log("Nouveau releve temperature exterieure : " + self.metrics["tempExt"] );
	console.log("Nouveau releve temperature cave : " + self.metrics["tempCave"] );
	console.log("Nouveau releve forecast summary : " + self.metrics["forecast_summary"] );
	console.log("Nouveau releve forecast temperature : " + self.metrics["forecast_temperature"] );
    } else {
        handled = false;
    }

    return handled ? true : MeteoDevice.super_.prototype.performCommand.call(this, command);
}

MeteoDevice.prototype.getValue = function (param) {
        console.log("--- MeteoDevice.getValue processing...");
        return this.getMetricValue(param);
}
