import { useEffect, useRef, useState } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Banner from "./components/Banner";

const CAMERA_START_POSITION = new THREE.Vector3(0, 10, 20);

export interface ProjectInterface {
  id: string;
  image: string;
  secondImage?: string;
  description: string;
  startPosition: THREE.Vector3;
  meshObject: THREE.Mesh<
    THREE.BoxGeometry,
    (THREE.MeshBasicMaterial | THREE.MeshLambertMaterial)[],
    THREE.Object3DEventMap
  > | null;
}

const projects: ProjectInterface[] = [
  {
    id: "about",
    image: "me.png",
    secondImage: "me2.jpg",
    description:
      "Hi! I'm Ward and I love to develop cool projects like this one. Check some of them out here! And if you want to see my code check out my github: https://github.com/WardVerc. I started developing as a hobby in 2018, got my degree in 2021 and started working as a fulltime developer in 2021. Started out as a frontend developer (+3 years of experience) and since 2024 I've been working as a Python developer. Next to coding, I like to wakeboard in the summer and leadclimb 🏄🏻‍♂️ 🧗🏻‍♂️. I also play chess once in a while and I like dogs 🐕",
    startPosition: new THREE.Vector3(0, 0, -20),
    meshObject: null,
  },
  {
    id: "archief",
    image: "archief.png",
    secondImage: "archief2.png",
    description:
      "hetarchief.be is a webapp that offers educational material from over 100 Flemish organizations, tailored to educational standards and accessible to instructors via an account. Instructors can view fragments, compile them into collections, and create and share targeted assignments. A management section allows for the administration of all content, collections, and assignments. I primarily worked on frontend development using React and handled backend tasks in Node.js, including modifying APIs and managing database interactions.",
    startPosition: new THREE.Vector3(-15, 0, 0),
    meshObject: null,
  },
  {
    id: "tvh",
    image: "tvh.png",
    description:
      "TVH is a company with a webshop specializing in aerial work platforms and their components. This webshop, which I contributed to developing, offers a wide range of parts tailored for industries that use elevated work solutions. Users can easily browse, select, and purchase components through their personalized accounts. The platform, built using React and Redux, features a streamlined management system for efficient order processing and inventory tracking. The focus is on providing a user-friendly experience while ensuring the availability of high-quality, industry-compliant parts.",
    startPosition: new THREE.Vector3(-5, 0, 0),
    meshObject: null,
  },
  {
    id: "spotify",
    image: "spotify.png",
    secondImage: "spotify2.png",
    description:
      "I made a Python-based project that allows users to create a Spotify playlist from the top 100 songs of any given date. By entering a specific date, the script searches the Billboard Top 100 to identify which songs were on the charts that day. Utilizing BeautifulSoup, I scrape the necessary data from the charts, then use the Spotipy library to search for these songs on Spotify, create a playlist, and add the songs to it.",
    startPosition: new THREE.Vector3(5, 0, 0),
    meshObject: null,
  },
  {
    id: "scraper",
    image: "scraper.png",
    secondImage: "scraper2.png",
    description:
      "In this project, I developed a Python-based scraper using Selenium and BeautifulSoup to search for houses for sale that meet specific personal criteria. The scraper navigates through a housing website, identifying properties that match predefined requirements such as location, price, and size. Once the relevant properties are found, the data is meticulously extracted and then stored in a Google Sheets document for easy access and analysis",
    startPosition: new THREE.Vector3(15, 0, 0),
    meshObject: null,
  },
];

function App() {
  const refContainer = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
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
    cameraRef.current = camera;

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
    scene.add(light);

    // Orbitcontrols
    const controls = new OrbitControls(camera, renderer.domElement);

    // Project card object
    const imageGeometry = new THREE.BoxGeometry(0.3, 3, 5);

    // Initialize projects
    projects.forEach((project) => {
      const map = new THREE.TextureLoader().load(project.image);
      const imageMaterial = new THREE.MeshBasicMaterial({ map: map });

      let projectObject: THREE.Mesh<
        THREE.BoxGeometry,
        (THREE.MeshBasicMaterial | THREE.MeshLambertMaterial)[],
        THREE.Object3DEventMap
      > | null = null;

      if (project.secondImage) {
        const map2 = new THREE.TextureLoader().load(project.secondImage);
        const imageMaterial2 = new THREE.MeshBasicMaterial({ map: map2 });
        projectObject = new THREE.Mesh(imageGeometry, [
          imageMaterial,
          imageMaterial2,
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
        ]);
      } else {
        projectObject = new THREE.Mesh(imageGeometry, [
          imageMaterial,
          imageMaterial,
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
        ]);
      }

      projectObject.position.copy(project.startPosition);
      scene.add(projectObject);
      project.meshObject = projectObject;
    });

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
      projects.forEach((project) => {
        project.meshObject &&
          project.meshObject.position.lerp(project.startPosition, 0.05);
      });

      setTimeout(() => {
        setCloseUpProject("");
      }, 500);
    };

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Project cards rotation
      const time = Date.now() * 0.001;
      projects.forEach((project) => {
        if (project.meshObject) {
          // TODO: for each even number index, use 'sin' else 'cos'
          // to add more random movements
          project.meshObject.rotation.y = time;
          project.meshObject.rotation.z = 0.5 * (1 + Math.cos(time));
        }
      });

      if (cameraRef.current) {
        // Listen which card is in close up
        projects.forEach((project) => {
          if (closeUpProjectRef.current == "overview") {
            resetCameraAndProjects();
          } else if (
            closeUpProjectRef.current == project.id &&
            project.meshObject
          ) {
            if (cameraRef.current) {
              moveMeshTowardsCamera(
                project.meshObject,
                cameraRef.current,
                0.1,
                3,
              );
            }
          } else {
            project.meshObject &&
              project.meshObject.position.lerp(project.startPosition, 0.05);
          }
        });

        // Update and render
        controls.update();
        renderer.render(scene, cameraRef.current);
      }
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
      <Terminal setCloseUpProject={setCloseUpProject} projects={projects} />
    </div>
  );
}

export default App;
