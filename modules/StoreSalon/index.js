/*** StoreSalon HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Gestion des stores du salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function StoreSalon(id, controller) {
    // Call superconstructor first (AutomationModule)
    StoreSalon.super_.call(this, id, controller);

    var self = this;

    // Load abstract StoreDevice device class
    executeFile(this.moduleBasePath() + "/StoreDevice.js");

    this.vdevTele = this.controller.devices.create({
        deviceId: "StoreDeviceTele",
        defaults: {
            deviceType: "switchBinary",
            metrics: {
                title: 'Store Device Tele',
                probeTitle: "Control",
                icon: "switch"
            }
        },
        overlay: {},
        handler: function (command) {

            self.performCommand(command, 1);
        },
        moduleId: this.id
    });

    console.log("Enregistrement de StoreDevice Tele : " + this.vdevTele.id);

    this.vdevTable = this.controller.devices.create({
        deviceId: "StoreDeviceTable",
        defaults: {
            deviceType: "switchBinary",
            metrics: {
                title: 'Store Device Table',
                probeTitle: "Control",
                icon: "switch"
           }
        },
        overlay: {},
        handler: function (command) {

            self.performCommand(command, 2);
        },
        moduleId: this.id
    });

    console.log("Enregistrement de StoreDevice : " + this.vdevTable.id);

    this.modeNuit = true;
    this.faitNuit = false;
    this.currentStore = 0;
    this.modeVacances = false;
    this.ciel = "Couvert";
    this.tempExt = 0;
    this.modeChaleur = false;

    this.scene = 1;  //  1 = nuit, 2 = journ�ee, 3 = chaleur

    var curDate1 = new Date();
    this.dateDebutJournee = new Date(curDate1.getFullYear(), curDate1.getMonth(), curDate1.getDate(), this.config.heureOuverture, this.config.minuteOuverture, 0);
    this.dateFinJournee = new Date(curDate1.getFullYear(), curDate1.getMonth(), curDate1.getDate(), this.config.heureFermeture, this.config.minuteFermeture, 0);
    if (curDate1 > this.dateDebutJournee && curDate1 < this.dateFinJournee) {
        this.modeNuit = false;
        this.scene = 2;
    } else {
        this.modeNuit = true;
        this.scene = 1;
    }
    this.tresLumineux = false;
    this.forteChaleur = false;

    console.log("StoreSalon : scene " + this.scene);
}

inherits(StoreSalon, AutomationModule);

_module = StoreSalon;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

StoreSalon.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    StoreSalon.super_.prototype.init.call(this, config);

    this.vdevTele.config = this.config;
    this.vdevTable.config = this.config;

    var self = this;

    self.controller.emit("cron.addTask", "StoreSalon.Ouverture.poll", {
        minute: self.config.minuteOuverture,
        hour: self.config.heureOuverture,
        weekDay: self.config.weekDay,
        day: null,
        month: null
    });

    self.controller.emit("cron.addTask", "StoreSalon.Fermeture.poll", {
        minute: self.config.minuteFermeture,
        hour: self.config.heureFermeture,
        weekDay: self.config.weekDay,
        day: null,
        month: null
    });

    console.log("StoreSalon : mode nuit " + self.modeNuit);
    console.log("StoreSalon : fait nuit " + self.faitNuit);
    console.log("StoreSalon : scene " + self.scene);

    //  Evenement pour ouverture des stores
    this.controller.on('StoreSalon.Ouverture.poll', function () {

        self.scene = 2;
        console.log("StoreSalon : scene " + self.scene);

        //  Arret du cron
        self.controller.emit("cron.removeTask", "StoreSalon.Ouverture.poll");

        //  Si il fait jour
        if (self.faitNuit == false)
            self.controller.emit("StoreSalon.ouvertureStore");

        //  Reprogramation pour le lendemain
        self.timer = setTimeout(function () {

            console.log("StoreSalon : Reprogrammation pour le lendemain");
            self.controller.emit("cron.addTask", "StoreSalon.Ouverture.poll", {
                minute: self.config.minuteOuverture,
                hour: self.config.heureOuverture,
                weekDay: self.config.weekDay,
                day: null,
                month: null
            });
            self.timer = null;
        }, 60 * 1000);

    });

    //  Evenement pour fermeture des stores
    this.controller.on('StoreSalon.Fermeture.poll', function () {

        self.scene = 1;
        console.log("StoreSalon : scene " + self.scene);

        //  Arret du cron
        self.controller.emit("cron.removeTask", "StoreSalon.Fermeture.poll");

        //  Si il fait nuit
        if (self.faitNuit == true)
            self.controller.emit("StoreSalon.fermetureStore");

        //  Reprogramation pour le lendemain
        self.timer = setTimeout(function () {

            console.log("StoreSalon : Reprogrammation pour le lendemain");
            self.controller.emit("cron.addTask", "StoreSalon.Fermeture.poll", {
                minute: self.config.minuteFermeture,
                hour: self.config.heureFermeture,
                weekDay: self.config.weekDay,
                day: null,
                month: null
            });
            self.timer = null;
        }, 60 * 1000);

    });

    //  Evenement de fermeture des stores
    this.controller.on('StoreSalon.fermetureStore', function (id, name, value) {
        console.log("StoreSalon : Evenement de fermeture des tores");

        //  En mode vacances on touche pas aux stores
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;
        console.log("StoreSalon : Fermeture des stores mode vacances = " + self.modeVacances);
        if (self.modeVacances)
            return;
        console.log("StoreSalon : Fermeture des stores pas en vacances");

        //  Fermeture des stores
        if (!self.modeNuit && self.scene == 1) {
            self.modeNuit = true;
            console.log("StoreSalon : Mode nuit , fermeture des stores");
            self.vdevTele.performCommand("off");
            /*
            try {
                system(
                    "sleep 20"
                );
            } catch (err) {
                console.log("Failed to execute script system call sleep : " + err);
            }
            */
            self.sleep(10000);

            self.vdevTable.performCommand("off");
        }
    });

    //  Evenement d'ouverture des stores
    this.controller.on('StoreSalon.ouvertureStore', function (id, name, value) {
        console.log("StoreSalon : Evenement d'ouveture des tores");

        //  En mode vacances on ouvre pas
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;
        if (self.modeVacances)
            return;

        //  Ouverture des stores
        if (self.modeNuit && self.scene == 2) {
            self.modeNuit = false;
            console.log("StoreSalon : Mode jour , ouverture des stores");
            self.vdevTele.performCommand("on");
            /*
            try {
                system(
                    "sleep 20"
                );
            } catch (err) {
                console.log("Failed to execute script system call sleep : " + err);
            }
            */
    		self.sleep(10000);
            self.vdevTable.performCommand("on");
        }
    });

    //  Evenement de mise a jour d'evement Device Meteo
    this.controller.on('ModeNuit', function () {
        console.log("StoreSalon : Mode nuit");
        self.faitNuit = true;
        //  Fermeture des stores
        if (self.scene == 1)
            self.controller.emit("StoreSalon.fermetureStore");
    });
    this.controller.on('ModeJour', function () {
        console.log("StoreSalon : Mode jour");
        self.faitNuit = false;
        //  Ouverture des stores
        if (self.scene == 2)
            self.controller.emit("StoreSalon.ouvertureStore");
    });

    // Verification des conditions meteo
    this.controller.on('MeteoDevice1.meteoUpdated', function () {
        self.ciel = controller.devices.get("MeteoDevice1").get("metrics:forecast_summary");
        self.tempExt = controller.devices.get("MeteoDevice1").get("metrics:tempExt");

        var curDate1 = new Date();

        //  Verification condition meteo
        console.log("StoreSalon : Ciel " + self.ciel + " Temperature exterieur " + self.tempExt + " heure " + curDate1.getHours());
        if (self.ciel == "Clear" && self.tempExt > 24.0 && curDate1.getHours() > 16) {
            if (!self.modeChaleur) { //  Pas encore baiss�e le store
                console.log("StoreSalon : Forte chaleur et forte luminosite faux fermer le store");

                //  En mode vacances on touche pas aux stores
                self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;
                if (self.modeVacances)
                    return;

                self.vdevTable.performCommand("off");
                self.modeChaleur = true;
            }
        } else
            self.modeChaleur = false;
    });

    StoreSalon.prototype.sleep = function(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      }
        
};


// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

