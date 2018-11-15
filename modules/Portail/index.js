/*** Portail HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Gestion des stores du salon

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function Portail(id, controller) {
    // Call superconstructor first (AutomationModule)
    Portail.super_.call(this, id, controller);

    var self = this;

    // Load abstract MeteoDevice device class
    executeFile(this.moduleBasePath() + "/PortailDevice.js");

    this.vdev = this.controller.devices.create({
        deviceId: "PortailDevice",
        defaults: {
            deviceType: "switchBinary",
            probeType: "portail",
            metrics: {
                probeTitle: "Control",
                icon: "switch",
                title: 'Portail Device',
                level: "off"
            }
        },
        overlay: {},
        handler: function (command) {

<<<<<<< HEAD
            self.performCommand(command);
=======
                self.performCommand( command);
>>>>>>> refs/remotes/origin/master
        },
        moduleId: this.id
    });

    console.log("Enregistrement de PortailDevice : " + this.vdev.id);

    this.ouvert = true;
    this.modeVacances = false;
}

inherits(Portail, AutomationModule);

_module = Portail;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

Portail.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)
    Portail.super_.prototype.init.call(this, config);

    this.vdev.config = this.config;

    var self = this;

    self.controller.emit("cron.addTask", "Portail.Ouverture.poll", {
        minute: self.config.minuteOuverture,
        hour: self.config.heureOuverture,
        weekDay: self.config.weekDayOpen,
        day: null,
        month: null
    });

    self.controller.emit("cron.addTask", "Portail.Fermeture.poll", {
        minute: self.config.minuteFermeture,
        hour: self.config.heureFermeture,
        weekDay: self.config.weekDayClose,
        day: null,
        month: null
    });

    ////////////
    //  Evenement d�éclenché a une heure donnee pour ouvrir le portail
    ////////////
    this.controller.on('Portail.Ouverture.poll', function () {

        console.log("Portail : Ouverture ");

        //  Arret du cron
        self.controller.emit("cron.removeTask", "Portail.Ouverture.poll");

<<<<<<< HEAD
        self.controller.emit("Portail.ouverturePortail");

        //  Reprogramation pour le lendemain
=======
	    self.controller.emit("Portail.ouverturePortail") ;

	    //  Reprogramation pour le lendemain
>>>>>>> refs/remotes/origin/master
        self.timer = setTimeout(function () {

            console.log("Portail : Reprogrammation pour le lendemain");
            self.controller.emit("cron.addTask", "Portail.Ouverture.poll", {
                minute: self.config.minuteOuverture,
                hour: self.config.heureOuverture,
                weekDay: self.config.weekDayOpen,
                day: null,
                month: null
            });
            self.timer = null;
<<<<<<< HEAD
        }, 60 * 1000);
=======
        }, 60 *1000);
>>>>>>> refs/remotes/origin/master

    });

    ////////////
    //  Evenement déclaenché a une heure donnée pour fermer le portail
    ////////////
    this.controller.on('Portail.Fermeture.poll', function () {

        console.log("Portail : Fermeture");

        //  Arret du cron
        self.controller.emit("cron.removeTask", "Portail.Fermeture.poll");

<<<<<<< HEAD
        self.controller.emit("Portail.fermeturePortail");

        //  Reprogramation pour le lendemain
=======
	    self.controller.emit("Portail.fermeturePortail") ;

	    //  Reprogramation pour le lendemain
>>>>>>> refs/remotes/origin/master
        self.timer = setTimeout(function () {

            console.log("Portail : Reprogrammation pour le lendemain");
            self.controller.emit("cron.addTask", "Portail.Fermeture.poll", {
                minute: self.config.minuteFermeture,
                hour: self.config.heureFermeture,
                weekDay: self.config.weekDayClose,
                day: null,
                month: null
            });
            self.timer = null;
        }, 60 * 1000);

    });

    ////////////
    //  Evenement permettant la fermeture du portail
    ////////////
    this.controller.on('Portail.fermeturePortail', function (id, name, value) {
        console.log("Portail : Evenement de fermeture du portail");

<<<<<<< HEAD
        console.log("Portail : fermeture ...");
        self.vdev.performCommand("off");
=======
    	console.log("Portail : fermeture ...");
	    self.vdev.performCommand("off");
>>>>>>> refs/remotes/origin/master
    });

    ////////////
    //  Evenement permettant l'ouverture du portail
    ////////////
    this.controller.on('Portail.ouverturePortail', function (id, name, value) {
        console.log("Portail : Evenement d'ouverture du portail");

        //  En mode vacances ou en jour ferie, on touche pas aux portail
<<<<<<< HEAD
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;
        self.jourFerie = (controller.devices.get(self.config.ferieDevice).get("metrics:level") == "on") ? true : false;
=======
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on")?true:false;
        self.jourFerie = (controller.devices.get(self.config.ferieDevice).get("metrics:level") == "on")?true:false;
>>>>>>> refs/remotes/origin/master
        if (self.modeVacances || self.jourFerie)
            return;

<<<<<<< HEAD
        console.log("Portail : Ouverture ...");
        self.vdev.performCommand("on");
=======
    	console.log("Portail : Ouverture ...");
	    self.vdev.performCommand("on");
>>>>>>> refs/remotes/origin/master
    });

    ////////////
    //  Evenement déclenché lors de la detection de l'ouverture du portail
    ////////////
    this.controller.on('AlarmPortailOuvert', function () {

        console.log("Portail : Alarm portail ouvert");

        //  Est - ce que la surveillance est activee ??
<<<<<<< HEAD
        var surveillance = (controller.devices.get("SurveillanceDevice1").get("metrics:level") == "on") ? true : false;

        //  En mode vacances c'est pas normal de voir le portail ouvert
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;
=======
        var surveillance = (controller.devices.get("SurveillanceDevice1").get("metrics:level") == "on")?true:false;

        //  En mode vacances c'est pas normal de voir le portail ouvert
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on")?true:false;

        if (self.modeVacances) {
                console.log("Portail : Attention !!! le portail est ouvert en mode vacances");
                try {
                        system(
                            "echo 'Subject: HomePortailDetection' | /usr/sbin/sendmail -f taiebma@free.fr gmtaiebma@gmail.com");
                } catch(err) {
                        console.log("Failed to execute script system call mail: " + err);
                }
        }
>>>>>>> refs/remotes/origin/master

        if (self.modeVacances) {
            console.log("Portail : Attention !!! le portail est ouvert en mode vacances");
            try {
                system(
                    "echo 'Subject: HomePortailDetection' | /usr/sbin/sendmail -f taiebma@free.fr gmtaiebma@gmail.com");
            } catch (err) {
                console.log("Failed to execute script system call mail: " + err);
            }
        }

<<<<<<< HEAD
        try {
            system(
                "python /opt/z-way-server/automation/network_send_notif.py",
                'HomePortailDetectionOuvert',
                '224.0.1.100',
                8084
            );
        } catch (err) {
            debugPrint("Failed to execute script notif system call: " + err);
        }

=======
>>>>>>> refs/remotes/origin/master
        self.vdev.set("metrics:level", "on");
    });

    ////////////
    //  Evenement déclenché lors de la detection de fermeture du portail
    ////////////
    this.controller.on('AlarmPortailFerme', function () {

        console.log("Portail : Alarm portail ferme");

<<<<<<< HEAD
        //  Est - ce que la surveillance est activee ??
        var surveillance = (controller.devices.get("SurveillanceDevice1").get("metrics:level") == "on") ? true : false;

        //  En mode vacances c'est pas normal de voir le portail ouvert
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;
=======
    	//  Est - ce que la surveillance est activee ??
	    var surveillance = (controller.devices.get("SurveillanceDevice1").get("metrics:level") == "on")?true:false;

        //  En mode vacances c'est pas normal de voir le portail ouvert
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on")?true:false;
>>>>>>> refs/remotes/origin/master

        if (self.modeVacances) {
            console.log("Portail : Attention !!! le portail est maintenant ferme en mode vacances");
            try {
<<<<<<< HEAD
                system(
                    "echo 'Subject: HomePortailDetectionFerme' | /usr/sbin/sendmail -f taiebma@free.fr gmtaiebma@gmail.com");
            } catch (err) {
                console.log("Failed to execute script system call mail: " + err);
            }
=======
                        system(
                        "echo 'Subject: HomePortailDetectionFerme' | /usr/sbin/sendmail -f taiebma@free.fr gmtaiebma@gmail.com");
                    } catch(err) {
                        console.log("Failed to execute script system call mail: " + err);
                    }
>>>>>>> refs/remotes/origin/master
        }

        try {
            system(
                "python /opt/z-way-server/automation/network_send_notif.py",
                'HomePortailDetectionFerme',
                '224.0.1.100',
                8084
            );
        } catch (err) {
            debugPrint("Failed to execute script notif system call: " + err);
        }

        self.vdev.set("metrics:level", "off");
    });
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

