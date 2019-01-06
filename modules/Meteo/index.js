/*** Meteo module ********************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB
Copyright: 

******************************************************************************/

// Concrete module constructor

function Meteo(id, controller) {
    Meteo.super_.call(this, id, controller);

    var self = this;

}

// Module inheritance and setup

inherits(Meteo, AutomationModule);

_module = Meteo;

Meteo.prototype.init = function (config) {
    Meteo.super_.prototype.init.call(this, config);

    var self = this;

    this.vdev = this.controller.devices.create({
        deviceId: "MeteoDevice1",
        defaults: {
            deviceType: "thermostat",
            metrics: {
                title: 'Meteo Device ' + this.id,
                luminosity: 0,
                tempInt: 20,
                tempExt: 20,
                tempCave: 20,
                forecast_summary: "Couvert",
                forecast_temperature: 20,
                icon: ""
            }
        },
        overlay: {},
        handler: function (command) {

            if ("update" === command) {
                console.log("Nouveau releve luminosite : " + self.vdev.get("metrics:luminosity"));
                console.log("Nouveau releve temperature interieure : " + self.vdev.get("metrics:tempInt"));
                console.log("Nouveau releve temperature exterieure : " + self.vdev.get("metrics:tempExt"));
                console.log("Nouveau releve temperature cave : " + self.vdev.get("metrics:tempCave"));
                console.log("Nouveau releve forecast summary : " + self.vdev.get("metrics:forecast_summary"));
                console.log("Nouveau releve forecast temperature : " + self.vdev.get("metrics:forecast_temperature"));
            }
        },
        moduleId: this.id
    });

    console.log("Enregistrement de MeteoDevice : " + this.vdev.id);

    this.vdevTempExt = this.controller.devices.create({
        deviceId: "TemperatureExterieur",
        defaults: {
            deviceType: "sensorMultilevel",
            probeType: "temperature",
            metrics: {
                probeTitle: "Temperature",
                scaleTitle: "°C",
                icon: "temperature",
                title: 'Meteo Device Temp Ext',
                level: 20
            }
        },
        overlay: {},
        handler: function (command) {

            if ("update" === command) {
                console.log("Nouveau releve temperature exterieure : " + self.vdevTempExt.get("metrics:level"));
            }
        },
        moduleId: this.id
    });

    this.vdevTempInt = this.controller.devices.create({
        deviceId: "TemperatureInterieur",
        defaults: {
            deviceType: "sensorMultilevel",
            probeType: "temperature",
            metrics: {
                probeTitle: "Temperature",
                scaleTitle: "°C",
                icon: "temperature",
                title: 'Meteo Device Temp Interieur',
                level: 20
            }
        },
        overlay: {},
        handler: function (command) {

            if ("update" === command) {
                console.log("Nouveau releve temperature interieur : " + self.vdevTempInt.get("metrics:level"));
            }
        },
        moduleId: this.id
    });

    this.vdevTempCave = this.controller.devices.create({
        deviceId: "TemperatureCave",
        defaults: {
            deviceType: "sensorMultilevel",
            probeType: "temperature",
            metrics: {
                probeTitle: "Temperature",
                scaleTitle: "°C",
                icon: "temperature",
                title: 'Meteo Device Temp Cave',
                level: 20
            }
        },
        overlay: {},
        handler: function (command) {

            if ("update" === command) {
                console.log("Nouveau releve temperature cave : " + self.vdevTempCave.get("metrics:level"));
            }
        },
        moduleId: this.id
    });

    this.vdevFcSum = this.controller.devices.create({
        deviceId: "ForcastSummary",
        defaults: {
            deviceType: "sensorMultilevel",
            probeType: "temperature",
            metrics: {
                probeTitle: "Temperature",
                scaleTitle: "",
                icon: "temperature",
                title: 'Meteo Device Forecast Summary',
                level: "Cloudy"
            }
        },
        overlay: {},
        handler: function (command) {

            if ("update" === command) {
                console.log("Nouveau releve temperature forecast summary : " + self.vdevFcSum.get("metrics:level"));
            }
        },
        moduleId: this.id
    });

    this.vdevFcTemp = this.controller.devices.create({
        deviceId: "ForcastTemperature",
        defaults: {
            deviceType: "sensorMultilevel",
            probeType: "temperature",
            metrics: {
                probeTitle: "Temperature",
                scaleTitle: "°C",
                icon: "temperature",
                title: 'Meteo Device Forecast temp',
                level: 20
            }
        },
        overlay: {},
        handler: function (command) {

            if ("update" === command) {
                console.log("Nouveau releve temperature exterieure : " + self.vdevFcTemp.get("metrics:level"));
            }
        },
        moduleId: this.id
    });

    this.vdevFerie = this.controller.devices.create({
        deviceId: "JourFerie",
        defaults: {
            deviceType: "switchBinary",
            probeType: "calendar",
            metrics: {
                probeTitle: "Ferie",
                icon: "switch",
                title: 'Jour ferie',
                level: "off"
            }
        },
        overlay: {},
        handler: function (command) {

        },
        moduleId: this.id
    });

    this.vdevFerie.set("metrics:level", self.JoursFeries());
    console.log("MeteoDevice : Jour ferie " + this.vdevFerie.get("metrics:level"));

    //  Programmation du cron pour le prochain calcul de jour feries
    self.controller.emit("cron.addTask", "Ferie.poll", {
        minute: 5,
        hour: 0,
        weekDay: [ 0, 6, 1],
        day: null,
        month: null
    });

    this.controller.on('Ferie.poll', function () {
 
       self.controller.emit("cron.removeTask", "Ferie.poll");

       this.vdevFerie.set("metrics:level", self.JoursFeries());
       console.log("MeteoDevice : Jour ferie " + this.vdevFerie.get("metrics:level"));
 
        //  Programmation du cron pour le prochain calcul de jour feries
        self.controller.emit("cron.addTask", "Ferie.poll", {
            minute: 5,
            hour: 0,
            weekDay: [ 0, 6, 1],
            day: null,
            month: null
        });
   });

    this.releve = {};
    this.forecast = {};

    //  Calcul du prochain test
    var curDate1 = new Date();
    var prochainTest = new Date(curDate1.getTime() + (60 * 1000));
    console.log("Begin first check at : " + prochainTest.getHours() + ":" + prochainTest.getMinutes());
    this.controller.emit("cron.addTask", "Meteo.poll", {
        minute: prochainTest.getMinutes(),
        hour: prochainTest.getHours(),
        weekDay: null,
        day: null,
        month: null
    });

    this.controller.on('Meteo.poll', function () {

        console.log("Check current luminosity");

        //  Arret du cron
        self.controller.emit("cron.removeTask", "Meteo.poll");

        //  Calcul du prochain test
        var curDate1 = new Date();
        var prochainTest = new Date(curDate1.getTime() + (self.config.interval * 60 * 1000));

        //  Programmation du cron pour le prochain test
        self.controller.emit("cron.addTask", "Meteo.poll", {
            minute: prochainTest.getMinutes(),
            hour: prochainTest.getHours(),
            weekDay: null,
            day: null,
            month: null
        });

        var filePath = self.moduleBasePath() + "/meteo.json";
        self.releve = fs.loadJSON(filePath);
        console.log("Mise a jour du releve de luminosite:  " + self.releve.jmeteo.releve.luminosite);
        self.vdev.set("metrics:luminosity", self.releve.jmeteo.releve.luminosite);
        self.vdev.set("metrics:tempInt", self.releve.jmeteo.sondes[2].sonde2);
        self.vdevTempInt.set("metrics:level", self.releve.jmeteo.sondes[2].sonde2);
        self.vdev.set("metrics:tempExt", self.releve.jmeteo.sondes[0].sonde0);
        self.vdevTempExt.set("metrics:level", self.releve.jmeteo.sondes[0].sonde0);
        self.vdev.set("metrics:tempCave", self.releve.jmeteo.sondes[1].sonde1);
        self.vdevTempCave.set("metrics:level", self.releve.jmeteo.sondes[1].sonde1);
        //    self.vdev.performCommand("update");

        //var filePath2 = self.moduleBasePath() + "/meteo_forecast.json";
        //self.forecast = fs.loadJSON( filePath2 );
        //console.log("Mise a jour des donnees forecast:  " + self.forecast.currently.summary);
        //self.vdev.set("metrics:forecast_summary", self.forecast.currently.summary);
        //self.vdevFcSum.set("metrics:level", self.forecast.currently.summary);
        //self.vdev.set("metrics:forecast_temperature", self.forecast.currently.temperature);
        //self.vdevFcTemp.set("metrics:level", self.forecast.currently.temperature);

        self.vdev.set("metrics:forecast_summary", controller.devices.get("ForecastIO_current_26").get("metrics:weather"));
        self.vdevFcSum.set("metrics:level", controller.devices.get("ForecastIO_current_26").get("metrics:weather"));
        self.vdev.set("metrics:forecast_temperature", controller.devices.get("ForecastIO_current_26").get("metrics:level"));
        self.vdevFcTemp.set("metrics:level", controller.devices.get("ForecastIO_current_26").get("metrics:level"));

        self.controller.emit("MeteoDevice1.meteoUpdated");
    });

};

Meteo.prototype.JoursFeries = function () {
    var curDate = new Date();
    var an = curDate.getFullYear();
    var JourAn = new Date(an, "00", "01")
    var FeteTravail = new Date(an, "04", "01")
    var Victoire1945 = new Date(an, "04", "08")
    var FeteNationale = new Date(an, "06", "14")
    var Assomption = new Date(an, "07", "15")
    var Toussaint = new Date(an, "10", "01")
    var Armistice = new Date(an, "10", "11")
    var Noel = new Date(an, "11", "25")
    var SaintEtienne = new Date(an, "11", "26")

    var G = an % 19
    var C = Math.floor(an / 100)
    var H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30
    var I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11))
    var J = (an * 1 + Math.floor(an / 4) + I + 2 - C + Math.floor(C / 4)) % 7
    var L = I - J
    var MoisPaques = 3 + Math.floor((L + 40) / 44)
    var JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4)
    var Paques = new Date(an, MoisPaques - 1, JourPaques)
    var VendrediSaint = new Date(an, MoisPaques - 1, JourPaques - 2)
    var LundiPaques = new Date(an, MoisPaques - 1, JourPaques + 1)
    var Ascension = new Date(an, MoisPaques - 1, JourPaques + 39)
    var Pentecote = new Date(an, MoisPaques - 1, JourPaques + 49)
    var LundiPentecote = new Date(an, MoisPaques - 1, JourPaques + 50)
    var curDateSansHeure = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());

    var joursFeries = new Array(+JourAn, +VendrediSaint, +Paques, +LundiPaques, +FeteTravail, +Victoire1945, +Ascension, +Pentecote, +LundiPentecote, +FeteNationale, +Assomption, +Toussaint, +Armistice, +Noel, +SaintEtienne)

    console.log("Meteo : jour " + curDateSansHeure + " (" + +curDateSansHeure + ") JoursFeries " + joursFeries);

    return (joursFeries.indexOf(+curDateSansHeure) >= 0) ? "on" : "off";
};

