import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DashboardThreeWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // ─── Central Core (Glowing Sphere) ─────────────────────────────────────────
    const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#6366f1"),
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Outer glow ring
    const glowGeo = new THREE.SphereGeometry(0.85, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#06b6d4"),
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // ─── Orbiting Ring (Representing Active Learning Cycles) ───────────────────
    const ringCount = 180;
    const ringGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(ringCount * 3);
    const colors = new Float32Array(ringCount * 3);

    const color1 = new THREE.Color("#6366f1");
    const color2 = new THREE.Color("#06b6d4");

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const radius = 1.8 + (Math.random() - 0.5) * 0.15;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const lerped = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = lerped.r;
      colors[i * 3 + 1] = lerped.g;
      colors[i * 3 + 2] = lerped.b;
    }

    ringGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    ringGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const ringMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const orbitRing = new THREE.Points(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 4;
    scene.add(orbitRing);

    // ─── Floating Star Dust Background ──────────────────────────────────────────
    const starCount = 60;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 8;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ─── Mouse Movement ────────────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) / 60;
      mouseY = (e.clientY - rect.top - rect.height / 2) / 60;
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);

    // ─── Animation Loop ────────────────────────────────────────────────────────
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow rotators
      core.rotation.y += 0.005;
      core.rotation.x += 0.002;

      glow.rotation.y -= 0.003;

      orbitRing.rotation.y += 0.012;

      // Mouse interactive parallax
      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;

      scene.rotation.y = targetX * 0.25;
      scene.rotation.x = targetY * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Resize Handler ────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

      window.addEventListener("resize", handleResize);

    // ─── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        if (renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener("resize", handleResize);

      coreGeo.dispose();
      coreMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        cursor: "pointer",
        position: "relative",
      }}
    />
  );
}
