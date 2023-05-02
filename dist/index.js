import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const textureloader = new THREE.TextureLoader();
const gold = textureloader.load('assets/silver.jpg');
  

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 10,10);
renderer.render(scene, camera);

const uniforms = {
    u_time: {type: 'f', value: 0.0},
    u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio)},
    u_mouse: {type: 'v2', value: new THREE.Vector2(0.0, 0.0)},
    texture: { type: "t", value: textureloader.load("assets/silver.jpg")}
}
window.addEventListener('mousemove', function(e) {
    uniforms.u_mouse.value.set(e.screenX / this.window.innerWidth, 1 - e.screenY / this.window.innerHeight)
})
const terrain = textureloader.load('assets/terrain.jpg');
const ridges = textureloader.load('assets/ridges.jpg');
const disp = textureloader.load('assets/displ.jpg');
const colors = textureloader.load('assets/colors.jpg');
const geometry = new THREE.BoxGeometry(15,1,15,50,50,50);
const material = new THREE.ShaderMaterial({
    // wireframe: true,
    vertexShader: `
    varying vec3 pos;
    uniform float u_time;

    void main() { 
        vec4 result;

        // change the amplitude of the box's waves
        // result = vec4(position.x, 4.0*sin(position.z/4.0) + position.y, position.z, 1.0);
        result = vec4(position.x, .45 * sin(position.z/.4 + u_time) + position.y,.45 * sin(position.x/.4 + u_time) + position.z, 1.0);

        gl_Position = projectionMatrix
          * modelViewMatrix
          * result;
    }
    `,
    fragmentShader: `

    uniform float u_time;
    
    void main() {
      
        gl_FragColor = vec4((sin(u_time) * .2) * .4,(cos(u_time) * .2) * .4,.2, 1.0);
    }`,
    uniforms
  });

const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0,0,0);
scene.add(sphere);
//sphere.rotateX(300);




const pointLight = new THREE.PointLight(0xffffff, 1.5)
scene.add(pointLight);
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const light1 = new THREE.SpotLight( 0xffffff, 2, 200, 10 );
light1.position.set( -30, 30, 40 );
light1.castShadow = true;
light1.shadow.mapSize.x = 2048;
light1.shadow.mapSize.y = 2048;
light1.shadow.camera.near = 0.1;
scene.add(light1);
const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

});


const clock = new THREE.Clock();
let elapsed;
function animate(){
    uniforms.u_time.value = clock.getElapsedTime();
    elapsed = clock.getElapsedTime() * .1;
    requestAnimationFrame(animate);
    controls.update();
    // sphere.rotateZ(.0005);
    // sphere.position.set(Math.sin(elapsed) * .5, Math.cos(elapsed), 0);
    renderer.render(scene, camera);
}

animate()