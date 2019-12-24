/*** LampeExterieur HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Allumage des lampes du Salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function LampeExterieur (id, controller) {
    // Call superconstructor first (AutomationModule)
    LampeExterieur.super_.call(this, id, controller);

   this.modeNuit = false;

}

inherits(LampeExterieur, AutomationModule);

_module = LampeExterieur;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

LampeExterieur.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    LampeExterieur.super_.prototype.init.call(this, config);

	/*  On arrete d'allumer automatiquement
    var curDate = new Date();
    if (curDate.getHours() > this.config.heureDebut && curDate.getHours() < this.config.heureFin) {
    	this.controller.emit("cron.addTask", "LampeExterieur.poll", {
        	minute: curDate.getMinutes() + 1,
        	hour: curDate.getHours(),
        	weekDay: [ 0, 6, 1],
        	day: null,
        	month: null
    	});
	this.itsTime = true;
    } else {
    	this.controller.emit("cron.addTask", "LampeExterieur.poll", {
        	minute: this.config.minuteDebut,
        	hour: this.config.heureDebut,
        	weekDay: [ 0, 6, 1],
        	day: null,
        	month: null
    	});
	this.itsTime = false;
	} 

   this.controller.emit("cron.addTask", "LampeExterieurStop.poll", {
       	minute: this.config.minuteFin,
       	hour: this.config.heureFin,
       	weekDay: [ 0, 6, 1],
       	day: null,
       	month: null
   });
	*/

    var self = this;
    console.log("LampeExterieur : It's time : " + self.itsTime);

    //  Evenement de Mode Nuit
    this.controller.on('ModeNuit', function (val) {
		console.log("LampeExterieur : Mode nuit = " + self.modeNuit + " " + val + "Lux");

		//  On allume que si c'est l'heure et qu'il fait nuit noir
		//if (self.itsTime && val <= 10) 
		if (val <= 10) 
			self.modeNuit = true;
	});
    //  Evenemnt mode Jour
    this.controller.on('ModeJour', function (val) {
		self.modeNuit = false;
		self.itsTime = false;
		console.log("LampeExterieur : Mode nuit = " + self.modeNuit);
    });
    //  Evenement d'extinction de la lumiere
    this.controller.on('ActivationSceneSingleDown', function () {
		console.log("LampeExterieur : extinction de la lumiere");
		zway.devices[7].instances[1].commandClasses[37].Set(false);
		self.itsTime = false;
    });
    //  Evenement d'allumage de la lumiere
    this.controller.on('ActivationSceneSingleUp', function () {
		if (zway.devices[7].instances[1].SwitchBinary.data.level.value === false) {
			console.log("LampeExterieur : allumage de la lumiere");
			zway.devices[7].instances[1].commandClasses[37].Set(true);
	}
    });
    //  Evenement declenché par double pression Gros bouton cuisine
    this.controller.on('ActivationSceneLumiereExterieur', function () {
		if (zway.devices[7].instances[1].SwitchBinary.data.level.value === false) {
			console.log("LampeExterieur : allumage de la lumiere");
			zway.devices[7].instances[1].commandClasses[37].Set(true);
		} else {
			console.log("LampeExterieur : extinction de la lumiere");
			zway.devices[7].instances[1].commandClasses[37].Set(false);
		}	
    });

	/*
    //  Timer d'arret de la lumiere
    this.controller.on('LampeExterieurStop.poll', function () {

		console.log("LampeExterieur : extinction de la lumiere exterieure");
		self.controller.emit("ActivationSceneSingleDown");

		self.timer = setTimeout(function () {
				self.controller.emit("cron.addTask", "LampeExterieurStop.poll", {
					minute: self.config.minuteFin,
					hour: self.config.heureFin,
					weekDay: [ 0, 6, 1],
					day: null,
					month: null
				});
			}, 6000);
	});

    //  Timer d'allumage de la lumiere
    this.controller.on('LampeExterieur.poll', function () {

		console.log("LampeExterieur : Timer allumage de la lumiere");

		//  Arret du cron
			self.controller.emit("cron.removeTask", "LampeExterieur.poll" );

		//  Calcul du prochain test
			var curDate1 = new Date();
		var dateFin = new Date( curDate1.getFullYear(), curDate1.getMonth(), curDate1.getDate(), self.config.heureFin, self.config.minuteFin, 0);
		var prochainTest = new Date(curDate1.getTime() + (self.config.interval * 60*1000));

		//  Verification heure de fin d'allumage atteinte

		//  Allumage des lumieres
		if (self.modeNuit) {
			console.log("LampeExterieur : Allumage de la lumieres exterieur");
			self.controller.emit("ActivationSceneSingleUp");
		}
		else
			console.log("LampeExterieur : Pas la peine d'allumer dehors");

		console.log("LampeExterieur : On reprogramme demain a " + self.config.heureDebut + ":00");
		self.itsTime = true;
		self.timer = setTimeout(function () {
				self.controller.emit("cron.addTask", "LampeExterieur.poll", {
					minute: self.config.minuteDebut,
					hour: self.config.heureDebut,
					weekDay: [ 0, 6, 1],
					day: null,
					month: null
				});
			}, 6000);
    });
	*/

};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

