import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Account catalogue data from Goat Funded Trader (approx. prices as of late 2026; always verify on site)
const accounts = [
  { id: 1, name: "2-Step GOAT $5K", size: "$5,000", price: 36, type: "2-Step Evaluation", target: "8% / 6%", dailyDD: "4%", maxDD: "10% static", split: "80% (up to 100%)", link: "https://goatfundedtrader.com", desc: "Popular low-cost 2-step challenge. Pass phases to get funded." },
  { id: 2, name: "1-Step $15K", size: "$15,000", price: 178, type: "1-Step Evaluation", target: "10%", dailyDD: "4%", maxDD: "6% static", split: "80%", link: "https://goatfundedtrader.com", desc: "Fast-track single phase challenge." },
  { id: 3, name: "Instant GOAT $5K", size: "$5,000", price: 108, type: "Instant Funding", target: "None", dailyDD: "3%", maxDD: "6% trailing", split: "80%", link: "https://app.goatfundedtrader.com/checkout", desc: "Skip evaluation, start trading immediately." },
  { id: 4, name: "Instant HERO $5K", size: "$5,000", price: 58, type: "Instant Funding", target: "None", dailyDD: "3%", maxDD: "5% trailing", split: "90%", link: "https://goatfundedtrader.com", desc: "Affordable instant option with higher split." },
  { id: 5, name: "3-Step $10K", size: "$10,000", price: 65, type: "3-Step Evaluation", target: "6% x3", dailyDD: "4%", maxDD: "8% static", split: "80%", link: "https://goatfundedtrader.com", desc: "Multi-phase for consistency builders." },
  { id: 6, name: "Goat $1 $1K", size: "$1,000", price: 1, type: "Instant Mini", target: "None", dailyDD: "3%", maxDD: "6% trailing", split: "80%", link: "https://help.goatfundedtrader.com/en/articles/11769239-goat-1-model", desc: "Limited $1 entry instant account (max $100 lifetime withdraw, 28-day expiry)." },
  { id: 7, name: "2-Step GOAT $100K", size: "$100,000", price: 275, type: "2-Step Evaluation", target: "8% / 6%", dailyDD: "4%", maxDD: "10% static", split: "80%", link: "https://goatfundedtrader.com", desc: "Larger capital 2-step challenge." },
  { id: 8, name: "Instant GOAT $100K", size: "$100,000", price: 503, type: "Instant Funding", target: "None", dailyDD: "3%", maxDD: "6%", split: "80%", link: "https://app.goatfundedtrader.com/checkout", desc: "Direct funded larger account." },
  { id: 9, name: "Pay Later $25K", size: "$25,000", price: 5, type: "Pay Later", target: "Varies", dailyDD: "3%", maxDD: "Trailing", split: "80%", link: "https://goatfundedtrader.com", desc: "Pay $5 now, rest after passing. Check current activation fees." },
  { id: 10, name: "2-Step Standard $50K", size: "$50,000", price: 203, type: "2-Step Standard", target: "10% / 5%", dailyDD: "5%", maxDD: "10% static", split: "80%", link: "https://goatfundedtrader.com", desc: "Standard 2-step with higher targets." }
];

let cart = [];
let currentAccount = null;

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 100, 300);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.7, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const directional = new THREE.DirectionalLight(0xffffff, 0.8);
directional.position.set(50, 100, 50);
directional.castShadow = true;
directional.shadow.mapSize.width = 2048;
directional.shadow.mapSize.height = 2048;
scene.add(directional);

// Controls
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

const moveState = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW': moveState.forward = true; break;
    case 'KeyS': moveState.backward = true; break;
    case 'KeyA': moveState.left = true; break;
    case 'KeyD': moveState.right = true; break;
    case 'KeyE': handleInteraction(); break;
  }
});
document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW': moveState.forward = false; break;
    case 'KeyS': moveState.backward = false; break;
    case 'KeyA': moveState.left = false; break;
    case 'KeyD': moveState.right = false; break;
  }
});

document.body.addEventListener('click', () => {
  if (!controls.isLocked) controls.lock();
});

// Ground
const groundGeo = new THREE.PlaneGeometry(400, 400);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Roads
function createRoad(x, z, width, length, rotationY = 0) {
  const roadGeo = new THREE.PlaneGeometry(width, length);
  const roadMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.rotation.z = rotationY;
  road.position.set(x, 0.01, z);
  road.receiveShadow = true;
  scene.add(road);
  // White lines
  const lineGeo = new THREE.PlaneGeometry(0.2, length);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.rotation.z = rotationY;
  line.position.set(x, 0.02, z);
  scene.add(line);
}

createRoad(0, -55, 10, 120); // Horizontal north road
createRoad(0, 5, 10, 100);   // Horizontal middle road
createRoad(0, 40, 5, 40, Math.PI / 2); // Vertical road

// Building helper
function createBuilding(x, z, w, d, h, color, name, interiorFunc = null) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.userData = { name, type: 'building' };

  // Exterior walls
  const wallMat = new THREE.MeshLambertMaterial({ color });
  const wallGeo = new THREE.BoxGeometry(w, h, 0.2);
  // Front
  const front = new THREE.Mesh(wallGeo, wallMat);
  front.position.set(0, h/2, d/2);
  front.castShadow = true;
  group.add(front);
  // Back
  const back = new THREE.Mesh(wallGeo, wallMat);
  back.position.set(0, h/2, -d/2);
  back.castShadow = true;
  group.add(back);
  // Sides
  const sideGeo = new THREE.BoxGeometry(0.2, h, d);
  const left = new THREE.Mesh(sideGeo, wallMat);
  left.position.set(-w/2, h/2, 0);
  left.castShadow = true;
  group.add(left);
  const right = new THREE.Mesh(sideGeo, wallMat);
  right.position.set(w/2, h/2, 0);
  right.castShadow = true;
  group.add(right);

  // Roof
  const roofGeo = new THREE.BoxGeometry(w + 0.5, 0.3, d + 0.5);
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = h + 0.15;
  roof.castShadow = true;
  group.add(roof);

  // Floor interior
  const floorGeo = new THREE.PlaneGeometry(w - 0.4, d - 0.4);
  const floorMat = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.05;
  floor.receiveShadow = true;
  group.add(floor);

  // Door opening (remove part of front by not adding solid, or simple door mesh)
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x654321 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.1), doorMat);
  door.position.set(0, 1.1, d/2 + 0.05);
  group.add(door);

  // Sign
  const signGeo = new THREE.PlaneGeometry(4, 1);
  const signMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, h - 0.5, d/2 + 0.1);
  group.add(sign);

  if (interiorFunc) interiorFunc(group, w, d, h);

  scene.add(group);
  return group;
}

// Specific interiors
function goatInterior(group, w, d, h) {
  // 10 trading seats: 2 rows of 5 desks
  const deskMat = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
  const chairMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const monitorMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 5; col++) {
      const dx = (col - 2) * 2.5;
      const dz = (row - 0.5) * 3;
      // Desk
      const desk = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 1), deskMat);
      desk.position.set(dx, 0.4, dz);
      desk.castShadow = true;
      group.add(desk);
      // Chair
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), chairMat);
      chair.position.set(dx, 0.25, dz + 1);
      chair.castShadow = true;
      group.add(chair);
      // Monitor
      const mon = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.05), monitorMat);
      mon.position.set(dx, 1.1, dz - 0.4);
      group.add(mon);
      // Seat label
      mon.userData = { type: 'seat', seatNum: row * 5 + col + 1 };
    }
  }
  // Trading station sign inside
  const label = new THREE.Mesh(new THREE.PlaneGeometry(6, 1), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
  label.position.set(0, 3, -d/2 + 0.5);
  group.add(label);
}

function propShopInterior(group, w, d, h) {
  // Catalogue shelves with account cards
  const shelfMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
  accounts.forEach((acc, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const sx = (col - 2) * 2.2;
    const sy = 1.5 + row * 1.2;
    const sz = -d/2 + 1;
    // Card mesh
    const card = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1, 0.1), new THREE.MeshLambertMaterial({ color: 0x2a5a8a }));
    card.position.set(sx, sy, sz);
    card.userData = { type: 'account', account: acc };
    card.castShadow = true;
    group.add(card);
    // Price text plane (simple colored)
    const priceSign = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.4), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    priceSign.position.set(sx, sy - 0.6, sz + 0.06);
    group.add(priceSign);
  });
  // Cart area
  const cartDesk = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1), new THREE.MeshLambertMaterial({ color: 0x666666 }));
  cartDesk.position.set(0, 0.5, d/2 - 1);
  cartDesk.userData = { type: 'cart-desk' };
  group.add(cartDesk);
}

function simpleInterior(group, w, d, h, furnitureColor = 0xaaaaaa) {
  // Basic table and chairs
  const table = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 1), new THREE.MeshLambertMaterial({ color: furnitureColor }));
  table.position.set(0, 0.4, 0);
  table.castShadow = true;
  group.add(table);
  for (let i = 0; i < 2; i++) {
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0x555555 }));
    chair.position.set((i - 0.5) * 1.5, 0.25, 1);
    group.add(chair);
  }
}

// Create buildings matching sketch
// North row (top of sketch)
createBuilding(-40, -80, 18, 12, 4, 0x8B4513, "Goat Trading Station", goatInterior);
createBuilding(-15, -80, 12, 10, 4, 0x4169E1, "Prop Firm Shop", propShopInterior);
createBuilding(10, -80, 15, 12, 3, 0x228B22, "Open Garden", (g, w, d) => {
  // Trees and benches
  for (let i = 0; i < 4; i++) {
    const tree = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
    tree.position.set((i - 1.5) * 3, 1.5, 0);
    g.add(tree);
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.5), new THREE.MeshLambertMaterial({ color: 0x006400 }));
    foliage.position.set((i - 1.5) * 3, 3.5, 0);
    g.add(foliage);
  }
});
createBuilding(35, -80, 12, 10, 4, 0xFF6347, "Restaurant", (g) => simpleInterior(g, 12, 10, 4, 0x8B4513));

// Middle row
createBuilding(-45, -25, 12, 10, 3.5, 0xDEB887, "House", (g) => simpleInterior(g));
createBuilding(-20, -25, 15, 12, 5, 0x4682B4, "Hotel", (g, w, d, h) => {
  simpleInterior(g);
  // Extra floors simple
  const floor2 = new THREE.Mesh(new THREE.BoxGeometry(w-0.5, 0.1, d-0.5), new THREE.MeshLambertMaterial({ color: 0xcccccc }));
  floor2.position.y = 2.5;
  g.add(floor2);
});
createBuilding(5, -25, 12, 10, 6, 0xFFFFFF, "Church", (g) => {
  // Pews
  for (let i = 0; i < 4; i++) {
    const pew = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 0.8), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
    pew.position.set(0, 0.25, -3 + i * 1.5);
    g.add(pew);
  }
});
createBuilding(25, -25, 8, 8, 3.5, 0xD2691E, "Coffee Shop", (g) => simpleInterior(g, 8, 8, 3.5, 0xA0522D));
createBuilding(40, -25, 12, 10, 5, 0xF5F5DC, "Mosque", (g) => {
  // Simple prayer hall
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshLambertMaterial({ color: 0x006400 }));
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.y = 0.1;
  g.add(carpet);
});

// Bottom: Car dealer and House equip
createBuilding(-30, 30, 20, 15, 4, 0x1E90FF, "Car Dealer Shop", (g) => {
  // Simple cars
  for (let i = 0; i < 3; i++) {
    const car = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1.5), new THREE.MeshLambertMaterial({ color: [0xff0000, 0x0000ff, 0x00ff00][i] }));
    body.position.y = 0.5;
    car.add(body);
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    for (let wx of [-1, 1]) for (let wz of [-0.6, 0.6]) {
      const wheel = new THREE.Mesh(wheelGeo, new THREE.MeshLambertMaterial({ color: 0x111111 }));
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.3, wz);
      car.add(wheel);
    }
    car.position.set((i - 1) * 5, 0, 0);
    g.add(car);
  }
});
createBuilding(25, 30, 18, 12, 4, 0x32CD32, "House Equip Shop", (g) => {
  // Shelves
  for (let i = 0; i < 3; i++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 1), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
    shelf.position.set(0, 1 + i * 1, -2);
    g.add(shelf);
  }
});

// Estates: 6x6 houses
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 6; j++) {
    const hx = -40 + i * 8;
    const hz = 70 + j * 8;
    createBuilding(hx, hz, 6, 6, 3, 0xF4A460, `Estate House ${i*6 + j + 1}`, (g) => simpleInterior(g, 6, 6, 3));
  }
}

// Interaction raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersected = null;

function handleInteraction() {
  if (!controls.isLocked) return;
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (obj.userData && obj.userData.type === 'account') {
      showAccountModal(obj.userData.account);
    } else if (obj.userData && obj.userData.type === 'cart-desk') {
      showCart();
    } else if (obj.userData && obj.userData.seatNum) {
      alert(`Trading seat ${obj.userData.seatNum} - Ready for trading simulation!`);
    }
  }
}

function showAccountModal(acc) {
  currentAccount = acc;
  document.getElementById('modal-title').textContent = acc.name;
  document.getElementById('modal-desc').textContent = `${acc.desc} | Type: ${acc.type} | Target: ${acc.target} | DD: ${acc.dailyDD}/${acc.maxDD} | Split: ${acc.split}`;
  document.getElementById('modal-price').textContent = acc.price;
  document.getElementById('account-modal').style.display = 'block';
}

function showCart() {
  const ul = document.getElementById('cart-items');
  ul.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    ul.appendChild(li);
    total += item.price;
  });
  document.getElementById('cart-total').textContent = total;
  document.getElementById('cart-panel').style.display = 'block';
}

document.getElementById('add-to-cart').addEventListener('click', () => {
  if (currentAccount && !cart.find(c => c.id === currentAccount.id)) {
    cart.push(currentAccount);
    alert(`${currentAccount.name} added to cart!`);
  }
  document.getElementById('account-modal').style.display = 'none';
});
document.getElementById('buy-now').addEventListener('click', () => {
  if (currentAccount) window.open(currentAccount.link, '_blank');
  document.getElementById('account-modal').style.display = 'none';
});
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('account-modal').style.display = 'none';
});
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) { alert('Cart empty'); return; }
  cart.forEach(item => window.open(item.link, '_blank'));
  alert('Opened official purchase pages. Prices may vary; verify on goatfundedtrader.com');
  cart = [];
  document.getElementById('cart-panel').style.display = 'none';
});
document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-panel').style.display = 'none';
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (controls.isLocked) {
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    direction.z = Number(moveState.forward) - Number(moveState.backward);
    direction.x = Number(moveState.right) - Number(moveState.left);
    direction.normalize();
    if (moveState.forward || moveState.backward) velocity.z -= direction.z * 40.0 * delta;
    if (moveState.left || moveState.right) velocity.x -= direction.x * 40.0 * delta;
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    // Keep on ground
    if (camera.position.y < 1.7) camera.position.y = 1.7;
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('3D Virtual Town loaded. Click to lock pointer and explore. Goat has 10 trading seats. Prop shop has catalogue of Goat Funded Trader accounts with cart and real purchase links.');
