import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { lerp } from "three/src/math/MathUtils";
import fragment from "./shader/fragment";
import vertex from "./shader/vertex";
import GUI from "lil-gui";
import particleTexture from "@/assets/home/galaxy/particle.png";
import { defineComponent, onMounted } from 'vue';


interface SketchTool {
}

export class Sketch implements SketchTool {
  scene: THREE.Scene
  container: any
  width: number
  height: number
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  controls: OrbitControls
  time: number
  materials: Array<THREE.ShaderMaterial>
  raycaster: THREE.Raycaster
  pointer: THREE.Vector2
  point: THREE.Vector3
  points: THREE.Mesh
  gui: GUI
  setting: any

  constructor(options: any) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 1, 1);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    this.materials = [];

    // Properties of different 'particle clusters'
    let opts = [
      {
        min_radius: 0.4,
        max_radius: 2.5,
        color: "#f7b373",
        size: 1,
        amp: 1,
      },
      {
        min_radius: 0.55,
        max_radius: 2.25,
        color: "#88b3ce",
        size: 0.6,
        amp: 3,
      },
      {
        min_radius: 0.5,
        max_radius: 2.4,
        color: "#ce9dcf",
        size: 0.6,
        amp: 2,
      },
    ];
    opts.forEach((op) => {
      this.addObject(op);
    });

    // For mouse animation
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.point = new THREE.Vector3();

    this.raycasterEvent();
    this.resize();
    this.render();
    this.setupResize();
  }

  raycasterEvent() {
    let mesh = new THREE.Mesh(
      // @ts-ignore
      new THREE.PlaneBufferGeometry(10, 10, 10, 10).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );

    let mouse = new THREE.Mesh(
      // @ts-ignore
      new THREE.SphereBufferGeometry(0.1, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );

    window.addEventListener("pointermove", (event) => {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);

      const intersects = this.raycaster.intersectObjects([mesh]);
      if (intersects[0]) {
        // console.log(intersects[0].point);
        this.point.copy(intersects[0].point);
        mouse.position.copy(intersects[0].point);
      }
    });
  }

  settings() {
    let that = this;
    this.setting = {
      progress: 0,
    };
    this.gui = new GUI();
    this.gui.add(this.setting, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    // @ts-ignore
    this.camera.aspect = this.width / this.height;
    // @ts-ignore
    this.camera.updateProjectionMatrix();
  }

  addObject(op: any) {
    let that = this;
    let count = 10000;
    let min_radius = op.min_radius;
    let max_radius = op.max_radius;
    // @ts-ignore
    let particleGeo = new THREE.PlaneBufferGeometry(1, 1);

    let geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = count;
    geo.setAttribute("position", particleGeo.getAttribute("position")); // geo.position.set(particleGeo.position);
    geo.index = particleGeo.index;

    let pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Torus formation
      let angle = Math.random() * 2 * Math.PI;
      let radius = lerp(min_radius, max_radius, Math.random());

      let x = radius * Math.sin(angle);
      let y = (Math.random() - 0.5) * 0.2;
      let z = radius * Math.cos(angle);

      pos.set([x, y, z], i * 3);
      geo.setAttribute(
        "pos",
        new THREE.InstancedBufferAttribute(pos, 3, false)
      );
    }

    let mat = new THREE.ShaderMaterial({
      extensions: {
      // @ts-ignore
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: { value: new THREE.TextureLoader().load(particleTexture) },
        uColor: { value: new THREE.Color(op.color) },
        uMouse: { value: new THREE.Vector3() },
        uAmp: { value: op.amp },
        size: { value: op.size },
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      // wireframe: true,
      transparent: true,
      depthTest: false,
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.materials.push(mat);

    this.points = new THREE.Mesh(geo, mat);
    this.scene.add(this.points);
  }

  render() {
    this.time += 0.05;
    this.materials.forEach((mat) => {
      mat.uniforms.time.value = this.time * 0.5;
      mat.uniforms.uMouse.value = this.point;
    });

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

export default defineComponent({
  setup() {
    onMounted(() => {
      new Sketch({
        dom: document.getElementById('container'),
      })
    })
  },
  render() {
    return <div id="container" class="w-[100%] h-[100%]"></div>
  }
})