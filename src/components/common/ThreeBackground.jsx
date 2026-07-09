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
    camera.position.z = 15;

    // ─── Renderer Setup ────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // ─── Particle Settings ──────────────────────────────────────────────────────
    const maxParticles = 120;
    const maxDistance = 3.5; // distance at which lines connect
    const particlePositions = new Float32Array(maxParticles * 3);
    const particleData = [];

    // Screen boundaries mapped to 3D space at z=0
    const xLimit = 12;
    const yLimit = 8;

    // Generate random positions & velocities
    for (let i = 0; i < maxParticles; i++) {
      const x = (Math.random() - 0.5) * xLimit * 2;
      const y = (Math.random() - 0.5) * yLimit * 2;
      const z = (Math.random() - 0.5) * 6; // depth

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleData.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.01
        ),
        numConnections: 0,
      });
    }

    // ─── Points (Stars) ────────────────────────────────────────────────────────
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Custom shader material for glowing round points
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x818cf8, // primary-light purple
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(particles);

    // ─── Line Segments (Constellation Connections) ─────────────────────────────
    const lineIndices = [];
    const linePositions = new Float32Array(maxParticles * maxParticles * 3);
    const lineColors = new Float32Array(maxParticles * maxParticles * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1,
    });

    const connections = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(connections);

    // ─── Mouse Interactions (Repulsion/Parallax) ──────────────────────────────
    let mouse = new THREE.Vector2(-999, -999);
    let targetMouse = new THREE.Vector2(-999, -999);

    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetMouse.set(x * xLimit, y * yLimit);
    };

    const handleMouseLeave = () => {
      targetMouse.set(-999, -999);
    };

    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mouseleave", handleMouseLeave);

    // Colors for gradient lines (cyan to indigo)
    const colorCyan = new THREE.Color("#06b6d4");
    const colorIndigo = new THREE.Color("#6366f1");

    // ─── Animation Loop ────────────────────────────────────────────────────────
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const positions = pointsGeometry.attributes.position.array;
      let vertexpos = 0;
      let colorpos = 0;
      let numConnected = 0;

      // Smooth mouse transition
      if (targetMouse.x !== -999) {
        mouse.lerp(targetMouse, 0.08);
      } else {
        mouse.set(-999, -999);
      }

      // Update positions
      for (let i = 0; i < maxParticles; i++) {
        // Apply velocity
        positions[i * 3] += particleData[i].velocity.x;
        positions[i * 3 + 1] += particleData[i].velocity.y;
        positions[i * 3 + 2] += particleData[i].velocity.z;

        // Boundary checks (bounce back)
        if (positions[i * 3] < -xLimit || positions[i * 3] > xLimit) particleData[i].velocity.x *= -1;
        if (positions[i * 3 + 1] < -yLimit || positions[i * 3 + 1] > yLimit) particleData[i].velocity.y *= -1;
        if (positions[i * 3 + 2] < -3 || positions[i * 3 + 2] > 3) particleData[i].velocity.z *= -1;

        // Mouse attraction/repulsion
        if (mouse.x !== -999) {
          const dx = mouse.x - positions[i * 3];
          const dy = mouse.y - positions[i * 3 + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 4) {
            // Push away subtly
            positions[i * 3] -= (dx / dist) * 0.03;
            positions[i * 3 + 1] -= (dy / dist) * 0.03;
          }
        }
      }

      // Find connections & update line buffer
      for (let i = 0; i < maxParticles; i++) {
        for (let j = i + 1; j < maxParticles; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = 1.0 - dist / maxDistance;

            // Line segment endpoint A
            linePositions[vertexpos++] = positions[i * 3];
            linePositions[vertexpos++] = positions[i * 3 + 1];
            linePositions[vertexpos++] = positions[i * 3 + 2];

            // Line segment endpoint B
            linePositions[vertexpos++] = positions[j * 3];
            linePositions[vertexpos++] = positions[j * 3 + 1];
            linePositions[vertexpos++] = positions[j * 3 + 2];

            // Cyan to Indigo gradient based on connection index
            const lerpedColor = colorCyan.clone().lerp(colorIndigo, i / maxParticles);

            lineColors[colorpos++] = lerpedColor.r * alpha;
            lineColors[colorpos++] = lerpedColor.g * alpha;
            lineColors[colorpos++] = lerpedColor.b * alpha;

            lineColors[colorpos++] = lerpedColor.r * alpha;
            lineColors[colorpos++] = lerpedColor.g * alpha;
            lineColors[colorpos++] = lerpedColor.b * alpha;

            numConnected++;
          }
        }
      }

      pointsGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      // Draw only the connected lines
      lineGeometry.setDrawRange(0, numConnected * 2);

      // Rotate camera very slowly for dynamic scene depth
      scene.rotation.y += 0.0004;

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
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave);
        if (renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }

      pointsGeometry.dispose();
      lineGeometry.dispose();
      pointsMaterial.dispose();
      lineMaterial.dispose();
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
        opacity: 0.75,
      }}
    />
  );
}
