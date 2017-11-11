/*** WallController HA module *************************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Marc TAIEB <taiebma@free.fr>
Copyright: 
Description: Fibaro Senso 1

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function WallController (id, controller) {
    // Call superconstructor first (AutomationModule)
    WallController.super_.call(this, id, controller);

}

inherits(WallController, AutomationModule);

_module = WallController;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

WallController.prototype.init = function (config) {

    // Call superclass' init (this will process config argument and so on)
    WallController.super_.prototype.init.call(this, config);

    var self = this;

//var output = 'Wall';
//for (property in zway.devices[1].instances[0].SceneActivation.data[1]) {
    //output += property + ': ' + zway.devices[1].instances[0].SceneActivation.data[1][property]+'; ';
//}
//console.log(output);

	zway.devices[1].instances[0].commandClasses[43].data.currentScene.bind(function() {
    		console.log("WallController : Scene activation " + this.value + ' src = ' + zway.devices[1].instances[0].commandClasses[43].data.srcNodeId);
		switch( this.value ) {
			case 1:
				self.controller.emit("ActivationSceneSingleUp");
				break;
			case 2:
				self.controller.emit("ActivationSceneSingleDown");
				break;
			case 3:
				self.controller.emit("ActivationSceneDimUp");
				break;
			case 4:
				self.controller.emit("ActivationSceneDimDown");
				break;
			case 5:
				self.controller.emit("ActivationSceneDimUpStop");
				break;
			case 6:
				self.controller.emit("ActivationSceneDimDownStop");
				break;
			case 11:
				self.controller.emit("ActivationSceneDoubleUp");
				break;
			case 12:
				self.controller.emit("ActivationSceneDoubleDown");
				self.controller.emit("ModeVacances");
				break;
			case 13:
				self.controller.emit("ActivationSceneDoubleDimUp");
				break;
			case 14:
				self.controller.emit("ActivationSceneDoubleDimDown");
				break;
			case 15:
				switch (zway.devices[1].instances[0].commandClasses[43].data.srcNodeId.value) {
					case 10:	//  Gros bouton cuisine
    						console.log("WallController : Scene activation lumiere exterieur");
						self.controller.emit("ActivationSceneLumiereExterieur");
						break;
					case 9:		//  Petit bouton cuisine
    						console.log("WallController : Scene activation extinction");
						self.controller.emit("ActivationSceneDoubleDimUpStop");
						break;
					default:
    						console.log("WallController : Scene activation inconnue");
						break;
				}
				break;
			case 16:
				self.controller.emit("ActivationSceneDoubleDimDownStop");
				break;
		}
	});

};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

