/* ============================================
   THREE.JS — Gold Particles & Wedding Rings
   ============================================ */

(function () {
    'use strict';

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // ─── SETUP ───
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ─── RESPONSIVE PARTICLE COUNT ───
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 250 : 700;

    // ─── GOLD PARTICLE SYSTEM ───
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const opacities = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // Spread particles in a wide sphere
        positions[i3]     = (Math.random() - 0.5) * 60;
        positions[i3 + 1] = (Math.random() - 0.5) * 40;
        positions[i3 + 2] = (Math.random() - 0.5) * 30;

        // Gentle random velocities
        velocities[i3]     = (Math.random() - 0.5) * 0.005;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.005 + 0.002; // slight upward drift
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.003;

        // Random sizes
        sizes[i] = Math.random() * 2.5 + 0.5;

        // Random initial opacities for twinkling
        opacities[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    // Custom shader for gold particles with glow
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouseX: { value: 0 },
            uMouseY: { value: 0 },
            uColor1: { value: new THREE.Color(0xc9a84c) },
            uColor2: { value: new THREE.Color(0xe8d48b) },
            uPixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute float aSize;
            uniform float uTime;
            uniform float uPixelRatio;
            uniform float uMouseX;
            uniform float uMouseY;
            varying float vAlpha;

            void main() {
                vec3 pos = position;

                // Gentle floating motion
                pos.x += sin(uTime * 0.3 + position.y * 0.5) * 0.3;
                pos.y += cos(uTime * 0.2 + position.x * 0.3) * 0.4;
                pos.z += sin(uTime * 0.15 + position.z * 0.4) * 0.2;

                // Mouse influence (subtle push)
                float mouseDistX = pos.x - uMouseX * 15.0;
                float mouseDistY = pos.y - uMouseY * 10.0;
                float mouseDist = sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);
                float mouseInfluence = smoothstep(12.0, 0.0, mouseDist) * 1.5;
                pos.x += mouseDistX * mouseInfluence * 0.02;
                pos.y += mouseDistY * mouseInfluence * 0.02;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

                gl_PointSize = aSize * uPixelRatio * (80.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;

                // Alpha based on distance and twinkling
                float twinkle = sin(uTime * 2.0 + position.x * 5.0 + position.y * 3.0) * 0.3 + 0.7;
                vAlpha = twinkle * smoothstep(30.0, 5.0, -mvPosition.z);
            }
        `,
        fragmentShader: `
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform float uTime;
            varying float vAlpha;

            void main() {
                // Circular particle with soft edge
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;

                float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
                alpha *= vAlpha;

                // Color variation
                vec3 color = mix(uColor1, uColor2, sin(uTime + gl_PointCoord.x * 3.14) * 0.5 + 0.5);

                // Glow effect
                float glow = exp(-dist * 4.0) * 0.5;
                color += vec3(glow) * 0.3;

                gl_FragColor = vec4(color, alpha * 0.6);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);

    // ─── WEDDING RINGS (Interlocking Torus) ───
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xc9a84c,
        metalness: 0.95,
        roughness: 0.05,
        emissive: 0x3d2e10,
        emissiveIntensity: 0.3
    });

    const ringGeometry = new THREE.TorusGeometry(3, 0.15, 32, 100);

    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.position.set(8, 0, 0);
    ring1.rotation.x = Math.PI * 0.4;
    ring1.rotation.z = Math.PI * 0.1;
    scene.add(ring1);

    const ring2Material = new THREE.MeshStandardMaterial({
        color: 0xe8d48b,
        metalness: 0.9,
        roughness: 0.08,
        emissive: 0x3d2e10,
        emissiveIntensity: 0.2
    });

    const ring2 = new THREE.Mesh(ringGeometry, ring2Material);
    ring2.position.set(10.5, 0.5, 0.5);
    ring2.rotation.x = Math.PI * 0.5;
    ring2.rotation.y = Math.PI * 0.3;
    scene.add(ring2);

    // Ring group for easier manipulation
    const ringGroup = new THREE.Group();
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    scene.add(ringGroup);

    // Position rings to the right
    ringGroup.position.set(isMobile ? 0 : 6, 1, -5);
    ringGroup.scale.setScalar(isMobile ? 0.7 : 1);

    // ─── FLOATING DIAMOND PARTICLES around rings ───
    const diamondCount = isMobile ? 15 : 30;
    const diamondGeo = new THREE.OctahedronGeometry(0.08, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
        color: 0xe8d48b,
        metalness: 1,
        roughness: 0,
        emissive: 0xc9a84c,
        emissiveIntensity: 0.5
    });

    const diamonds = [];
    for (let i = 0; i < diamondCount; i++) {
        const diamond = new THREE.Mesh(diamondGeo, diamondMat);
        const angle = (i / diamondCount) * Math.PI * 2;
        const radius = 4 + Math.random() * 2;
        diamond.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 3,
            Math.sin(angle) * radius
        );
        diamond.userData = {
            angle,
            radius,
            speed: 0.001 + Math.random() * 0.002,
            yOffset: (Math.random() - 0.5) * 3
        };
        ringGroup.add(diamond);
        diamonds.push(diamond);
    }

    // ─── LIGHTING ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc9a84c, 2, 50);
    pointLight1.position.set(10, 5, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xe8d48b, 1.5, 40);
    pointLight2.position.set(-5, -5, 8);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 0.5, 30);
    pointLight3.position.set(0, 10, -5);
    scene.add(pointLight3);

    // ─── MOUSE TRACKING ───
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    document.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // ─── SCROLL TRACKING ───
    let scrollY = 0;
    let scrollProgress = 0;

    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
        scrollProgress = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    });

    // ─── ANIMATION LOOP ───
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Smooth mouse following
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Update particle uniforms
        particleMaterial.uniforms.uTime.value = elapsed;
        particleMaterial.uniforms.uMouseX.value = mouse.x;
        particleMaterial.uniforms.uMouseY.value = mouse.y;

        // Rotate entire particle system slowly
        particleSystem.rotation.y = elapsed * 0.02;
        particleSystem.rotation.x = Math.sin(elapsed * 0.01) * 0.1;

        // Animate rings
        ring1.rotation.y = elapsed * 0.3;
        ring1.rotation.z = Math.sin(elapsed * 0.2) * 0.3 + Math.PI * 0.1;

        ring2.rotation.y = elapsed * 0.25 + Math.PI;
        ring2.rotation.x = Math.cos(elapsed * 0.15) * 0.2 + Math.PI * 0.5;

        // Float the ring group
        ringGroup.position.y = Math.sin(elapsed * 0.5) * 0.8 + 1;
        ringGroup.rotation.y = elapsed * 0.1;

        // Mouse parallax on ring group
        ringGroup.position.x = (isMobile ? 0 : 6) + mouse.x * 2;
        ringGroup.position.y = Math.sin(elapsed * 0.5) * 0.8 + 1 + mouse.y * 1;

        // Animate diamonds
        diamonds.forEach((diamond, i) => {
            const d = diamond.userData;
            d.angle += d.speed;
            diamond.position.x = Math.cos(d.angle) * d.radius;
            diamond.position.z = Math.sin(d.angle) * d.radius;
            diamond.position.y = d.yOffset + Math.sin(elapsed * 0.8 + i) * 0.5;
            diamond.rotation.x = elapsed * 2;
            diamond.rotation.y = elapsed * 1.5;
        });

        // Scroll-based effects: fade particles and move camera
        const scrollFade = Math.max(0, 1 - scrollProgress * 3);
        particleMaterial.uniforms.uMouseX.value = mouse.x;
        particleSystem.material.opacity = scrollFade;
        ringGroup.scale.setScalar((isMobile ? 0.7 : 1) * (0.5 + scrollFade * 0.5));

        // Camera subtle movement
        camera.position.x = mouse.x * 1.5;
        camera.position.y = mouse.y * 0.8;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    // ─── RESIZE HANDLER ───
    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        particleMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    });

})();
