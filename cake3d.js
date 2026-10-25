/* =========================================================
   3D intro on page 1: Maliha walks in and cuts her cake.
   Built from simple shapes with three.js and plays by itself.
   ========================================================= */
(() => {
  const stage = document.querySelector("#stage");
  if (!stage) return;
  if (!window.THREE) { stage.hidden = true; return; } // offline: skip the 3D scene

  const canvas = stage.querySelector("canvas");
  const replayBtn = document.querySelector("#replay");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 2, 0.1, 60);
  const LOOK = new THREE.Vector3(-0.45, 0.95, 0);
  let camDist = 5.2;

  /* ---------- helpers ---------- */
  const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, ...opts });
  function add(parent, geo, material, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const seg = (t, a, b) => clamp01((t - a) / (b - a));
  const ease = (v) => v * v * (3 - 2 * v);
  const lerp = (a, b, v) => a + (b - a) * v;
  const mix = (a, b, v) => a.map((n, i) => lerp(n, b[i], v));
  const elastic = (v) => (v <= 0 ? 0.001 : v >= 1 ? 1 : 2 ** (-10 * v) * Math.sin(((v * 10 - 0.75) * 2 * Math.PI) / 3) + 1);

  /* ---------- lights ---------- */
  scene.add(new THREE.HemisphereLight(0xffe3ef, 0x3a1748, 0.95));
  const sun = new THREE.DirectionalLight(0xfff1e0, 1.0);
  sun.position.set(2.5, 5, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 });
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);
  const rim = new THREE.PointLight(0xff5c9a, 1.2, 12);
  rim.position.set(-3, 2.5, -2);
  scene.add(rim);

  /* ---------- floor ---------- */
  const floor = add(scene, new THREE.CircleGeometry(3.4, 64), mat(0x3b1646, { roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2;
  floor.castShadow = false;
  const ring = add(scene, new THREE.TorusGeometry(3.4, 0.03, 8, 96), new THREE.MeshBasicMaterial({ color: 0xff5c9a }));
  ring.rotation.x = -Math.PI / 2;
  ring.castShadow = false;

  /* ---------- Maliha ---------- */
  const SKIN = mat(0xe2a587);
  const DRESS = mat(0x1b1022, { roughness: 0.45 });
  const PINK = mat(0xe0307a, { roughness: 0.5 });
  const GOLD = mat(0xffc65a, { metalness: 0.8, roughness: 0.3 });
  const HAIR = mat(0x1a0f0d, { roughness: 0.35 });

  const girl = new THREE.Group();
  scene.add(girl);
  const body = new THREE.Group(); // the part that bobs and hops
  girl.add(body);

  // saree skirt with gold and pink borders, blouse, pallu
  add(body, new THREE.CylinderGeometry(0.16, 0.4, 0.8, 32), DRESS, 0, 0.4, 0);
  add(body, new THREE.TorusGeometry(0.395, 0.022, 8, 48), GOLD, 0, 0.025, 0).rotation.x = Math.PI / 2;
  add(body, new THREE.TorusGeometry(0.37, 0.018, 8, 48), PINK, 0, 0.1, 0).rotation.x = Math.PI / 2;
  add(body, new THREE.CylinderGeometry(0.14, 0.17, 0.42, 24), DRESS, 0, 0.99, 0);
  add(body, new THREE.BoxGeometry(0.09, 0.5, 0.02), PINK, 0.02, 0.98, 0.155).rotation.z = -0.55;
  add(body, new THREE.BoxGeometry(0.13, 0.72, 0.02), PINK, 0.12, 0.82, -0.15).rotation.z = 0.08;
  add(body, new THREE.CylinderGeometry(0.05, 0.055, 0.1, 12), SKIN, 0, 1.25, 0);

  // head, hair and face
  const head = new THREE.Group();
  head.position.set(0, 1.43, 0);
  body.add(head);
  add(head, new THREE.SphereGeometry(0.19, 32, 24), SKIN).scale.set(1, 1.06, 1);
  add(head, new THREE.SphereGeometry(0.21, 32, 16, 0, Math.PI * 2, 0, 1.15), HAIR);
  add(head, new THREE.SphereGeometry(0.21, 32, 16, Math.PI, Math.PI, 0, Math.PI), HAIR);
  for (const s of [-1, 1]) {
    add(head, new THREE.CapsuleGeometry(0.035, 0.16, 6, 10), HAIR, s * 0.155, -0.06, 0.09).rotation.z = s * 0.12;
  }
  const hairBack = new THREE.Group();
  hairBack.position.set(0, 1.43, 0);
  body.add(hairBack);
  add(hairBack, new THREE.CapsuleGeometry(0.16, 0.5, 8, 16), HAIR, 0, -0.36, -0.1).scale.set(1.15, 1, 0.55);

  const BLACK = new THREE.MeshBasicMaterial({ color: 0x120a0a });
  const WHITE = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const BLUSH = new THREE.MeshBasicMaterial({ color: 0xff7aa8, transparent: true, opacity: 0.45 });
  for (const s of [-1, 1]) {
    add(head, new THREE.SphereGeometry(0.023, 12, 12), BLACK, s * 0.066, 0.02, 0.172);
    add(head, new THREE.SphereGeometry(0.007, 8, 8), WHITE, s * 0.06, 0.03, 0.193);
    add(head, new THREE.SphereGeometry(0.032, 12, 12), BLUSH, s * 0.105, -0.04, 0.152).scale.z = 0.3;
    add(head, new THREE.SphereGeometry(0.02, 10, 10), GOLD, s * 0.19, -0.05, 0.01);
    add(head, new THREE.SphereGeometry(0.014, 10, 10), PINK, s * 0.19, -0.09, 0.01);
  }
  add(head, new THREE.CapsuleGeometry(0.012, 0.035, 4, 8), mat(0xc2185b), 0, -0.078, 0.176).rotation.z = Math.PI / 2;
  add(head, new THREE.SphereGeometry(0.009, 8, 8), new THREE.MeshBasicMaterial({ color: 0xd0103a }), 0, 0.06, 0.181);

  // arms point along +z from the shoulder, so lookAt() can aim the hand anywhere
  function makeArm(side) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.22, 1.16, 0);
    body.add(pivot);
    add(pivot, new THREE.CylinderGeometry(0.062, 0.056, 0.15, 14), DRESS, 0, 0, 0.06).rotation.x = Math.PI / 2;
    add(pivot, new THREE.CapsuleGeometry(0.045, 0.4, 6, 12), SKIN, 0, 0, 0.25).rotation.x = Math.PI / 2;
    add(pivot, new THREE.TorusGeometry(0.05, 0.012, 8, 20), GOLD, 0, 0, 0.42);
    const hand = add(pivot, new THREE.SphereGeometry(0.055, 14, 14), SKIN, 0, 0, 0.5);
    return { pivot, hand };
  }
  const rightArm = makeArm(-1);
  const leftArm = makeArm(1);

  const feet = [-1, 1].map((s) => {
    const foot = add(girl, new THREE.SphereGeometry(0.06, 12, 10), PINK, s * 0.1, 0.03, 0.3);
    foot.scale.set(0.9, 0.55, 1.5);
    return foot;
  });

  /* ---------- where she walks and where the cake stands ---------- */
  const START = new THREE.Vector3(-3.6, 0, -0.9);
  const SPOT = new THREE.Vector3(-0.6, 0, -0.35);
  const FACE = 0.9; // the way she faces while cutting
  const WALK_ANGLE = Math.atan2(SPOT.x - START.x, SPOT.z - START.z);
  const ref = new THREE.Object3D();
  ref.position.copy(SPOT);
  ref.rotation.y = FACE;
  ref.updateMatrixWorld();
  const cakeSpot = ref.localToWorld(new THREE.Vector3(-0.22, 0, 0.5)); // right in front of her right hand
  const knifeRest = ref.localToWorld(new THREE.Vector3(0.06, 0.79, 0.45));

  // hand targets, in her own space (x = her left, z = forward)
  const REST_R = [-0.3, 0.67, 0.02];
  const REST_L = [0.3, 0.67, 0.02];
  const UP_R = [-0.38, 1.6, 0.15];
  const UP_L = [0.38, 1.6, 0.15];
  const KNIFE_UP = [-0.22, 1.58, 0.28];
  const KNIFE_CUT = [-0.22, 1.2, 0.5];

  /* ---------- table and cake ---------- */
  const table = new THREE.Group();
  table.position.copy(cakeSpot);
  scene.add(table);
  add(table, new THREE.CylinderGeometry(0.34, 0.34, 0.04, 40), mat(0xfff4f8, { roughness: 0.8 }), 0, 0.75, 0);
  add(table, new THREE.CylinderGeometry(0.345, 0.35, 0.1, 40, 1, true), mat(0xffb3d1, { side: THREE.DoubleSide, roughness: 0.8 }), 0, 0.7, 0);
  add(table, new THREE.CylinderGeometry(0.035, 0.045, 0.72, 12), GOLD, 0, 0.36, 0);
  add(table, new THREE.CylinderGeometry(0.11, 0.12, 0.03, 24), GOLD, 0, 0.015, 0);

  function spongeMaterial() {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const g = c.getContext("2d");
    g.fillStyle = "#ffe7c2";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#ff5c9a";
    g.fillRect(0, 28, 64, 8);
    return new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(c), side: THREE.DoubleSide, roughness: 0.9 });
  }
  const SPONGE = spongeMaterial();
  const FLAME = new THREE.MeshBasicMaterial({ color: 0xffb347 });
  const flames = [];

  const cake = new THREE.Group();
  cake.position.set(cakeSpot.x, 0.77, cakeSpot.z);
  cake.rotation.y = FACE + Math.PI; // so the knife cuts it into two halves
  scene.add(cake);

  // the cake is two halves that slide apart when she cuts it
  const halves = [1, -1].map((s) => {
    const half = new THREE.Group();
    cake.add(half);
    const start = s > 0 ? 0 : Math.PI;
    const tier = (r, h, y, color, frosting) => {
      add(half, new THREE.CylinderGeometry(r, r, h, 40, 1, false, start, Math.PI), mat(color, { side: THREE.DoubleSide }), 0, y + h / 2, 0);
      add(half, new THREE.CylinderGeometry(r + 0.012, r + 0.012, 0.03, 40, 1, false, start, Math.PI), mat(frosting), 0, y + h - 0.01, 0);
      add(half, new THREE.PlaneGeometry(r * 2, h), SPONGE, 0, y + h / 2, 0).rotation.y = Math.PI / 2;
    };
    tier(0.26, 0.2, 0, 0xff8fbd, 0xffffff);
    tier(0.17, 0.16, 0.2, 0xffe0ec, 0xff9cc6);
    for (let k = 0; k < 4; k++) {
      const a = start + ((k + 0.5) * Math.PI) / 4;
      add(half, new THREE.SphereGeometry(0.028, 10, 10), mat(0xe0213f, { roughness: 0.3 }), Math.sin(a) * 0.215, 0.215, Math.cos(a) * 0.215);
    }
    const candles = s > 0 ? [[0.09, 0.03]] : [[-0.08, -0.06], [-0.07, 0.08]];
    for (const [x, z] of candles) {
      add(half, new THREE.CylinderGeometry(0.012, 0.012, 0.1, 8), mat(0xb98cff), x, 0.41, z);
      const flame = add(half, new THREE.ConeGeometry(0.018, 0.05, 10), FLAME, x, 0.485, z);
      flame.castShadow = false;
      flames.push(flame);
    }
    return half;
  });
  const candleLight = new THREE.PointLight(0xffa040, 0.8, 2.5);
  candleLight.position.set(0, 0.6, 0);
  cake.add(candleLight);

  /* ---------- knife ---------- */
  const knife = new THREE.Group();
  add(knife, new THREE.BoxGeometry(0.03, 0.11, 0.035), mat(0x5a3020), 0, 0, 0);
  add(knife, new THREE.BoxGeometry(0.008, 0.32, 0.07), mat(0xe8e8f0, { metalness: 0.9, roughness: 0.2 }), 0, -0.21, 0.01);
  scene.add(knife);

  /* ---------- balloons ---------- */
  const balloons = [
    [-2.1, 1.8, -1.4, 0xff5c9a], [-1.3, 2.25, -1.8, 0xffd479], [1.0, 2.1, -1.6, 0xb98cff],
    [1.6, 1.7, -1.0, 0x7ee0ff], [0.3, 2.45, -2.1, 0xff9cc6],
  ].map(([x, y, z, color], i) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    scene.add(g);
    add(g, new THREE.SphereGeometry(0.2, 24, 18), mat(color, { roughness: 0.25 })).scale.set(1, 1.18, 1);
    const string = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.24, 0), new THREE.Vector3(0.05, -1.2, 0)]);
    g.add(new THREE.Line(string, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })));
    g.userData = { baseY: y, phase: i * 1.3 };
    return g;
  });

  /* ---------- "Happy Birthday" banner ---------- */
  const bannerCanvas = document.createElement("canvas");
  bannerCanvas.width = 1024;
  bannerCanvas.height = 220;
  const bannerTex = new THREE.CanvasTexture(bannerCanvas);
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.56), new THREE.MeshBasicMaterial({ map: bannerTex, transparent: true }));
  banner.position.set(-0.4, 2.3, -1.2);
  banner.scale.setScalar(0.001);
  scene.add(banner);
  function drawBanner() {
    const g = bannerCanvas.getContext("2d");
    g.clearRect(0, 0, 1024, 220);
    const grad = g.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, "#ff5c9a");
    grad.addColorStop(1, "#b98cff");
    g.fillStyle = grad;
    g.beginPath();
    if (g.roundRect) g.roundRect(10, 10, 1004, 200, 100);
    else g.rect(10, 10, 1004, 200);
    g.fill();
    g.fillStyle = "#fff";
    g.font = "700 92px 'Dancing Script', cursive";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("Happy Birthday, Maliha!", 512, 116);
    bannerTex.needsUpdate = true;
  }

  /* ---------- 3D confetti ---------- */
  const confetti3d = [];
  const confGeo = new THREE.PlaneGeometry(0.035, 0.055);
  const confMats = [0xff5c9a, 0xffd479, 0xb98cff, 0x7ee0ff, 0xffffff].map((c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
  function popConfetti() {
    for (let i = 0; i < 160; i++) {
      const m = new THREE.Mesh(confGeo, confMats[i % confMats.length]);
      m.position.set(cake.position.x, 1.3, cake.position.z);
      m.userData.v = new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 2 + 1.5, (Math.random() - 0.5) * 3);
      m.userData.spin = new THREE.Vector2(Math.random() * 9, Math.random() * 9);
      scene.add(m);
      confetti3d.push(m);
    }
  }
  function clearConfetti() {
    confetti3d.splice(0).forEach((m) => scene.remove(m));
  }

  /* ---------- the story, second by second ---------- */
  const T_WALK = 4.4;   // walks in
  const T_TURN = 5.1;   // turns to the cake, knife appears
  const T_RAISE = 6.0;  // lifts the knife
  const T_CUT = 6.5;    // cuts!
  const T_SPLIT = 7.3;  // cake opens
  const T_DOWN = 7.7;   // puts the knife down
  const T_CELEB = 8.0;  // turns to you, arms up, hops
  const T_IDLE = 10.2;  // waves every few seconds

  let startAt = null;
  let cutDone = false;
  let lastNow = performance.now();
  const tmp = new THREE.Vector3();
  const aim = (arm, [x, y, z]) => arm.pivot.lookAt(girl.localToWorld(tmp.set(x, y, z)));

  function update(t, now, dt) {
    // walking and turning
    girl.position.lerpVectors(START, SPOT, ease(seg(t, 0, T_WALK)));
    let heading = WALK_ANGLE;
    if (t >= T_WALK) heading = lerp(WALK_ANGLE, FACE, ease(seg(t, T_WALK, T_TURN)));
    if (t >= T_CELEB) heading = lerp(FACE, 0.3, ease(seg(t, T_CELEB, T_CELEB + 0.6)));
    girl.rotation.y = heading;

    const walking = t < T_WALK;
    const amp = walking ? clamp01(Math.min(t / 0.4, (T_WALK - t) / 0.4)) : 0;
    const step = t * 8.5;
    body.position.y = Math.abs(Math.sin(step)) * 0.035 * amp;
    body.rotation.z = Math.sin(step) * 0.03 * amp;
    feet[0].position.z = 0.3 + Math.sin(step) * 0.13 * amp;
    feet[1].position.z = 0.3 - Math.sin(step) * 0.13 * amp;
    hairBack.rotation.x = 0.06 * amp + Math.sin(now / 700) * 0.03;
    head.rotation.z = Math.sin(now / 1300) * 0.05;
    if (t > T_CELEB && t < T_CELEB + 1.6) body.position.y = Math.max(0, Math.sin((t - T_CELEB) * Math.PI * 2.5)) * 0.12;
    girl.updateMatrixWorld(true);

    // arms
    if (walking) {
      const a = Math.sin(step) * 0.45 * amp;
      aim(rightArm, [-0.27, 1.16 - 0.5 * Math.cos(a), 0.5 * Math.sin(a)]);
      aim(leftArm, [0.27, 1.16 - 0.5 * Math.cos(a), -0.5 * Math.sin(a)]);
    } else if (t < T_CELEB) {
      let r = REST_R;
      if (t >= T_TURN && t < T_RAISE) r = mix(REST_R, KNIFE_UP, ease(seg(t, T_TURN, T_RAISE)));
      else if (t >= T_RAISE && t < T_CUT) r = mix(KNIFE_UP, KNIFE_CUT, seg(t, T_RAISE, T_CUT) ** 2);
      else if (t >= T_CUT && t < T_SPLIT) r = [KNIFE_CUT[0], KNIFE_CUT[1], KNIFE_CUT[2] + Math.sin(t * 22) * 0.025];
      else if (t >= T_SPLIT) r = mix(KNIFE_CUT, REST_R, ease(seg(t, T_SPLIT, T_DOWN)));
      aim(rightArm, r);
      aim(leftArm, REST_L);
    } else if (t < T_IDLE) {
      const v = ease(seg(t, T_CELEB, T_CELEB + 0.4));
      aim(rightArm, mix(REST_R, UP_R, v));
      aim(leftArm, mix(REST_L, UP_L, v));
    } else {
      const down = ease(seg(t, T_IDLE, T_IDLE + 0.5));
      aim(rightArm, mix(UP_R, REST_R, down));
      const cycle = (t - T_IDLE) % 5;
      const wave = cycle > 1.5 && cycle < 3.5 ? Math.sin(seg(cycle, 1.5, 3.5) * Math.PI) : 0;
      aim(leftArm, mix(mix(UP_L, REST_L, down), [0.42 + Math.sin(t * 10) * 0.07, 1.55, 0.12], wave));
    }

    // knife: in her hand while cutting, then lying on the table
    let knifeScale = 0;
    if (t >= T_WALK && t < T_SPLIT + 0.3) {
      rightArm.hand.getWorldPosition(knife.position);
      knife.rotation.set(0, heading, 0, "XYZ");
      knifeScale = ease(seg(t, T_WALK, T_WALK + 0.4)) * (1 - ease(seg(t, T_SPLIT, T_SPLIT + 0.3)));
    } else if (t >= T_SPLIT + 0.3) {
      knife.position.copy(knifeRest);
      knife.rotation.set(0, FACE, Math.PI / 2, "YXZ");
      knifeScale = ease(seg(t, T_SPLIT + 0.3, T_SPLIT + 0.6));
    }
    knife.scale.setScalar(Math.max(0.001, knifeScale));

    // the cut
    const split = ease(seg(t, T_CUT + 0.2, T_SPLIT + 0.2)) * 0.07;
    halves[0].position.x = split;
    halves[1].position.x = -split;
    if (t >= T_CUT && !cutDone) {
      cutDone = true;
      drawBanner();
      popConfetti();
      const r = stage.getBoundingClientRect();
      throwConfetti(140, r.left + r.width / 2, r.top + r.height * 0.45);
      burst(r.left + r.width / 2, r.top + r.height * 0.4, ["🎂", "🎉", "💖", "✨"], 14);
    }
    banner.scale.setScalar(t < T_CUT ? 0.001 : Math.max(0.001, elastic(seg(t, T_CUT, T_CUT + 1))));
    banner.position.y = 2.3 + Math.sin(now / 900) * 0.04;

    // confetti falls and settles on the floor
    for (const m of confetti3d) {
      const v = m.userData.v;
      if (m.position.y > 0.012) {
        v.y -= 4.5 * dt;
        v.x *= 0.99;
        v.z *= 0.99;
        m.position.addScaledVector(v, dt);
        m.rotation.x += m.userData.spin.x * dt;
        m.rotation.y += m.userData.spin.y * dt;
      } else {
        m.position.y = 0.012;
        m.rotation.set(-Math.PI / 2, 0, m.rotation.z);
      }
    }

    // little life everywhere
    flames.forEach((f, i) => f.scale.set(1, 1 + Math.sin(now / 60 + i * 2) * 0.18, 1));
    candleLight.intensity = 0.7 + Math.random() * 0.25;
    balloons.forEach((b) => {
      b.position.y = b.userData.baseY + Math.sin(now / 1000 + b.userData.phase) * 0.08;
      b.rotation.z = Math.sin(now / 1400 + b.userData.phase) * 0.08;
    });

    // camera: gentle push in, then a slow sway
    const orbit = t > T_IDLE ? Math.sin((t - T_IDLE) * 0.25) * 0.28 : 0;
    const dist = camDist * lerp(1.25, 1, ease(seg(t, 0, 3)));
    camera.position.set(LOOK.x + Math.sin(orbit) * dist, 1.6, LOOK.z + Math.cos(orbit) * dist);
    camera.lookAt(LOOK);

    replayBtn.classList.toggle("show", t > T_IDLE);
  }

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camDist = 5.2 * Math.max(1, 1.5 / camera.aspect); // step back on narrow phones
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;
    if (current !== 0 || document.hidden) return; // only draw while page 1 is showing
    if (startAt === null) startAt = now + 700;
    update(Math.max(0, (now - startAt) / 1000), now, dt);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  replayBtn.addEventListener("click", () => {
    startAt = performance.now();
    cutDone = false;
    clearConfetti();
  });
})();
