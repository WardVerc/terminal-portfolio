import { useEffect, useRef, useState } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Banner from "./components/Banner";

const CAMERA_START_POSITION = new THREE.Vector3(0, 20, 30);
const PROJECT1_START_POSITION = new THREE.Vector3(-5, 5, 0);
const PROJECT2_START_POSITION = new THREE.Vector3(5, 5, 0);

function App() {
  const refContainer = useRef<HTMLDivElement>(null);
  const closeUpProjectRef = useRef<string | null>(null);
  const [closeUpProject, setCloseUpProject] = useState("");

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
    // Set the camera's startposition
    camera.position.copy(CAMERA_START_POSITION);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // use ref instead of the document.body
    refContainer.current &&
      refContainer.current.appendChild(renderer.domElement);

    // Background
    const spaceTexture = new THREE.TextureLoader().load("space.png");
    scene.background = spaceTexture;
    scene.backgroundBlurriness = 1;
    scene.backgroundIntensity = 0.3;

    // Light source
    // const pointLight = new THREE.PointLight(0xffffff, 1000);
    // pointLight.position.set(10, 10, 0);
    // const lightHelper = new THREE.PointLightHelper(pointLight);
    // scene.add(lightHelper)
    const light = new THREE.AmbientLight(0xffffff, 20);
    const gridHelper = new THREE.GridHelper(50, 10);
    scene.add(light, gridHelper);

    // Orbitcontrols
    const controls = new OrbitControls(camera, renderer.domElement);

    // Project card object
    const imageGeometry = new THREE.BoxGeometry(0.3, 3, 5);

    // Card 1
    const map = new THREE.TextureLoader().load("notsure.png");
    const imageMaterial = new THREE.MeshBasicMaterial({ map: map });
    const project1 = new THREE.Mesh(imageGeometry, [
      imageMaterial,
      imageMaterial,
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
    ]);
    project1.position.copy(PROJECT1_START_POSITION);
    scene.add(project1);

    // Card 2
    const map2 = new THREE.TextureLoader().load("space.png");
    const imageMaterial2 = new THREE.MeshBasicMaterial({ map: map2 });
    const project2 = new THREE.Mesh(imageGeometry, [
      imageMaterial2,
      imageMaterial2,
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
    ]);
    project2.position.copy(PROJECT2_START_POSITION);
    scene.add(project2);

    // Stars
    function addStar() {
      const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
      const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(starGeometry, starMaterial);

      // Get an array of 3 random values (float from -range/2 to range/2)
      const [x, y, z] = Array(3)
        .fill(0)
        .map(() => THREE.MathUtils.randFloatSpread(100));

      star.position.set(x, y, z);
      scene.add(star);
    }
    // Fill an array with 200 values and execute addStar for each
    Array(200).fill(0).forEach(addStar);

    // Move the Mesh object towards the camera with a certain speed
    function moveMeshTowardsCamera(
      mesh: THREE.Mesh,
      camera: THREE.Camera,
      speed: number,
      distance: number,
    ): void {
      // Clone the camera's position
      const cameraPosition = camera.position.clone();

      // Calculate the look-at direction of the camera (pointing towards the center of the scene)
      const lookAtDirection = new THREE.Vector3(0, 0, 0)
        // The .sub() method subtracts the camera's position from the center, resulting in the look-at direction.
        .sub(cameraPosition)
        // The .normalize() method scales the resulting vector to a unit length, ensuring consistent speed.
        .normalize();

      // Calculate the final position by moving in the look-at direction with the specified distance
      const newPosition = cameraPosition
        .clone()
        // The .multiplyScalar() method scales the look-at direction vector by the specified distance,
        // determining the position the mesh should move towards.
        .add(lookAtDirection.multiplyScalar(distance));

      // Use linear interpolation (lerp) for smooth movement
      mesh.position.lerp(newPosition, speed); // Adjust the second parameter for desired smoothness
      // The .lerp() method interpolates between the current position of the mesh and the calculated newPosition.
      // The second parameter (speed) determines the amount of interpolation,
      // where higher values result in smoother but slower movement.
    }

    // Reset camera and object positions
    const resetCameraAndProjects = () => {
      // Use lerp to smoothly interpolate between current and initial positions
      camera.position.lerp(CAMERA_START_POSITION, 0.05);
      project1.position.lerp(PROJECT1_START_POSITION, 0.05);
      project2.position.lerp(PROJECT2_START_POSITION, 0.05);

      setTimeout(() => {
        setCloseUpProject("");
      }, 500);
    };

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

      // Project cards rotation
      const time = Date.now() * 0.001;
      project1.rotation.y = time;
      project1.rotation.z = 0.5 * (1 + Math.sin(time));

      project2.rotation.y = time;
      project2.rotation.z = 0.5 * (1 + Math.cos(time));

      // Listen which card is in close up
      switch (closeUpProjectRef.current) {
        case "project1":
          moveMeshTowardsCamera(project1, camera, 0.1, 5);
          project2.position.lerp(PROJECT2_START_POSITION, 0.05);
          break;
        case "project2":
          moveMeshTowardsCamera(project2, camera, 0.1, 5);
          project1.position.lerp(PROJECT1_START_POSITION, 0.05);
          break;
        case "overview":
          resetCameraAndProjects();
          break;
      }

      // Update and render
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

  useEffect(() => {
    closeUpProjectRef.current = closeUpProject;
  }, [closeUpProject]);

  return (
    <div ref={refContainer}>
      <Banner />
      <Terminal setCloseUpProject={setCloseUpProject} />
    </div>
  );
}

export default App;
