import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fs from './shaders/frag.js';
import vs from './shaders/vert.js';
// import * as meshline from 'meshline';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0,.5,1);
renderer.render(scene, camera);
scene.background = new THREE.Color( 0x474643);
const textureloader = new THREE.TextureLoader(); 
const colors = textureloader.load('assets/colors.gif');

const bgGeometry = new THREE.PlaneGeometry(4,2,100,100);
const bgMaterial = new THREE.MeshBasicMaterial({ map: colors });
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.set(0, 0, -1);
// scene.add(bgMesh);

const uniforms = {
    u_time: {type: 'f', value: 0.0},
    u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio)},
    u_mouse: {type: 'v2', value: new THREE.Vector2(0.0, 0.0)},
    u_scroll: {type: 'f', value: 0.0}
    ,u_texture: {type: 't', value: colors}
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const cursor = {}
cursor.x = 0
cursor.y = 0
window.addEventListener('mousemove', function(e) {
    uniforms.u_mouse.value.set(e.screenX / this.window.innerWidth, 1 - e.screenY / this.window.innerHeight)
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

// window.addEventListener('scroll', () =>
// {
//     scrollY = window.scrollY
//     console.log(scrollY)
// })
let perc;
document.getScroll = function() {
    if (window.pageYOffset != undefined) {
        return [pageXOffset, pageYOffset];
    } else {
        var sy, d = document,
            r = d.documentElement,
            b = d.body;
        // sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sy];
    }
}

const geom = new THREE.BoxGeometry(2,.5,2, 100,100,100)
// const mat = new THREE.MeshPhysic,alMaterial({
//     roughness: 0,
//     transmission:1,
//     thickness: 0.2,
// })

const mat = new THREE.ShaderMaterial({
    wireframe:true,
    vertexShader: vs,
    fragmentShader: fs,
    uniforms,
})
const mesh = new THREE.Mesh(geom, mat);
scene.add(mesh);
mesh.position.set(0,0,.5);
// mesh.rotateZ(-2)



const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
let elapsed;
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    uniforms.u_time.value = clock.getElapsedTime() * .25;
    uniforms.u_scroll.value = scrollY * sizes.height / 100000;
    renderer.render(scene, camera);
}

animate()