import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/examples/jsm/objects/Reflector'

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.set(1, 1, 1)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

//fog
const fogColor = new THREE.Color(0xffffff);
const near = 1;
const far = 3;
//scene.fog = new THREE.Fog(fogColor, near, far);

function createMaterial() {
    //texture
    const texture1 = new THREE.TextureLoader().load('textures/plastic-texture.png')

    var material = new THREE.MeshStandardMaterial({
        map: texture1,
        color: 0xFA8072
    });

    return material;
}

var objects = [];

function createTexturedCube() {
    var geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
    var material = createMaterial();
    var cube = new THREE.Mesh(geometry, material);

    cube.castShadow = true;
    cube.receiveShadow = true;


    scene.add( cube );
    objects.push( cube );   
}

function createNormalCube() {
    var geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
    var material = new THREE.MeshStandardMaterial({ color: 0xFA8072 });
    var cube = new THREE.Mesh(geometry, material);

    cube.castShadow = true;
    cube.receiveShadow = true;


    scene.add( cube );
    objects.push( cube );
}


for (var i = 0; i < 5; i ++)
{
    if (i > 2)
    {
        createNormalCube();
        objects[i].position.z = i-1;
    }
    else 
        createTexturedCube();
        objects[i].position.z = i-1;
}

//shadow
const light = new THREE.SpotLight( 0xffffff );
light.position.set( 0, 4, 0 );
light.castShadow = true;
light.shadow.mapSize.width = 512; 
light.shadow.mapSize.height = 512; 
light.shadow.camera.near = 1; 
light.shadow.camera.far = 10; 
scene.add( light );

const light2 = new THREE.AmbientLight( 0x505050 );
scene.add( light2 );

//const helper = new THREE.CameraHelper( light.shadow.camera );
//scene.add( helper );

const planeGeometry = new THREE.PlaneGeometry( 10, 10 );
const planeMaterial = new THREE.MeshStandardMaterial( {color: 0xCD5C5C, side: THREE.DoubleSide} );
const planeGround = new THREE.Mesh( planeGeometry, planeMaterial );
planeGround.rotateX(-Math.PI / 2);
planeGround.position.y = -0.2;
planeGround.receiveShadow = true;
scene.add(planeGround);
//command this so the shadow will be visible
planeGround.visible = false;

//var gridHelper = new THREE.GridHelper( 10, 10 );
//scene.add( gridHelper );	

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

window.addEventListener( 'mousemove', onMouseMove, false );
		
const orbitControls = new OrbitControls( camera, renderer.domElement );

//control
const dragControls = new DragControls( objects, camera, renderer.domElement );
dragControls.addEventListener( 'dragstart', function () { orbitControls.enabled = false; } );
dragControls.addEventListener( 'drag', onDragEvent );
dragControls.addEventListener( 'dragend', function () { orbitControls.enabled = true; } );

//loader
const loader = new GLTFLoader();
loader.load('models/scene.gltf',
    function (gltf) {
        const root = gltf.scene;
        scene.add(root);

        root.position.set(0, -0.275, 4);
        root.rotateY(-2.5);
        //root.castShadow = true;
        //root.receiveShadow = true;
    },
    function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
    function ( error ) {

		console.log( 'An error happened' );
	}
);

//reflective
const mirror: Reflector = new Reflector(
    new THREE.BoxBufferGeometry(2, 2, 0.1),
    {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio
    }
)

mirror.position.y = 0;
mirror.position.z = -2;
scene.add(mirror);

//panorama
const panoTexture = new THREE.TextureLoader().load( 'textures/spherical-texture.jpg');
const panoMaterial =  new THREE.MeshBasicMaterial({map: panoTexture, side: THREE.DoubleSide});
const panoGeometry = new THREE.SphereGeometry(5, 30, 30);
const panoSphere = new THREE.Mesh(panoGeometry, panoMaterial);
         
scene.add(panoSphere); 

function animate() {

    requestAnimationFrame( animate );
    
    render();
}

function render() {
    renderer.render( scene, camera );
}

var mouse = new THREE.Vector2();

function onMouseMove(e) {
  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}


var plane = new THREE.Plane(new THREE.Vector3(0, 10, 0), 0);
var raycaster = new THREE.Raycaster();
var intersects = new THREE.Vector3();

function onDragEvent(e) {
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersects);
  e.object.position.set(intersects.x, intersects.y, intersects.z);
}

animate();