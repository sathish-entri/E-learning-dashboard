import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ─── Scene & Camera Setup ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    // ─── Renderer Setup ────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // ─── Create Floating Particle Network (Digital Globe) ───────────────────────
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#6366f1"); // Primary Indigo
    const color2 = new THREE.Color("#06b6d4"); // Secondary Cyan

    for (let i = 0; i < particleCount; i++) {
      // Generate spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.5 + Math.random() * 0.5; // radius with variation

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Blend colors randomly between Indigo and Cyan
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const pMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Add extra orbit ring particles
    const ringCount = 400;
    const ringGeometry = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringCount * 3);
    const ringColors = new Float32Array(ringCount * 3);

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const r = 4.8 + (Math.random() - 0.5) * 0.2;
      ringPos[i * 3] = Math.cos(angle) * r;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.3; // thin plane
      ringPos[i * 3 + 2] = Math.sin(angle) * r;

      const c = new THREE.Color("#f59e0b"); // Gold accents
      ringColors[i * 3] = c.r;
      ringColors[i * 3 + 1] = c.g;
      ringColors[i * 3 + 2] = c.b;
    }

    ringGeometry.setAttribute("position", new THREE.BufferAttribute(ringPos, 3));
    ringGeometry.setAttribute("color", new THREE.BufferAttribute(ringColors, 3));

    const ringMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const ring = new THREE.Points(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 6;
    scene.add(ring);

    // ─── Mouse Interactions (Parallax) ─────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 100;
      mouseY = (event.clientY - window.innerHeight / 2) / 100;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ─── Animation Loop ────────────────────────────────────────────────────────
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.rotation.y += 0.0015;
      particles.rotation.x += 0.0008;

      ring.rotation.y -= 0.0025;

      // Apply parallax rotation based on mouse
      scene.rotation.y = targetX * 0.15;
      scene.rotation.x = targetY * 0.15;

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      ringGeometry.dispose();
      pMaterial.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.85,
      }}
    />
  );
}
