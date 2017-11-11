/*** BonneNuitSalon HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Allumage des lampes du Salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function BonneNuitSalon (id, controller) {
    // Call superconstructor first (AutomationModule)
    BonneNuitSalon.super_.call(this, id, controller);

}

inherits(BonneNuitSalon, AutomationModule);

_module = BonneNuitSalon;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

BonneNuitSalon.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    BonneNuitSalon.super_.prototype.init.call(this, config);

    console.log("Bonne nuit Salon a " + this.config.heureArret + ":" + this.config.minuteArret);

    this.controller.emit("cron.addTask", "BonneNuitSalon.poll", {
        	minute: this.config.minuteArret,
        	hour: this.config.heureArret,
        	weekDay: this.config.weekDay,
        	day: null,
        	month: null
    });

    var self = this;

    this.controller.on('BonneNuitSalon.poll', function () {

        //  Arret du cron
        self.controller.emit("cron.removeTask", "BonneNuitSalon.poll" );

    	//  Extinction des feux
    	console.log("BonneNuitSalon : Extrinbction des feux !");
    	zway.devices[2].instances[0].commandClasses[37].Set(0);
    	zway.devices[3].instances[0].commandClasses[37].Set(0);
    	zway.devices[3].instances[2].commandClasses[37].Set(0);

	//  Mise en place d'une tempo sinon il ne s'arrete plus
	self.timer = setTimeout(function () {

		console.log("BonneNuitSalon : Reprogrammation pour le lendemain");
    		self.controller.emit("cron.addTask", "BonneNuitSalon.poll", {
        		minute: self.config.minuteArret,
        		hour: self.config.heureArret,
        		weekDay: self.config.weekDay,
        		day: null,
        		month: null
    		});
		self.timer = null;
	}, 60 *1000);
    });

};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

