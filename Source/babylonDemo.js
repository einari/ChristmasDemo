(function() {
	"use strict";
	
	var canvas = document.getElementById("renderCanvas");
	var sphere = null;
	var camera = null;
	var engine = new BABYLON.Engine(canvas, true);
	// This begins the creation of a function that we will 'call' just after it's built
	var createScene = function () {
		var scene = new BABYLON.Scene(engine);
		
		
		
		scene.clearColor = new BABYLON.Color3(0, 1, 0);

		var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
		light.intensity = .5;
		sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
		sphere.position.y = 1;
		var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
		
		camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
		
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas, false);
		
		
		BABYLON.SceneLoader.ImportMesh("Snowman", "/assets/", "Snowman.babylon", scene, function(loadedMeshes) {
			
		});
		
		return scene;
	};
	
	var spheresByConnectionId = {};

	var hubConnection = $.connection.hub;
	
	hubConnection.stateChanged(function(state) {
		console.log("State : "+state.newState);
	});
	var playerHub = $.signalR.playerHub;
	
	
	playerHub.client.setPosition = function(connectionId, x, y, z) {
		console.log(connectionId+" - "+x+", "+y+", "+z);	
	};
	
	playerHub.client.connected = function(connectionId) {
		
	};
	
	playerHub.client.disconnected = function(connectionId) {
		
	};
	
	/*
	hubConnection.start().then(function() {
		console.log("Started");
	});*/
	
	/*
	$.connection().start().then(function() {
		console.log("Regular connection started");
	});*/
	
	
	var scene = createScene();
	
	var renderCounter = 0;
	engine.runRenderLoop(function () {
		scene.render();
		
		var delta = camera._currentTarget.subtract(camera.position);
		var normalized = delta.normalize();
		var scaled = normalized.scale(5);
		
		sphere.position = camera.position.add(scaled);
		
		
		renderCounter++;
		if( renderCounter == 100 ) {
			renderCounter = 0;
			
			if( hubConnection.state == 1 ) {
				try {
					//console.log("We're here");
					//playerHub.server.setPosition(sphere.position.x, sphere.position.y, sphere.position.z);
				} catch(e) {
					//console.log(e);
				}
			}
			
		}
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