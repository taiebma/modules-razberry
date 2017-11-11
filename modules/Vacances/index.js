/*** Vacances HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Allumage des lampes du Salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function Vacances (id, controller) {
    // Call superconstructor first (AutomationModule)
    Vacances.super_.call(this, id, controller);

   this.modeNuit = false;
   this.modeVacances = false;

}

inherits(Vacances, AutomationModule);

_module = Vacances;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

Vacances.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    Vacances.super_.prototype.init.call(this, config);

    console.log("Interval " + this.config.interval + " minutes");

    var curDate = new Date();
    if (curDate.getHours() > this.config.heureDebut && curDate.getHours() < this.config.heureFin) {
    	this.controller.emit("cron.addTask", "Vacances.poll", {
        	minute: curDate.getMinutes() + 1,
        	hour: curDate.getHours(),
        	weekDay: [ 0, 6, 1],
        	day: null,
        	month: null
    	});
	this.itsTime = true;
    } 
    else {
    	this.controller.emit("cron.addTask", "Vacances.poll", {
        	minute: 0,
        	hour: this.config.heureDebut,
        	weekDay: [ 0, 6, 1],
        	day: null,
        	month: null
    	});
	this.itsTime = false;
    } 

    this.controller.emit("cron.addTask", "VacancesArretTotal.poll", {
       	minute: 0,
       	hour: 5,
       	weekDay: [ 0, 6, 1],
       	day: null,
       	month: null
    });

    //  Programmation de l'heure d'arret
    this.controller.emit("cron.addTask", "VacancesArret.poll", {
       	minute: this.config.minuteArret,
       	hour: this.config.heureArret,
       	weekDay: [ 0, 6, 1],
       	day: null,
       	month: null
    });

    var self = this;
    console.log("It's time : " + self.itsTime);

    //  Evenement de mise a jour d'evement
    this.controller.on('ModeNuit', function () {
	self.modeNuit = true;
   	console.log("Vacances : Mode nuit = " + self.modeNuit);
	if (self.itsTime) 
		self.controller.emit("AllumageCuisine");
    });
    this.controller.on('ModeJour', function () {
	self.modeNuit = false;
   	console.log("Vacances : Mode nuit = " + self.modeNuit);
    });

    this.controller.on('AllumageCuisine', function () {
	self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == true)?true:false;
	//  On ne fait rien si on est pas en mode vacances
	if (!self.modeVacances)
		return;
	if (zway.devices[8].instances[0].SwitchMultilevel.data.level.value === 0 || zway.devices[9].instances[0].SwitchMultilevel.data.level.value === 0 || zway.devices[10].instances[0].SwitchMultilevel.data.level.value === 0) {
   		zway.devices[8].instances[0].commandClasses[38].Set(255);
    		zway.devices[9].instances[0].commandClasses[38].Set(255);
    		zway.devices[10].instances[0].commandClasses[38].Set(255);
	}
    });

    this.controller.on('Vacances.poll', function () {

	//  Arret du cron
    	self.controller.emit("cron.removeTask", "Vacances.poll" );

	//  Calcul du prochain test
    	var curDate1 = new Date();
	var dateFin = new Date( curDate1.getFullYear(), curDate1.getMonth(), curDate1.getDate(), self.config.heureFin, self.config.minuteFin, 0);
	var prochainTest = new Date(curDate1.getTime() + (self.config.interval * 60*1000));

	//  Verification heure de fin d'allumage atteinte
	if (curDate1 < dateFin) {

		self.itsTime = true;

		//  Programmation du cron pour le prochain test
    		self.controller.emit("cron.addTask", "Vacances.poll", {
        		minute: prochainTest.getMinutes(),
       			hour: prochainTest.getHours(), 
       			weekDay: [ 0, 6, 1],
       			day: null,
       			month: null
    		});
    		console.log("Vacances : Prochain allumage dans " + self.config.interval + " minutes, a " + prochainTest.getHours() + ":" + prochainTest.getMinutes());


		//  Allumage des lumieres
		if (self.modeNuit) {
			console.log("Vacances : Allumage des lumieres de la cuisine");
			self.controller.emit("AllumageCuisine");
		}
		else
			console.log("Vacances : Pas la peine d'allumer la cuisine");
	}
	else {  //  on programme pour le lendemain
		console.log("Vacances : On reprendra demain a " + self.config.heureDebut + ":00");
		self.itsTime = false;
    		self.controller.emit("cron.addTask", "Vacances.poll", {
        		minute: 0,
       			hour: self.config.heureDebut,
       			weekDay: [ 0, 6, 1],
       			day: null,
       			month: null
    		});
	}
    });

    //  Exctinction des lumieres de la cuisine
    this.controller.on('VacancesArret.poll', function () {

	//  Arret du cron
    	self.controller.emit("cron.removeTask", "VacancesArret.poll" );

	self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == true)?true:false;
	//  On ne fait rien si on est pas en mode vacances
	if (self.modeVacances) {
   		zway.devices[8].instances[0].commandClasses[38].Set(0);
    		zway.devices[9].instances[0].commandClasses[38].Set(0);
    		zway.devices[10].instances[0].commandClasses[38].Set(0);
	}

	console.log("Vacances : On reprendra l'arret demain a " + self.config.heureArret + ":" + self.config.minuteArret);
	self.itsTime = false;
	self.timer = setTimeout(function () {
    		self.controller.emit("cron.addTask", "VacancesArret.poll", {
       			minute: self.config.minuteArret,
       			hour: self.config.heureArret,
       			weekDay: [ 0, 6, 1],
       			day: null,
       			month: null
    		});
	}, 60*1000);

    });

    this.controller.on('VacancesArretTotal.poll', function () {

	console.log("Vacances : Arret total des lumieres ");
	
	//  Arret du cron
    	self.controller.emit("cron.removeTask", "VacancesArretTotal.poll" );

	self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == true)?true:false;
	if (self.modeVacances) {
		self.controller.emit("ActivationSceneDoubleDimUpStop");
	}

	console.log("Vacances : On reprendra l'arret total des lumieres ");
	self.timer = setTimeout(function () {
    		self.controller.emit("cron.addTask", "VacancesArretTotal.poll", {
       			minute: 0,
       			hour: 5,
       			weekDay: [ 0, 6, 1],
       			day: null,
       			month: null
    		});
	}, 60*1000);
    });

};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

