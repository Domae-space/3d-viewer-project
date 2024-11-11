import * as THREE from 'three';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);
camera.lookAt(0, 0, 0);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setup video
const video = document.createElement('video');
video.src = 'https://domae-space.github.io/3d-viewer-project/public/videos/domaevideo.mp4';
video.loop = true;
video.muted = true;
video.playsInline = true;

// Add error handling for video loading
video.addEventListener('error', function(e) {
    console.error('Video loading error:', e);
});

video.addEventListener('loadeddata', function() {
    console.log('Video loaded successfully!');
});

video.play().catch(e => console.error('Video play error:', e));

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

// Create retro PC
function createRetroPC() {
    const computer = new THREE.Group();

    // Classic PC colors
    const caseColor = 0xe0dfd5;
    const screenBorder = 0x696969;
    const screenBezel = 0x404040;
    const screen = 0x0078d7;
    const keyboard = 0x404040;
    const keyboardDetail = 0x696969;
    const topRidge = 0x696969;
    const stand = 0xe0dfd5;
    const standBase = 0xe0dfd5;

    // Monitor body
    const monitorBody = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3, 1.5),
        new THREE.MeshPhongMaterial({ color: caseColor })
    );

    // Screen bezel (the inset part around the screen)
    const bezel = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 2.6, 0.1),
        new THREE.MeshPhongMaterial({ color: screenBorder })
    );
    bezel.position.z = 0.7;

    // Screen with video
    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 2.2),
        new THREE.MeshBasicMaterial({ map: videoTexture })
    );
    screen.position.z = 0.76;

    // Monitor details (those classic ridges on the case)
    const topRidge = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.1, 1.5),
        new THREE.MeshPhongMaterial({ color: topRidge })
    );
    topRidge.position.y = 1.5;

    // Monitor stand (that chunky adjustable part)
    const stand = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        new THREE.MeshPhongMaterial({ color: stand })
    );
    stand.position.y = -2;

    // Stand base (wide and stable)
    const standBase = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.3, 1.5),
        new THREE.MeshPhongMaterial({ color: standBase })
    );
    standBase.position.y = -2.75;

    // Keyboard (chunky with high profile keys)
    const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.4, 1.2),
        new THREE.MeshPhongMaterial({ color: keyboard })
    );
    keyboard.position.z = 2;
    keyboard.position.y = -2.9;
    keyboard.rotation.x = -0.1;

    // Add some key details to keyboard
    const keyboardDetail = new THREE.Mesh(
        new THREE.BoxGeometry(3.3, 0.1, 1),
        new THREE.MeshPhongMaterial({ color: keyboardDetail })
    );
    keyboardDetail.position.z = 2;
    keyboardDetail.position.y = -2.7;
    keyboardDetail.rotation.x = -0.1;

    // Add all parts
    computer.add(monitorBody);
    computer.add(bezel);
    computer.add(screen);
    computer.add(topRidge);
    computer.add(stand);
    computer.add(standBase);
    computer.add(keyboard);
    computer.add(keyboardDetail);

    return computer;
}

const computer = createRetroPC();
scene.add(computer);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const frontLight = new THREE.DirectionalLight(0xffffff, 1);
frontLight.position.set(5, 5, 5);
scene.add(frontLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
backLight.position.set(-5, 5, -5);
scene.add(backLight);

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    // Gentle rotation
    computer.rotation.y = Math.sin(Date.now() * 0.001) * 0.15;
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
