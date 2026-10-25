import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 1. Procedural Vector Canvas Texture Generators for Indian Wedding Elements
function createKalashTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Pot base (Lota) in auspicious golden brass
  const potGrad = ctx.createLinearGradient(70, 140, 186, 230);
  potGrad.addColorStop(0, '#fef08a');
  potGrad.addColorStop(0.3, '#f59e0b');
  potGrad.addColorStop(0.7, '#d97706');
  potGrad.addColorStop(1, '#92400e');

  // Pot bowl
  ctx.beginPath();
  ctx.moveTo(85, 140);
  ctx.bezierCurveTo(45, 170, 50, 225, 95, 232);
  ctx.lineTo(161, 232);
  ctx.bezierCurveTo(206, 225, 211, 170, 171, 140);
  ctx.closePath();
  ctx.fillStyle = potGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#b45309';
  ctx.stroke();

  // Neck ring
  ctx.beginPath();
  ctx.ellipse(128, 140, 44, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#fde047';
  ctx.fill();
  ctx.stroke();

  // Red sacred thread (Kalava/Mauli) band
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(86, 144, 84, 8);
  ctx.fillStyle = '#fef08a';
  for (let i = 92; i <= 164; i += 12) {
    ctx.beginPath();
    ctx.arc(i, 148, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Auspicious Swastik / Shubh Tilak on pot
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(128, 172);
  ctx.lineTo(128, 204);
  ctx.moveTo(112, 188);
  ctx.lineTo(144, 188);
  ctx.moveTo(128, 172);
  ctx.lineTo(140, 172);
  ctx.moveTo(144, 188);
  ctx.lineTo(144, 200);
  ctx.moveTo(128, 204);
  ctx.lineTo(116, 204);
  ctx.moveTo(112, 188);
  ctx.lineTo(112, 176);
  ctx.stroke();

  // 5 Green Mango Leaves (Aam ke Patte) fanning out
  const leafAngles = [-0.65, -0.32, 0, 0.32, 0.65];
  leafAngles.forEach((ang) => {
    ctx.save();
    ctx.translate(128, 136);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-18, -45, 0, -82);
    ctx.quadraticCurveTo(18, -45, 0, 0);
    const leafGrad = ctx.createLinearGradient(-15, -80, 15, 0);
    leafGrad.addColorStop(0, '#4ade80');
    leafGrad.addColorStop(0.5, '#16a34a');
    leafGrad.addColorStop(1, '#14532d');
    ctx.fillStyle = leafGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#052e16';
    ctx.stroke();
    ctx.restore();
  });

  // Coconut (Shreephal) on top
  ctx.beginPath();
  ctx.ellipse(128, 92, 28, 38, 0, 0, Math.PI * 2);
  const cocoGrad = ctx.createRadialGradient(122, 85, 5, 128, 92, 35);
  cocoGrad.addColorStop(0, '#b45309');
  cocoGrad.addColorStop(0.6, '#78350f');
  cocoGrad.addColorStop(1, '#451a03');
  ctx.fillStyle = cocoGrad;
  ctx.fill();

  // Red Tilak on Coconut
  ctx.beginPath();
  ctx.arc(128, 86, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

function createDiyaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Clay Diya Base
  ctx.beginPath();
  ctx.moveTo(35, 160);
  ctx.bezierCurveTo(45, 225, 211, 225, 221, 160);
  ctx.bezierCurveTo(180, 175, 76, 175, 35, 160);
  ctx.closePath();

  const diyaGrad = ctx.createLinearGradient(35, 160, 221, 220);
  diyaGrad.addColorStop(0, '#f97316');
  diyaGrad.addColorStop(0.3, '#dc2626');
  diyaGrad.addColorStop(0.7, '#991b1b');
  diyaGrad.addColorStop(1, '#450a0a');
  ctx.fillStyle = diyaGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#fbbf24';
  ctx.stroke();

  // Decorative Golden Dot Patterns on Diya Rim
  ctx.fillStyle = '#fef08a';
  for (let i = 50; i <= 206; i += 14) {
    ctx.beginPath();
    const y = 172 + Math.sin(((i - 50) / 156) * Math.PI) * 22;
    ctx.arc(i, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Radiating Golden Aura around flame
  const auraGrad = ctx.createRadialGradient(128, 105, 5, 128, 105, 70);
  auraGrad.addColorStop(0, 'rgba(255, 240, 150, 0.95)');
  auraGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.7)');
  auraGrad.addColorStop(0.65, 'rgba(239, 68, 68, 0.25)');
  auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(128, 105, 70, 0, Math.PI * 2);
  ctx.fill();

  // Vibrant Teardrop Flame (Jyoti)
  ctx.beginPath();
  ctx.moveTo(128, 42);
  ctx.bezierCurveTo(156, 92, 154, 150, 128, 162);
  ctx.bezierCurveTo(102, 150, 100, 92, 128, 42);
  ctx.closePath();

  const flameGrad = ctx.createLinearGradient(128, 42, 128, 162);
  flameGrad.addColorStop(0, '#ffffff');
  flameGrad.addColorStop(0.25, '#fef08a');
  flameGrad.addColorStop(0.6, '#f59e0b');
  flameGrad.addColorStop(0.9, '#ea580c');
  flameGrad.addColorStop(1, '#b91c1c');
  ctx.fillStyle = flameGrad;
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

function createMandapDrapeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 260;
  const ctx = canvas.getContext('2d');

  // Top Beam (Mandap Roof bar)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(20, 20, 260, 16);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 260, 16);

  // Left & Right Royal Red Curtains
  const drawCurtain = (isLeft) => {
    ctx.save();
    if (!isLeft) {
      ctx.translate(300, 0);
      ctx.scale(-1, 1);
    }
    ctx.beginPath();
    ctx.moveTo(35, 36);
    ctx.lineTo(110, 36);
    ctx.bezierCurveTo(95, 120, 60, 150, 50, 230);
    ctx.lineTo(25, 230);
    ctx.bezierCurveTo(35, 150, 30, 90, 35, 36);
    ctx.closePath();

    const drapeGrad = ctx.createLinearGradient(30, 36, 110, 230);
    drapeGrad.addColorStop(0, '#dc2626');
    drapeGrad.addColorStop(0.5, '#b91c1c');
    drapeGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = drapeGrad;
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Gold Curtain Tie & Tassel
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(36, 145, 32, 8);
    ctx.beginPath();
    ctx.moveTo(52, 153);
    ctx.lineTo(44, 185);
    ctx.lineTo(60, 185);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawCurtain(true);
  drawCurtain(false);

  // Center Scalloped Valance / Arch
  ctx.beginPath();
  ctx.moveTo(90, 36);
  ctx.quadraticCurveTo(150, 85, 210, 36);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#b91c1c';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(90, 42);
  ctx.quadraticCurveTo(150, 91, 210, 42);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#fbbf24';
  ctx.stroke();

  // Central Hanging Chandelier / Bell
  ctx.beginPath();
  ctx.arc(150, 95, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

function createGarlandTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');

  // Auspicious Marigold Garland swag curve
  const flowerCount = 13;
  for (let i = 0; i < flowerCount; i++) {
    const t = i / (flowerCount - 1);
    const x = 30 + t * 260;
    const y = 30 + Math.sin(t * Math.PI) * 90;

    // Green leaf behind every 2nd flower
    if (i % 2 === 1) {
      ctx.beginPath();
      ctx.ellipse(x, y + 10, 6, 14, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#16a34a';
      ctx.fill();
    }

    // Marigold Blossom (alternating saffron orange & yellow)
    const isOrange = i % 2 === 0;
    const radius = 13;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = isOrange ? '#ea580c' : '#facc15';
    ctx.fill();

    // Blossom petals edge
    ctx.lineWidth = 2;
    ctx.strokeStyle = isOrange ? '#c2410c' : '#eab308';
    ctx.stroke();

    // Center pollen dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#78350f';
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 42;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Warm Ambient & Royal Sapphire + Gold Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 0.9);
    scene.add(ambientLight);

    const goldPoint = new THREE.PointLight(0xffc107, 3.2, 110);
    goldPoint.position.set(22, 22, 25);
    scene.add(goldPoint);

    const sapphirePoint = new THREE.PointLight(0x38bdf8, 2.2, 100);
    sapphirePoint.position.set(-25, -15, 20);
    scene.add(sapphirePoint);

    // 2. Texture Instances
    const kalashTex = createKalashTexture();
    const diyaTex = createDiyaTexture();
    const mandapTex = createMandapDrapeTexture();
    const garlandTex = createGarlandTexture();

    // 3. Floating Indian Wedding Vector Elements
    const elements = [];

    // Helper to spawn 3D vector sprite planes
    const addElement = (texture, width, height, x, y, z, swaySpeed, swayAmp, rotSpeed = 0.005) => {
      const geo = new THREE.PlaneGeometry(width, height);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);

      elements.push({
        mesh,
        basePos: { x, y, z },
        swaySpeed,
        swayAmp,
        rotSpeed,
        phase: Math.random() * Math.PI * 2,
      });
      return mesh;
    };

    // A. Auspicious Shubh Kalash Motifs (Floating at corners and margins)
    addElement(kalashTex, 7.5, 7.5, -28, 14, -18, 0.7, 1.2, 0.004);
    addElement(kalashTex, 8.0, 8.0, 28, -12, -16, 0.65, 1.4, -0.004);
    addElement(kalashTex, 6.5, 6.5, -24, -22, -22, 0.8, 1.0, 0.003);

    // B. Traditional Glowing Diyas with Point Lights
    const diyaPoints = [];
    const diyaConfigs = [
      { x: -18, y: 8, z: -10, scale: 7.2 },
      { x: 22, y: 16, z: -12, scale: 7.5 },
      { x: -26, y: -8, z: -14, scale: 6.8 },
      { x: 20, y: -24, z: -15, scale: 7.0 },
    ];

    diyaConfigs.forEach((cfg) => {
      const mesh = addElement(diyaTex, cfg.scale, cfg.scale, cfg.x, cfg.y, cfg.z, 0.9, 0.9, 0.002);
      const pLight = new THREE.PointLight(0xf59e0b, 1.8, 35);
      pLight.position.copy(mesh.position);
      scene.add(pLight);
      diyaPoints.push({ mesh, pLight });
    });

    // C. Royal Mandap Drapery Canopies (Top framing margins)
    addElement(mandapTex, 15, 13, -24, 26, -24, 0.5, 0.8, 0.001);
    addElement(mandapTex, 15, 13, 24, 26, -24, 0.48, 0.8, -0.001);

    // D. Festive Marigold Garlands (Toran Swags)
    addElement(garlandTex, 16, 9, 0, 24, -20, 0.6, 0.7, 0.002);
    addElement(garlandTex, 14, 8, -22, 2, -22, 0.55, 1.0, 0.003);
    addElement(garlandTex, 14, 8, 22, -4, -22, 0.52, 1.0, -0.003);

    // 4. Sacred 3D Golden Armillary Mandala Rings
    const mandalaGroup = new THREE.Group();
    mandalaGroup.position.set(0, 0, -14);
    scene.add(mandalaGroup);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdfb743,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x3d2b06,
      emissiveIntensity: 0.35,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(17, 0.26, 16, 120), goldMat);
    mandalaGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(13, 0.22, 16, 100), goldMat);
    ring2.rotation.x = Math.PI / 3;
    mandalaGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(9.5, 0.2, 16, 80), goldMat);
    ring3.rotation.y = Math.PI / 4;
    mandalaGroup.add(ring3);

    // Central Sacred Star
    const centralStar = new THREE.Mesh(
      new THREE.OctahedronGeometry(3.6, 0),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.85,
        roughness: 0.2,
        wireframe: true,
        emissive: 0xd97706,
        emissiveIntensity: 0.45,
      })
    );
    mandalaGroup.add(centralStar);

    // 5. 3D Tumbling Flower Petals (Pushpa Vrishti)
    const petalCount = 70;
    const petals = [];
    const petalGeo = new THREE.PlaneGeometry(1.6, 2.4, 5, 5);

    const pos = petalGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      pos.setZ(i, Math.sin((vx / 1.6) * Math.PI) * 0.45 + Math.cos((vy / 2.4) * Math.PI) * 0.25);
    }
    petalGeo.computeVertexNormals();

    const marigoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.15,
      roughness: 0.45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });

    const roseMat = new THREE.MeshStandardMaterial({
      color: 0xc21d38,
      metalness: 0.2,
      roughness: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    });

    for (let i = 0; i < petalCount; i++) {
      const isGold = Math.random() > 0.4;
      const mesh = new THREE.Mesh(petalGeo, isGold ? marigoldMat : roseMat);
      mesh.position.set(
        (Math.random() - 0.5) * 85,
        (Math.random() - 0.5) * 90,
        (Math.random() - 0.5) * 45
      );
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const scale = 0.75 + Math.random() * 0.6;
      mesh.scale.set(scale, scale, scale);

      petals.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.035,
          y: (Math.random() - 0.5) * 0.04,
          z: (Math.random() - 0.5) * 0.025,
        },
        fallSpeed: Math.random() * 0.05 + 0.025,
        swaySpeed: Math.random() * 0.025 + 0.012,
        swayAmp: Math.random() * 1.5 + 0.8,
        swayOffset: Math.random() * Math.PI * 2,
      });
      scene.add(mesh);
    }

    // 6. Shimmering Golden Stardust Cloud
    const particleCount = 650;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 120;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 65;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64;
    starCanvas.height = 64;
    const sctx = starCanvas.getContext('2d');
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 230, 1)');
    grad.addColorStop(0.3, 'rgba(245, 190, 40, 0.9)');
    grad.addColorStop(0.65, 'rgba(217, 119, 6, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);

    const dustTex = new THREE.CanvasTexture(starCanvas);
    const dustMat = new THREE.PointsMaterial({
      size: 1.5,
      map: dustTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 7. Mouse Movement & Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera parallax
      targetCamX += (mouseX * 5 - targetCamX) * 0.04;
      targetCamY += (mouseY * 3.5 - targetCamY) * 0.04;
      camera.position.x = targetCamX;
      camera.position.y = targetCamY;
      camera.lookAt(0, 0, 0);

      // Animate Vector Elements (Kalash, Diyas, Garlands, Mandap Drapes)
      elements.forEach((el) => {
        el.mesh.position.y = el.basePos.y + Math.sin(elapsed * el.swaySpeed + el.phase) * el.swayAmp;
        el.mesh.position.x = el.basePos.x + Math.cos(elapsed * el.swaySpeed * 0.6 + el.phase) * (el.swayAmp * 0.5);
        el.mesh.rotation.z = Math.sin(elapsed * el.swaySpeed * 0.8 + el.phase) * 0.06;
      });

      // Diya point lights flickering & position tracking
      diyaPoints.forEach((dp, i) => {
        dp.pLight.position.copy(dp.mesh.position);
        dp.pLight.intensity = 1.6 + Math.sin(elapsed * 7 + i) * 0.45;
      });

      // Rotate Celestial Rings
      ring1.rotation.z = elapsed * 0.12;
      ring2.rotation.y = elapsed * 0.15;
      ring3.rotation.x = elapsed * 0.18;
      centralStar.rotation.x = elapsed * 0.25;
      centralStar.rotation.y = elapsed * 0.3;

      const mandalaPulse = 1 + Math.sin(elapsed * 0.8) * 0.04;
      mandalaGroup.scale.set(mandalaPulse, mandalaPulse, mandalaPulse);

      // Tumbling Flower Petals Physics
      petals.forEach((p) => {
        p.mesh.rotation.x += p.rotSpeed.x;
        p.mesh.rotation.y += p.rotSpeed.y;
        p.mesh.rotation.z += p.rotSpeed.z;

        p.mesh.position.y -= p.fallSpeed;
        p.mesh.position.x += Math.sin(elapsed * p.swaySpeed * 10 + p.swayOffset) * 0.04 * p.swayAmp;

        if (p.mesh.position.y < -45) {
          p.mesh.position.y = 48;
          p.mesh.position.x = (Math.random() - 0.5) * 85;
          p.mesh.position.z = (Math.random() - 0.5) * 45;
        }
      });

      // Stardust Galaxy Animation
      const dPos = dustParticles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        dPos[i * 3 + 1] += 0.015;
        dPos[i * 3] += Math.sin(elapsed * 0.5 + i) * 0.008;

        if (dPos[i * 3 + 1] > 60) {
          dPos[i * 3 + 1] = -60;
          dPos[i * 3] = (Math.random() - 0.5) * 120;
        }
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;
      dustParticles.rotation.y = elapsed * 0.012;

      // Orbit Lights
      goldPoint.position.x = Math.sin(elapsed * 0.6) * 30;
      goldPoint.position.y = Math.cos(elapsed * 0.4) * 25;
      sapphirePoint.position.x = Math.cos(elapsed * 0.5) * 28;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      kalashTex.dispose();
      diyaTex.dispose();
      mandapTex.dispose();
      garlandTex.dispose();
      goldMat.dispose();
      petalGeo.dispose();
      marigoldMat.dispose();
      roseMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      dustTex.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="webgl-canvas" />;
}
