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

            self.performCommand(command);
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

        self.controller.emit("Portail.ouverturePortail");

        //  Reprogramation pour le lendemain
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
        }, 60 * 1000);

    });

    ////////////
    //  Evenement déclaenché a une heure donnée pour fermer le portail
    ////////////
    this.controller.on('Portail.Fermeture.poll', function () {

        console.log("Portail : Fermeture");

        //  Arret du cron
        self.controller.emit("cron.removeTask", "Portail.Fermeture.poll");

        self.controller.emit("Portail.fermeturePortail");

        //  Reprogramation pour le lendemain
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

        console.log("Portail : fermeture ...");
        self.vdev.performCommand("off");
    });

    ////////////
    //  Evenement permettant l'ouverture du portail
    ////////////
    this.controller.on('Portail.ouverturePortail', function (id, name, value) {
        console.log("Portail : Evenement d'ouverture du portail");

        //  En mode vacances ou en jour ferie, on touche pas aux portail
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;
        self.jourFerie = (controller.devices.get("JourFerie").get("metrics:level") == "on") ? true : false;
        if (self.modeVacances || self.jourFerie)
            return;

        console.log("Portail : Ouverture ...");
        self.vdev.performCommand("on");
    });

    ////////////
    //  Evenement déclenché lors de la detection de l'ouverture du portail
    ////////////
    this.controller.on('AlarmPortailOuvert', function () {

        console.log("Portail : Alarm portail ouvert");

        //  Est - ce que la surveillance est activee ??
        var surveillance = (controller.devices.get("SurveillanceDevice1").get("metrics:level") == "on") ? true : false;

        //  En mode vacances c'est pas normal de voir le portail ouvert
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;

        if (self.modeVacances) {
            console.log("Portail : Attention !!! le portail est ouvert en mode vacances");
            try {
                system(
                    "echo 'Subject: HomePortailDetection' | /usr/sbin/sendmail -f taiebma@free.fr gmtaiebma@gmail.com");
            } catch (err) {
                console.log("Failed to execute script system call mail: " + err);
            }
        }

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

        // ATTENTION : Mettre a jour systématiquement provoque une boucle infinie de notification
        if (controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") === "off")
            self.vdev.set("metrics:level", "on");
    });

    ////////////
    //  Evenement déclenché lors de la detection de fermeture du portail
    ////////////
    this.controller.on('AlarmPortailFerme', function () {

        console.log("Portail : Alarm portail ferme");

        //  Est - ce que la surveillance est activee ??
        var surveillance = (controller.devices.get("SurveillanceDevice1").get("metrics:level") == "on") ? true : false;

        //  En mode vacances c'est pas normal de voir le portail ouvert
        self.modeVacances = (controller.devices.get("VacancesDevice1").get("metrics:level") == "on") ? true : false;

        if (self.modeVacances) {
            console.log("Portail : Attention !!! le portail est maintenant ferme en mode vacances");
            try {
                system(
                    "echo 'Subject: HomePortailDetectionFerme' | /usr/sbin/sendmail -f taiebma@free.fr gmtaiebma@gmail.com");
            } catch (err) {
                console.log("Failed to execute script system call mail: " + err);
            }
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

        // ATTENTION : Mettre a jour systématiquement provoque une boucle infinie de notification
        if (controller.devices.get("ZWayVDev_zway_18-0-113-6-Door-A").get("metrics:level") === "on")
            self.vdev.set("metrics:level", "off");
    });
  
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

