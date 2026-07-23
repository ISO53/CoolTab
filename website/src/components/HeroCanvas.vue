<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let renderer = null;
let scene = null;
let camera = null;
let frameId = 0;
let disposed = false;
let floaters = [];
let structures = [];
let beams = [];
let points = null;
let lattice = null;
let grid = null;
let clock = null;
let prefersReducedMotion = false;
let THREE = null;

// Pointer state (NDC + smoothed world target)
let mouse = { x: 0, y: 0, active: false };
let smoothMouse = { x: 0, y: 0 };
let targetCam = { x: 0, y: 0.4 };
let cursorWorld = null;
let raycaster = null;
let hitPlane = null;
let heroEl = null;
let composer = null;
let chromaPass = null;

const INFLUENCE = 2.8;
const REPEL = 0.85;

const ChromaticAberrationShader = {
    uniforms: {
        tDiffuse: { value: null },
        amount: { value: 0.0045 },
        angle: { value: 0.0 },
        mouse: { value: null },
        time: { value: 0.0 },
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform float amount;
        uniform float angle;
        uniform vec2 mouse;
        uniform float time;
        varying vec2 vUv;

        void main() {
            vec2 center = vec2(0.5);
            vec2 fromCenter = vUv - center;
            float dist = length(fromCenter);

            // Stronger fringe toward edges + mild mouse boost
            float mouseDist = length(vUv - (mouse * 0.5 + 0.5));
            float mouseBoost = 1.0 + (1.0 - smoothstep(0.0, 0.55, mouseDist)) * 0.85;
            float strength = amount * (0.35 + dist * 1.8) * mouseBoost;

            // Rotating spectral direction for rainbow feel
            float a = angle + time * 0.15;
            vec2 dir = normalize(fromCenter + 0.0001);
            vec2 rOff = dir * strength;
            vec2 gOff = vec2(
                cos(a + 2.094) * strength * 0.65,
                sin(a + 2.094) * strength * 0.65
            );
            vec2 bOff = -dir * strength * 1.05;

            // Extra spectral samples (cyan / magenta fringing)
            float r = texture2D(tDiffuse, vUv + rOff).r;
            float g = texture2D(tDiffuse, vUv + gOff).g;
            float b = texture2D(tDiffuse, vUv + bOff).b;

            float r2 = texture2D(tDiffuse, vUv + rOff * 1.35).r;
            float b2 = texture2D(tDiffuse, vUv + bOff * 1.35).b;

            vec3 color = vec3(
                mix(r, r2, 0.35),
                g,
                mix(b, b2, 0.35)
            );

            // Subtle prismatic tint on high-contrast edges
            float edge = abs(r - b) + abs(g - r);
            color += vec3(0.12, 0.04, 0.18) * edge * strength * 18.0;
            color += vec3(0.02, 0.1, 0.14) * edge * strength * 10.0;

            float alpha = texture2D(tDiffuse, vUv).a;
            gl_FragColor = vec4(color, alpha);
        }
    `,
};

function createRenderer(canvas) {
    // WebGL required for EffectComposer chromatic pass
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
    });
    gl.setClearColor(0x0a0a0b, 0);
    gl.autoClear = true;
    return gl;
}

async function setupComposer() {
    const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
    const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js');

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    chromaPass = new ShaderPass(ChromaticAberrationShader);
    chromaPass.uniforms.mouse.value = new THREE.Vector2(0, 0);
    composer.addPass(chromaPass);
}

function lineMat(opacity = 0.45) {
    return new THREE.LineBasicMaterial({
        color: 0xf2f2f0,
        transparent: true,
        opacity,
    });
}

function fillMat(opacity = 0.06) {
    return new THREE.MeshBasicMaterial({
        color: 0xf2f2f0,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
}

function addPanel(w, h, d, x, y, z, rx, ry, opts = {}) {
    const group = new THREE.Group();
    const geo = new THREE.BoxGeometry(w, h, d);
    const materials = [];

    if (opts.fill !== false) {
        const fill = fillMat(opts.fillOpacity ?? 0.05);
        materials.push({ mat: fill, base: opts.fillOpacity ?? 0.05, kind: 'fill' });
        group.add(new THREE.Mesh(geo, fill));
    }

    const edgeMat = lineMat(opts.lineOpacity ?? 0.55);
    materials.push({ mat: edgeMat, base: opts.lineOpacity ?? 0.55, kind: 'line' });
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));

    if (opts.detail) {
        const detail = new THREE.BufferGeometry();
        const hw = w * 0.35;
        const hh = h * 0.35;
        detail.setAttribute('position', new THREE.Float32BufferAttribute([
            -hw, 0, d / 2 + 0.01, hw, 0, d / 2 + 0.01,
            0, -hh, d / 2 + 0.01, 0, hh, d / 2 + 0.01,
        ], 3));
        const dMat = lineMat(0.25);
        materials.push({ mat: dMat, base: 0.25, kind: 'line' });
        group.add(new THREE.LineSegments(detail, dMat));
    }

    group.position.set(x, y, z);
    group.rotation.set(rx, ry, 0);
    group.userData = {
        baseY: y,
        baseX: x,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.55,
        amp: 0.12 + Math.random() * 0.22,
        spin: (Math.random() - 0.5) * 0.004,
        materials,
        offsetX: 0,
        offsetY: 0,
        offsetZ: 0,
        heat: 0,
    };
    scene.add(group);
    floaters.push(group);
}

function addBeam(x, z, height = 4) {
    const geo = new THREE.PlaneGeometry(0.04, height);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    const beam = new THREE.Mesh(geo, mat);
    beam.position.set(x, height / 2 - 1.2, z);
    beam.userData = {
        phase: Math.random() * Math.PI * 2,
        baseOpacity: 0.08 + Math.random() * 0.12,
        baseX: x,
        baseZ: z,
    };
    scene.add(beam);
    beams.push(beam);
}

function buildLattice() {
    const group = new THREE.Group();
    const size = 5;
    const step = 1.0;
    const positions = [];

    for (let x = -size; x <= size; x += step) {
        for (let y = -2; y <= 3; y += step) {
            for (let z = -3; z <= 2; z += step) {
                const onFace = Math.abs(x) === size || Math.abs(y + 0.5) > 2.4 || Math.abs(z) > 2.4;
                if (!onFace && Math.random() > 0.08) continue;
                if (x < size) positions.push(x, y, z, x + step, y, z);
                if (y < 3) positions.push(x, y, z, x, y + step, z);
                if (z < 2) positions.push(x, y, z, x, y, z + step);
            }
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    group.add(new THREE.LineSegments(geo, lineMat(0.12)));
    group.position.set(0, -0.3, -2.5);
    group.rotation.y = 0.35;
    scene.add(group);
    lattice = group;
}

function buildScene() {
    cursorWorld = new THREE.Vector3(0, 0.3, 0.4);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
    camera.position.set(0, 0.55, 6.8);
    camera.lookAt(0, 0.2, 0);

    raycaster = new THREE.Raycaster();
    hitPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.3);

    const gridHelper = new THREE.GridHelper(24, 48, 0xffffff, 0xffffff);
    const gridMats = Array.isArray(gridHelper.material) ? gridHelper.material : [gridHelper.material];
    gridMats.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.14;
    });
    gridHelper.position.y = -1.6;
    scene.add(gridHelper);
    grid = gridHelper;

    const grid2 = new THREE.GridHelper(16, 32, 0xffffff, 0xffffff);
    const g2mats = Array.isArray(grid2.material) ? grid2.material : [grid2.material];
    g2mats.forEach((m) => { m.transparent = true; m.opacity = 0.07; });
    grid2.rotation.x = Math.PI / 2.6;
    grid2.position.set(0, 0.8, -4);
    scene.add(grid2);
    structures.push(grid2);

    const frameGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(9, 5.2, 0.01));
    const frame = new THREE.LineSegments(frameGeo, lineMat(0.35));
    frame.position.set(0, 0.4, -3.2);
    scene.add(frame);
    structures.push(frame);

    const braceGeo = new THREE.BufferGeometry();
    braceGeo.setAttribute('position', new THREE.Float32BufferAttribute([
        -4.5, -2.2, -3.1, 4.5, 3.0, -3.1,
        4.5, -2.2, -3.1, -4.5, 3.0, -3.1,
        -4.5, 0.4, -3.1, 4.5, 0.4, -3.1,
        0, -2.2, -3.1, 0, 3.0, -3.1,
    ], 3));
    scene.add(new THREE.LineSegments(braceGeo, lineMat(0.18)));

    buildLattice();

    const layouts = [
        [1.8, 1.15, 0.06, -2.4, 1.1, 0.2, -0.25, 0.45],
        [1.2, 1.2, 0.06, -0.3, 1.55, -0.6, -0.3, -0.15],
        [0.95, 1.6, 0.06, 2.0, 0.9, 0.1, -0.2, -0.55],
        [1.45, 0.85, 0.06, -1.5, -0.15, 0.9, 0.12, 0.25],
        [1.1, 0.7, 0.06, 0.6, -0.45, 1.1, 0.18, -0.2],
        [0.75, 0.75, 0.06, 2.3, -0.55, 0.7, 0.1, -0.4],
        [0.9, 1.1, 0.06, -2.6, -0.7, 0.4, 0.08, 0.55],
        [2.2, 0.55, 0.05, 0.1, 0.35, -1.4, -0.1, 0.05],
        [0.65, 0.65, 0.05, 1.4, 1.7, -1.0, -0.35, -0.3],
        [1.0, 0.5, 0.05, -1.0, 1.9, -1.2, -0.28, 0.2],
        [0.55, 1.4, 0.05, 2.8, 0.2, -0.8, -0.15, -0.65],
        [1.3, 0.9, 0.05, -2.9, 0.5, -1.0, -0.2, 0.6],
    ];

    layouts.forEach((cfg, i) => {
        addPanel(...cfg, { detail: i % 2 === 0, fillOpacity: 0.04 + (i % 3) * 0.015, lineOpacity: 0.5 });
    });

    for (let i = 0; i < 14; i++) {
        addBeam((Math.random() - 0.5) * 8, -1.5 - Math.random() * 3, 3 + Math.random() * 3);
    }

    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    points = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
            color: 0xf2f2f0,
            size: 0.028,
            transparent: true,
            opacity: 0.55,
            sizeAttenuation: true,
        })
    );
    scene.add(points);

    const linePositions = [];
    for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < Math.min(i + 12, count); j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 1.4) {
                linePositions.push(
                    positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                    positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                );
            }
        }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    scene.add(new THREE.LineSegments(lGeo, lineMat(0.1)));

    const ico = new THREE.IcosahedronGeometry(1.8, 1);
    const icoMesh = new THREE.LineSegments(new THREE.EdgesGeometry(ico), lineMat(0.28));
    icoMesh.position.set(0, 0.3, -1.8);
    scene.add(icoMesh);
    structures.push(icoMesh);

    const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.4, 2.48, 128),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.22,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
    );
    ring.rotation.x = Math.PI / 2.5;
    ring.position.set(0, -0.4, -1.2);
    scene.add(ring);
    structures.push(ring);

    const ring2 = ring.clone();
    ring2.scale.set(1.35, 1.35, 1.35);
    ring2.material = ring.material.clone();
    ring2.material.opacity = 0.1;
    ring2.rotation.x = Math.PI / 2.8;
    scene.add(ring2);
    structures.push(ring2);
}

function updatePointerFromEvent(e) {
    if (!heroEl) return;
    const rect = heroEl.getBoundingClientRect();
    const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    mouse.active = inside;
    if (!inside) return;

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
}

function onPointerMove(e) {
    updatePointerFromEvent(e);
}

function onPointerLeave() {
    mouse.active = false;
}

function projectCursor() {
    if (!raycaster || !camera || !hitPlane || !cursorWorld) return;

    raycaster.setFromCamera(new THREE.Vector2(smoothMouse.x, smoothMouse.y), camera);
    const hit = new THREE.Vector3();
    const ok = raycaster.ray.intersectPlane(hitPlane, hit);
    if (ok) {
        cursorWorld.copy(hit);
        // Keep cursor in a sensible play volume
        cursorWorld.x = THREE.MathUtils.clamp(cursorWorld.x, -4.5, 4.5);
        cursorWorld.y = THREE.MathUtils.clamp(cursorWorld.y, -1.8, 2.6);
        cursorWorld.z = THREE.MathUtils.clamp(cursorWorld.z, -1.2, 1.6);
    }
}

function resize() {
    if (!renderer || !camera || !canvasRef.value) return;
    const parent = canvasRef.value.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    if (composer) {
        composer.setPixelRatio(dpr);
        composer.setSize(w, h);
    }
}

function animate() {
    if (disposed) return;
    frameId = requestAnimationFrame(animate);
    if (!renderer || !scene || !camera) return;

    const t = clock.getElapsedTime();

    // Smooth mouse
    const lerp = mouse.active ? 0.12 : 0.04;
    smoothMouse.x += (mouse.x - smoothMouse.x) * lerp;
    smoothMouse.y += (mouse.y - smoothMouse.y) * lerp;

    if (!prefersReducedMotion) {
        projectCursor();

        floaters.forEach((m) => {
            const u = m.userData;

            // Idle drift target
            let tx = u.baseX + Math.cos(t * u.speed * 0.6 + u.phase) * u.amp * 0.35;
            let ty = u.baseY + Math.sin(t * u.speed + u.phase) * u.amp;
            let tz = u.baseZ;

            // Mouse repulsion + heat
            let heatTarget = 0;
            if (mouse.active && cursorWorld) {
                const dx = m.position.x - cursorWorld.x;
                const dy = m.position.y - cursorWorld.y;
                const dz = (m.position.z - cursorWorld.z) * 0.6;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;

                if (dist < INFLUENCE) {
                    const falloff = 1 - dist / INFLUENCE;
                    const force = falloff * falloff * REPEL;
                    const inv = 1 / dist;
                    u.offsetX += dx * inv * force * 0.35;
                    u.offsetY += dy * inv * force * 0.35;
                    u.offsetZ += dz * inv * force * 0.2;
                    heatTarget = falloff;
                }
            }

            // Spring offsets back
            u.offsetX *= 0.88;
            u.offsetY *= 0.88;
            u.offsetZ *= 0.88;
            u.heat += (heatTarget - u.heat) * 0.18;

            m.position.x = tx + u.offsetX;
            m.position.y = ty + u.offsetY;
            m.position.z = tz + u.offsetZ;

            m.rotation.y += u.spin + u.heat * 0.01;
            m.rotation.x += u.spin * 0.4 + u.heat * 0.006;

            // Lit-up materials near cursor
            u.materials.forEach(({ mat, base, kind }) => {
                const boost = kind === 'line' ? u.heat * 0.55 : u.heat * 0.22;
                const target = Math.min(1, base + boost);
                mat.opacity += (target - mat.opacity) * 0.2;
            });

            // Slight scale punch when hot
            const s = 1 + u.heat * 0.08;
            m.scale.setScalar(s);
        });

        beams.forEach((b) => {
            let opacity = b.userData.baseOpacity + Math.sin(t * 1.4 + b.userData.phase) * 0.06;
            if (mouse.active && cursorWorld) {
                const dx = b.position.x - cursorWorld.x;
                const dist = Math.abs(dx);
                if (dist < 2.2) {
                    opacity += (1 - dist / 2.2) * 0.2;
                }
            }
            b.material.opacity = opacity;
        });

        if (points) {
            points.rotation.y = t * 0.05 + smoothMouse.x * 0.15;
            points.rotation.x = Math.sin(t * 0.1) * 0.08 + smoothMouse.y * 0.08;
            points.material.opacity = 0.45 + (mouse.active ? 0.2 : 0);
        }
        if (lattice) {
            lattice.rotation.y = 0.35 + t * 0.03 + smoothMouse.x * 0.12;
            lattice.rotation.x = Math.sin(t * 0.08) * 0.05 + smoothMouse.y * 0.06;
        }
        if (grid) {
            grid.position.z = ((t * 0.35) % 1) * (24 / 48);
        }
        structures.forEach((s, i) => {
            if (s.isLineSegments || s.type === 'LineSegments') {
                s.rotation.y += 0.0015 * (i % 2 === 0 ? 1 : -1);
                s.rotation.z = Math.sin(t * 0.15 + i) * 0.04;
            } else if (s.isMesh) {
                s.rotation.z = t * 0.08 * (i % 2 === 0 ? 1 : -0.7);
            }
        });

        targetCam.x += (smoothMouse.x * 0.7 - targetCam.x) * 0.06;
        targetCam.y += (-smoothMouse.y * 0.35 + 0.45 - targetCam.y) * 0.06;
        camera.position.x = targetCam.x + Math.sin(t * 0.12) * 0.1;
        camera.position.y = targetCam.y;
        camera.lookAt(smoothMouse.x * 0.35, 0.15 + smoothMouse.y * 0.15, -0.5);
    }

    if (chromaPass) {
        const base = prefersReducedMotion ? 0.0015 : 0.0055;
        const activeBoost = mouse.active ? 0.0025 : 0;
        chromaPass.uniforms.amount.value = base + activeBoost;
        chromaPass.uniforms.angle.value = t * 0.4;
        chromaPass.uniforms.time.value = t;
        chromaPass.uniforms.mouse.value.set(smoothMouse.x, smoothMouse.y);
    }

    if (composer) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

onMounted(async () => {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.value;
    if (!canvas) return;

    heroEl = canvas.closest('.hero') || canvas.parentElement;

    THREE = await import('three');
    if (disposed) return;

    renderer = createRenderer(canvas);
    if (disposed) {
        renderer.dispose();
        return;
    }
    clock = new THREE.Clock();
    buildScene();
    await setupComposer();
    if (disposed) return;
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    if (heroEl) {
        heroEl.addEventListener('pointerleave', onPointerLeave);
    }
    animate();
});

onUnmounted(() => {
    disposed = true;
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    if (heroEl) heroEl.removeEventListener('pointerleave', onPointerLeave);
    floaters = [];
    structures = [];
    beams = [];
    if (composer) {
        composer.dispose();
        composer = null;
    }
    chromaPass = null;
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
    scene = null;
    camera = null;
});
</script>

<template>
    <canvas ref="canvasRef" class="hero-canvas" aria-hidden="true"></canvas>
</template>

<style scoped>
.hero-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    z-index: 0;
    opacity: 1;
}
</style>
