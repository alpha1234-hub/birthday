/* =========================================================
   EDIT THESE TO MAKE IT YOURS
   ========================================================= */

// Your name, shown in the letter and in the message she sends back to you.
const FROM_NAME = "Sowad";

// Your WhatsApp number with country code. Her answer is sent here.
const WHATSAPP_NUMBER = "+8801782510223";

// The birthday letter on page 2. Each line types out one after another.
const WISH_LINES = [
  "Happy birthday, Afroze Maliha! 🎂",
  "Today the world got a little brighter, because it's the day you came into it.",
  "I hope this year brings you everything your heart has been quietly wishing for: big dreams coming true, small joys every single day, and a hundred reasons to smile.",
  "May you laugh until your cheeks hurt, eat all your favourite food without a single worry, and always be surrounded by people who love you the way you deserve.",
  "Never stop being you: kind, funny, a little bit stubborn, and completely one of a kind.",
  "Thank you for making so many ordinary days feel special. Including mine. 💫",
  "Here's to you, today and always. 🥂",
];

// Songs are looked up online with the iTunes Search API (no key needed) and
// play Apple's official preview clip. If you put a full mp3 at `file`, that
// plays instead. If both fail, a little Happy Birthday tune plays.
const SONGS = [
  { tag: "বাংলা · Bengali", title: "Aj Jonmodin Tomar", artist: "Shafin Ahmed", term: "Jonmodin Tomar Shafin Ahmed", match: "jonmodin", country: "IN", file: "songs/bengali.mp3", icon: "🌸", color: "#ff5c9a", wave: "triangle", shift: 0 },
  { tag: "हिन्दी · Hindi", title: "Baar Baar Din Ye Aaye", artist: "Mohammed Rafi", term: "Baar Baar Din Ye Aaye Mohammed Rafi", country: "IN", file: "songs/hindi.mp3", icon: "🌙", color: "#ffb347", wave: "sine", shift: -5 },
  { tag: "English", title: "Perfect", artist: "Ed Sheeran", term: "Perfect Ed Sheeran", country: "US", file: "songs/english.mp3", icon: "💫", color: "#b98cff", wave: "square", shift: 2 },
];

// Her photos in the "images" folder, each with what's written on the back.
const PHOTOS = [
  { file: "images/1000192938.jpg", caption: "main character ✦", icon: "🕶️", title: "Your confidence", text: "Sunglasses on, head tilted, owning the doorway like it was built for you. You walk in and the whole room notices." },
  { file: "images/1000192939.jpg", caption: "twice as lovely ♡", icon: "🪞", title: "Your elegance", text: "A saree, a ponytail and that quiet look in the mirror. Even your reflection looks like a painting." },
  { file: "images/1000192940.jpg", caption: "those eyes…", icon: "✨", title: "Your eyes", text: "One look from you and I forget what I was going to say. Your eyes could start a whole story on their own." },
  { file: "images/1000192941.jpg", caption: "that shy smile 🌸", icon: "😊", title: "Your smile", text: "Looking down, half smiling, playing with your earring. This might be the softest, prettiest you, and it's my favourite." },
  { file: "images/1000192942.jpg", caption: "pink & dreamy", icon: "🌷", title: "Your glow", text: "Even under a tree full of pink blossoms, you're still the most beautiful thing in the picture." },
  { file: "images/1000192943.jpg", caption: "simply timeless", icon: "💖", title: "Simply you", text: "Graceful, a little mysterious, completely unforgettable. There's nobody quite like you, Maliha. Nobody." },
];

/* ========================================================= */

const pages = [...document.querySelectorAll(".page")];
const dotsBox = document.querySelector("#dots");
const counter = document.querySelector("#counter");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const muteBtn = document.querySelector("#mute");
const muteLabel = document.querySelector("#mute-label");
let current = 0;

/* ---------- page navigation ---------- */
pages.forEach((page, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Page ${i + 1}: ${page.dataset.title}`);
  dot.addEventListener("click", () => showPage(i));
  dotsBox.append(dot);
});
const dots = [...dotsBox.children];

function showPage(index) {
  index = Math.max(0, Math.min(index, pages.length - 1));
  if (index === current && pages[index].classList.contains("active")) return;
  pages[current]?.classList.remove("active");
  current = index;
  pages[current].classList.add("active");
  pages[current].scrollTop = 0;
  dots.forEach((dot, i) => dot.classList.toggle("on", i === current));
  counter.textContent = `${current + 1} / ${pages.length}`;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;
  document.title = `${pages[current].dataset.title} · Happy Birthday, Afroze 💖`;

  if (index !== 0 || document.readyState === "complete") heartWipe();
  if (current === 0) launchBalloons(6);
  if (current === 1) typeWish();
  if (current === 5) setTimeout(() => burst(innerWidth / 2, innerHeight / 3, ["💖", "💕", "✨"], 14), 600);
  if (noBtn.parentElement === document.body) noBtn.style.visibility = current === 5 ? "visible" : "hidden";
}

prevBtn.addEventListener("click", () => showPage(current - 1));
nextBtn.addEventListener("click", () => showPage(current + 1));
document.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) return;
  if (e.key === "ArrowRight") showPage(current + 1);
  if (e.key === "ArrowLeft") showPage(current - 1);
});

let touchX = null;
document.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
document.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 70 && !e.target.closest("input, .btn-no, .polaroids")) showPage(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- background sky: stars + rising hearts ---------- */
const sky = document.querySelector("#sky");
const skyCtx = sky.getContext("2d");
let stars = [];
let hearts = [];
let shooting = [];
let petals = [];

function resizeCanvases() {
  for (const c of [sky, confettiCanvas]) {
    c.width = innerWidth * devicePixelRatio;
    c.height = innerHeight * devicePixelRatio;
    c.getContext("2d").setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  stars = Array.from({ length: Math.round((innerWidth * innerHeight) / 6000) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.4 + 0.3,
    t: Math.random() * Math.PI * 2,
  }));
}

function drawSky() {
  skyCtx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of stars) {
    s.t += 0.03;
    skyCtx.globalAlpha = 0.35 + Math.sin(s.t) * 0.35;
    skyCtx.fillStyle = "#fff";
    skyCtx.beginPath();
    skyCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    skyCtx.fill();
  }
  if (Math.random() < 0.06) {
    hearts.push({ x: Math.random() * innerWidth, y: innerHeight + 20, s: Math.random() * 14 + 10, v: Math.random() * 0.8 + 0.4, w: Math.random() * 2, a: Math.random() * 0.4 + 0.2 });
  }
  skyCtx.fillStyle = "#ff9cc6";
  hearts = hearts.filter((h) => h.y > -30);
  for (const h of hearts) {
    h.y -= h.v;
    h.w += 0.02;
    skyCtx.globalAlpha = h.a;
    skyCtx.font = `${h.s}px serif`;
    skyCtx.fillText("♥", h.x + Math.sin(h.w) * 20, h.y);
  }

  // shooting stars
  if (Math.random() < 0.006) {
    shooting.push({ x: Math.random() * innerWidth * 0.8, y: Math.random() * innerHeight * 0.4, life: 1 });
  }
  shooting = shooting.filter((s) => s.life > 0);
  for (const s of shooting) {
    s.x += 9;
    s.y += 4;
    s.life -= 0.02;
    const tail = skyCtx.createLinearGradient(s.x, s.y, s.x - 120, s.y - 53);
    tail.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
    tail.addColorStop(1, "rgba(255, 255, 255, 0)");
    skyCtx.globalAlpha = 1;
    skyCtx.strokeStyle = tail;
    skyCtx.lineWidth = 2;
    skyCtx.beginPath();
    skyCtx.moveTo(s.x, s.y);
    skyCtx.lineTo(s.x - 120, s.y - 53);
    skyCtx.stroke();
  }

  // falling petals on the cover and photo pages
  if ([0, 3, 4].includes(current) && Math.random() < 0.05) {
    petals.push({ x: Math.random() * innerWidth, y: -30, v: Math.random() + 0.8, w: Math.random() * 6, r: Math.random() * 6, s: Math.random() * 10 + 14 });
  }
  petals = petals.filter((p) => p.y < innerHeight + 30);
  for (const p of petals) {
    p.y += p.v;
    p.w += 0.03;
    p.r += 0.02;
    skyCtx.save();
    skyCtx.globalAlpha = 0.8;
    skyCtx.translate(p.x + Math.sin(p.w) * 40, p.y);
    skyCtx.rotate(p.r);
    skyCtx.font = `${p.s}px serif`;
    skyCtx.fillText("🌸", 0, 0);
    skyCtx.restore();
  }
  skyCtx.globalAlpha = 1;
  requestAnimationFrame(drawSky);
}

/* ---------- confetti ---------- */
const confettiCanvas = document.querySelector("#confetti");
const confettiCtx = confettiCanvas.getContext("2d");
let confetti = [];
let confettiRunning = false;
const COLORS = ["#ff5c9a", "#ffd479", "#b98cff", "#ff9cc6", "#7ee0ff", "#ffffff"];

function throwConfetti(count = 160, originX = innerWidth / 2, originY = innerHeight / 2) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 11 + 4;
    confetti.push({
      x: originX, y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: Math.random() * 7 + 5,
      rot: Math.random() * 360,
      vr: Math.random() * 12 - 6,
      color: COLORS[i % COLORS.length],
      heart: Math.random() < 0.25,
      life: 1,
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
}

function drawConfetti() {
  confettiCtx.clearRect(0, 0, innerWidth, innerHeight);
  confetti = confetti.filter((p) => p.y < innerHeight + 40 && p.life > 0);
  for (const p of confetti) {
    p.vy += 0.28;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 0.004;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rot * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.min(1, p.life * 2);
    confettiCtx.fillStyle = p.color;
    if (p.heart) {
      confettiCtx.font = `${p.size * 2}px serif`;
      confettiCtx.fillText("♥", 0, 0);
    } else {
      confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    confettiCtx.restore();
  }
  if (confetti.length) requestAnimationFrame(drawConfetti);
  else { confettiRunning = false; confettiCtx.clearRect(0, 0, innerWidth, innerHeight); }
}

function burst(x, y, emojis, count = 12) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "burst";
    el.textContent = emojis[i % emojis.length];
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 180 + 80;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
    el.style.setProperty("--rot", `${Math.random() * 360 - 180}deg`);
    document.body.append(el);
    setTimeout(() => el.remove(), 1700);
  }
}

/* ---------- sparkle cursor trail ---------- */
let lastTrail = 0;
document.addEventListener("pointermove", (e) => {
  const now = performance.now();
  if (now - lastTrail < 45) return;
  lastTrail = now;
  const el = document.createElement("span");
  el.className = "trail";
  el.textContent = ["✦", "♥", "✧", "·"][Math.floor(Math.random() * 4)];
  el.style.left = `${e.clientX}px`;
  el.style.top = `${e.clientY}px`;
  el.style.color = COLORS[Math.floor(Math.random() * 4)];
  el.style.setProperty("--tx", `${Math.random() * 40 - 20}px`);
  document.body.append(el);
  setTimeout(() => el.remove(), 900);
});

/* ---------- tap anywhere for little hearts ---------- */
document.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button, a, input, label, .polaroids")) return;
  burst(e.clientX, e.clientY, ["💗", "✨", "💕"], 6);
});

/* ---------- heart wipe between pages ---------- */
const wipe = document.querySelector("#wipe");
function heartWipe() {
  wipe.classList.remove("go");
  void wipe.offsetWidth;
  wipe.classList.add("go");
}
wipe.addEventListener("animationend", () => wipe.classList.remove("go"));

/* ---------- balloons ---------- */
const BALLOON_COLORS = ["#ff5c9a", "#ffd479", "#b98cff", "#ff9cc6", "#7ee0ff", "#ff8a5c"];
function launchBalloons(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const b = document.createElement("span");
      b.className = "balloon";
      b.style.left = `${Math.random() * 92}vw`;
      b.style.setProperty("--c", BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]);
      b.style.setProperty("--t", `${Math.random() * 5 + 8}s`);
      b.style.setProperty("--sx", `${Math.random() * 60 - 30}px`);
      b.style.scale = Math.random() * 0.5 + 0.7;
      document.body.append(b);
      b.addEventListener("animationend", () => b.remove());
    }, i * 450);
  }
}
setInterval(() => { if (current === 0 && !document.hidden) launchBalloons(2); }, 4000);

/* ---------- 3D tilt on cards (mouse only) ---------- */
function addTilt(el, strength = 8) {
  el.classList.add("tilt");
  el.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
}
document.querySelectorAll(".letter, #ask-step").forEach((el) => addTilt(el, 6));

/* ---------- page 1: title, countdown, gift ---------- */
const bounceTitle = document.querySelector("#bounce-title");
let charIndex = 0;
bounceTitle.innerHTML = bounceTitle.textContent
  .split(" ")
  .map((word) => `<span class="word">${[...word].map((ch) => `<span class="ch" style="--i:${charIndex++}">${ch}</span>`).join("")}</span>`)
  .join(" ");

const countdown = document.querySelector("#countdown");
function updateCountdown() {
  const now = new Date();
  let target = new Date(now.getFullYear(), 10, 10);
  const isToday = now.getMonth() === 10 && now.getDate() === 10;
  if (isToday) { countdown.innerHTML = "🎉 <b>It's your day today!</b> 🎉"; return; }
  if (now > target) target = new Date(now.getFullYear() + 1, 10, 10);
  const diff = target - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  countdown.innerHTML = `your day is in <b>${d}</b>d <b>${h}</b>h <b>${m}</b>m <b>${s}</b>s`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

const gift = document.querySelector("#gift");
const startBtn = document.querySelector("#start");
gift.addEventListener("click", () => {
  if (gift.classList.contains("open")) return;
  gift.classList.add("open");
  const r = gift.getBoundingClientRect();
  throwConfetti(220, r.left + r.width / 2, r.top + r.height / 3);
  burst(r.left + r.width / 2, r.top, ["🎉", "🎂", "💖", "🎈", "✨"], 18);
  document.querySelector("#gift-hint").textContent = "surprise!! 🎉 your story is waiting…";
  startBtn.classList.add("show");
  launchBalloons(14);
  playSong(0);
});
startBtn.addEventListener("click", () => showPage(1));

/* ---------- page 2: candles + typed letter ---------- */
const candles = [...document.querySelectorAll(".candle")];
candles.forEach((candle) => {
  candle.addEventListener("click", () => {
    if (candle.classList.contains("out")) return;
    candle.classList.add("out");
    if (candles.every((c) => c.classList.contains("out"))) {
      const r = document.querySelector("#cake").getBoundingClientRect();
      setTimeout(() => {
        throwConfetti(200, r.left + r.width / 2, r.top + 40);
        burst(r.left + r.width / 2, r.top + 40, ["💫", "🎂", "🥳", "💖"], 16);
        document.querySelector("#cake-hint").textContent = "yaaay! your wish is on its way 💫";
      }, 400);
    }
  });
});

const typedWish = document.querySelector("#typed-wish");
const signoff = document.querySelector("#signoff");
signoff.textContent = `with all my heart, ${FROM_NAME} 💖`;
let typed = false;

function typeWish() {
  if (typed) return;
  typed = true;
  let line = 0;
  let char = 0;
  let para;
  setTimeout(function step() {
    if (char === 0) {
      para?.classList.remove("typing");
      para = document.createElement("p");
      para.className = "typing";
      typedWish.append(para);
    }
    const chars = [...WISH_LINES[line]];
    para.textContent = chars.slice(0, ++char).join("");
    if (char < chars.length) { setTimeout(step, 28); return; }
    line += 1;
    char = 0;
    if (line < WISH_LINES.length) setTimeout(step, 450);
    else {
      para.classList.remove("typing");
      signoff.classList.add("show");
    }
  }, 1100);
}

/* ---------- page 3: songs ---------- */
const songsBox = document.querySelector("#songs");
SONGS.forEach((song, i) => {
  const card = document.createElement("article");
  card.className = "song reveal";
  card.style.setProperty("--d", i + 2);
  card.style.setProperty("--song-color", song.color);
  card.innerHTML = `
    <button class="vinyl" type="button" aria-label="Play ${song.title}"><span class="vinyl-label">${song.icon}</span></button>
    <span class="tag">${song.tag}</span>
    <h3>${song.title}</h3>
    <p class="artist">${song.artist}</p>
    <div class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <p class="note">finding the song online…</p>
    <a class="store" target="_blank" rel="noopener" hidden>Listen on Apple Music ↗</a>`;
  card.querySelector(".vinyl").addEventListener("click", () => {
    if (playingIndex === i) stopAll();
    else playSong(i);
  });
  addTilt(card, 12);
  songsBox.append(card);
});
const songCards = [...songsBox.children];

// JSONP request, because the iTunes API works this way even from a local file.
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const name = `itunes_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timer = setTimeout(() => { cleanup(); reject(new Error("timeout")); }, 8000);
    function cleanup() {
      clearTimeout(timer);
      delete window[name];
      script.remove();
    }
    window[name] = (data) => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error("network")); };
    script.src = `${url}&callback=${name}`;
    document.head.append(script);
  });
}

const simplify = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

async function findOnline(song) {
  for (const country of [song.country, "US"]) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(song.term)}&media=music&entity=song&limit=15&country=${country}`;
    const { results = [] } = await jsonp(url);
    const withPreview = results.filter((r) => r.previewUrl);
    // `match` is a shorter keyword for titles that are spelled many ways (Aj / Aaj).
    const titleMatches = withPreview.filter((r) => simplify(r.trackName).includes(simplify(song.match || song.title)));
    const match = titleMatches.find((r) => simplify(r.artistName).includes(simplify(song.artist.split(" ")[0])))
      || titleMatches[0]
      || withPreview[0];
    if (match) {
      return {
        url: match.previewUrl,
        art: match.artworkUrl100?.replace("100x100", "300x300"),
        link: match.trackViewUrl,
      };
    }
  }
  return null;
}

SONGS.forEach((song, i) => {
  const card = songCards[i];
  song.online = findOnline(song)
    .then((found) => {
      if (found?.art) {
        const label = card.querySelector(".vinyl-label");
        label.style.backgroundImage = `url("${found.art}")`;
        label.classList.add("art");
      }
      if (found?.link) {
        const store = card.querySelector(".store");
        store.href = found.link;
        store.hidden = false;
      }
      card.querySelector(".note").textContent = found ? "ready to play ♪" : "couldn't find it online, a birthday tune will play";
      return found;
    })
    .catch(() => {
      card.querySelector(".note").textContent = "offline, a birthday tune will play";
      return null;
    });
});

const audios = SONGS.map(() => {
  const audio = new Audio();
  audio.loop = true;
  return audio;
});
let playingIndex = -1;
let lastSong = 0;
let notesTimer;

async function tryPlay(audio, src) {
  if (audio.dataset.src !== src) {
    audio.src = src;
    audio.dataset.src = src;
  }
  try {
    await audio.play();
    return true;
  } catch (err) {
    if (err.name === "AbortError") throw err; // stopped while loading
    return false;
  }
}

async function playSong(i) {
  stopAll();
  playingIndex = i;
  lastSong = i;
  const song = SONGS[i];
  const audio = audios[i];
  const note = songCards[i].querySelector(".note");
  songCards[i].classList.add("playing");
  muteBtn.setAttribute("aria-pressed", "true");
  muteLabel.textContent = "Pause";
  notesTimer = setInterval(() => floatNote(songCards[i]), 500);

  try {
    // 1. a full mp3 from the songs folder, if you added one
    if (!song.noLocalFile) {
      if (await tryPlay(audio, song.file)) { note.textContent = "playing the full song ♪"; return; }
      song.noLocalFile = true;
    }
    // 2. the online preview from the iTunes API
    note.textContent = "loading…";
    const online = await song.online;
    if (playingIndex !== i) return;
    if (online && await tryPlay(audio, online.url)) { note.textContent = "playing a preview from Apple Music ♪"; return; }
  } catch {
    if (playingIndex !== i) return;
  }
  if (playingIndex !== i) return;
  // 3. the built-in birthday tune
  synth.start(song.wave, song.shift);
  note.textContent = "playing a little birthday tune ♪";
}

function stopAll() {
  audios.forEach((a) => a.pause());
  synth.stop();
  clearInterval(notesTimer);
  songCards.forEach((c) => c.classList.remove("playing"));
  playingIndex = -1;
  muteBtn.setAttribute("aria-pressed", "false");
  muteLabel.textContent = "Music";
}

muteBtn.addEventListener("click", () => {
  if (playingIndex >= 0) stopAll();
  else playSong(lastSong);
});

function floatNote(card) {
  if (current !== 2) return;
  const n = document.createElement("span");
  n.className = "floating-note";
  n.textContent = ["♪", "♫", "♬", "💗"][Math.floor(Math.random() * 4)];
  n.style.setProperty("--tx", `${Math.random() * 120 - 60}px`);
  card.append(n);
  setTimeout(() => n.remove(), 2200);
}

// A small Happy Birthday tune, used when a song can't be loaded.
const synth = (() => {
  const melody = [
    [7, 0.75], [7, 0.25], [9, 1], [7, 1], [12, 1], [11, 2],
    [7, 0.75], [7, 0.25], [9, 1], [7, 1], [14, 1], [12, 2],
    [7, 0.75], [7, 0.25], [19, 1], [16, 1], [12, 1], [11, 1], [9, 2],
    [17, 0.75], [17, 0.25], [16, 1], [12, 1], [14, 1], [12, 2.5],
  ];
  const beat = 0.42;
  let ctx;
  let loopTimer;
  let nodes = [];

  function playLoop(wave, shift) {
    let t = ctx.currentTime + 0.05;
    for (const [semi, len] of melody) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.value = 261.63 * 2 ** ((semi + shift) / 12);
      const peak = wave === "square" ? 0.04 : 0.12;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + len * beat * 0.95);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + len * beat);
      nodes.push(osc);
      t += len * beat;
    }
    const total = melody.reduce((sum, [, len]) => sum + len, 0) * beat;
    loopTimer = setTimeout(() => { nodes = []; playLoop(wave, shift); }, total * 1000 + 600);
  }

  return {
    start(wave, shift) {
      ctx ??= new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
      playLoop(wave, shift);
    },
    stop() {
      clearTimeout(loopTimer);
      nodes.forEach((n) => { try { n.stop(); } catch {} });
      nodes = [];
    },
  };
})();

/* ---------- pages 4 & 5: polaroids ---------- */
function buildPolaroids(boxId, from, to) {
  const box = document.querySelector(boxId);
  PHOTOS.slice(from, to).forEach((p, k) => {
    const n = from + k + 1;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "polaroid";
    card.style.setProperty("--r", `${[-5, 3, -2][k % 3]}deg`);
    card.style.setProperty("--d", k);
    card.setAttribute("aria-label", `Photo ${n}: ${p.title}. Tap to flip.`);
    card.innerHTML = `
      <div class="flip">
        <div class="face front">
          <div class="photo">
            <span class="ph"><b>${p.icon}</b>photo missing: ${p.file}</span>
            <img src="${p.file}" alt="Afroze, photo ${n}" loading="lazy">
          </div>
          <div class="caption">${p.caption}</div>
        </div>
        <div class="face back">
          <div class="big">${p.icon}</div>
          <h3>${p.title}</h3>
          <p>${p.text}</p>
        </div>
      </div>`;
    card.querySelector("img").addEventListener("error", (e) => e.target.remove());
    card.addEventListener("click", (e) => {
      card.classList.toggle("flipped");
      if (card.classList.contains("flipped")) burst(e.clientX, e.clientY, ["💗", "✨"], 8);
    });
    box.append(card);
  });
}
buildPolaroids("#polaroids-a", 0, 3);
buildPolaroids("#polaroids-b", 3, 6);

/* ---------- page 6: the question ---------- */
const yesBtn = document.querySelector("#yes");
const noBtn = document.querySelector("#no");
const answers = document.querySelector("#answers");
const tease = document.querySelector("#tease");
const askStep = document.querySelector("#ask-step");
const whenStep = document.querySelector("#when-step");
const doneStep = document.querySelector("#done-step");
const MAX_TRIES = 6;
const TEASES = [
  "Hmm? I think your finger slipped 🤭",
  "Are you suuure? 🥺",
  "Catch me if you can 😜",
  "Nope, try the other one 💖",
  "Last chance to change your mind… 🙈",
];
let tries = 0;
let converted = false;
let convertedAt = 0;

function sayTease(text) {
  tease.textContent = text;
  tease.classList.remove("pop");
  void tease.offsetWidth;
  tease.classList.add("pop");
}

function dodge(e) {
  if (converted) return;
  if (e) e.preventDefault();
  tries += 1;

  if (tries >= MAX_TRIES) { convertNo(); return; }

  const rect = noBtn.getBoundingClientRect();
  if (noBtn.parentElement !== document.body) {
    // The card's blur effect traps fixed elements, so run free on the body.
    noBtn.style.left = `${rect.left}px`;
    noBtn.style.top = `${rect.top}px`;
    noBtn.classList.add("runaway");
    document.body.append(noBtn);
    void noBtn.offsetWidth;
  }
  const pad = 20;
  let x;
  let y;
  do {
    x = pad + Math.random() * (innerWidth - rect.width - pad * 2);
    y = 70 + Math.random() * (innerHeight - rect.height - 170);
  } while (Math.hypot(x - rect.left, y - rect.top) < 140);
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.setProperty("--shrink", 1 - tries * 0.08);
  yesBtn.style.setProperty("--grow", 1 + tries * 0.12);
  sayTease(TEASES[(tries - 1) % TEASES.length]);
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, ["💨", "😜"], 4);
}

function convertNo() {
  converted = true;
  convertedAt = performance.now();
  noBtn.classList.remove("runaway");
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.removeProperty("--shrink");
  answers.append(noBtn);
  noBtn.textContent = "Yes 💖";
  noBtn.classList.add("converted");
  sayTease("Saying no is not an option 😌💖");
  const r = noBtn.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, ["💖", "✨", "💕"], 14);
}

noBtn.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") dodge(); });
noBtn.addEventListener("pointerdown", (e) => { if (!converted) dodge(e); });
noBtn.addEventListener("click", (e) => {
  // Ignore the tap that caused the switch, so she sees the message first.
  if (converted && performance.now() - convertedAt > 500) sayYes();
  else if (e.detail === 0) dodge(e); // keyboard press
});
yesBtn.addEventListener("click", sayYes);

function sayYes() {
  throwConfetti(320, innerWidth / 2, innerHeight / 2);
  setTimeout(() => throwConfetti(200, innerWidth * 0.2, innerHeight * 0.6), 300);
  setTimeout(() => throwConfetti(200, innerWidth * 0.8, innerHeight * 0.6), 600);
  burst(innerWidth / 2, innerHeight / 2, ["💖", "💕", "🥰", "💘", "✨"], 30);
  launchBalloons(16);
  askStep.hidden = true;
  doneStep.hidden = true;
  whenStep.hidden = false;
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  document.querySelector("#when-date").min = iso;
}

whenStep.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.querySelector("#when-date").value;
  const time = document.querySelector("#when-time").value;
  const plan = new FormData(whenStep).get("plan");
  const note = document.querySelector("#when-note").value.trim();

  const when = new Date(`${date}T${time}`);
  const niceDate = when.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const niceTime = when.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  document.querySelector("#done-summary").textContent = `${plan} on ${niceDate} at ${niceTime}`;

  let message = `Hi ${FROM_NAME}! YES, I'll go on a date with you 💖\nPlan: ${plan}\nWhen: ${niceDate} at ${niceTime}`;
  if (note) message += `\nNote: ${note}`;
  message += "\n— Afroze";
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  document.querySelector("#send").href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  try { localStorage.setItem("afroze-date", JSON.stringify({ date, time, plan, note })); } catch {}

  whenStep.hidden = true;
  doneStep.hidden = false;
  throwConfetti(260, innerWidth / 2, innerHeight / 3);
  burst(innerWidth / 2, innerHeight / 3, ["💞", "🎉", "🥳", "💖"], 24);
});

document.querySelector("#change").addEventListener("click", () => {
  doneStep.hidden = true;
  whenStep.hidden = false;
});

/* ---------- start ---------- */
addEventListener("resize", resizeCanvases);
resizeCanvases();
drawSky();
pages[0].classList.remove("active");
current = -1;
showPage(0);
