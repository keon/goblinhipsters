import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Plane, useAspect, useTexture } from "@react-three/drei";
import {
  EffectComposer,
  DepthOfField,
  Vignette,
} from "@react-three/postprocessing";
// import Fireflies from "./Fireflies";
// import bgUrl from "./resources/bg.jpg";
// import bgUrl from "./resources/bg.png";
// import starsUrl from "./resources/stars.png";
// import groundUrl from "./resources/ground.png";
// import bearUrl from "./resources/bear.png";
// import leaves1Url from "./resources/leaves1.png";
// import leaves2Url from "./resources/leaves2.png";
import "./materials/layerMaterial";

let x, y;

function Scene({ dof }) {
  const scaleN = useAspect(1600, 1000, 1.05);
  const scaleW = useAspect(2200, 1000, 1.05);
  const textures = useTexture([
    "./resources/bg.png",
    "./resources/stars.png",
    "./resources/ground.png",
    "./resources/bear.png",
    "./resources/leaves1.png",
    "./resources/leaves2.png",
    //     bgUrl,
    //     starsUrl,
    //     groundUrl,
    //     bearUrl,
    //     leaves1Url,
    //     leaves2Url,
  ]);
  const subject = useRef();
  const group = useRef();
  const layersRef = useRef([]);
  const [movement] = useState(() => new THREE.Vector3());
  const [temp] = useState(() => new THREE.Vector3());
  const [focus] = useState(() => new THREE.Vector3());
  const layers = [
    { texture: textures[0], z: 0, factor: 0.005, scale: scaleW },
    { texture: textures[1], z: 10, factor: 0.005, scale: scaleW },
    { texture: textures[2], z: 20, scale: scaleW },
    {
      texture: textures[3],
      z: 30,
      ref: subject,
      scaleFactor: 0.83,
      scale: scaleN,
    },
    {
      texture: textures[4],
      factor: 0.03,
      scaleFactor: 1,
      z: 40,
      wiggle: 0.6,
      scale: scaleW,
    },
    {
      texture: textures[5],
      factor: 0.04,
      scaleFactor: 1.3,
      z: 49,
      wiggle: 1,
      scale: scaleW,
    },
  ];

  useEffect(() => {
    function handleMouseMove(event) {
      var eventDoc, doc, body;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0);
      }
      // x = event.pageX ;
      // y = event.pageY;
      x = (event.pageX / window.innerWidth) * 2 - 1;
      y = -1 * ((event.pageY / window.innerHeight) * 2 - 1);
    }

    document.onmousemove = handleMouseMove;
  }, []);

  useFrame((state, delta) => {
    dof.current.target = focus.lerp(subject.current.position, 0.05);

    if (x && y) {
      movement.lerp(temp.set(x, y * 0.2, 0), 0.2);
      group.current.position.x = THREE.MathUtils.lerp(
        group.current.position.x,
        x * 20,
        0.2
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        y / 10,
        0.2
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        -x / 2,
        0.2
      );
      layersRef.current[4].uniforms.time.value =
        layersRef.current[5].uniforms.time.value += delta;
    }
  }, 1);

  return (
    <group ref={group}>
      {/* <Fireflies count={20} radius={80} colors={["orange"]} /> */}
      {layers.map(
        (
          { scale, texture, ref, factor = 0, scaleFactor = 1, wiggle = 0, z },
          i
        ) => (
          <Plane
            scale={scale}
            args={[1, 1, wiggle ? 10 : 1, wiggle ? 10 : 1]}
            position-z={z}
            key={i}
            ref={ref}
          >
            <layerMaterial
              movement={movement}
              textr={texture}
              factor={factor}
              ref={(el) => (layersRef.current[i] = el)}
              wiggle={wiggle}
              scale={scaleFactor}
            />
          </Plane>
        )
      )}
    </group>
  );
}

const Effects = React.forwardRef((props, ref) => {
  const { viewport: { width, height } } = useThree() // prettier-ignore
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField
        ref={ref}
        bokehScale={3}
        focalLength={0.1}
        width={(width * 5) / 2}
        height={(height * 5) / 2}
      />
      <Vignette />
    </EffectComposer>
  );
});

export default function App() {
  const dof = useRef();
  return (
    <div
      className="canvas"
      style={{
        zIndex: 0,
      }}
    >
      <Canvas
        linear
        orthographic
        gl={{ antialias: false, stencil: false, alpha: false, depth: false }}
        camera={{ zoom: 5, position: [0, 0, 200], far: 300, near: 0 }}
      >
        <Suspense fallback={null}>
          <Scene dof={dof} />
        </Suspense>
        <Effects ref={dof} />
      </Canvas>
    </div>
  );
}
