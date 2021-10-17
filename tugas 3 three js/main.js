import * as THREE from 'https://cdn.skypack.dev/three@0.133.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';

// Random Array
let colorsArray = [
    "63b598", "ce7d78", "ea9e70", "a48a9e", "c6e1e8", "648177", "0d5ac1",
    "f205e6", "1c0365", "14a9ad", "4ca2f9", "a4e43f", "d298e2", "6119d0",
    "d2737d", "c0a43c", "f2510e", "651be6", "79806e", "61da5e", "cd2f00",
    "9348af", "01ac53", "c5a4fb", "996635", "b11573", "4bb473", "75d89e"]

//All three.js implementation
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 500, 500, 500 );

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls( camera, renderer.domElement );

controls.autoRotate = true;
controls.screenSpacePanning = false;
controls.minDistance = 0;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

var geometry, material, meshArray, colour;
geometry = new THREE.BoxGeometry(35, 35, 35);
meshArray = [];

for (var i = 0; i < 100; i++) {
    colour = new THREE.Color();
    colour.setHex(`0x${colorsArray[Math.floor(Math.random() * colorsArray.length)]}`);
        /*if (colour < 500) {
            colour.setHex(500);
        }*/
    
        
    material = new THREE.MeshLambertMaterial({ color: colour });
    let mesh = new THREE.Mesh(geometry, material);
        
    mesh.position.x = (Math.random() * 1000) - 600;
    mesh.position.y = (Math.random() * 1000) - 600;
    mesh.position.z = (Math.random() * 1000) - 600;
    mesh.updateMatrix();
    
        //mesh.scale.x = mesh.scale.y = 25;
    meshArray.push(mesh);
    scene.add(mesh);
}

function createNextObject() {
    colour = new THREE.Color();
    colour.setHex(`0x${colorsArray[Math.floor(Math.random() * colorsArray.length)]}`);
        /*if (colour < 500) {
            colour.setHex(500);
        }*/
    
        
    material = new THREE.MeshLambertMaterial({ color: colour });
    let mesh = new THREE.Mesh(geometry, material);
        
    mesh.position.x = (Math.random() * 1000) - 600;
    mesh.position.y = (Math.random() * 1000) - 600;
    mesh.position.z = (Math.random() * 1000) - 600;
    mesh.updateMatrix();

        //mesh.scale.x = mesh.scale.y = 25;
    meshArray.push(mesh);
    scene.add(mesh);
}


var light = new THREE.AmbientLight(0xFFFFFF)
light.position.set(0, 0, 0);
scene.add(light);

var light = new THREE.Light(0xFFFFFF, 2)
light.position.set(0, 0, 25);
scene.add(light);

var mouse, raycaster, selectedPiece = null, selectedPieceColor, clickedPiece, clickedColor, selectColor, clickColor, score = 0;

mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

function onMouseMove( event ) {
 
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
 
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    mouse.x = -100000;
    mouse.y = -100000;
    selectedPiece = undefined;
    selectedPieceColor = null;
}

class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }
    
    pick(normalizedPosition, scene, camera, time) {
        // restore the color if there is a picked object
        if (this.pickedObject) {
            this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
        }
   
        // cast a ray through the frustum
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // get the list of objects the ray intersected
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length) {
            // pick the first object. It's the closest one
            this.pickedObject = intersectedObjects[0].object;
            // save its color
            this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
            // set its emissive color to flashing red/yellow
            this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
        }
        selectedPiece = this.pickedObject;
        selectedPieceColor = this.pickedObjectSavedColor;
    }
}

function selectObject() {
    if (clickedPiece) {
        if(selectedPiece instanceof THREE.Mesh) {
            if(selectedPiece === clickedPiece) 
            {
                clickedPiece.material.emissive.setHex(clickedColor);
                clickedPiece = undefined;
            }
            else if((selectedPiece.geometry instanceof THREE.BoxGeometry && clickedPiece.geometry instanceof THREE.BoxGeometry)) 
            {
                selectColor = selectedPiece.material.color.getHex();
                clickColor = clickedPiece.material.color.getHex();
                if(selectColor === clickColor) {
                    meshArray.splice(meshArray.indexOf(selectedPiece), 1);
                    meshArray.splice(meshArray.indexOf(clickedPiece), 1);
                    scene.remove(clickedPiece);
                    scene.remove(selectedPiece);
                    clickedPiece = undefined;
                    clearPickPosition;
                    score += 1;
                    console.log('score');
                    document.getElementById('score').innerHTML = "SCORE : " + score;
                }
            }
        } 
        else {
            clickedPiece.material.emissive.setHex(clickedColor);
            clickedPiece = undefined;
        }
    }
    else {
        if(selectedPiece instanceof THREE.Mesh) {
            clickedPiece = selectedPiece;
            clickedColor = selectedPieceColor;
            clearPickPosition();
        }
    }
}

const pickHelper = new PickHelper();

function animate() {
    requestAnimationFrame( animate );
    //controls.update();
    render();
}

function render(time) {
    pickHelper.pick(mouse, scene, camera, time);

    if(meshArray.length < 100) {
        createNextObject();
    }
    renderer.render( scene, camera );
}

window.addEventListener('click', selectObject);
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

animate();