(function() {
	"use strict";
	
	var canvas = document.getElementById("renderCanvas");
	var sphere = null;
	var camera = null;
    var snowman = null;
    
	var engine = new BABYLON.Engine(canvas, true);
    
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 1, 0);

    var cameraPosition = new BABYLON.Vector3(Math.random()*50, 5, Math.random()*50);
    camera = new BABYLON.FreeCamera("camera1", cameraPosition, scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .5;
    
    sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
    sphere.position.y = 1;
    
    var ground = BABYLON.Mesh.CreateGround("ground1", 600, 600, 2, scene);
    
    /*
	var spheresByConnectionId = {};

	var hubConnection = $.connection.hub;
	var playerHub = $.signalR.playerHub;
	
	playerHub.client.setPosition = function(connectionId, x, y, z) {
        if( !spheresByConnectionId.hasOwnProperty(connectionId) ) {
            var otherSphere = BABYLON.Mesh.CreateSphere("sphere-"+connectionId, 16, 2, scene);
            spheresByConnectionId[connectionId] = otherSphere;
        }
        
		spheresByConnectionId[connectionId].position = new BABYLON.Vector3(x,y,z);
	};
	
	playerHub.client.connected = function(connectionId) {
	};
	
	playerHub.client.disconnected = function(connectionId) {
		
	};
	
	hubConnection.start().then(function() {
		console.log("Started");
	});*/

	var renderCounter = 0;
	engine.runRenderLoop(function () {
		scene.render();
        
		
		var delta = camera._currentTarget.subtract(camera.position);
		var normalized = delta.normalize();
		var scaled = normalized.scale(5);
		
		sphere.position = camera.position.add(scaled);
		/*
		renderCounter++;
		if( renderCounter == 10 ) {
			renderCounter = 0;
			
			if( hubConnection.state == 1 ) {
				try {
					//console.log("We're here");
					playerHub.server.setPosition(sphere.position.x, sphere.position.y, sphere.position.z);
				} catch(e) {
					//console.log(e);
				}
			}
			
		}
        */
	});		
	
	window.addEventListener("resize", function () {
		engine.resize();
	});			
	
	document.addEventListener("keyup", function (e) {
		if( e.keyCode == 85 ) {
			
			var target = camera._currentTarget;
			target.y += 0.05;
			camera.setTarget(target);
		}
		
		// Left = 37
		// Up = 38
		// Right = 39
		// Down = 40
		//debugger;	
	}); 
	
			
	
})();