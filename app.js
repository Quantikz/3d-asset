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

// Shared premium materials - brighter, richer
const materials = {
  wall: new THREE.MeshStandardMaterial({ color: 0xf8f4ee, roughness: 0.55, metalness: 0.02 }),
  wallAlt: new THREE.MeshStandardMaterial({ color: 0xf0e6d8, roughness: 0.5, metalness: 0.02 }),
  wallWarm: new THREE.MeshStandardMaterial({ color: 0xf5e6d3, roughness: 0.5, metalness: 0.02 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.7, metalness: 0.05 }),
  roofDark: new THREE.MeshStandardMaterial({ color: 0x2c2416, roughness: 0.75, metalness: 0.05 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0xa8d8ff, roughness: 0.02, metalness: 0.05, transmission: 0.85, thickness: 0.15, transparent: true, opacity: 0.7 }),
  wood: new THREE.MeshStandardMaterial({ color: 0xa67c52, roughness: 0.6, metalness: 0.02 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.65, metalness: 0.02 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.25, metalness: 0.85 }),
  ground: new THREE.MeshStandardMaterial({ color: 0x4a7c3f, roughness: 0.85, metalness: 0.0 }),
  road: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8, metalness: 0.05 }),
  line: new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }),
  desk: new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.35, metalness: 0.5 }),
  monitor: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.15, metalness: 0.6, emissive: 0x1a3a5a, emissiveIntensity: 0.4 }),
  chair: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.15 }),
  card: new THREE.MeshStandardMaterial({ color: 0x1a4a7a, roughness: 0.25, metalness: 0.35 }),
  carBody: new THREE.MeshPhysicalMaterial({ color: 0xcc2222, roughness: 0.15, metalness: 0.8, clearcoat: 0.6, clearcoatRoughness: 0.08 })
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 120, 350);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(0, 55, 110);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Bright daytime lighting
const hemi = new THREE.HemisphereLight(0x87ceeb, 0x4a7c3f, 0.7);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff8e8, 1.6);
sun.position.set(80, 120, 50);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 300;
sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;
sun.shadow.bias = -0.0005;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xc0d8ff, 0.4);
fill.position.set(-50, 40, -40);
scene.add(fill);
const ambient = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI * 0.45;
controls.minDistance = 20;
controls.maxDistance = 220;
controls.target.set(0, 2, 0);

// Ground
const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), materials.ground);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

function createRoad(x, z, w, l, rot = 0) {
  const road = new THREE.Mesh(new THREE.PlaneGeometry(w, l), materials.road);
  road.rotation.x = -Math.PI / 2;
  road.rotation.z = rot;
  road.position.set(x, 0.02, z);
  road.receiveShadow = true;
  scene.add(road);
  const line = new THREE.Mesh(new THREE.PlaneGeometry(0.15, l), materials.line);
  line.rotation.x = -Math.PI / 2;
  line.rotation.z = rot;
  line.position.set(x, 0.03, z);
  scene.add(line);
}
createRoad(0, -55, 12, 140);
createRoad(0, 5, 12, 120);
createRoad(0, 42, 6, 50, Math.PI / 2);

// Premium building factory with consistent materials
function createPremiumBuilding(x, z, w, d, h, name, interior = null, wallMat = materials.wall) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.userData = { name };

  const wallGeo = new THREE.BoxGeometry(w, h, 0.15);
  const sideGeo = new THREE.BoxGeometry(0.15, h, d);

  const front = new THREE.Mesh(wallGeo, wallMat);
  front.position.set(0, h / 2, d / 2);
  front.castShadow = true;
  front.receiveShadow = true;
  group.add(front);

  const back = new THREE.Mesh(wallGeo, wallMat);
  back.position.set(0, h / 2, -d / 2);
  back.castShadow = true;
  group.add(back);

  const left = new THREE.Mesh(sideGeo, wallMat);
  left.position.set(-w / 2, h / 2, 0);
  left.castShadow = true;
  group.add(left);

  const right = new THREE.Mesh(sideGeo, wallMat);
  right.position.set(w / 2, h / 2, 0);
  right.castShadow = true;
  group.add(right);

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.25, d + 0.4), materials.roof);
  roof.position.y = h + 0.12;
  roof.castShadow = true;
  group.add(roof);

  // Interior floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.3, d - 0.3), new THREE.MeshStandardMaterial({ color: 0xc8b89a, roughness: 0.8 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.05;
  floor.receiveShadow = true;
  group.add(floor);

  // Door
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.08), materials.darkWood);
  door.position.set(0, 1.1, d / 2 + 0.04);
  door.castShadow = true;
  group.add(door);

  // Windows (consistent)
  const winGeo = new THREE.PlaneGeometry(1.2, 1.0);
  const winPositions = [[-w * 0.3, h * 0.6, d / 2 + 0.08], [w * 0.3, h * 0.6, d / 2 + 0.08]];
  winPositions.forEach(p => {
    const win = new THREE.Mesh(winGeo, materials.glass);
    win.position.set(...p);
    group.add(win);
  });

  if (interior) interior(group, w, d, h);
  scene.add(group);
  return group;
}

// Goat interior — 10 identical seats
function goatInterior(group, w, d, h) {
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      const dx = (c - 2) * 2.6;
      const dz = (r - 0.5) * 3.2;
      const desk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.75, 1.1), materials.desk);
      desk.position.set(dx, 0.38, dz);
      desk.castShadow = true;
      group.add(desk);

      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.55), materials.chair);
      chair.position.set(dx, 0.22, dz + 1.1);
      chair.castShadow = true;
      group.add(chair);

      const mon = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.65, 0.04), materials.monitor);
      mon.position.set(dx, 1.05, dz - 0.45);
      mon.userData = { type: 'seat', seatNum: r * 5 + c + 1 };
      group.add(mon);
    }
  }
}

// Prop shop interior — catalogue cards
function propInterior(group, w, d, h) {
  accounts.forEach((acc, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const card = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.1, 0.06), materials.card);
    card.position.set((col - 2) * 2.3, 1.4 + row * 1.3, -d / 2 + 1.2);
    card.userData = { type: 'account', account: acc };
    card.castShadow = true;
    group.add(card);
  });
  const cartDesk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 1.0), materials.desk);
  cartDesk.position.set(0, 0.45, d / 2 - 1.2);
  cartDesk.userData = { type: 'cart-desk' };
  group.add(cartDesk);
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

// Buildings — consistent materials, premium scale
createPremiumBuilding(-42, -78, 20, 14, 4.5, "Goat", goatInterior);
createPremiumBuilding(-16, -78, 14, 12, 4.2, "Prop Shop", propInterior, materials.wallAlt);
createPremiumBuilding(12, -78, 16, 13, 3.8, "Garden", (g) => {
  for (let i = 0; i < 5; i++) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2.8), materials.darkWood);
    trunk.position.set((i - 2) * 2.8, 1.4, 0);
    trunk.castShadow = true;
    g.add(trunk);
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.4), new THREE.MeshStandardMaterial({ color: 0x1a4a1a, roughness: 0.9 }));
    foliage.position.set((i - 2) * 2.8, 3.2, 0);
    foliage.castShadow = true;
    g.add(foliage);
  }
});
createPremiumBuilding(36, -78, 13, 11, 4.2, "Restaurant", simpleInterior);

createPremiumBuilding(-46, -24, 13, 11, 3.8, "House", simpleInterior);
createPremiumBuilding(-22, -24, 16, 13, 5.2, "Hotel", simpleInterior, materials.wallAlt);
createPremiumBuilding(4, -24, 13, 11, 6.5, "Church", (g) => {
  for (let i = 0; i < 5; i++) {
    const pew = new THREE.Mesh(new THREE.BoxGeometry(9, 0.4, 0.7), materials.darkWood);
    pew.position.set(0, 0.2, -3.5 + i * 1.4);
    pew.castShadow = true;
    g.add(pew);
  }
});
createPremiumBuilding(24, -24, 9, 9, 3.6, "Coffee", simpleInterior);
createPremiumBuilding(40, -24, 13, 11, 5.0, "Mosque", (g) => {
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(11, 9), new THREE.MeshStandardMaterial({ color: 0x0a3a0a, roughness: 0.95 }));
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.y = 0.08;
  g.add(carpet);
});

createPremiumBuilding(-32, 32, 22, 16, 4.2, "Car Dealer", (g) => {
  const colors = [0xcc0000, 0x0044cc, 0x00aa44];
  colors.forEach((col, i) => {
    const car = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 1.6), new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.15, metalness: 0.85, clearcoat: 0.6 }));
    body.position.y = 0.55;
    body.castShadow = true;
    car.add(body);
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
    [[-1.1, -0.7], [1.1, -0.7], [-1.1, 0.7], [1.1, 0.7]].forEach(([wx, wz]) => {
      const w = new THREE.Mesh(wheelGeo, materials.metal);
      w.rotation.z = Math.PI / 2;
      w.position.set(wx, 0.32, wz);
      car.add(w);
    });
    car.position.set((i - 1) * 5.5, 0, 0);
    g.add(car);
  });
});
createPremiumBuilding(26, 32, 18, 13, 4.0, "House Equip", (g) => {
  for (let i = 0; i < 3; i++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(14, 0.12, 0.8), materials.wood);
    shelf.position.set(0, 1.1 + i * 1.1, -2.2);
    shelf.castShadow = true;
    g.add(shelf);
  }
});

// Estates: exact duplicates
function createEstateHouse() {
  const group = new THREE.Group();
  const w = 7, d = 7, h = 3.4;
  const wallMat = materials.wall;

  const wallGeo = new THREE.BoxGeometry(w, h, 0.15);
  const sideGeo = new THREE.BoxGeometry(0.15, h, d);

  [[0, h/2, d/2], [0, h/2, -d/2]].forEach(pos => {
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(...pos);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);
  });
  [[-w/2, h/2, 0], [w/2, h/2, 0]].forEach(pos => {
    const wall = new THREE.Mesh(sideGeo, wallMat);
    wall.position.set(...pos);
    wall.castShadow = true;
    group.add(wall);
  });

  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.25, d + 0.4), materials.roof);
  roof.position.y = h + 0.12;
  roof.castShadow = true;
  group.add(roof);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.3, d - 0.3), new THREE.MeshStandardMaterial({ color: 0xc8b89a, roughness: 0.8 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.05;
  group.add(floor);

  const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 0.08), materials.darkWood);
  door.position.set(0, 1.0, d / 2 + 0.04);
  group.add(door);

  simpleInterior(group);
  return group;
}

for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 6; j++) {
    const house = createEstateHouse();
    house.position.set(-42 + i * 9, 0, 72 + j * 9);
    scene.add(house);
  }
}

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
