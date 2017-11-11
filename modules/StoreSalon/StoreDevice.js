/******************************************************************************

 StoreDevice Z-Way Home Automation module
 Version: 1.0.0
 (c) ZWave.Me, 2013

 -----------------------------------------------------------------------------
 Author: Gregory Sitnin <sitnin@z-wave.me>
 Description:
     This module listens given VirtualDevice (which MUSt be typed as switch)
     level metric update events and switches off device after configured
     timeout if this device has been switched on.

******************************************************************************/

//var request = require("../../request");

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

/*
function StoreDevice (id, controller, zDeviceId, zInstanceId, zScaleId) {
    // Call superconstructor first (AutomationModule)
    StoreDevice.super_.call(this, id, controller, zDeviceId, zInstanceId);

    // Create instance variables
//    this.deviceType = "virtual";
//    this.deviceSubType = "luminosity";
    //this.caps = ["customWidget"];

    this.zCommandClassId = 0x32;
    this.zSubTreeKey = zScaleId;

    this.deviceType = "probe";

    var self = this;
}

inherits(StoreDevice, VirtualDevice);
*/

StoreSalon.prototype.selectStore = function(idStore) {

	console.log("Selection du store " + idStore);

	var self = this;

	http.request({
            method: 'GET',
            url: this.config.urlStoreSelect,
            data: { }
        });
	try {
               	system( "sleep " + self.config.intervalSelectAttente / 1000 );
       	} catch(err) {
               	console.log("Failed to execute script system call sleep : " + err);
       	}
	for(i = 0; i < idStore; i++) {
			console.log("Store " + (i + 1));

			http.request({
            			method: 'GET',
            			url: self.config.urlStoreSelect,
            			data: { }
        		});
                	self.timer = null;
                	try {
                        	system(
                        	"sleep " + self.config.intervalSelectAttente / 1000
                        	);
                	} catch(err) {
                        	console.log("Failed to execute script system call sleep : " + err);
                	}

	}
	this.currentStore = idStore;
}

StoreSalon.prototype.selectStoreAll = function() {

	console.log("Retour au store principal " + this.currentStore);

	var self = this;

	for(i = 0; i < this.config.nbChannel + 2 - this.currentStore; i++) {
			console.log("Store " + (i + 1));

			http.request({
            			method: 'GET',
            			url: self.config.urlStoreSelect,
            			data: { }
        		});
                	self.timer = null;
                	try {
                        	system(
                        	"sleep " + self.config.intervalSelectAttente / 1000
                        	);
                	} catch(err) {
                        	console.log("Failed to execute script system call sleep : " + err);
                	}


	}
}

//  Devait servir a mettre a jour le device mais loadJSON ne fonctionne pas a cet endroit
StoreSalon.prototype.performCommand = function (command, idStore) {
    console.log("--- StoreDevice.performCommand processing...");

    var handled = true;
    var self = this;

    //  Selection du store
    this.selectStore(idStore);

    if ("openPartial" === command) {

	console.log("Ouverture partielle du store " + idStore);
	console.log("Appel de l'URL : " + self.config.urlStoreUp);

	//  stop ouverture du store
	console.log("Stop");

	http.request({
      		method: 'GET',
            	url: self.config.urlStoreStop,
       		data: { }
      	});

    } else if ("open" === command) {

        console.log("Ouverture totale du store " + idStore);

        //  ouverture du store
	console.log("Up");

	http.request({
      		method: 'GET',
            	url: self.config.urlStoreUp,
       		data: { }
      	});


    } else if ("close" === command) {

        console.log("Fermeture du store " + idStore);
        
        //  fermeture du store
	console.log("Close");

	http.request({
      		method: 'GET',
            	url: self.config.urlStoreDown,
       		data: { }
      	});

    } else if ("stop" === command) {

        console.log("Stop du store " + idStore);
        
        //  ouverture du store
	console.log("Stop");

	http.request({
      		method: 'GET',
            	url: self.config.urlStoreStop,
       		data: { }
      	});

    } else {
        handled = false;
    }

    //  On attend un peu avant de se remettre au début
    try {
       	system(
               	"sleep " + self.config.intervalSelectAttente *2 / 1000 );
    } catch(err) {
        	console.log("Failed to execute script system call sleep : " + err);
    }

    //  On se repositionne sur le "all channel"
    self.selectStoreAll();

    return handled ? true : StoreDevice.super_.prototype.performCommand.call(this, command);
}


