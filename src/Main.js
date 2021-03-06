window.onload = function() {
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 10000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	// Stats monitor:
	var stats = new Stats();
	stats.showPanel(0);
	document.body.appendChild(stats.dom);
	
	var rendererStats  = new THREEx.RendererStats();
	
	rendererStats.domElement.style.position   = 'absolute';
	rendererStats.domElement.style.left  = '0px';
	rendererStats.domElement.style.bottom    = '0px';
	document.body.appendChild( rendererStats.domElement );
	
	// Perlin noise parameters:
	var scale = 40;
	var octaves = 4;
	var persistance = 0.5;
	var lacunarity = 3;
	var noiseHeightGenerator = new NoiseHeightGenerator(scale, octaves, persistance, lacunarity);

	// Texture loader:
	var textureLoader = new THREE.TextureLoader();
	
	// Light of the sun:
	var lightSun = new THREE.PointLight();
	lightSun.distance = 0.0;
	
	// Light of the moon:
	var lightMoon = new THREE.PointLight();
	lightMoon.distance = 100.0;
	
	// Point light intensity:
	var pointLightIntensity = [1.0, 0.1];
	
	// Sun parameters:
	var sunRadius = 100; // sun: 695700km
	var sunRotationSpeed = 0.01;
	var sunRevolutionSpeed = 0;
	var sunOrbitalDistance = 0;
	var sunChunkPerFaceSide = 2;
	var sunLodParams = [[5, 0]];
	var sunUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
												{
												 pointLightIntensity: { type: "fv1", value: pointLightIntensity },
												 emissiveLightIntensity: { type: "f", value: 1.4 },
												 planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
												 radius: { value: sunRadius },
												 texture: { value: Array(8).fill(null) },
												 textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
												}]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/sun/sun0.png", function(texture) {
					   sunUniforms.texture.value[0] = texture;
					   sunUniforms.texture.value[1] = texture;
					   sunUniforms.texture.value[2] = texture;
					   sunUniforms.texture.value[3] = texture;
					   sunUniforms.texture.value[4] = texture;
					   sunUniforms.texture.value[5] = texture;
					   sunUniforms.texture.value[6] = texture;
					   sunUniforms.texture.value[7] = texture;
					   });
	
	var sunMaterial = new THREE.ShaderMaterial({
												uniforms: sunUniforms,
												vertexShader: document.getElementById("basicVertexShader").textContent,
												fragmentShader: document.getElementById("basicFragmentShader").textContent,
												lights: true
											   });
	
	var sun = new Planet("sun", sunRadius, sunRotationSpeed, sunRevolutionSpeed, sunOrbitalDistance,
						  sunChunkPerFaceSide, sunLodParams, sunMaterial, noiseHeightGenerator);
	scene.add(sun);
	sun.add(lightSun);
	
	//Sun particles effects
	var sun_particles = new SphereParticleEffect(100000, sunRadius-2, sunRadius+2.5);
	sun.add(sun_particles);
	
	// Mercury parameters:
	noiseHeightGenerator.scale = 50;
	var mercuryRadius = 20; // earth: 2440km
	var mercuryRotationSpeed = 0.1;
	var mercuryRevolutionSpeed = 0.1;
	var mercuryOrbitalDistance = 250;
	var mercuryChunkPerFaceSide = 4;
	var mercuryLodParams = [[15, 100], [2, 200]];
	var mercuryUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
													{
													 pointLightIntensity: { type: "fv1", value: pointLightIntensity },
													 emissiveLightIntensity: { type: "f", value: 0.0 },
													 planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
													 radius: { value: mercuryRadius },
													 texture: { value: Array(8).fill(null) },
													 textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
													}]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/moon/moon0.jpg", function(texture) {
					   mercuryUniforms.texture.value[0] = texture;
					   mercuryUniforms.texture.value[1] = texture;
					   mercuryUniforms.texture.value[2] = texture;
					   mercuryUniforms.texture.value[3] = texture;
					   mercuryUniforms.texture.value[4] = texture;
					   mercuryUniforms.texture.value[5] = texture;
					   mercuryUniforms.texture.value[6] = texture;
					   mercuryUniforms.texture.value[7] = texture;
					   });
	
	var mercuryMaterial = new THREE.ShaderMaterial({
													uniforms: mercuryUniforms,
													vertexShader: document.getElementById("basicVertexShader").textContent,
													fragmentShader: document.getElementById("basicFragmentShader").textContent,
													lights: true
												   });
	
	var mercury = new Planet("mercury", mercuryRadius, mercuryRotationSpeed, mercuryRevolutionSpeed, mercuryOrbitalDistance,
						  mercuryChunkPerFaceSide, mercuryLodParams, mercuryMaterial, noiseHeightGenerator);
	sun.add(mercury);

	// Venus parameters:
	noiseHeightGenerator.scale = 15;
	var venusRadius = 35; // earth: 6052km
	var venusRotationSpeed = 0.01;
	var venusRevolutionSpeed = 0.01;
	var venusOrbitalDistance = 500;
	var venusChunkPerFaceSide = 4;
	var venusLodParams = [[38, 10], [30, 50], [22, 100], [8, 200]];
	var venusUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
												  {
												   pointLightIntensity: { type: "fv1", value: pointLightIntensity },
												   emissiveLightIntensity: { type: "f", value: 0.3 },
												   planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
												   radius: { value: venusRadius },
												   texture: { value: Array(8).fill(null) },
												   textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
												  }]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/venus/venus0.jpg", function (texture) {
					   venusUniforms.texture.value[0] = texture;
					   venusUniforms.texture.value[1] = texture;
					   });
	
	textureLoader.load("images/venus/venus1.jpg", function (texture) {
					   venusUniforms.texture.value[2] = texture;
					   venusUniforms.texture.value[3] = texture;
					   });
	
	textureLoader.load("images/venus/venus2.jpg", function (texture) {
					   venusUniforms.texture.value[4] = texture;
					   venusUniforms.texture.value[5] = texture;
					   });
	
	textureLoader.load("images/venus/venus3.jpg", function (texture) {
					   venusUniforms.texture.value[6] = texture;
					   venusUniforms.texture.value[7] = texture;
					   });
	
	var venusMaterial = new THREE.ShaderMaterial({
													uniforms: venusUniforms,
													vertexShader: document.getElementById("basicVertexShader").textContent,
													fragmentShader: document.getElementById("basicFragmentShader").textContent,
													lights: true
												 });
	
	var venus = new Planet("venus", venusRadius, venusRotationSpeed, venusRevolutionSpeed, venusOrbitalDistance,
						   venusChunkPerFaceSide, venusLodParams, venusMaterial, noiseHeightGenerator );
	sun.add(venus);
	
	// Earth parameters:
	noiseHeightGenerator.scale = 15;
	var earthRadius = 40; // earth: 6371km
	var earthRotationSpeed = 0.02;
	var earthRevolutionSpeed = 0.005;
	var earthOrbitalDistance = 800;
	var earthChunkPerFaceSide = 4;
	var earthLodParams = [[50, 10], [40, 50], [30, 100], [10, 200]];
	var earthUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
												  {
												   pointLightIntensity: { type: "fv1", value: pointLightIntensity },
												   emissiveLightIntensity: { type: "f", value: 0.0 },
												   planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
												   radius: { value: earthRadius },
												   texture: { value: Array(8).fill(null) },
												   textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
												  }]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/earth/deepsea.jpg", function (texture) {
		earthUniforms.texture.value[0] = texture;
	});
	
	textureLoader.load("images/earth/sea.jpg", function (texture) {
		earthUniforms.texture.value[1] = texture;
	});
	
	textureLoader.load("images/earth/sand.jpg", function (texture) {
		earthUniforms.texture.value[2] = texture;
	});
	
	textureLoader.load("images/earth/grass.jpg", function (texture) {
		earthUniforms.texture.value[3] = texture;
	});
	
	textureLoader.load("images/earth/grass2.png", function (texture) {
		earthUniforms.texture.value[4] = texture;
	});
	
	textureLoader.load("images/earth/rock.jpg", function (texture) {
		earthUniforms.texture.value[5] = texture;
	});
	
	textureLoader.load("images/earth/rock2.jpg", function (texture) {
		earthUniforms.texture.value[6] = texture;
	});
	
	textureLoader.load("images/earth/snow.jpg", function (texture) {
		earthUniforms.texture.value[7] = texture;
	});
	
	var earthMaterial = new THREE.ShaderMaterial({ uniforms: earthUniforms,
												   vertexShader: document.getElementById("basicVertexShader").textContent,
												   fragmentShader: document.getElementById("basicFragmentShader").textContent,
												   lights: true
												 });

	var earth = new Planet("earth", earthRadius, earthRotationSpeed, earthRevolutionSpeed, earthOrbitalDistance,
						   earthChunkPerFaceSide, earthLodParams, earthMaterial, noiseHeightGenerator );
	
	var oceanMaterial =  new THREE.MeshPhongMaterial( { color: 0x219e4, transparent: true, opacity: 0.9, shininess:100} );
	var ocean = new SimpleSphericalOcean("earthOcean", earthRadius+1, 50, oceanMaterial);
	var atmosphere = new SimpleAtmosphere("earthAtmosphere", earthRadius+3, 40, "images/earth/atmosphere.png");
	earth.add(ocean);
	earth.add(atmosphere);
	
	sun.add(earth);
	
	// Moon parameters:
	noiseHeightGenerator.scale = 50;
	var moonRadius = 10; // earth: 1737km
	var moonRotationSpeed = 0.005;
	var moonRevolutionSpeed = 0.1;
	var moonOrbitalDistance = 75;
	var moonChunkPerFaceSide = 2;
	var moonLodParams = [[15, 100], [5, 200]];
	var moonUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
												 {
												  pointLightIntensity: { type: "fv1", value: pointLightIntensity },
												  emissiveLightIntensity: { type: "f", value: 0.5 },
												  planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
												  radius: { value: moonRadius },
												  texture: { value: Array(8).fill(null) },
												  textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
												 }]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/moon/moon0.jpg", function(texture) {
		moonUniforms.texture.value[0] = texture;
		moonUniforms.texture.value[1] = texture;
		moonUniforms.texture.value[2] = texture;
		moonUniforms.texture.value[3] = texture;
		moonUniforms.texture.value[4] = texture;
		moonUniforms.texture.value[5] = texture;
		moonUniforms.texture.value[6] = texture;
		moonUniforms.texture.value[7] = texture;
	});
	
	var moonMaterial = new THREE.ShaderMaterial({ uniforms: moonUniforms,
												 vertexShader: document.getElementById("basicVertexShader").textContent,
												 fragmentShader: document.getElementById("basicFragmentShader").textContent,
												 lights: true
												 });
	
	var moon = new Planet("moon", moonRadius, moonRotationSpeed, moonRevolutionSpeed, moonOrbitalDistance,
						  moonChunkPerFaceSide, moonLodParams, moonMaterial, noiseHeightGenerator);
	earth.add(moon);
	moon.add(lightMoon);
	
	// Mars parameters:
	noiseHeightGenerator.scale = 15;
	var marsRadius = 26; // earth: 3390km
	var marsRotationSpeed = 0.02;
	var marsRevolutionSpeed = 0.003;
	var marsOrbitalDistance = 1150;
	var marsChunkPerFaceSide = 3;
	var marsLodParams = [[50, 10], [40, 50], [30, 100], [10, 200]];
	var marsUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
												 {
												  pointLightIntensity: { type: "fv1", value: pointLightIntensity },
												  emissiveLightIntensity: { type: "f", value: 0.0 },
												  planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
												  radius: { value: marsRadius },
												  texture: { value: Array(8).fill(null) },
												  textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
												 }]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/mars/mars0.jpg", function (texture) {
					   marsUniforms.texture.value[0] = texture;
					   });
	
	textureLoader.load("images/mars/mars1.jpg", function (texture) {
					   marsUniforms.texture.value[1] = texture;
					   marsUniforms.texture.value[2] = texture;
					   });
	
	textureLoader.load("images/mars/mars2.png", function (texture) {
					   marsUniforms.texture.value[3] = texture;
					   marsUniforms.texture.value[4] = texture;
					   });
	
	textureLoader.load("images/mars/mars3.jpg", function (texture) {
					   marsUniforms.texture.value[5] = texture;
					   });
	
	textureLoader.load("images/mars/mars4.jpg", function (texture) {
					   marsUniforms.texture.value[6] = texture;
					   });
	
	textureLoader.load("images/mars/mars5.jpg", function (texture) {
					   marsUniforms.texture.value[7] = texture;
					   });
	
	var marsMaterial = new THREE.ShaderMaterial({ uniforms: marsUniforms,
												 vertexShader: document.getElementById("basicVertexShader").textContent,
												 fragmentShader: document.getElementById("basicFragmentShader").textContent,
												 lights: true
												 });
	
	var mars = new Planet("mars", marsRadius, marsRotationSpeed, marsRevolutionSpeed, marsOrbitalDistance,
						   marsChunkPerFaceSide, marsLodParams, marsMaterial, noiseHeightGenerator );
	sun.add(mars);
	
	
	// Add meteorites
	var meteorites = new MeteoritesCloud(1500, 8);
	meteorites.frustumCulled = false;
	sun.add(meteorites);

	// Add starfield (spherified cube):
	var starfieldSphere = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
	for (var i = 0; i < starfieldSphere.vertices.length; ++i) {
		starfieldSphere.vertices[i].normalize().multiplyScalar(2500);
	}
	var starfieldMaterial = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "images/galaxy_starfield.png" ),
														   side: THREE.BackSide } );
	var starfieldMesh = new THREE.Mesh(starfieldSphere, starfieldMaterial);
	scene.add(starfieldMesh);
	
	// Add celestial objects tags
	var mars_tag_texture = generateTextureFromCanvas(drawTagsTexture, ['Mars', 'Terrestrial planet']);
	var moon_tag_texture = generateTextureFromCanvas(drawTagsTexture, ['Moon', 'Natural satellite']);
	var earth_tag_texture = generateTextureFromCanvas(drawTagsTexture, ['Earth', 'Terrestrial planet']);
	var venus_tag_texture = generateTextureFromCanvas(drawTagsTexture, ['Venus', 'Terrestrial planet']);
	var mercury_tag_texture = generateTextureFromCanvas(drawTagsTexture, ['Mercury', 'Terrestrial planet']);
	var sun_tag_texture = generateTextureFromCanvas(drawTagsTexture, ['Sun', 'Yellow dwarfs']);
	
	var marsTag = new GraphicalTag(mars_tag_texture, camera, mars, marsRadius+10.0);
	var moonTag = new GraphicalTag(moon_tag_texture, camera, moon, moonRadius+10.0);
	var earthTag = new GraphicalTag(earth_tag_texture, camera, earth, earthRadius+10.0);
	var venusTag = new GraphicalTag(venus_tag_texture, camera, venus, venusRadius+10.0);
	var mercuryTag = new GraphicalTag(mercury_tag_texture, camera, mercury, mercuryRadius+10.0);
	var sunTag = new GraphicalTag(sun_tag_texture, camera, sun, sunRadius+10.0);
	
	scene.add(sunTag);
	scene.add(mercuryTag);
	scene.add(venusTag);
	scene.add(earthTag);
	scene.add(moonTag);
	scene.add(marsTag);
	
	// Move camera:
	camera.position.z = 500;
	camera.position.y = 200;
	camera.lookAt(new THREE.Vector3(0,0,0));

	// Time:
	var clock = new THREE.Clock();
	var time = 0;
	var time_speed = 1.0;
	
	// Fly controls:
	var controls = new THREE.FlyControls(camera, renderer.domElement);
	controls.movementSpeed = 100;
	controls.rollSpeed = Math.PI / 24;
	controls.dragToLook = true;
	
	
	// Input handler functions:
	var solarSystem = { 'sun': sun, 'mercury': mercury, 'venus': venus,
							'earth': earth, 'moon': moon, 'mars': mars }; 
	
	var lookAtPlanet = function(planetName) {
		var selectedPlanet = solarSystem[planetName];
		
		var target_position = new THREE.Vector3();
		target_position.setFromMatrixPosition( selectedPlanet.matrixWorld );
		
		camera.lookAt(target_position);
		camera.updateProjectionMatrix();
	}
	
	var moveToPlanet = function(planetName) {
		var selectedPlanet = solarSystem[planetName];
		
		var ncp = new THREE.Vector3();	//new camera position
		ncp.setFromMatrixPosition( selectedPlanet.matrixWorld );
		ncp.z += 4 * selectedPlanet.radius;
		
		camera.position.set(ncp.x, ncp.y, ncp.z);
		camera.updateProjectionMatrix();
		
		lookAtPlanet(planetName);
	}
	
	
	// GUI definition:
	var gui = new dat.GUI({
		height: 5 * 32 - 1,
		resizable: false
	});
	
	gui_values = {
		
		TimeSpeed:	1.0,
		
		DragToLook:	controls.dragToLook,
		
		MoveToSun:		function() { moveToPlanet('sun'); }, 
		MoveToMercury:	function() { moveToPlanet('mercury'); },
		MoveToVenus:	function() { moveToPlanet('venus'); },
		MoveToEarth:	function() { moveToPlanet('earth'); },
		MoveToMoon:		function() { moveToPlanet('moon'); },
		MoveToMars:		function() { moveToPlanet('mars'); },
		
		LookAtSun:		function() { lookAtPlanet('sun'); }, 
		LookAtMercury:	function() { lookAtPlanet('mercury'); },
		LookAtVenus:	function() { lookAtPlanet('venus'); },
		LookAtEarth:	function() { lookAtPlanet('earth'); },
		LookAtMoon:		function() { lookAtPlanet('moon'); },
		LookAtMars:		function() { lookAtPlanet('mars'); }
	};
	
	var timeopt = gui.addFolder("Time settings");
	var time_speed_slider = timeopt.add(gui_values, "TimeSpeed", 0.0, 10.0).name("Speed multiplier");
	time_speed_slider.onChange( function(value) { time_speed = value; } );
	timeopt.open();
	
	var camopt = gui.addFolder("Camera settings");
	var dragcheck = camopt.add(gui_values, "DragToLook").name("Drag to look").listen();
	dragcheck.onChange( function(value) { controls.dragToLook = value; } );
	camopt.open();
	
	var moveto = gui.addFolder("Move To");
	moveto.add(gui_values, 'MoveToSun').name('Sun');
	moveto.add(gui_values, 'MoveToMercury').name('Mercury');
	moveto.add(gui_values, 'MoveToVenus').name('Venus');
	moveto.add(gui_values, 'MoveToEarth').name('Earth');
	moveto.add(gui_values, 'MoveToMoon').name('Moon');
	moveto.add(gui_values, 'MoveToMars').name('Mars');
	moveto.open();
	
	var lookat = gui.addFolder("Look At");
	lookat.add(gui_values, 'LookAtSun').name('Sun');
	lookat.add(gui_values, 'LookAtMercury').name('Mercury');
	lookat.add(gui_values, 'LookAtVenus').name('Venus');
	lookat.add(gui_values, 'LookAtEarth').name('Earth');
	lookat.add(gui_values, 'LookAtMoon').name('Moon');
	lookat.add(gui_values, 'LookAtMars').name('Mars');
	lookat.open();
	
	var render = function () {
		// Update time:
		delta = clock.getDelta();
		time += delta * time_speed;
		
		// Update performance monitor:
		stats.update();
		rendererStats.update(renderer);
		
		// Update position of the planets:
		sun.updatePosition(time);
		mercury.updatePosition(time);
		venus.updatePosition(time);
		earth.updatePosition(time);
		moon.updatePosition(time);
		mars.updatePosition(time);
		
		sun_particles.update(time);
		meteorites.update(time);
		
		// Send position of the planets to the shader:
		sunUniforms.planetPosition.value = sun.position;
		mercuryUniforms.planetPosition.value = mercury.position;
		venusUniforms.planetPosition.value = venus.position;
		earthUniforms.planetPosition.value = earth.position;
		moonUniforms.planetPosition.value = moon.position;
		marsUniforms.planetPosition.value = mars.position;
		
		// Update controls:
		controls.update(delta);
		
		
		// Update matrixWorld of the objects before the rendering
		// this permits to compute collisions and tags position with more accuracy
		//sun.updateMatrixWorld(true);
		//mercury.updateMatrixWorld(true);
		//venus.updateMatrixWorld(true);
		//earth.updateMatrixWorld(true);
		//moon.updateMatrixWorld(true);
		//mars.updateMatrixWorld(true);
		
		camera.updateMatrixWorld(true);
		
		// Update tags positions:
		sunTag.update();
		mercuryTag.update();
		venusTag.update();
		earthTag.update();
		moonTag.update();
		marsTag.update();
		
		// Check for collisions:
		for(planetName in solarSystem) {
			planet = solarSystem[planetName];
			
			//check collision and get the suggested new position for the camera
			var sgp = checkCollisionBetween(camera, planet, 2.8);
			
			if(sgp != null) {
				camera.position.set(sgp.x, sgp.y, sgp.z);
				break;
			}
		}
		
		// Force camera position inside starfield:
		var sgp = forceCameraInsideSphere(camera, new THREE.Vector3(), 2400);
		if(sgp != null) 
			camera.position.set(sgp.x, sgp.y, sgp.z);
		
		// Update chunk details (LOD):
		scene.traverse(
			function (object) {
				if (object instanceof THREE.LOD) {
					object.update(camera);
				}
			}
		);
		
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	};

	render();

}
