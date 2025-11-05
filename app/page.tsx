"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Html, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const LOOP_DURATION = 5;

function TomatoBody() {
  const tomatoRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const eyelidRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() % LOOP_DURATION;

    if (!tomatoRef.current || !mouthRef.current || !leftEyeRef.current || !rightEyeRef.current || !eyelidRef.current) {
      return;
    }

    const chewPhase = Math.max(0, t - 2);
    const chewProgress = Math.min(1, chewPhase / 3);
    const chewWave = Math.sin((chewPhase / 3) * Math.PI * 4) * Math.exp(-chewProgress * 1.1);

    tomatoRef.current.position.y = 0.02 * Math.sin(t * Math.PI * 0.7);
    tomatoRef.current.rotation.z = 0.08 * Math.sin(t * Math.PI * 0.45);

    const laughOpen = t < 2 ? 1 : 1 + Math.max(0, chewWave * 0.6);
    mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 0.8 + laughOpen * 0.5, 0.2);
    mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, 1 + laughOpen * 0.25, 0.2);

    const eyeSmile = 0.15 + chewProgress * 0.18 + Math.max(0, chewWave * 0.1);
    leftEyeRef.current.scale.y = rightEyeRef.current.scale.y = THREE.MathUtils.lerp(
      leftEyeRef.current.scale.y,
      0.9 - eyeSmile,
      0.35
    );
    eyelidRef.current.position.y = THREE.MathUtils.lerp(eyelidRef.current.position.y, 0.2 - eyeSmile, 0.3);
  });

  const tomatoMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#d51623",
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        reflectivity: 0.65,
        thickness: 0.7,
        iridescence: 0.08,
        sheen: 1,
        sheenRoughness: 0.2,
        sheenColor: new THREE.Color("#ff807c")
      }),
    []
  );

  const stemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a8f3a",
        roughness: 0.3,
        metalness: 0.1
      }),
    []
  );

  return (
    <group ref={tomatoRef} position={[0, 0, 0]}>
      <mesh castShadow receiveShadow geometry={new THREE.SphereGeometry(1, 64, 64)} material={tomatoMaterial} />
      <group position={[0, 0.9, 0]}>
        <mesh castShadow position={[0, 0.05, 0]} material={stemMaterial}>
          <cylinderGeometry args={[0.05, 0.09, 0.35, 16]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((index) => (
          <mesh
            key={index}
            castShadow
            rotation={[0.1, 0, (index / 5) * Math.PI * 2]}
            position={[Math.sin((index / 5) * Math.PI * 2) * 0.32, -0.02, Math.cos((index / 5) * Math.PI * 2) * 0.32]}
            material={stemMaterial}
          >
            <boxGeometry args={[0.12, 0.03, 0.3]} />
          </mesh>
        ))}
      </group>
      <group position={[0, 0.2, 0.95]}>
        <mesh ref={leftEyeRef} position={[-0.35, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={0.5} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.35, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={0.5} />
        </mesh>
        <mesh position={[-0.32, 0.12, 0.12]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#18141a" metalness={0.2} roughness={0.3} />
        </mesh>
        <mesh position={[0.32, 0.12, 0.12]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#18141a" metalness={0.2} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.05, 0.18]}>
          <sphereGeometry args={[0.08, 18, 18]} />
          <meshStandardMaterial color="#ff9f89" roughness={0.4} />
        </mesh>
        <mesh ref={mouthRef} position={[0, -0.4, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.12, 32, 72, Math.PI]} />
          <meshStandardMaterial color="#640f1f" roughness={0.25} metalness={0.05} />
        </mesh>
        <mesh ref={eyelidRef} position={[0, 0.2, 0.1]}>
          <cylinderGeometry args={[0.45, 0.45, 0.08, 32, 1, true, Math.PI * 0.2, Math.PI * 0.6]} />
          <meshStandardMaterial color="#c20f1b" roughness={0.5} transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function ForkHand() {
  const forkGroup = useRef<THREE.Group>(null);
  const sliceRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() % LOOP_DURATION;
    const approachPhase = Math.min(1, t / 2);
    const chewPhase = Math.max(0, t - 2);
    const retreatProgress = Math.min(1, Math.max(0, (chewPhase - 1.5) / 1.2));

    if (forkGroup.current) {
      const startPos = new THREE.Vector3(-2.6, -0.2, 0.6);
      const midPos = new THREE.Vector3(-0.6, -0.15, 0.9);
      const finalPos = new THREE.Vector3(-0.05, -0.15, 0.75);

      const approachPos = startPos.clone().lerp(midPos, approachPhase);
      const finalApproach = midPos.clone().lerp(finalPos, Math.max(0, (approachPhase - 0.6) / 0.4));
      const currentPosition = approachPhase < 0.6 ? approachPos : finalApproach;
      const retreatTarget = finalPos.clone().lerp(startPos, retreatProgress);
      const blended = approachPhase >= 1 ? retreatTarget : currentPosition;

      forkGroup.current.position.copy(blended);
      const hover = Math.sin(t * Math.PI * 1.1) * 0.03;
      forkGroup.current.position.y += hover;
      forkGroup.current.rotation.z = THREE.MathUtils.degToRad(-20 + approachPhase * 40);
      forkGroup.current.rotation.x = THREE.MathUtils.degToRad(10 - approachPhase * 8);
    }

    if (sliceRef.current) {
      const biteProgress = Math.min(1, chewPhase / 0.4);
      const chewWave = Math.sin(chewPhase * Math.PI * 2.2) * Math.exp(-chewPhase * 1.4);

      sliceRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.05, biteProgress));
      sliceRef.current.position.y = 0.06 + chewWave * 0.03;
    }
  });

  const metalMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f3f3f4",
        metalness: 1,
        roughness: 0.12,
        reflectivity: 1,
        clearcoat: 1
      }),
    []
  );

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffbf99",
        roughness: 0.45,
        metalness: 0.05
      }),
    []
  );

  return (
    <group ref={forkGroup}>
      <mesh castShadow material={metalMaterial} position={[0, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.6]} />
      </mesh>
      {[ -0.09, 0, 0.09, 0.18 ].map((x, index) => (
        <mesh key={index} castShadow position={[x, 0.01, 0.27]} rotation={[Math.PI / 16, 0, 0]} material={metalMaterial}>
          <boxGeometry args={[0.03, 0.01, 0.25]} />
        </mesh>
      ))}
      <RoundedBox args={[0.35, 0.15, 0.35]} radius={0.08} smoothness={6} position={[0.1, -0.12, -0.35]}>
        <meshStandardMaterial attach="material" color="#eec3a2" roughness={0.5} />
      </RoundedBox>
      {[0, 1, 2, 3].map((fingerIndex) => (
        <mesh
          key={fingerIndex}
          castShadow
          position={[0.22 + fingerIndex * 0.07, -0.06 - fingerIndex * 0.012, -0.32]}
          rotation={[Math.PI / 2.3, 0, 0.1 - fingerIndex * 0.03]}
          material={skinMaterial}
        >
          <capsuleGeometry args={[0.05, 0.26, 12, 24]} />
        </mesh>
      ))}
      <mesh ref={sliceRef} castShadow position={[0, 0.04, 0.51]} rotation={[Math.PI / 2.1, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.04, 32]} />
        <meshPhysicalMaterial
          color="#f54f41"
          transparent
          opacity={0.95}
          roughness={0.15}
          transmission={0.6}
          thickness={0.45}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        angle={0.6}
        penumbra={0.7}
        castShadow
        position={[2.4, 3.5, 3.2]}
        intensity={1.4}
        shadow-mapSize={2048}
      />
      <directionalLight intensity={0.5} position={[-3, 2.5, 1.5]} />
      <TomatoBody />
      <ForkHand />
      <ContactShadows
        position={[0, -1.01, 0]}
        opacity={0.4}
        scale={6}
        blur={2.2}
        far={4.5}
        smooth={true}
        frames={1}
      />
      <Environment preset="studio" />
    </>
  );
}

export default function Page() {
  return (
    <main
      style={{
        width: "100%",
        maxWidth: 900,
        height: "70vh",
        background: "linear-gradient(180deg, rgba(255,218,224,0.6), rgba(247,170,186,0.9))",
        borderRadius: "32px",
        boxShadow: "0 25px 60px rgba(175, 45, 70, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.35)",
        overflow: "hidden",
        position: "relative"
      }}
    >
      <Canvas shadows camera={{ position: [0, 0.2, 4.2], fov: 35 }}>
        <color attach="background" args={["#f6afb9"]} />
        <Suspense fallback={<Html center>Loading tomato...</Html>}>
          <Scene />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          color: "#6e1c2a",
          fontSize: "1rem",
          fontWeight: 500,
          letterSpacing: "0.04em"
        }}
      >
        Fruit rattling the food.
      </div>
    </main>
  );
}
