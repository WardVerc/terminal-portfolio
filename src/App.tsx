import { useEffect, useRef, useState } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Banner from "./components/Banner";

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
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 20;

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

    // Blue cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const blueCube = new THREE.Mesh(geometry, material);
    scene.add(blueCube);

    // Project card
    const map = new THREE.TextureLoader().load("notsure.png");
    const imageMaterial = new THREE.MeshBasicMaterial({ map: map });
    const imageGeometry = new THREE.BoxGeometry(0.3, 3, 5);
    // Card 1
    const project1 = new THREE.Mesh(imageGeometry, [
      imageMaterial,
      imageMaterial,
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
    ]);
    project1.position.set(-5, 5, 5);
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
    project2.position.set(0, 5, 5);
    scene.add(project2);

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
      blueCube.rotation.x += 0.01;
      blueCube.rotation.y += 0.01;

      // Project cards rotation
      const time = Date.now() * 0.001;
      project1.rotation.y = time;
      project1.rotation.z = 0.5 * (1 + Math.sin(time));

      project2.rotation.y = time;
      project2.rotation.z = 0.5 * (1 + Math.cos(time));

      // Listen which card is in close up
      if (closeUpProjectRef.current === "project1") {
        moveMeshTowardsCamera(project1, camera, 0.1, 5);
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
    console.log(closeUpProject);
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
