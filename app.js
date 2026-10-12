import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const accounts = [
  { id: 1, name: "2-Step GOAT $5K", size: "$5,000", price: 36, type: "2-Step", target: "8%/6%", dd: "4%/10%", split: "80%", link: "https://goatfundedtrader.com", desc: "Low-cost 2-step challenge." },
  { id: 2, name: "1-Step $15K", size: "$15,000", price: 178, type: "1-Step", target: "10%", dd: "4%/6%", split: "80%", link: "https://goatfundedtrader.com", desc: "Single-phase fast track." },
  { id: 3, name: "Instant GOAT $5K", size: "$5,000", price: 108, type: "Instant", target: "None", dd: "3%/6%", split: "80%", link: "https://app.goatfundedtrader.com/checkout", desc: "Skip evaluation." },
  { id: 4, name: "Instant HERO $5K", size: "$5,000", price: 58, type: "Instant", target: "None", dd: "3%/5%", split: "90%", link: "https://goatfundedtrader.com", desc: "Higher split instant." },
  { id: 5, name: "3-Step $10K", size: "$10,000", price: 65, type: "3-Step", target: "6%x3", dd: "4%/8%", split: "80%", link: "https://goatfundedtrader.com", desc: "Three-phase consistency." },
  { id: 6, name: "Goat $1", size: "$1,000", price: 1, type: "Mini Instant", target: "None", dd: "3%/6%", split: "80%", link: "https://help.goatfundedtrader.com/en/articles/11769239-goat-1-model", desc: "$1 entry, limited withdraw." },
  { id: 7, name: "2-Step GOAT $100K", size: "$100,000", price: 275, type: "2-Step", target: "8%/6%", dd: "4%/10%", split: "80%", link: "https://goatfundedtrader.com", desc: "Larger 2-step." },
  { id: 8, name: "Instant GOAT $100K", size: "$100,000", price: 503, type: "Instant", target: "None", dd: "3%/6%", split: "80%", link: "https://app.goatfundedtrader.com/checkout", desc: "Direct funded." },
  { id: 9, name: "Pay Later $25K", size: "$25,000", price: 5, type: "Pay Later", target: "Varies", dd: "3%", split: "80%", link: "https://goatfundedtrader.com", desc: "Pay $5 now." },
  { id: 10, name: "2-Step Std $50K", size: "$50,000", price: 203, type: "2-Step", target: "10%/5%", dd: "5%/10%", split: "80%", link: "https://goatfundedtrader.com", desc: "Standard targets." }
];

let cart = [];
let currentAccount = null;

// Premium materials with richer finishes
const materials = {
  wall: new THREE.MeshStandardMaterial({ color: 0xf5f0ea, roughness: 0.45, metalness: 0.02 }),
  wallAlt: new THREE.MeshStandardMaterial({ color: 0xe8dfd0, roughness: 0.42, metalness: 0.02 }),
  wallWarm: new THREE.MeshStandardMaterial({ color: 0xf0e4d4, roughness: 0.4, metalness: 0.02 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.65, metalness: 0.08 }),
  roofEdge: new THREE.MeshStandardMaterial({ color: 0x2a1d14, roughness: 0.7, metalness: 0.05 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x9fd4ff, roughness: 0.01, metalness: 0.02, transmission: 0.92, thickness: 0.1, transparent: true, opacity: 0.65, ior: 1.45 }),
  windowFrame: new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.3, metalness: 0.7 }),
  wood: new THREE.MeshStandardMaterial({ color: 0xb8956a, roughness: 0.55, metalness: 0.02 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.6, metalness: 0.02 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.9 }),
  ground: new THREE.MeshStandardMaterial({ color: 0x3d6b32, roughness: 0.9, metalness: 0.0 }),
  sidewalk: new THREE.MeshStandardMaterial({ color: 0xc8c0b8, roughness: 0.7, metalness: 0.0 }),
  road: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.75, metalness: 0.05 }),
  desk: new THREE.MeshStandardMaterial({ color: 0x2e2e2e, roughness: 0.3, metalness: 0.45 }),
  monitorScreen: new THREE.MeshStandardMaterial({ color: 0x0a1520, roughness: 0.1, metalness: 0.3, emissive: 0x1a4a8a, emissiveIntensity: 0.6 }),
  monitorBezel: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.5 }),
  chair: new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.45, metalness: 0.2 }),
  card: new THREE.MeshStandardMaterial({ color: 0x1a3a5c, roughness: 0.2, metalness: 0.4 }),
  sign: new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.3, metalness: 0.3 })
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 120, 350);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(5, 28, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Bright daytime lighting
const hemi = new THREE.HemisphereLight(0xb0e0ff, 0x5a8c4f, 0.85);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff8e0, 1.8);
sun.position.set(70, 100, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 250;
sun.shadow.camera.left = -80;
sun.shadow.camera.right = 80;
sun.shadow.camera.top = 80;
sun.shadow.camera.bottom = -80;
sun.shadow.bias = -0.0005;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xd0e8ff, 0.5);
fill.position.set(-40, 30, -30);
scene.add(fill);
const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI * 0.45;
controls.minDistance = 15;
controls.maxDistance = 180;
controls.target.set(5, 3, 0);

// Simple ground and one road
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), materials.ground);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Single road in front of buildings
const road = new THREE.Mesh(new THREE.PlaneGeometry(80, 8), materials.road);
road.rotation.x = -Math.PI / 2;
road.position.set(5, 0.02, 12);
road.receiveShadow = true;
scene.add(road);

// Richer building factory
function createPremiumBuilding(x, z, w, d, h, name, interior = null, wallMat = materials.wall) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.userData = { name };

  // Main walls
  const wallThick = 0.18;
  const front = new THREE.Mesh(new THREE.BoxGeometry(w, h, wallThick), wallMat);
  front.position.set(0, h / 2, d / 2);
  front.castShadow = true;
  front.receiveShadow = true;
  group.add(front);

  const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, wallThick), wallMat);
  back.position.set(0, h / 2, -d / 2);
  back.castShadow = true;
  group.add(back);

  const left = new THREE.Mesh(new THREE.BoxGeometry(wallThick, h, d), wallMat);
  left.position.set(-w / 2, h / 2, 0);
  left.castShadow = true;
  group.add(left);

  const right = new THREE.Mesh(new THREE.BoxGeometry(wallThick, h, d), wallMat);
  right.position.set(w / 2, h / 2, 0);
  right.castShadow = true;
  group.add(right);

  // Roof with edge trim
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.3, d + 0.6), materials.roof);
  roof.position.y = h + 0.15;
  roof.castShadow = true;
  group.add(roof);
  const roofEdge = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 0.12, d + 0.8), materials.roofEdge);
  roofEdge.position.y = h + 0.05;
  group.add(roofEdge);

  // Interior floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.4, d - 0.4), new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.7 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.06;
  floor.receiveShadow = true;
  group.add(floor);

  // Door with frame
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.4, 0.12), materials.windowFrame);
  doorFrame.position.set(0, 1.2, d / 2 + 0.02);
  group.add(doorFrame);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.1, 0.06), materials.darkWood);
  door.position.set(0, 1.15, d / 2 + 0.08);
  door.castShadow = true;
  group.add(door);

  // Windows with frames (2 on front)
  const winW = 1.4, winH = 1.1;
  const winPositions = [[-w * 0.28, h * 0.62], [w * 0.28, h * 0.62]];
  winPositions.forEach(([wx, wy]) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.12, winH + 0.12, 0.08), materials.windowFrame);
    frame.position.set(wx, wy, d / 2 + 0.04);
    group.add(frame);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), materials.glass);
    glass.position.set(wx, wy, d / 2 + 0.1);
    group.add(glass);
  });

  // Building name sign
  const sign = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, 0.5, 0.08), materials.sign);
  sign.position.set(0, h - 0.4, d / 2 + 0.1);
  group.add(sign);

  if (interior) interior(group, w, d, h);
  scene.add(group);
  return group;
}

// Goat interior — detailed 10 trading stations
function goatInterior(group, w, d, h) {
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      const dx = (c - 2) * 2.8;
      const dz = (r - 0.5) * 3.4;
      // Desk
      const desk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.2), materials.desk);
      desk.position.set(dx, 0.75, dz);
      desk.castShadow = true;
      group.add(desk);
      // Desk legs
      const legGeo = new THREE.BoxGeometry(0.08, 0.7, 0.08);
      [[-1, -0.5], [1, -0.5], [-1, 0.5], [1, 0.5]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, materials.metal);
        leg.position.set(dx + lx, 0.35, dz + lz);
        group.add(leg);
      });
      // Chair
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), materials.chair);
      seat.position.set(dx, 0.45, dz + 1.2);
      group.add(seat);
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.06), materials.chair);
      backrest.position.set(dx, 0.75, dz + 1.45);
      group.add(backrest);
      // Monitor with screen
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.04), materials.monitorBezel);
      bezel.position.set(dx, 1.15, dz - 0.5);
      group.add(bezel);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.55), materials.monitorScreen);
      screen.position.set(dx, 1.15, dz - 0.47);
      screen.userData = { type: 'seat', seatNum: r * 5 + c + 1 };
      group.add(screen);
    }
  }
}

// Prop shop interior — catalogue wall
function propInterior(group, w, d, h) {
  accounts.forEach((acc, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const card = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.04), materials.card);
    card.position.set((col - 2) * 2.2, 1.5 + row * 1.25, -d / 2 + 0.8);
    card.userData = { type: 'account', account: acc };
    card.castShadow = true;
    group.add(card);
  });
  // Checkout counter
  const counter = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.9, 1.1), materials.desk);
  counter.position.set(0, 0.45, d / 2 - 1.5);
  counter.userData = { type: 'cart-desk' };
  counter.castShadow = true;
  group.add(counter);
}

// Warehouse interior
function warehouseInterior(group, w, d, h) {
  for (let i = 0; i < 4; i++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(w - 1, 0.1, 1.0), materials.wood);
    shelf.position.set(0, 0.8 + i * 0.9, -1.5);
    shelf.castShadow = true;
    group.add(shelf);
    // Shelf supports
    const support = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8 + i * 0.9, 0.1), materials.metal);
    support.position.set(-w / 2 + 0.8, (0.8 + i * 0.9) / 2, -1.5);
    group.add(support);
    const support2 = support.clone();
    support2.position.x = w / 2 - 0.8;
    group.add(support2);
  }
}

function simpleInterior(group) {
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 0.9), materials.wood);
  table.position.set(0, 0.35, 0);
  table.castShadow = true;
  group.add(table);
  const chair1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.5), materials.chair);
  chair1.position.set(-0.7, 0.22, 0.8);
  group.add(chair1);
  const chair2 = chair1.clone();
  chair2.position.set(0.7, 0.22, 0.8);
  group.add(chair2);
}

// Sidewalk in front of buildings
const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(70, 4), materials.sidewalk);
sidewalk.rotation.x = -Math.PI / 2;
sidewalk.position.set(5, 0.03, 8);
sidewalk.receiveShadow = true;
scene.add(sidewalk);

// Only 3 buildings: Goat Station, Prop Shop, Warehouse
createPremiumBuilding(-18, 0, 22, 16, 5.2, "Goat Trading Station", goatInterior);
createPremiumBuilding(8, 0, 16, 14, 4.8, "Prop Firm Shop", propInterior, materials.wallAlt);
createPremiumBuilding(30, 0, 14, 12, 4.5, "Warehouse", warehouseInterior, materials.wallWarm);

// Raycast interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerDown(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  if (hits.length) {
    const obj = hits[0].object;
    if (obj.userData?.type === 'account') showAccountModal(obj.userData.account);
    else if (obj.userData?.type === 'cart-desk') showCart();
    else if (obj.userData?.seatNum) console.log('Seat', obj.userData.seatNum);
  }
}
renderer.domElement.addEventListener('pointerdown', onPointerDown);

function showAccountModal(acc) {
  currentAccount = acc;
  document.getElementById('modal-title').textContent = acc.name;
  document.getElementById('modal-desc').textContent = `${acc.desc} · ${acc.type} · ${acc.target} · ${acc.dd}`;
  document.getElementById('modal-price').textContent = acc.price;
  document.getElementById('account-modal').style.display = 'block';
}
function showCart() {
  const ul = document.getElementById('cart-items');
  ul.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} — $${item.price}`;
    ul.appendChild(li);
    total += item.price;
  });
  document.getElementById('cart-total').textContent = total;
  document.getElementById('cart-panel').style.display = 'block';
}

document.getElementById('add-to-cart').onclick = () => {
  if (currentAccount && !cart.some(c => c.id === currentAccount.id)) cart.push(currentAccount);
  document.getElementById('account-modal').style.display = 'none';
};
document.getElementById('buy-now').onclick = () => {
  if (currentAccount) window.open(currentAccount.link, '_blank');
  document.getElementById('account-modal').style.display = 'none';
};
document.getElementById('close-modal').onclick = () => document.getElementById('account-modal').style.display = 'none';
document.getElementById('checkout-btn').onclick = () => {
  cart.forEach(item => window.open(item.link, '_blank'));
  cart = [];
  document.getElementById('cart-panel').style.display = 'none';
};
document.getElementById('close-cart').onclick = () => document.getElementById('cart-panel').style.display = 'none';

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
