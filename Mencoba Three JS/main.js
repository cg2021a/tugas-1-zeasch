const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 35;

/* lights */
const AmbientLight = new THREE.AmbientLight( 0x404040 ); // soft white light

const HemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );

const PointLight = new THREE.PointLight( 0xff0000, 1, 100 );
PointLight.position.set( 10, 15, -3);
const pointLightHelper = new THREE.PointLightHelper(PointLight, 0.8);
scene.add(pointLightHelper);

const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 1000, 1000, 1000 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

/* 
geometry = box
material = MeshBasicMaterial */
const cubegeometry = new THREE.BoxGeometry( 4, 4, 4 );
const cubematerial = new THREE.MeshLambertMaterial( {color: 0x56d1d1} );

const cube = new THREE.Mesh( cubegeometry, cubematerial );
cube.position.set( 0, 14, 0 );

/* 
geometry = cone
material = MeshPhysicalMaterial
wireframe */
const conegeometry = new THREE.ConeGeometry( 3, 5, 20 );
const conematerial = new THREE.MeshPhysicalMaterial( {color: 0x6d04f4, clearcoat: 1} );

const cone = new THREE.Mesh( conegeometry, conematerial );
cone.castShadow = true;
cone.position.set (0, 5, 0);

/*
geometry = cylinder 
material = MeshNormalMaterial */
const cylindergeometry = new THREE.CylinderGeometry( 3, 3, 7, 20 );
const cylindermaterial = new THREE.MeshNormalMaterial( {color: 0xffff00} );

const cylinder = new THREE.Mesh( cylindergeometry, cylindermaterial );
cylinder.position.set (0, -6, 0);

/*
geometry = dodecahedron
material = MeshPhongMaterial
wireframe */
const dodegeometry = new THREE.DodecahedronGeometry(3, 1);
const dodematerial = new THREE.MeshPhongMaterial({color:0x9e3885, wireframe: true});

const dodecahedron = new THREE.Mesh(dodegeometry, dodematerial);
dodecahedron.position.set(0, 22, 0);

/*
geometry = torus knot
material =  MeshPhysicalMaterial
wireframe */
const tkgeometry = new THREE.TorusKnotGeometry( 3, 1, 75, 10 );
const tkmaterial = new THREE.MeshPhysicalMaterial( { color: 0x60ed2e, wireframe: true } );

const torusKnot = new THREE.Mesh( tkgeometry, tkmaterial );
torusKnot.position.set(0, -19, 0);

//create a group and add the two cubes
//These cubes can now be rotated / scaled etc as a group
const group = new THREE.Group();
group.add(cube);
group.add(cone);
group.add(cylinder);
group.add(dodecahedron);
group.add(torusKnot);

scene.add(group);
scene.add(AmbientLight);
//AmbientLight.visible = false;
scene.add(HemisphereLight);
//HemisphereLight.visible = false;
scene.add(directionalLight);
//directionalLight.visible = false;
scene.add(PointLight);
//PointLight.visible = false;
scene.add(spotLight);
//spotLight.visible = false;

const animate = function() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.0025;
    cube.rotation.y += 0.0025;

    cone.rotation.x += 0.005;
    cone.rotation.y += 0.005;

    cylinder.rotation.x += 0.0075;
    cylinder.rotation.y += 0.0075;

    dodecahedron.rotation.x += 0.01;
    dodecahedron.rotation.y += 0.01;

    torusKnot.rotation.x += 0.0125;
    torusKnot.rotation.y += 0.0125;

    //controls.update();

    renderer.render( scene, camera );
};

animate();