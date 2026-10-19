import Phaser from "phaser";
import "./style.css";
import { bagOptions, createHouseSvg, createSceneSvg, decorations, destinations, earOptions, eyeOptions, furOptions, hatOptions, pets, traitOptions } from "./scene-art.js";

const STORE_KEY = "little-star-traveler-save-v1";
const DAY = 24 * 60 * 60 * 1000;
const SNACK_PERIOD = 8 * 60 * 1000;
const POSTCARD_PERIOD = 3 * DAY;
const LIFE_PERIOD = 90 * 1000;
const LIFE_SEQUENCE = ["explore", "friend", "rest"];
const LIFE_KIND_LABELS = { explore: "探索新地點", friend: "認識新朋友", rest: "睡覺休息" };
const souvenirCatalog = [
  { id: "moon-shell", name: "月光小貝殼", icon: "🐚", description: "海浪替你留住的一點月光。" },
  { id: "pressed-flower", name: "星瓣壓花", icon: "🌼", description: "從暮光草地撿來的花瓣書籤。" },
  { id: "tiny-comet", name: "迷你彗星石", icon: "☄️", description: "摸起來暖暖的，像一顆小星星。" },
  { id: "cloud-charm", name: "雲朵吊飾", icon: "☁️", description: "掛在行囊上就像帶著一片天空。" },
];
const houseDecorCatalog = [
  { id: "photo-frame", name: "旅人合照相框", description: "把一起旅行的樣子掛在窗邊。", price: 0, icon: "🖼️" },
  { id: "star-plush", name: "星星抱抱玩偶", description: "柔軟的小玩偶，留給休息的午後。", price: 18, icon: "🧸" },
  { id: "window-plant", name: "窗邊小花盆", description: "種一盆不急著長大的綠意。", price: 22, icon: "🪴" },
  { id: "souvenir-shelf", name: "旅途紀念小架", description: "把一路撿來的小東西好好放著。", price: 28, icon: "🎁" },
  { id: "moon-lamp", name: "月亮小夜燈", description: "夜深時，替小屋留一盞柔光。", price: 24, icon: "🌙" },
  { id: "postcard-wall", name: "星球明信片牆", description: "讓遠方寄來的風景陪在身邊。", price: 32, icon: "💌" },
];
const validOption = (options, id, fallback) => options.some((option) => option.id === id) ? id : fallback;

function createPetLifeRecord(now = Date.now()) {
  return { activity: "explore", lastActivityAt: now, memories: [], counts: { explore: 0, friend: 0, rest: 0 } };
}

function normalizePetLife(value, fallback) {
  return Object.fromEntries(pets.map((pet) => {
    const saved = value?.[pet.id];
    if (!saved || typeof saved !== "object") return [pet.id, fallback[pet.id]];
    const memories = Array.isArray(saved.memories) ? saved.memories.filter((memory) => memory && LIFE_SEQUENCE.includes(memory.activity)).slice(-6).map((memory) => ({
      id: String(memory.id || `${pet.id}-${memory.activity}-${memory.date || Date.now()}`),
      activity: memory.activity,
      title: typeof memory.title === "string" ? memory.title.slice(0, 60).replaceAll("午後草地", "暮光草地") : LIFE_KIND_LABELS[memory.activity],
      message: typeof memory.message === "string" ? memory.message.slice(0, 180).replaceAll("午後草地", "暮光草地") : "",
      date: Number(memory.date) || Date.now(),
    })) : [];
    return [pet.id, {
      activity: LIFE_SEQUENCE.includes(saved.activity) ? saved.activity : "explore",
      lastActivityAt: Number(saved.lastActivityAt) || Date.now(),
      memories,
      counts: Object.fromEntries(LIFE_SEQUENCE.map((activity) => [activity, Math.max(0, Number(saved.counts?.[activity]) || 0)])),
    }];
  }));
}

function normalizeTraveler(value) {
  if (!value || typeof value !== "object" || !pets.some((pet) => pet.id === value.species)) return null;
  const base = pets.find((pet) => pet.id === value.species) || pets[0];
  const furDefaults = { dog: "honey", cat: "silver", bunny: "cocoa" };
  const name = typeof value.name === "string" ? value.name.trim().slice(0, 10) : "";
  return {
    species: value.species,
    name: name || base.name,
    fur: validOption(furOptions, value.fur, furDefaults[value.species]),
    ears: validOption(earOptions, value.ears, value.species === "dog" ? "soft" : "upright"),
    eyes: validOption(eyeOptions, value.eyes, "smile"),
    bag: validOption(bagOptions, value.bag, "ochre"),
    hat: validOption(hatOptions, value.hat, "none"),
    trait: traitOptions.includes(value.trait) ? value.trait : traitOptions[0],
    createdAt: Number(value.createdAt) || Date.now(),
  };
}

const defaultState = () => {
  const now = Date.now();
  return {
    stardust: 12,
    snacks: 3,
    bond: 84,
    activePet: "dog",
    traveler: null,
    petLife: Object.fromEntries(pets.map((pet) => [pet.id, createPetLifeRecord(now)])),
    location: "meadow",
    visited: ["meadow"],
    decor: [],
    houseItems: ["photo-frame"],
    houseDecor: ["photo-frame"],
    cards: [{
      id: "welcome-postcard",
      title: "奶油雲朵星的來信",
      from: "奶油雲朵星",
      message: "花不會催你開。累了的話，就坐下來一起吹吹風吧。願你今天也能對自己溫柔一點。",
      destination: "meadow",
      petSpecies: "dog",
      petName: "阿栗",
      date: now - 1000 * 60 * 17,
    }],
    readCards: [],
    souvenirs: [],
    journal: [],
    albumPhotos: [],
    favorites: [],
    startedAt: now,
    lastStarAt: now,
    lastSnackAt: now,
    lastPostcardAt: now,
  };
};

function loadState() {
  const fresh = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (!saved || typeof saved !== "object") return fresh;
    const houseItems = Array.isArray(saved.houseItems)
      ? [...new Set(saved.houseItems.filter((id) => houseDecorCatalog.some((item) => item.id === id)))]
      : fresh.houseItems;
    const houseDecor = Array.isArray(saved.houseDecor)
      ? [...new Set(saved.houseDecor.filter((id) => houseItems.includes(id)))]
      : fresh.houseDecor.filter((id) => houseItems.includes(id));
    return {
      ...fresh,
      ...saved,
      traveler: normalizeTraveler(saved.traveler),
      petLife: normalizePetLife(saved.petLife, fresh.petLife),
      visited: Array.isArray(saved.visited) ? saved.visited : fresh.visited,
      decor: Array.isArray(saved.decor) ? saved.decor : [],
      houseItems,
      houseDecor,
      cards: Array.isArray(saved.cards) ? saved.cards : fresh.cards,
      souvenirs: Array.isArray(saved.souvenirs) ? saved.souvenirs.filter((item) => item && souvenirCatalog.some((souvenir) => souvenir.id === item.id)).map((item) => {
        const catalogItem = souvenirCatalog.find((souvenir) => souvenir.id === item.id);
        return { ...catalogItem, count: Math.max(1, Number(item.count) || 1) };
      }) : fresh.souvenirs,
      readCards: Array.isArray(saved.readCards) ? saved.readCards : [],
      journal: Array.isArray(saved.journal) ? saved.journal : [],
      albumPhotos: Array.isArray(saved.albumPhotos) ? saved.albumPhotos.filter((photo) => photo && typeof photo.thumbnail === "string" && photo.thumbnail.startsWith("data:image/jpeg;base64,") && photo.thumbnail.length < 1_200_000).slice(-12).map((photo) => ({
        id: String(photo.id || `photo-${Date.now()}`),
        title: typeof photo.title === "string" ? photo.title.slice(0, 60) : "生活裡的小片刻",
        date: Number(photo.date) || Date.now(),
        thumbnail: photo.thumbnail,
        category: photo.category === "travel" ? "travel" : "daily",
        source: photo.source === "footprint" ? "footprint" : "photo",
      })) : [],
      favorites: Array.isArray(saved.favorites) ? [...new Set(saved.favorites.filter((id) => typeof id === "string"))].slice(-100) : [],
      startedAt: Number(saved.startedAt) || fresh.startedAt,
      lastStarAt: Number(saved.lastStarAt) || Date.now(),
      lastSnackAt: Number(saved.lastSnackAt) || Date.now(),
      lastPostcardAt: Number(saved.lastPostcardAt) || fresh.lastPostcardAt,
      stardust: Math.max(0, Number(saved.stardust) || 0),
      snacks: Math.max(0, Number(saved.snacks) || 0),
      bond: Math.max(0, Number(saved.bond) || 0),
      location: destinations.some((item) => item.id === saved.location) ? saved.location : "meadow",
      activePet: pets.some((pet) => pet.id === saved.activePet) ? saved.activePet : "dog",
    };
  } catch {
    return fresh;
  }
}

const state = loadState();
const $ = (selector) => document.querySelector(selector);
const stage = $("#garden-stage");
const houseRoomArt = $("#house-room-art");
const modalBackdrop = $("#modal-backdrop");
const modalContent = $("#modal-content");
const modalCard = $("#modal-card");
const toastElement = $("#toast");
let gameScene = null;
let toastTimeout = 0;
let sceneTextureNumber = 0;
let travelerDraft = null;
let travelerStep = 1;
let activeAppScreen = "planet";
let memoryFilter = "all";
let pendingMemoryPhoto = "";
let pendingMemoryPhotoTask = null;
let arCameraStream = null;
let arCameraFacing = "environment";
let arPetDrag = null;

function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* The game remains playable if storage is unavailable. */ }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function currentPet() {
  const base = pets.find((pet) => pet.id === state.activePet) || pets[0];
  return state.traveler?.species === base.id ? { ...base, name: state.traveler.name, mood: state.traveler.trait } : base;
}
function currentDestination() { return destinations.find((place) => place.id === state.location) || destinations[0]; }
function unreadCount() { return state.cards.filter((card) => !state.readCards.includes(card.id)).length; }

function renderHouseScene() {
  if (!houseRoomArt) return;
  houseRoomArt.innerHTML = createHouseSvg({
    activePet: state.activePet,
    traveler: state.traveler,
    houseDecor: state.houseDecor,
    souvenirs: state.souvenirs,
  });
  $("#house-pet-name").textContent = currentPet().name;
  $("#house-item-count").textContent = `小屋裡擺著 ${state.houseDecor.length} 件小物`;
  const placedItems = houseDecorCatalog.filter((item) => state.houseDecor.includes(item.id));
  $("#house-room-items").innerHTML = placedItems.length ? placedItems.map((item) => `
    <article class="house-room-item house-item-${item.id}"><span aria-hidden="true">${item.icon}</span><div><strong>${escapeHtml(item.name)}</strong><small>好好擺在小屋裡</small></div></article>`).join("")
    : `<div class="house-room-empty"><span aria-hidden="true">♡</span><p>留一個喜歡的小物在這裡吧。</p><button class="text-link" type="button" data-house-decor-empty>挑一件收藏 →</button></div>`;
  $("[data-house-decor-empty]")?.addEventListener("click", openHouseDecor);
}

function updateHUD() {
  const pet = currentPet();
  $("#stardust-count").textContent = String(state.stardust);
  $("#snack-count").textContent = String(state.snacks);
  $("#location-name").textContent = currentDestination().name;
  $("#scene-whisper").textContent = sceneWhispers[state.location] || "微風把草葉吹得沙沙響。";
  $("#active-pet-name").textContent = pet.name;
  $("#active-pet-mood").textContent = pet.mood;
  $("#pet-avatar").textContent = pet.icon;
  $("#days-together").textContent = String(Math.max(1, Math.floor((Date.now() - state.startedAt) / DAY) + 1));
  $("#bond-level").textContent = `星光夥伴 · ${Math.floor(state.bond / 20) + 1}`;
  const progress = state.bond % 20 / 20 * 100;
  $("#bond-progress").style.width = `${progress}%`;
  $("#bond-percent").textContent = `${Math.round(progress)}%`;
  const latest = state.cards.at(-1);
  if (latest) {
    $("#latest-card-title").textContent = latest.title;
    $("#latest-card-excerpt").textContent = latest.message;
  }
  const unread = unreadCount();
  $("#unread-count").textContent = String(unread);
  $("#unread-count").hidden = unread === 0;
  const navUnread = $("#nav-unread-count");
  if (navUnread) {
    navUnread.textContent = String(unread);
    navUnread.hidden = unread === 0;
  }
  const nextPostcardAt = state.lastPostcardAt + POSTCARD_PERIOD;
  const daysUntilPostcard = Math.max(1, Math.ceil((nextPostcardAt - Date.now()) / DAY));
  const arrivalNote = $("#postcard-arrival-note");
  if (arrivalNote) arrivalNote.textContent = `遠方下一封明信片約 ${daysUntilPostcard} 天後寄達`;
  $("#traveler-button-label").textContent = state.traveler ? "我的旅人證" : "製作旅人證";
  $("#pet-choices").innerHTML = pets.map((petOption) => `
    <button class="pet-choice ${petOption.id === state.activePet ? "active" : ""}" data-pet="${petOption.id}" type="button" aria-pressed="${petOption.id === state.activePet}">
      <span class="pet-choice-icon" aria-hidden="true">${petOption.icon}</span><span class="pet-choice-copy"><strong>${state.traveler?.species === petOption.id ? escapeHtml(state.traveler.name) : petOption.name}</strong><small>${petOption.kind}${state.traveler?.species === petOption.id ? " · 旅人" : ""}</small></span>
    </button>`).join("");
  $("#pet-choices").querySelectorAll("[data-pet]").forEach((button) => {
    button.addEventListener("click", () => selectPet(button.dataset.pet));
  });
  updatePetLifePanel();
}

const sceneWhispers = {
  meadow: "暮色落在樹屋旁，星星慢慢亮了起來。",
  coast: "海浪把一封沒寫完的信送上岸。",
  sunflower: "向日葵們正朝著同一個方向發呆。",
  stargarden: "有幾顆星星，今晚打算陪我們久一點。",
};

const lifeStatus = {
  explore: { icon: "✦", title: "正在探索", note: "沿著小路留下新的腳印，聞一聞花香。" },
  friend: { icon: "♡", title: "遇見新朋友", note: "一場輕輕的招呼，讓今天多了一個熟悉的身影。" },
  rest: { icon: "Zz", title: "睡覺休息", note: "找一片柔軟的草地，安心做一個暖暖的夢。" },
};

const lifeMemoryArt = {
  explore: { icon: "🌼", accent: "✦", fallbackTitle: "在星球散散步", fallbackMessage: "慢慢走，風景會自己出現。" },
  friend: { icon: "🐦", accent: "♡", fallbackTitle: "新的朋友正在路上", fallbackMessage: "也許下一個轉角，就會遇見誰。" },
  rest: { icon: "🌙", accent: "Zz", fallbackTitle: "好好睡一個午覺", fallbackMessage: "醒來時，星星還會在這裡。" },
};
const lifeFriends = ["小雲雀", "郵差蝸牛", "星星精靈", "棉花兔"];

function petLifeName(petId) {
  const base = pets.find((pet) => pet.id === petId) || pets[0];
  return state.traveler?.species === petId ? state.traveler.name : base.name;
}

function formatAge(timestamp) {
  const elapsed = Math.max(0, Date.now() - Number(timestamp || Date.now()));
  if (elapsed < 60_000) return "剛剛";
  if (elapsed < 60 * 60_000) return `${Math.floor(elapsed / 60_000)} 分鐘前`;
  if (elapsed < DAY) return `${Math.floor(elapsed / (60 * 60_000))} 小時前`;
  return `${Math.floor(elapsed / DAY)} 天前`;
}

function makeLifeMemory(activity, petId, date) {
  const petName = petLifeName(petId);
  const place = destinations.find((destination) => destination.id === state.location) || destinations[0];
  const friend = lifeFriends[Math.floor(date / LIFE_PERIOD + pets.findIndex((pet) => pet.id === petId)) % lifeFriends.length];
  const memory = {
    id: `${petId}-${activity}-${date}`,
    activity,
    date,
  };
  if (activity === "explore") {
    memory.title = `在${place.name}發現新風景`;
    memory.message = `${petName}沿著小路走了一段，還拾起一枚亮晶晶的星塵。`;
  } else if (activity === "friend") {
    memory.title = `認識了${friend}`;
    memory.message = `${friend}停下來和${petName}打招呼，牠們一起聊了好一會兒。`;
  } else {
    memory.title = `${petName}的午後小憩`;
    memory.message = `在${place.name}找了一片軟草地，做了一個有花香的夢。`;
  }
  return memory;
}

function renderLifeMemoryGrid(record, petId) {
  return LIFE_SEQUENCE.map((activity) => {
    const art = lifeMemoryArt[activity];
    const memory = [...record.memories].reverse().find((entry) => entry.activity === activity);
    return `<article class="life-memory-card life-memory-${activity}">
      <div class="life-memory-art" aria-hidden="true"><span>${art.icon}</span><i>${art.accent}</i></div>
      <div class="life-memory-copy"><div><strong>${LIFE_KIND_LABELS[activity]}</strong><time>${memory ? escapeHtml(formatAge(memory.date)) : "慢慢來"}</time></div>
        <p>${escapeHtml(memory?.title || art.fallbackTitle)}</p><small>${escapeHtml(memory?.message || art.fallbackMessage)}</small></div>
    </article>`;
  }).join("");
}

function updatePetLifePanel() {
  const record = state.petLife[state.activePet] || (state.petLife[state.activePet] = createPetLifeRecord());
  const status = lifeStatus[record.activity] || lifeStatus.explore;
  const destination = destinations.find((place) => place.id === state.location) || destinations[0];
  const title = record.activity === "explore" ? `${petLifeName(state.activePet)}正在${destination.name}探索`
    : record.activity === "friend" ? `${petLifeName(state.activePet)}在${destination.name}遇見新朋友`
      : `${petLifeName(state.activePet)}在${destination.name}睡午覺`;
  const remaining = Math.max(0, record.lastActivityAt + LIFE_PERIOD - Date.now());
  const seconds = Math.ceil(remaining / 1000);
  const timer = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  $("#pet-life-icon").textContent = status.icon;
  $("#pet-life-title").textContent = title;
  $("#pet-life-note").textContent = status.note;
  $("#pet-life-timer").textContent = `下一段日常 · ${timer}`;
  $("#life-explore-count").textContent = String(record.counts.explore);
  $("#life-friend-count").textContent = String(record.counts.friend);
  $("#life-rest-count").textContent = String(record.counts.rest);
  $("#life-memory-grid").innerHTML = renderLifeMemoryGrid(record, state.activePet);
}

function advancePetLives() {
  const now = Date.now();
  let changed = false;
  for (const pet of pets) {
    const record = state.petLife[pet.id] || (state.petLife[pet.id] = createPetLifeRecord(now));
    const cycles = Math.floor((now - record.lastActivityAt) / LIFE_PERIOD);
    if (cycles < 1) continue;
    changed = true;
    const oldIndex = LIFE_SEQUENCE.indexOf(record.activity);
    const completeRounds = Math.floor(cycles / LIFE_SEQUENCE.length);
    for (const activity of LIFE_SEQUENCE) record.counts[activity] += completeRounds;
    for (let step = 1; step <= cycles % LIFE_SEQUENCE.length; step += 1) {
      record.counts[LIFE_SEQUENCE[(oldIndex + step) % LIFE_SEQUENCE.length]] += 1;
    }
    const firstNewStep = Math.max(1, cycles - 5);
    for (let step = firstNewStep; step <= cycles; step += 1) {
      const activity = LIFE_SEQUENCE[(oldIndex + step) % LIFE_SEQUENCE.length];
      record.memories.push(makeLifeMemory(activity, pet.id, record.lastActivityAt + step * LIFE_PERIOD));
    }
    record.memories = record.memories.slice(-6);
    record.activity = LIFE_SEQUENCE[(oldIndex + cycles) % LIFE_SEQUENCE.length];
    record.lastActivityAt += cycles * LIFE_PERIOD;
  }
  return changed;
}

function showToast(message) {
  window.clearTimeout(toastTimeout);
  toastElement.textContent = message;
  toastElement.classList.add("visible");
  toastTimeout = window.setTimeout(() => toastElement.classList.remove("visible"), 2400);
}

function paintScene() {
  if (gameScene) gameScene.paint(state);
  renderHouseScene();
}

function refresh() {
  updateHUD();
  paintScene();
  persist();
}

function selectPet(petId) {
  if (!pets.some((pet) => pet.id === petId)) return;
  state.activePet = petId;
  refresh();
  gameScene?.showSparkle(petId, "✦");
  showToast(`${currentPet().name} 靠過來陪你了。`);
}

function closeModal() {
  modalBackdrop.hidden = true;
  modalCard.classList.remove("traveler-modal");
  document.body.classList.remove("modal-open");
}

function openModal(markup) {
  modalContent.innerHTML = markup;
  modalCard.classList.toggle("traveler-modal", markup.includes("traveler-maker-layout") || markup.includes("traveler-id-card"));
  modalBackdrop.hidden = false;
  document.body.classList.add("modal-open");
  modalCard.scrollTop = 0;
  $("#modal-close").focus({ preventScroll: true });
}

function modalHeader(eyebrow, title, description) {
  return `<span class="modal-eyebrow">${eyebrow}</span><h2 class="modal-title" id="modal-title">${title}</h2><p class="modal-intro">${description}</p>`;
}

function choiceButtons(field, options, selected, iconKey = "icon") {
  return options.map((option) => `<button class="maker-choice ${selected === option.id ? "selected" : ""}" type="button" data-field="${field}" data-value="${option.id}" aria-pressed="${selected === option.id}"><span class="maker-choice-icon" aria-hidden="true">${option[iconKey]}</span><strong>${option.name}</strong></button>`).join("");
}

function travelerPreviewMarkup() {
  const species = pets.find((pet) => pet.id === travelerDraft.species) || pets[0];
  const fur = furOptions.find((option) => option.id === travelerDraft.fur) || furOptions[0];
  const bag = bagOptions.find((option) => option.id === travelerDraft.bag) || bagOptions[0];
  const hat = hatOptions.find((option) => option.id === travelerDraft.hat) || hatOptions[0];
  return `<div class="traveler-preview" style="--traveler-fur:${fur.swatch}">
    <span class="preview-star preview-star-one" aria-hidden="true">✦</span><span class="preview-star preview-star-two" aria-hidden="true">✧</span>
    <span class="preview-creature" aria-hidden="true">${species.icon}<i>${hat.id === "none" ? "" : hat.icon}</i></span>
    <div class="preview-copy"><span class="preview-caption">MY LITTLE TRAVELER</span><strong id="traveler-preview-name">${escapeHtml(travelerDraft.name || "小小旅人")}</strong>
      <small>${species.kind} · ${fur.name}</small><span class="preview-kit">${bag.icon}　${hat.id === "none" ? "準備好出發" : hat.name}</span></div>
  </div>`;
}

function renderTravelerStep() {
  const descriptions = [
    "選一種喜歡的模樣，讓毛孩子成為旅程裡最特別的夥伴。",
    "給牠一個名字，再挑一種最像牠的旅行個性。",
    "背起小行囊、戴上喜歡的帽子，旅人證就完成了。",
  ];
  let controls = "";
  if (travelerStep === 1) {
    const speciesButtons = pets.map((pet) => `<button class="species-choice ${travelerDraft.species === pet.id ? "selected" : ""}" type="button" data-field="species" data-value="${pet.id}" aria-pressed="${travelerDraft.species === pet.id}"><span aria-hidden="true">${pet.icon}</span><strong>${pet.kind}</strong></button>`).join("");
    const furButtons = furOptions.map((option) => `<button class="fur-choice ${travelerDraft.fur === option.id ? "selected" : ""}" type="button" data-field="fur" data-value="${option.id}" aria-label="${option.name}" aria-pressed="${travelerDraft.fur === option.id}"><span style="--fur-swatch:${option.swatch}"></span><small>${option.name}</small></button>`).join("");
    controls = `<div class="maker-section"><h3>選擇毛孩外型</h3><div class="species-options">${speciesButtons}</div></div>
      <div class="maker-section"><h3>挑一種毛色</h3><div class="fur-options">${furButtons}</div></div>
      <div class="maker-section split-options"><div><h3>耳朵</h3><div class="maker-choice-row">${choiceButtons("ears", earOptions)}</div></div><div><h3>眼睛</h3><div class="maker-choice-row">${choiceButtons("eyes", eyeOptions)}</div></div></div>`;
  } else if (travelerStep === 2) {
    const traits = traitOptions.map((trait) => `<button class="trait-choice ${travelerDraft.trait === trait ? "selected" : ""}" type="button" data-field="trait" data-value="${trait}" aria-pressed="${travelerDraft.trait === trait}"><span aria-hidden="true">${trait === "愛看雲朵" ? "☁" : trait === "喜歡散步" ? "➶" : "♡"}</span>${trait}</button>`).join("");
    controls = `<label class="maker-label" for="traveler-name">旅人名字</label><input class="maker-input" id="traveler-name" type="text" maxlength="10" autocomplete="off" placeholder="像是：咖啡" value="${escapeHtml(travelerDraft.name)}"><p class="maker-hint">最多 10 個字，之後也可以隨時改名。</p>
      <div class="maker-section"><h3>牠最喜歡</h3><div class="trait-options">${traits}</div></div>`;
  } else {
    controls = `<div class="maker-section"><h3>替牠準備一只小行囊</h3><div class="gear-options">${choiceButtons("bag", bagOptions)}</div></div>
      <div class="maker-section"><h3>再選一頂旅途小帽</h3><div class="gear-options hat-options">${choiceButtons("hat", hatOptions)}</div></div>
      <p class="maker-hint">完成後，牠會帶著這身裝扮出現在小樹屋裡。旅人證只會儲存在這個裝置。</p>`;
  }
  const progress = [1, 2, 3].map((step) => `<span class="${travelerStep >= step ? "active" : ""}"></span>`).join("");
  openModal(`${modalHeader("MAKE YOUR LITTLE TRAVELER", "製作專屬小小旅人證", descriptions[travelerStep - 1])}
    <div class="traveler-progress" aria-label="第 ${travelerStep} 步，共三步">${progress}<small>STEP ${travelerStep} / 3</small></div>
    <div class="traveler-maker-layout">${travelerPreviewMarkup()}<div class="traveler-maker-controls">${controls}</div></div>
    <div class="maker-footer">${travelerStep > 1 ? '<button class="secondary-button" id="traveler-back" type="button">← 上一步</button>' : '<span class="maker-footer-note">慢慢挑，沒有時間限制 ♡</span>'}<button class="primary-button" id="traveler-next" type="button">${travelerStep === 3 ? "完成旅人證" : "下一步　→"}</button></div>`);

  modalContent.querySelectorAll("[data-field]").forEach((button) => {
    button.addEventListener("click", () => {
      travelerDraft[button.dataset.field] = button.dataset.value;
      renderTravelerStep();
    });
  });
  const nameInput = $("#traveler-name");
  nameInput?.addEventListener("input", (event) => {
    travelerDraft.name = event.currentTarget.value.slice(0, 10);
    const previewName = $("#traveler-preview-name");
    if (previewName) previewName.textContent = travelerDraft.name || "小小旅人";
  });
  $("#traveler-back")?.addEventListener("click", () => { travelerStep -= 1; renderTravelerStep(); });
  $("#traveler-next").addEventListener("click", () => {
    if (travelerStep === 2 && !travelerDraft.name.trim()) {
      showToast("先替小小旅人寫下名字吧。 ");
      $("#traveler-name")?.focus();
      return;
    }
    if (travelerStep < 3) {
      travelerStep += 1;
      renderTravelerStep();
      return;
    }
    state.traveler = normalizeTraveler({ ...travelerDraft, name: travelerDraft.name.trim(), createdAt: state.traveler?.createdAt || Date.now() });
    state.activePet = state.traveler.species;
    refresh();
    gameScene?.showSparkle(state.activePet, "✦");
    openTravelerCard();
    showToast(`${state.traveler.name} 的小小旅人證做好了。`);
  });
}

function openTravelerMaker() {
  const base = currentPet();
  const furDefaults = { dog: "honey", cat: "silver", bunny: "cocoa" };
  travelerDraft = normalizeTraveler(state.traveler || {
    species: state.activePet,
    name: base.name,
    fur: furDefaults[state.activePet],
    ears: state.activePet === "dog" ? "soft" : "upright",
    eyes: "smile",
    bag: "ochre",
    hat: "none",
    trait: traitOptions[0],
  });
  travelerStep = 1;
  renderTravelerStep();
}

function openTravelerCard() {
  const traveler = state.traveler;
  if (!traveler) {
    openTravelerMaker();
    return;
  }
  const species = pets.find((pet) => pet.id === traveler.species) || pets[0];
  const fur = furOptions.find((option) => option.id === traveler.fur) || furOptions[0];
  const bag = bagOptions.find((option) => option.id === traveler.bag) || bagOptions[0];
  const hat = hatOptions.find((option) => option.id === traveler.hat) || hatOptions[0];
  const departure = new Date(traveler.createdAt).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", ".");
  openModal(`${modalHeader("A LITTLE TRAVELER ID", "專屬小小旅人證", "每一段柔軟的陪伴，都從這張小小的證件開始。")}
    <article class="traveler-id-card" style="--traveler-fur:${fur.swatch}">
      <div class="traveler-id-top"><span>THE LITTLE STAR TRAVELER</span><span class="id-stamp">✦ 出發中</span></div>
      <div class="traveler-id-main"><div class="traveler-id-portrait" aria-hidden="true"><span>${species.icon}</span><i>${hat.id === "none" ? "" : hat.icon}</i><b>${bag.icon}</b></div><div class="traveler-id-name"><small>NAME / 名字</small><strong>${escapeHtml(traveler.name)}</strong><span>${species.kind} · ${fur.name}</span></div></div>
      <div class="traveler-id-fields"><div><small>出發日</small><strong>${departure}</strong></div><div><small>喜歡</small><strong>${traveler.trait}</strong></div><div class="traveler-id-destination"><small>目的地</small><strong>未知星球 ♡</strong></div></div>
      <span class="traveler-paw" aria-hidden="true">✿</span>
    </article><div class="traveler-card-actions"><button class="secondary-button" id="edit-traveler" type="button">重新整理外型</button><button class="primary-button" id="traveler-card-done" type="button">收好旅人證</button></div>`);
  $("#edit-traveler").addEventListener("click", openTravelerMaker);
  $("#traveler-card-done").addEventListener("click", closeModal);
}

const postage = {
  meadow: { from: "暮光草地", title: "草葉間的悄悄話", message: "你好呀，剛才我們遇見一陣剛剛好的風。牠提醒我，停下來並不等於落後。希望這張小小的明信片，也能替你留一片可以休息的草地。" },
  coast: { from: "海邊郵局", title: "從浪花裡撈起的信", message: "今天的海很安靜，浪花幫我把這封信帶到你手上。你可以想念，可以休息，也可以先什麼都不決定。遠方的風會替你守住那些還沒整理好的心事。" },
  sunflower: { from: "向日葵小徑", title: "寄給慢慢長大的你", message: "向日葵朝著陽光，但陰天時也沒有停止生長。想告訴你：不需要每天都閃閃發亮，你現在的樣子，也值得被好好喜歡。" },
  stargarden: { from: "星河露台", title: "星星今晚沒有催促", message: "我們在露台上數了好久的星星。沒有一顆問我們明天要去哪裡；牠們只是一起亮著。晚安，願你今晚也能放心地慢下來。" },
};

function addSouvenir(souvenir) {
  if (!souvenir) return;
  const existing = state.souvenirs.find((item) => item.id === souvenir.id);
  if (existing) existing.count += 1;
  else state.souvenirs.push({ ...souvenir, count: 1 });
}

function makeDailyPostcard(date) {
  const pet = currentPet();
  const place = currentDestination();
  const life = state.petLife[pet.id] || createPetLifeRecord(date);
  const activity = LIFE_SEQUENCE.includes(life.activity) ? life.activity : "explore";
  const recentFriend = [...life.memories].reverse().find((memory) => memory.activity === "friend");
  const messages = {
    explore: `${pet.name}今天在${place.name}慢慢散步，發現一朵很像星星的小花。牠說，走得慢一點，也能遇見好多風景。`,
    friend: recentFriend?.message || `${pet.name}在${place.name}遇見一位新朋友，牠們一起分享了午後的微風。今天也有人記得替你留一個位置。`,
    rest: `${pet.name}在${place.name}找了片柔軟的草地睡午覺，夢見你們一起看星星。醒來後，牠想把這份安穩也寄給你。`,
  };
  const titles = { explore: "路邊的小小發現", friend: "遇見朋友的一天", rest: "從午睡夢裡寄來的信" };
  const souvenir = Math.random() < 0.35 ? souvenirCatalog[Math.floor(Math.random() * souvenirCatalog.length)] : null;
  return {
    id: `faraway-${pet.id}-${date}`,
    title: `${pet.name}寄來的${titles[activity]}`,
    from: `${pet.name} · ${place.name}`,
    message: messages[activity],
    destination: place.id,
    petSpecies: pet.id,
    petName: pet.name,
    activity,
    souvenir,
    date,
  };
}

function deliverDuePostcards(now = Date.now()) {
  const due = Math.floor((now - state.lastPostcardAt) / POSTCARD_PERIOD);
  if (due < 1) return false;
  // Returning from a long break brings the three most recent letters, at most.
  const firstBatch = Math.max(1, due - 2);
  for (let batch = firstBatch; batch <= due; batch += 1) {
    const card = makeDailyPostcard(state.lastPostcardAt + batch * POSTCARD_PERIOD);
    state.cards.push(card);
    if (card.souvenir) addSouvenir(card.souvenir);
  }
  state.cards = state.cards.slice(-60);
  state.lastPostcardAt += due * POSTCARD_PERIOD;
  return true;
}

function openTravel() {
  if (activeAppScreen === "footprints") stopArCamera();
  const options = destinations.map((place) => {
    const visited = state.visited.includes(place.id);
    const swatches = { meadow: "#c8debd", coast: "#c4e2df", sunflower: "#e7dfad", stargarden: "#7f91a1" };
    return `<button class="destination-option" type="button" data-destination="${place.id}">
      <span class="destination-swatch" style="background:${swatches[place.id]}" aria-hidden="true">${place.id === "coast" ? "≈" : place.id === "sunflower" ? "✿" : place.id === "stargarden" ? "✦" : "⌂"}</span>
      <span class="destination-copy"><strong>${place.name} ${visited ? "" : '<span class="new-stamp">新地方</span>'}</strong><small>${place.description}</small></span>
      <span class="destination-tail" aria-hidden="true">→</span>
    </button>`;
  }).join("");
  openModal(`${modalHeader("A LITTLE WALK TOGETHER", "想去哪裡走走？", "選一個喜歡的地方慢慢散步。旅行不用花星塵，也不會錯過任何事。")}<div class="destination-list">${options}</div>`);
  modalContent.querySelectorAll("[data-destination]").forEach((button) => {
    button.addEventListener("click", () => travelTo(button.dataset.destination));
  });
}

function travelTo(destinationId) {
  const place = destinations.find((item) => item.id === destinationId);
  if (!place) return;
  const isFirstVisit = !state.visited.includes(place.id);
  state.location = place.id;
  closeModal();
  if (isFirstVisit) {
    state.visited.push(place.id);
    state.stardust += 8;
    const letter = postage[place.id];
    const pet = currentPet();
    state.cards.push({ id: `${place.id}-${Date.now()}`, ...letter, destination: place.id, petSpecies: pet.id, petName: pet.name, activity: state.petLife[pet.id]?.activity || "explore", date: Date.now() });
    state.bond += 1;
    refresh();
    showToast(`新旅程郵票收藏好了，${letter.from} 也捎來一張信。`);
  } else {
    refresh();
    showToast(`和${currentPet().name}在${place.name}散散步。`);
  }
}

function openInbox() {
  setActiveAppNav("mail");
  state.readCards = [...new Set([...state.readCards, ...state.cards.map((card) => card.id)])];
  refresh();
  const incoming = [...state.cards].reverse().map((card) => {
    const place = destinations.find((destination) => destination.id === card.destination)
      || destinations.find((destination) => postage[destination.id]?.from === card.from)
      || destinations[0];
    const pet = pets.find((petOption) => petOption.id === card.petSpecies) || currentPet();
    const activity = LIFE_SEQUENCE.includes(card.activity) ? card.activity : "explore";
    const souvenir = souvenirCatalog.find((item) => item.id === card.souvenir?.id);
    const date = new Date(Number(card.date) || Date.now()).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", " · ");
    const attachment = souvenir ? `<div class="attached-souvenir"><span aria-hidden="true">${souvenir.icon}</span><div><small>隨信附上的小紀念品</small><strong>${escapeHtml(souvenir.name)}</strong></div></div>` : "";
    return `
    <article class="mail-card postcard-mail postcard-mail-${place.id}">
      <div class="postcard-painting postcard-painting-${place.id}" aria-label="${escapeHtml(place.name)}的手繪風景">
        <span class="postcard-painting-moon" aria-hidden="true">${place.id === "coast" ? "☼" : place.id === "sunflower" ? "☀" : "✦"}</span>
        <span class="postcard-painting-pet" aria-hidden="true">${pet.icon}</span>
        <span class="postcard-painting-flower" aria-hidden="true">${activity === "rest" ? "Zz" : activity === "friend" ? "♡" : "✿"}</span>
        <span class="postcard-painting-stamp" aria-hidden="true">✉</span>
      </div>
      <div class="postcard-copy">
        <div class="postcard-meta"><small>FROM ${escapeHtml(card.from || "一顆遙遠的星球")}</small><time>${date}</time></div>
        <strong>${escapeHtml(card.title || "遠方明信片")}</strong>
        <p>${escapeHtml(card.message || "")}</p>${attachment}
      </div>
    </article>`;
  }).join("");
  const journal = [...state.journal].reverse().map((letter) => `
    <article class="mail-card self-letter"><small>FOR A DAY WHEN YOU NEED IT</small><strong>寫給自己的信</strong><p>${escapeHtml(letter.message)}</p><time>${new Date(letter.date).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}</time></article>`).join("");
  const content = incoming || "<div class=\"empty-mail\">郵筒裡還很安靜。去一個新地方走走，<br>也許會收到遠方捎來的信。</div>";
  const souvenirCount = state.souvenirs.reduce((total, item) => total + item.count, 0);
  const shelfItems = state.souvenirs.length ? state.souvenirs.map((item) => `
    <div class="souvenir-item"><span aria-hidden="true">${escapeHtml(item.icon)}</span><strong>${escapeHtml(item.name)}</strong><small>× ${item.count}</small></div>`).join("") : `<p class="souvenir-empty">有些明信片會帶來小禮物，收到後會收在這裡。</p>`;
  const shelf = `<section class="souvenir-shelf"><div class="souvenir-shelf-heading"><div><small>POSTCARD SOUVENIRS</small><strong>旅行小紀念品</strong></div><span>共 ${souvenirCount} 件</span></div><div class="souvenir-items">${shelfItems}</div></section>`;
  openModal(`${modalHeader("SNAIL MAIL FROM THE STARS", "星際郵筒", "每隔幾天，遠方的旅伴就會寄來一張明信片；偶爾還會附上沿途拾起的小禮物。" )}${shelf}<div class="mail-list">${content}${journal}</div>`);
}

function albumDate(timestamp) {
  return new Date(Number(timestamp) || Date.now()).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", ".");
}

function collectAlbumEntries() {
  const daily = pets.flatMap((pet) => {
    const record = state.petLife[pet.id] || createPetLifeRecord();
    return record.memories.map((memory) => {
      const art = lifeMemoryArt[memory.activity] || lifeMemoryArt.explore;
      return {
        id: `daily-${memory.id}`, kind: "daily", date: memory.date,
        title: memory.title || art.fallbackTitle, message: memory.message || art.fallbackMessage,
        label: LIFE_KIND_LABELS[memory.activity], art: memory.activity, icon: art.icon,
        petIcon: pet.icon, petName: petLifeName(pet.id),
      };
    });
  });
  const trips = state.cards.map((card) => {
    const place = destinations.find((item) => item.id === card.destination) || destinations[0];
    const pet = pets.find((item) => item.id === card.petSpecies) || pets[0];
    return {
      id: `travel-${card.id}`, kind: "travel", date: Number(card.date) || Date.now(),
      title: card.title || `${place.name}的明信片`, message: card.message || "遠方捎來了一張明信片。",
      label: place.name, art: place.id, icon: "✉", petIcon: pet.icon, petName: card.petName || pet.name,
    };
  });
  const letters = state.journal.map((letter, index) => ({
    id: `letter-${letter.date || index}`, kind: "letter", date: Number(letter.date) || Date.now(),
    title: "寫給自己的信", message: letter.message || "留給未來的一句話。", label: "給自己的心意", art: "letter", icon: "♡", petIcon: "✎",
  }));
  const photos = state.albumPhotos.map((photo) => ({
    id: photo.id, kind: "photo", category: photo.category || "daily", date: photo.date, title: photo.title || "生活裡的小片刻",
    message: photo.source === "footprint" ? "在現實的風景裡，再一次和毛孩子相遇。" : "把這一天，好好留在相簿裡。",
    label: photo.source === "footprint" ? "AR 足跡" : "我的照片", image: photo.thumbnail, icon: "♡", petIcon: currentPet().icon,
  }));
  return [...daily, ...trips, ...letters, ...photos].sort((a, b) => b.date - a.date);
}

function memoryAlbumCard(entry) {
  const favorite = state.favorites.includes(entry.id);
  const artMarkup = entry.image
    ? `<img src="${entry.image}" alt="${escapeHtml(entry.title)}" loading="lazy">`
    : `<span class="album-art-pet" aria-hidden="true">${escapeHtml(entry.kind === "travel" || entry.kind === "daily" ? entry.petIcon : entry.kind === "letter" ? "✎" : entry.icon)}</span><span class="album-art-mark" aria-hidden="true">${escapeHtml(entry.kind === "travel" ? "✦" : entry.kind === "letter" ? "♡" : entry.art === "rest" ? "Zz" : entry.art === "friend" ? "♡" : "✿")}</span>`;
  return `<article class="album-memory-card album-memory-${entry.kind}">
    <div class="album-art album-art-${entry.kind} ${entry.kind === "travel" ? `album-scene-${entry.art}` : entry.kind === "daily" ? `album-moment-${entry.art}` : ""}" aria-label="${escapeHtml(entry.label)}">
      ${artMarkup}${entry.kind === "travel" ? `<span class="album-art-stamp" aria-hidden="true">✉</span>` : ""}
    </div>
    <div class="album-memory-copy"><small>${escapeHtml(entry.label)} · ${escapeHtml(albumDate(entry.date))}</small><strong>${escapeHtml(entry.title)}</strong><p>${escapeHtml(entry.message)}</p></div>
    <button class="album-favorite ${favorite ? "is-favorite" : ""}" type="button" data-album-favorite="${escapeHtml(entry.id)}" aria-label="${favorite ? "取消" : "加入"}最喜歡的事" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
  </article>`;
}

function renderMemoryAlbum() {
  const grid = $("#memory-album-grid");
  if (!grid) return;
  document.querySelectorAll("[data-memory-filter]").forEach((button) => {
    const selected = button.dataset.memoryFilter === memoryFilter;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-selected", String(selected));
    button.onclick = () => {
      memoryFilter = button.dataset.memoryFilter;
      renderMemoryAlbum();
    };
  });
  const allEntries = collectAlbumEntries();
  const filtered = allEntries.filter((entry) => {
    if (memoryFilter === "daily") return entry.kind === "daily" || entry.kind === "photo" || entry.kind === "letter";
    if (memoryFilter === "travel") return entry.kind === "travel" || entry.category === "travel";
    if (memoryFilter === "favorite") return state.favorites.includes(entry.id);
    return true;
  });
  grid.innerHTML = filtered.length ? filtered.map(memoryAlbumCard).join("") : `<div class="album-empty"><span aria-hidden="true">${memoryFilter === "favorite" ? "♡" : "✿"}</span><strong>${memoryFilter === "favorite" ? "喜歡的故事，等你慢慢挑選。" : memoryFilter === "travel" ? "第一張旅行明信片，正在路上。" : "每一段小小日常，都會成為故事。"}</strong><p>${memoryFilter === "favorite" ? "按下回憶上的愛心，就能把它留在這裡。" : memoryFilter === "travel" ? "去星球散散步，郵差會把風景寄回來。" : "和毛孩子一起生活，回憶就會慢慢長出來。"}</p></div>`;
  grid.querySelectorAll("[data-album-favorite]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.albumFavorite;
      state.favorites = state.favorites.includes(id) ? state.favorites.filter((favoriteId) => favoriteId !== id) : [...state.favorites, id];
      persist();
      renderMemoryAlbum();
    });
  });
  $("#add-memory-button").onclick = openMemoryUpload;
}

function openMemoryBook() {
  setActiveAppNav("memories");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateFootprintSnapshot() {
  const latest = [...state.albumPhotos].filter((photo) => photo.source === "footprint").sort((a, b) => b.date - a.date)[0];
  const image = $("#footprint-snapshot-image");
  const placeholder = $("#footprint-snapshot-placeholder");
  if (!image || !placeholder) return;
  image.hidden = !latest;
  placeholder.hidden = Boolean(latest);
  if (latest) {
    image.src = latest.thumbnail;
    $("#footprint-snapshot-date").textContent = albumDate(latest.date);
    $("#footprint-snapshot-title").textContent = latest.title;
  } else {
    $("#footprint-snapshot-date").textContent = "等一張新的相遇合照";
    $("#footprint-snapshot-title").textContent = "在陽光下，再一次相遇";
    $("#footprint-preview-pet").textContent = currentPet().icon;
  }
}

function renderFootprints() {
  const place = currentDestination();
  const pet = currentPet();
  $("#footprint-location-name").textContent = place.name;
  $("#ar-pet-emoji").textContent = pet.icon;
  $("#ar-pet-caption").textContent = `${pet.name} · 星光旅伴`;
  $("#ar-memory-bubble").querySelector("p").textContent = `這裡好像是我們常來散步的地方！你還記得嗎？`;
  updateFootprintSnapshot();
}

function openFootprints() {
  setActiveAppNav("footprints");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function stopArCamera() {
  arCameraStream?.getTracks().forEach((track) => track.stop());
  arCameraStream = null;
  const video = $("#ar-camera-video");
  if (video) {
    video.pause();
    video.srcObject = null;
    video.hidden = true;
  }
  $("#ar-park-fallback").hidden = false;
  $("#ar-camera-toggle-label").textContent = "開啟相機";
  $("#ar-camera-toggle").classList.remove("is-live");
  $("#ar-camera-status").textContent = "示意 AR · 按下方按鈕開啟相機";
  $("#ar-shutter").disabled = true;
}

async function startArCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    $("#ar-camera-status").textContent = "目前的瀏覽器或連線方式無法開啟相機。";
    showToast("相機功能需要 HTTPS 或 localhost 安全連線。 ");
    return;
  }
  try {
    arCameraStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: arCameraFacing }, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
    const video = $("#ar-camera-video");
    video.srcObject = arCameraStream;
    video.hidden = false;
    await video.play();
    $("#ar-park-fallback").hidden = true;
    $("#ar-camera-toggle-label").textContent = "關閉相機";
    $("#ar-camera-toggle").classList.add("is-live");
    $("#ar-camera-status").textContent = "相機已開啟 · 拖曳毛孩子調整位置";
    $("#ar-shutter").disabled = false;
  } catch (error) {
    stopArCamera();
    $("#ar-camera-status").textContent = error?.name === "NotAllowedError" ? "相機權限尚未開啟，繪本示意場景仍可使用。" : "相機暫時無法使用，繪本示意場景仍可使用。";
    showToast(error?.name === "NotAllowedError" ? "相機權限未開啟，可以先使用示意場景。" : "相機暫時無法使用，可以先看示意場景。 ");
  }
}

async function toggleArCamera() {
  if (arCameraStream) stopArCamera();
  else await startArCamera();
}

async function flipArCamera() {
  arCameraFacing = arCameraFacing === "environment" ? "user" : "environment";
  if (arCameraStream) {
    stopArCamera();
    await startArCamera();
  } else {
    showToast(arCameraFacing === "environment" ? "下次開啟時會使用後鏡頭。" : "下次開啟時會使用前鏡頭。 ");
  }
}

function captureArFootprint() {
  if (!arCameraStream) {
    showToast("先開啟相機，才能拍下現實中的相遇。 ");
    return;
  }
  if (state.albumPhotos.length >= 12) {
    showToast("回憶相簿裡已經有 12 張照片，先替它們留一點位置吧。 ");
    return;
  }
  const video = $("#ar-camera-video");
  const stage = $("#ar-stage");
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    showToast("相機畫面還在準備，稍等一下再拍。 ");
    return;
  }
  const scale = Math.min(1, 840 / Math.max(video.videoWidth, video.videoHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
  canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
  const context = canvas.getContext("2d", { alpha: false });
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const petBounds = $("#ar-pet-companion").getBoundingClientRect();
  const stageBounds = stage.getBoundingClientRect();
  const x = ((petBounds.left + petBounds.width / 2 - stageBounds.left) / stageBounds.width) * canvas.width;
  const y = ((petBounds.top + petBounds.height * .68 - stageBounds.top) / stageBounds.height) * canvas.height;
  context.save();
  context.globalAlpha = .76;
  context.shadowColor = "rgba(255, 240, 192, .95)";
  context.shadowBlur = canvas.width * .025;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `${Math.round(canvas.width * .17)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  context.fillText(currentPet().icon, x, y);
  context.restore();
  context.save();
  context.globalAlpha = .9;
  context.fillStyle = "rgba(255,250,235,.92)";
  context.font = `700 ${Math.max(12, Math.round(canvas.width * .027))}px sans-serif`;
  context.textAlign = "left";
  context.shadowColor = "rgba(42,54,48,.4)";
  context.shadowBlur = 5;
  context.fillText(`${currentPet().name} · ${currentDestination().name}`, canvas.width * .055, canvas.height * .92);
  context.restore();
  const photo = {
    id: `footprint-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: `${currentDestination().name}的相遇合照`, date: Date.now(),
    thumbnail: canvas.toDataURL("image/jpeg", .72), category: "travel", source: "footprint",
  };
  state.albumPhotos.push(photo);
  persist();
  updateFootprintSnapshot();
  showToast("新的現實足跡，已經收進回憶相簿。 ");
}

function moveArPet(event) {
  if (!arPetDrag) return;
  const bounds = $("#ar-stage").getBoundingClientRect();
  const x = Math.min(90, Math.max(10, ((event.clientX - bounds.left) / bounds.width) * 100));
  const y = Math.min(87, Math.max(25, ((event.clientY - bounds.top) / bounds.height) * 100));
  const pet = $("#ar-pet-companion");
  pet.style.left = `${x}%`;
  pet.style.top = `${y}%`;
}

function finishArPetDrag(event) {
  if (!arPetDrag) return;
  if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  arPetDrag = null;
  $("#ar-pet-companion").classList.remove("is-dragging");
}

async function makePhotoThumbnail(file) {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 840 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#f8f1e4";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close?.();
  return canvas.toDataURL("image/jpeg", 0.72);
}

function openMemoryUpload() {
  pendingMemoryPhoto = "";
  pendingMemoryPhotoTask = null;
  openModal(`${modalHeader("A LITTLE MOMENT TO KEEP", "新增一段回憶", "挑一張照片，或留下一句今天想記住的事。照片只會縮小後保存在這個裝置。")}
    <form class="memory-upload-form" id="memory-upload-form">
      <label class="memory-photo-picker" for="memory-photo"><span class="memory-photo-icon" aria-hidden="true">＋</span><strong>選一張生活照片</strong><small>從裝置挑選圖片，最多 12 張</small><input id="memory-photo" type="file" accept="image/*"></label>
      <div class="memory-photo-preview" id="memory-photo-preview" hidden><img id="memory-photo-preview-image" alt="照片預覽"><span id="memory-photo-preview-note">已經準備好收進相簿</span></div>
      <label class="memory-caption-label" for="memory-caption">替這段回憶寫個名字</label>
      <input class="memory-caption-input" id="memory-caption" maxlength="60" placeholder="例如：一起曬太陽的午後">
      <p class="form-note" id="memory-upload-note">不選照片也可以，只留下一句話也很好。</p>
      <div class="memory-upload-actions"><button class="primary-button" id="save-memory-button" type="submit">收進相簿 <span aria-hidden="true">♡</span></button></div>
    </form>`);
  const photoInput = $("#memory-photo");
  const preview = $("#memory-photo-preview");
  const submit = $("#save-memory-button");
  photoInput.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    pendingMemoryPhoto = "";
    if (!file) { preview.hidden = true; return; }
    if (!file.type.startsWith("image/")) {
      photoInput.value = "";
      showToast("請選擇圖片檔案。 ");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      photoInput.value = "";
      showToast("這張照片有點大，請選擇 12 MB 以下的圖片。 ");
      return;
    }
    preview.hidden = false;
    $("#memory-photo-preview-note").textContent = "正在把照片整理成小小的回憶……";
    submit.disabled = true;
    pendingMemoryPhotoTask = makePhotoThumbnail(file).then((thumbnail) => {
      pendingMemoryPhoto = thumbnail;
      $("#memory-photo-preview-image").src = thumbnail;
      $("#memory-photo-preview-note").textContent = "已經準備好收進相簿";
    }).catch(() => {
      photoInput.value = "";
      preview.hidden = true;
      showToast("照片暫時無法讀取，請換一張圖片試試。 ");
    }).finally(() => {
      pendingMemoryPhotoTask = null;
      submit.disabled = false;
    });
  });
  $("#memory-upload-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pendingMemoryPhotoTask) await pendingMemoryPhotoTask;
    const title = $("#memory-caption").value.trim();
    if (!title && !pendingMemoryPhoto) {
      $("#memory-caption").focus();
      showToast("留下一句話或挑一張照片，再收進相簿吧。 ");
      return;
    }
    if (pendingMemoryPhoto && state.albumPhotos.length >= 12) {
      showToast("相簿裡已經有 12 張照片，先替它們留一點位置吧。 ");
      return;
    }
    if (pendingMemoryPhoto) state.albumPhotos.push({
      id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: title || "生活裡的小片刻", date: Date.now(), thumbnail: pendingMemoryPhoto, category: "daily", source: "photo",
    });
    else state.journal.push({ message: title, date: Date.now() });
    persist();
    closeModal();
    memoryFilter = pendingMemoryPhoto ? "daily" : "all";
    renderMemoryAlbum();
    showToast(pendingMemoryPhoto ? "照片已經好好收進相簿。" : "這句話已經成為一段回憶。 ");
  });
}

function setActiveAppNav(activeKey) {
  if (activeAppScreen === "footprints" && activeKey !== "footprints") stopArCamera();
  activeAppScreen = activeKey === "house" ? "house" : activeKey === "memories" ? "memories" : activeKey === "footprints" ? "footprints" : "planet";
  $("#home").hidden = activeAppScreen !== "planet";
  $("#house-screen").hidden = activeAppScreen !== "house";
  $("#memories-screen").hidden = activeAppScreen !== "memories";
  $("#footprints-screen").hidden = activeAppScreen !== "footprints";
  if (activeAppScreen === "house") renderHouseScene();
  if (activeAppScreen === "memories") renderMemoryAlbum();
  if (activeAppScreen === "footprints") renderFootprints();
  document.querySelectorAll("[data-app-nav]").forEach((button) => {
    const selected = button.dataset.appNav === activeKey;
    button.classList.toggle("is-active", selected);
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function openLetter() {
  const pastLetters = state.journal.length ? `<p class="form-note">你已經替未來的自己留了 ${state.journal.length} 封信。它們會安靜地收在星際郵筒裡。</p>` : "";
  openModal(`${modalHeader("A NOTE TO YOUR FUTURE SELF", "寫一封信給未來的自己", "不需要寫得完整。只要留下一句現在的感覺，等哪天想起來時，這裡會替你收著。")}
    <form class="letter-form" id="letter-form"><label for="letter-message">此刻，想對自己說些什麼？</label><textarea id="letter-message" maxlength="280" placeholder="像是：今天雖然有點累，但我還是好好走到了這裡。" required></textarea><div class="form-note">最多 280 個字，只儲存在這個裝置上。</div>${pastLetters}<div class="letter-submit"><button class="primary-button" type="submit">把這封信收好 <span aria-hidden="true">♡</span></button></div></form>`);
  $("#letter-message").focus({ preventScroll: true });
  $("#letter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const message = $("#letter-message").value.trim();
    if (!message) return;
    state.journal.push({ message, date: Date.now() });
    refresh();
    openModal(`${modalHeader("A LITTLE PROMISE KEPT", "這封信，已經好好收下了。", "未來想讀的時候，再到星際郵筒找找看。希望那時候的你，記得現在的自己一直很努力。")}<div class="mail-card"><small>FOR A DAY WHEN YOU NEED IT</small><strong>寫給自己的信</strong><p>${escapeHtml(message)}</p></div><div class="letter-submit" style="margin-top:15px"><button class="primary-button" id="letter-done" type="button">好好收在心裡 <span aria-hidden="true">♡</span></button></div>`);
    $("#letter-done").addEventListener("click", closeModal);
    showToast("給自己的溫柔，已經收進手札裡。 ");
  });
}

function openShop() {
  const items = decorations.map((item) => {
    const owned = state.decor.includes(item.id);
    return `<div class="decor-option"><span class="decor-icon" aria-hidden="true">${item.icon}</span><span class="decor-copy"><strong>${item.name}</strong><small>${item.description}</small></span><button class="buy-button" data-buy="${item.id}" type="button" ${owned ? "disabled" : ""}>${owned ? "已擺好" : `✦ ${item.price}`}</button></div>`;
  }).join("");
  openModal(`${modalHeader("MAKE THIS LITTLE PLACE YOURS", "替小樹屋添一點喜歡", "用旅行慢慢收集的星塵，換一件看了會微笑的小物。買下的佈置會一直留在小樹屋。")}<p class="shop-balance">現在有 <strong>✦ ${state.stardust}</strong> 星塵</p><div class="decor-list">${items}</div>`);
  modalContent.querySelectorAll("[data-buy]").forEach((button) => {
    button.addEventListener("click", () => purchaseDecor(button.dataset.buy));
  });
}

function openHouse() {
  setActiveAppNav("house");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openHouseDecor() {
  const items = houseDecorCatalog.map((item) => {
    const owned = state.houseItems.includes(item.id);
    const placed = state.houseDecor.includes(item.id);
    const buttonText = owned ? (placed ? "先收好" : "擺上小屋") : `✦ ${item.price}`;
    return `<article class="house-decor-option ${placed ? "is-placed" : ""}">
      <span class="house-decor-icon" aria-hidden="true">${item.icon}</span>
      <span class="house-decor-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small></span>
      <button class="buy-button" data-house-item="${item.id}" type="button">${buttonText}</button>
    </article>`;
  }).join("");
  const treasureCount = state.souvenirs.reduce((total, souvenir) => total + souvenir.count, 0);
  openModal(`${modalHeader("MAKE THIS LITTLE ROOM YOURS", "慢慢布置小屋", "選一件喜歡的小物放進房間。已收藏的東西可以隨時擺上或收好，星塵只在第一次收藏時使用。")}
    <p class="shop-balance">目前有 <strong>✦ ${state.stardust}</strong> 星塵 · 旅途小紀念品 ${treasureCount} 件</p><div class="house-decor-list">${items}</div>`);
  modalContent.querySelectorAll("[data-house-item]").forEach((button) => {
    button.addEventListener("click", () => toggleHouseItem(button.dataset.houseItem));
  });
}

function toggleHouseItem(itemId) {
  const item = houseDecorCatalog.find((entry) => entry.id === itemId);
  if (!item) return;
  const owned = state.houseItems.includes(item.id);
  const placed = state.houseDecor.includes(item.id);
  if (owned) {
    if (placed) {
      state.houseDecor = state.houseDecor.filter((id) => id !== item.id);
      showToast(`${item.name}先收進收藏裡了。`);
    } else {
      state.houseDecor.push(item.id);
      showToast(`${item.name}已經擺進小屋了。`);
    }
  } else {
    if (state.stardust < item.price) {
      showToast("星塵還不夠，慢慢收集也沒關係。 ");
      return;
    }
    state.stardust -= item.price;
    state.houseItems.push(item.id);
    state.houseDecor.push(item.id);
    showToast(`把${item.name}帶回小屋了。`);
  }
  refresh();
  openHouseDecor();
}

function purchaseDecor(itemId) {
  const item = decorations.find((decor) => decor.id === itemId);
  if (!item || state.decor.includes(itemId)) return;
  if (state.stardust < item.price) {
    showToast("星塵還不夠，先和毛孩子散散步吧。 ");
    return;
  }
  state.stardust -= item.price;
  state.decor.push(item.id);
  refresh();
  showToast(`${item.name} 已經放進小樹屋了。`);
  openShop();
}

function applyIdleGifts() {
  const now = Date.now();
  const starBatches = Math.floor((now - state.lastStarAt) / 60_000);
  if (starBatches > 0) {
    state.stardust += Math.min(starBatches, 60 * 24 * 7);
    state.lastStarAt += starBatches * 60_000;
  }
  const snackBatches = Math.floor((now - state.lastSnackAt) / SNACK_PERIOD);
  if (snackBatches > 0) {
    state.snacks = Math.min(8, state.snacks + snackBatches);
    state.lastSnackAt += snackBatches * SNACK_PERIOD;
  }
  const lifeChanged = advancePetLives();
  const postcardChanged = deliverDuePostcards(now);
  if (starBatches > 0 || snackBatches > 0 || lifeChanged || postcardChanged) refresh();
  else updatePetLifePanel();
}

function petWithAffection(source = "touch") {
  const pet = currentPet();
  if (source === "snack") {
    if (state.snacks <= 0) {
      showToast("點心正在慢慢準備，現在也可以先摸摸牠。 ");
      gameScene?.showSparkle(pet.id, "♡");
      return;
    }
    state.snacks -= 1;
    state.bond += 3;
    refresh();
    gameScene?.showSparkle(pet.id, "♥");
    showToast(`${pet.name}開心地收下點心，尾巴搖了搖。`);
    return;
  }
  state.bond += 1;
  refresh();
  gameScene?.showSparkle(pet.id, "♡");
  showToast(`${pet.name}舒服地瞇起眼睛，好像在說謝謝。`);
}

function onCanvasPet(petId) {
  if (state.activePet !== petId) {
    state.activePet = petId;
    refresh();
  }
  petWithAffection("touch");
}

class GardenScene extends Phaser.Scene {
  constructor() { super({ key: "GardenScene" }); }

  create() {
    const placeholder = this.textures.createCanvas("garden-placeholder", 1200, 760);
    placeholder.context.fillStyle = "#bfd9c8";
    placeholder.context.fillRect(0, 0, 1200, 760);
    placeholder.refresh();
    this.art = this.add.image(600, 380, "garden-placeholder").setDisplaySize(1200, 760).setDepth(-5);
    this.petZones = [
      { id: "dog", x: 403, y: 550, width: 210, height: 190 },
      { id: "cat", x: 645, y: 563, width: 198, height: 169 },
      { id: "bunny", x: 872, y: 548, width: 176, height: 202 },
    ];
    for (const pet of this.petZones) {
      this.add.zone(pet.x, pet.y, pet.width, pet.height).setInteractive({ useHandCursor: true }).on("pointerdown", (_pointer, _x, _y, event) => {
        event?.stopPropagation?.();
        onCanvasPet(pet.id);
      });
    }
    this.time.addEvent({ delay: 3100, loop: true, callback: () => {
      if (document.hidden) return;
      const x = Phaser.Math.Between(80, 1110), y = Phaser.Math.Between(90, 405);
      const fleck = this.add.text(x, y, "✦", { fontFamily: "Georgia, serif", fontSize: `${Phaser.Math.Between(10, 16)}px`, color: "#fff0bd" }).setAlpha(0).setDepth(2);
      this.tweens.add({ targets: fleck, y: y - 25, alpha: { from: 0, to: .78 }, duration: 700, yoyo: true, hold: 550, onComplete: () => fleck.destroy() });
    }});
    this.paint(state);
    gameScene = this;
  }

  paint(currentState) {
    if (!this.art) return;
    const request = ++sceneTextureNumber;
    const key = `garden-art-${request}`;
    const image = new Image();
    image.onload = () => {
      if (request !== sceneTextureNumber || !this.game || this.sys.isDestroyed) return;
      const oldKey = this.art.texture?.key;
      this.textures.addImage(key, image);
      this.art.setTexture(key).setDisplaySize(1200, 760);
      if (oldKey && oldKey !== "garden-placeholder" && oldKey !== key) this.textures.remove(oldKey);
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createSceneSvg(currentState))}`;
  }

  showSparkle(petId, symbol) {
    const pet = this.petZones?.find((entry) => entry.id === petId);
    if (!pet) return;
    const sparkle = this.add.text(pet.x + Phaser.Math.Between(-30, 30), pet.y - 48, symbol, { fontFamily: "Arial, sans-serif", fontSize: "27px", color: symbol === "♥" ? "#d17e7b" : "#d09474", stroke: "#fff8ec", strokeThickness: 3 }).setOrigin(.5).setDepth(5);
    const label = this.add.text(pet.x, pet.y - 19, "陪伴 +1", { fontFamily: "Nunito, Noto Sans TC, sans-serif", fontSize: "11px", fontStyle: "bold", color: "#715a42", stroke: "#fff8e8", strokeThickness: 4 }).setOrigin(.5).setDepth(5);
    this.tweens.add({ targets: [sparkle, label], y: "-=52", alpha: { from: 1, to: 0 }, duration: 1050, ease: "Cubic.easeOut", onComplete: () => { sparkle.destroy(); label.destroy(); } });
    this.cameras.main.shake(110, .0008);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: stage,
  width: 1200,
  height: 760,
  backgroundColor: "#bfd9c8",
  transparent: false,
  antialias: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { roundPixels: false, antialias: true },
  scene: [GardenScene],
});

game.events.once(Phaser.Core.Events.READY, () => {
  const garden = game.scene.getScene("GardenScene");
  if (garden) gameScene = garden;
});

$("#pet-touch").addEventListener("click", () => petWithAffection("touch"));
$("#pet-snack").addEventListener("click", () => petWithAffection("snack"));
$("#pet-travel").addEventListener("click", openTravel);
$("#open-travel-top").addEventListener("click", openTravel);
$("#open-inbox").addEventListener("click", openInbox);
$("#open-inbox-top").addEventListener("click", openInbox);
$("#open-traveler").addEventListener("click", openTravelerCard);
$("#open-letter").addEventListener("click", openLetter);
$("#open-shop").addEventListener("click", openShop);
$("#open-house-decor").addEventListener("click", openHouseDecor);
$("#footprint-go-somewhere").addEventListener("click", openTravel);
$("#open-footprint-album").addEventListener("click", () => {
  memoryFilter = "travel";
  openMemoryBook();
});
$("#ar-camera-toggle").addEventListener("click", toggleArCamera);
$("#ar-flip-camera").addEventListener("click", flipArCamera);
$("#ar-shutter").addEventListener("click", captureArFootprint);
$("#ar-tip-toggle").addEventListener("click", () => {
  const bubble = $("#ar-memory-bubble");
  bubble.hidden = !bubble.hidden;
  $("#ar-tip-toggle-label").textContent = bubble.hidden ? "顯示提示" : "隱藏提示";
});
const arPetCompanion = $("#ar-pet-companion");
arPetCompanion.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  arPetDrag = event.pointerId;
  arPetCompanion.setPointerCapture(event.pointerId);
  arPetCompanion.classList.add("is-dragging");
  event.preventDefault();
});
arPetCompanion.addEventListener("pointermove", moveArPet);
arPetCompanion.addEventListener("pointerup", finishArPetDrag);
arPetCompanion.addEventListener("pointercancel", finishArPetDrag);
$("[data-app-nav='planet']").addEventListener("click", () => {
  setActiveAppNav("planet");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("[data-app-nav='mail']").addEventListener("click", () => { setActiveAppNav("mail"); openInbox(); });
$("[data-app-nav='footprints']").addEventListener("click", openFootprints);
$("[data-app-nav='memories']").addEventListener("click", openMemoryBook);
$("[data-app-nav='house']").addEventListener("click", openHouse);
$("#modal-close").addEventListener("click", closeModal);
modalBackdrop.addEventListener("pointerdown", (event) => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modalBackdrop.hidden) closeModal(); });

applyIdleGifts();
updateHUD();
persist();
window.setInterval(applyIdleGifts, 10_000);
window.addEventListener("pagehide", () => { stopArCamera(); persist(); });

