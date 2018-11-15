/******************************************************************************

 VacancesDevice Z-Way Home Automation module
 Version: 1.0.0
 (c) ZWave.Me, 2013

 -----------------------------------------------------------------------------
 Author: Marc TAIEB <taiebma@free.fr>
 Description:
    Module permettant de g�erer un mode vacance

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

VacancesDevice = function (id, controller, basePath) {
    // Call superconstructor first (AutomationModule)
    VacancesDevice.super_.call(this, id, controller);

    // Create instance variables
    this.zCommandClassId = 0x2b;

    this.deviceType = "virtual";
    this.deviceSubType = "SceneActivation";
    this.widgetClass = "SceneWidget";

    var filePath = basePath + "/vacances.json";
    var persistantConfig = loadJSON( filePath);
    console.log("VacancesDevice : persistantConfig = " + persistantConfig);
    this.modeVacances = persistantConfig.vacances;
    this.setMetricValue("modeVacances", this.modeVacances);

    var self = this;
}

inherits(VacancesDevice, VirtualDevice);

VacancesDevice.prototype.deviceTitle = function () {
    return "SceneVacances";
}


//  Devait servir a mettre a jour le device mais loadJSON ne fonctionne pas a cet endroit
VacancesDevice.prototype.performCommand = function (command) {
    console.log("--- VacancesDevice.performCommand processing...");

    var handled = true;
    var self = this;

    if ("on" === command) {
	console.log("VacancesDevice: Mode vacances on");
    	self.setMetricValue("modeVacances", "on");
	self.modeVacances = true;
	activeVacances("on");
    } else if ("off" === command) {
	console.log("VacancesDevice: Mode vacances off");
    	self.setMetricValue("modeVacances", "off");
	self.modeVacances = false;
	activeVacances("off");
    } else {
	handled = false;
    }

    return handled ? true : VacancesDevice.super_.prototype.performCommand.call(this, command);
}


VacancesDevice.prototype.getMetricValue = function (param) {
    	console.log("--- VacancesDevice.getMetricValue processing...");
	return this.modeVacances;
}

VacancesDevice.prototype.getStatut = function (param) {
    	console.log("--- VacancesDevice.getStatut processing...");
	return this.modeVacances;
}

function activeVacances( output)
{
	try {
		system("/usr/local/bin/activscene", "vacances",  output);
	}
	catch(err) {
		console.log("VacancesDevice : Failed to store scene status : " + err);
	}
}
