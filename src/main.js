import Phaser from "phaser";
import "./style.css";
import { createSceneSvg, decorations, destinations, pets } from "./scene-art.js";

const STORE_KEY = "little-star-traveler-save-v1";
const DAY = 24 * 60 * 60 * 1000;
const SNACK_PERIOD = 8 * 60 * 1000;
const defaultState = () => {
  const now = Date.now();
  return {
    stardust: 12,
    snacks: 3,
    bond: 84,
    activePet: "dog",
    location: "meadow",
    visited: ["meadow"],
    decor: [],
    cards: [{
      id: "welcome-postcard",
      title: "奶油雲朵星的來信",
      from: "奶油雲朵星",
      message: "花不會催你開。累了的話，就坐下來一起吹吹風吧。願你今天也能對自己溫柔一點。",
      date: now - 1000 * 60 * 17,
    }],
    readCards: [],
    journal: [],
    startedAt: now,
    lastStarAt: now,
    lastSnackAt: now,
  };
};

function loadState() {
  const fresh = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (!saved || typeof saved !== "object") return fresh;
    return {
      ...fresh,
      ...saved,
      visited: Array.isArray(saved.visited) ? saved.visited : fresh.visited,
      decor: Array.isArray(saved.decor) ? saved.decor : [],
      cards: Array.isArray(saved.cards) ? saved.cards : fresh.cards,
      readCards: Array.isArray(saved.readCards) ? saved.readCards : [],
      journal: Array.isArray(saved.journal) ? saved.journal : [],
      startedAt: Number(saved.startedAt) || fresh.startedAt,
      lastStarAt: Number(saved.lastStarAt) || Date.now(),
      lastSnackAt: Number(saved.lastSnackAt) || Date.now(),
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
const modalBackdrop = $("#modal-backdrop");
const modalContent = $("#modal-content");
const modalCard = $("#modal-card");
const toastElement = $("#toast");
let gameScene = null;
let toastTimeout = 0;
let sceneTextureNumber = 0;

function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* The game remains playable if storage is unavailable. */ }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function currentPet() { return pets.find((pet) => pet.id === state.activePet) || pets[0]; }
function currentDestination() { return destinations.find((place) => place.id === state.location) || destinations[0]; }
function unreadCount() { return state.cards.filter((card) => !state.readCards.includes(card.id)).length; }

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
  $("#pet-choices").innerHTML = pets.map((petOption) => `
    <button class="pet-choice ${petOption.id === state.activePet ? "active" : ""}" data-pet="${petOption.id}" type="button" aria-pressed="${petOption.id === state.activePet}">
      <span class="pet-choice-icon" aria-hidden="true">${petOption.icon}</span><span class="pet-choice-copy"><strong>${petOption.name}</strong><small>${petOption.kind}</small></span>
    </button>`).join("");
  $("#pet-choices").querySelectorAll("[data-pet]").forEach((button) => {
    button.addEventListener("click", () => selectPet(button.dataset.pet));
  });
}

const sceneWhispers = {
  meadow: "微風把草葉吹得沙沙響。",
  coast: "海浪把一封沒寫完的信送上岸。",
  sunflower: "向日葵們正朝著同一個方向發呆。",
  stargarden: "有幾顆星星，今晚打算陪我們久一點。",
};

function showToast(message) {
  window.clearTimeout(toastTimeout);
  toastElement.textContent = message;
  toastElement.classList.add("visible");
  toastTimeout = window.setTimeout(() => toastElement.classList.remove("visible"), 2400);
}

function paintScene() {
  if (gameScene) gameScene.paint(state);
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
  document.body.classList.remove("modal-open");
}

function openModal(markup) {
  modalContent.innerHTML = markup;
  modalBackdrop.hidden = false;
  document.body.classList.add("modal-open");
  modalCard.scrollTop = 0;
  $("#modal-close").focus({ preventScroll: true });
}

function modalHeader(eyebrow, title, description) {
  return `<span class="modal-eyebrow">${eyebrow}</span><h2 class="modal-title" id="modal-title">${title}</h2><p class="modal-intro">${description}</p>`;
}

const postage = {
  meadow: { from: "午後草地", title: "草葉間的悄悄話", message: "你好呀，剛才我們遇見一陣剛剛好的風。牠提醒我，停下來並不等於落後。希望這張小小的明信片，也能替你留一片可以休息的草地。" },
  coast: { from: "海邊郵局", title: "從浪花裡撈起的信", message: "今天的海很安靜，浪花幫我把這封信帶到你手上。你可以想念，可以休息，也可以先什麼都不決定。遠方的風會替你守住那些還沒整理好的心事。" },
  sunflower: { from: "向日葵小徑", title: "寄給慢慢長大的你", message: "向日葵朝著陽光，但陰天時也沒有停止生長。想告訴你：不需要每天都閃閃發亮，你現在的樣子，也值得被好好喜歡。" },
  stargarden: { from: "星河露台", title: "星星今晚沒有催促", message: "我們在露台上數了好久的星星。沒有一顆問我們明天要去哪裡；牠們只是一起亮著。晚安，願你今晚也能放心地慢下來。" },
};

function openTravel() {
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
    state.cards.push({ id: `${place.id}-${Date.now()}`, ...letter, date: Date.now() });
    state.bond += 1;
    refresh();
    showToast(`新旅程郵票收藏好了，${letter.from} 也捎來一張信。`);
  } else {
    refresh();
    showToast(`和${currentPet().name}在${place.name}散散步。`);
  }
}

function openInbox() {
  state.readCards = [...new Set([...state.readCards, ...state.cards.map((card) => card.id)])];
  refresh();
  const incoming = [...state.cards].reverse().map((card) => `
    <article class="mail-card"><small>FROM ${escapeHtml(card.from || "一顆遙遠的星球")}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.message)}</p><time>${new Date(card.date).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}</time></article>`).join("");
  const journal = [...state.journal].reverse().map((letter) => `
    <article class="mail-card"><small>FOR A DAY WHEN YOU NEED IT</small><strong>寫給自己的信</strong><p>${escapeHtml(letter.message)}</p><time>${new Date(letter.date).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}</time></article>`).join("");
  const content = incoming || "<div class=\"empty-mail\">郵筒裡還很安靜。去一個新地方走走，<br>也許會收到遠方捎來的信。</div>";
  openModal(`${modalHeader("SNAIL MAIL FROM THE STARS", "星際郵筒", "每一次旅行，都會在手札裡留下一張明信片。寄給自己的信，也只有你能在這裡讀到。")}<div class="mail-list">${content}${journal}</div>`);
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
  if (starBatches > 0 || snackBatches > 0) refresh();
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
$("#open-letter").addEventListener("click", openLetter);
$("#open-shop").addEventListener("click", openShop);
$("#modal-close").addEventListener("click", closeModal);
modalBackdrop.addEventListener("pointerdown", (event) => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modalBackdrop.hidden) closeModal(); });

applyIdleGifts();
updateHUD();
persist();
window.setInterval(applyIdleGifts, 10_000);
window.addEventListener("pagehide", persist);

