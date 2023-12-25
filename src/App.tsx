import { useEffect, useRef } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

function App() {
  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 20;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current &&
      refContainer.current.appendChild(renderer.domElement);

    // Blue cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Light source
    const light = new THREE.PointLight(0xffffff, 2000);
    light.position.set(10, 10, 0);
    const lightHelper = new THREE.PointLightHelper(light);
    const gridHelper = new THREE.GridHelper(50, 10);
    scene.add(light, lightHelper, gridHelper);

    // Orbitcontrols
    const controls = new OrbitControls(camera, renderer.domElement);

    // // Load 3D model
    // const loader = new GLTFLoader();

    // loader.load(
    //   "/laptop.fbx",
    //   function (gltf) {
    //     scene.add(gltf.scene);
    //   },
    //   undefined,
    //   function (error) {
    //     console.error(error);
    //   },
    // );

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Blue cube spinning
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup *IMPORTANT*
    return () => {
      window.removeEventListener("resize", handleResize);
      refContainer.current &&
        refContainer.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={refContainer}>
      <Terminal />
    </div>
  );
}

export default App;
