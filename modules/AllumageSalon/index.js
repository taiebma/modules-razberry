/*** AllumageSalon HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Allumage des lampes du Salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function AllumageSalon (id, controller) {
    // Call superconstructor first (AutomationModule)
    AllumageSalon.super_.call(this, id, controller);

   this.modeNuit = false;

}

inherits(AllumageSalon, AutomationModule);

_module = AllumageSalon;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

AllumageSalon.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    AllumageSalon.super_.prototype.init.call(this, config);

    console.log("Interval " + this.config.interval + " minutes");

    var curDate = new Date();
    if (curDate.getHours() > this.config.heureDebut && curDate.getHours() < this.config.heureFin) {
    	this.controller.emit("cron.addTask", "AllumageSalon.poll", {
        	minute: curDate.getMinutes() + 1,
        	hour: curDate.getHours(),
        	weekDay: [ 0, 6, 1],
        	day: null,
        	month: null
    	});
	this.itsTime = true;
    } 
    else {
    	this.controller.emit("cron.addTask", "AllumageSalon.poll", {
        	minute: 0,
        	hour: this.config.heureDebut,
        	weekDay: [ 0, 6, 1],
        	day: null,
        	month: null
    	});
	this.itsTime = false;
    } 

    var self = this;
    console.log("It's time : " + self.itsTime);

    //  Evenement de mise a jour d'evement
    this.controller.on('ModeNuit', function () {
		self.modeNuit = true;
		console.log("AllumageSalon : Mode nuit = " + self.modeNuit);
		if (self.itsTime) 
			self.controller.emit("AllumageLumieres");
    });
    this.controller.on('ModeJour', function () {
		self.modeNuit = false;
		console.log("AllumageSalon : Mode nuit = " + self.modeNuit);
    });

    this.controller.on('AllumageLumieres', function () {
	if (zway.devices[3].instances[0].SwitchBinary.data.level.value === false) {
   		//zway.devices[2].instances[0].commandClasses[37].Set(true);
    		zway.devices[3].instances[0].commandClasses[37].Set(true);
	}
    });

    this.controller.on('AllumageSalon.poll', function () {

		//  Arret du cron
		self.controller.emit("cron.removeTask", "AllumageSalon.poll" );

		//  Calcul du prochain test
		var curDate1 = new Date();
		var dateFin = new Date( curDate1.getFullYear(), curDate1.getMonth(), curDate1.getDate(), self.config.heureFin, self.config.minuteFin, 0);
		var prochainTest = new Date(curDate1.getTime() + (self.config.interval * 60*1000));

		//  Verification heure de fin d'allumage atteinte
		if (curDate1 < dateFin) {

			self.itsTime = true;

			//  Programmation du cron pour le prochain test
			self.controller.emit("cron.addTask", "AllumageSalon.poll", {
				minute: prochainTest.getMinutes(),
				hour: prochainTest.getHours(), 
				weekDay: [ 0, 6, 1],
				day: null,
				month: null
			});
			console.log("AllumageSalon : Prochain allumage dans " + self.config.interval + " minutes, a " + prochainTest.getHours() + ":" + prochainTest.getMinutes());


			//  Allumage des lumieres
			if (self.modeNuit) {
				console.log("AllumageSalon : Allumage des lumieres du salon");
				self.controller.emit("AllumageLumieres");
			}
			else
				console.log("AllumageSalon : Pas la peine d'allumer le salon");
		}
		else {  //  on programme pour le lendemain
			console.log("AllumageSalon : On reprendra demain a " + self.config.heureDebut + ":00");
			self.itsTime = false;
			self.controller.emit("cron.addTask", "AllumageSalon.poll", {
				minute: 0,
				hour: self.config.heureDebut,
				weekDay: [ 0, 6, 1],
				day: null,
				month: null
			});
		}
    });

};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

