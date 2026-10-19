const palettes = {
  meadow: { sky: "#304468", far: "#526c8b", mid: "#5a7d84", ground: "#617b70", sun: "#f4dca0", accent: "#dfad88", whisper: "暮色落在樹屋旁，星星慢慢亮了起來。" },
  coast: { sky: "#a9cbd9", far: "#85aebe", mid: "#72a4ad", ground: "#d7c69f", sun: "#f6dfa4", accent: "#d99787", whisper: "海浪把一封沒寫完的信送上岸。" },
  sunflower: { sky: "#b7d0d4", far: "#9dbcae", mid: "#8ea994", ground: "#839d7a", sun: "#f5da91", accent: "#d5a67d", whisper: "向日葵們正朝著同一個方向發呆。" },
  stargarden: { sky: "#304363", far: "#5d788d", mid: "#668583", ground: "#637d72", sun: "#f7e3af", accent: "#d7b3b4", whisper: "有幾顆星星，今晚打算陪我們久一點。" },
};

const safeDecor = new Set(["lantern", "flowerbed", "telescope"]);

export const furOptions = [
  { id: "honey", name: "蜂蜜奶油", swatch: "#d9a967", main: "#d9a967", shadow: "#b47c43", dark: "#896843" },
  { id: "cloud", name: "雲朵白", swatch: "#e7dcc4", main: "#e7dcc4", shadow: "#c5b79d", dark: "#988a76" },
  { id: "silver", name: "月光灰", swatch: "#9aa4ad", main: "#9aa4ad", shadow: "#75808b", dark: "#59636d" },
  { id: "cocoa", name: "可可棕", swatch: "#aa8062", main: "#aa8062", shadow: "#866348", dark: "#674a38" },
];

export const eyeOptions = [
  { id: "smile", name: "彎彎笑眼", icon: "⌣" },
  { id: "bright", name: "亮亮圓眼", icon: "●" },
];

export const earOptions = [
  { id: "soft", name: "軟綿綿", icon: "〰" },
  { id: "upright", name: "精神豎耳", icon: "⌃" },
];

export const bagOptions = [
  { id: "ochre", name: "暖陽橘小行囊", color: "#d88e5c", icon: "🎒" },
  { id: "blue", name: "天空藍小行囊", color: "#86a8bd", icon: "🧳" },
  { id: "sage", name: "森林綠小行囊", color: "#89a486", icon: "🌿" },
];

export const hatOptions = [
  { id: "none", name: "不戴帽子", icon: "♡" },
  { id: "cap", name: "探險小帽", icon: "🧢" },
  { id: "sunhat", name: "午後遮陽帽", icon: "👒" },
];

export const traitOptions = ["愛看雲朵", "喜歡散步", "最會安慰人"];

function petArt(active, traveler, petLife) {
  const custom = traveler?.species === active ? traveler : null;
  const defaults = {
    dog: { main: "#d9a967", shadow: "#b47c43", dark: "#896843" },
    cat: { main: "#798493", shadow: "#667381", dark: "#46515c" },
    bunny: { main: "#b69a75", shadow: "#a68a68", dark: "#655541" },
  };
  const selectedFur = furOptions.find((fur) => fur.id === custom?.fur);
  const furFor = (species) => custom?.species === species && selectedFur ? selectedFur : defaults[species];
  const dogFur = furFor("dog");
  const catFur = furFor("cat");
  const bunnyFur = furFor("bunny");
  const dogBody = custom?.species === "dog" && selectedFur ? selectedFur.main : "#c89254";
  const eyeArt = (species, defaultArt, x, y) => custom?.species === species && custom?.eyes === "bright" && petLife?.activity !== "rest"
    ? `<circle cx="${x}" cy="${y}" r="5.2" fill="#3e342c"/><circle cx="${x + 1.5}" cy="${y - 1.5}" r="1.5" fill="#fff7e6"/>`
    : defaultArt;
  const activityBadge = (species, x, y) => {
    if (active !== species) return "";
    const symbol = petLife?.activity === "rest" ? "Zz" : petLife?.activity === "friend" ? "♡" : "✦";
    return `<g transform="translate(${x} ${y})"><path d="M-20 8 Q-25 -14 -7 -16 H14 Q25 -14 23 1 Q22 15 9 15 H-5 L-13 23 -12 14 Q-19 13 -20 8Z" fill="#fff8e9" stroke="#9a8061" stroke-width="2.5"/><text x="1" y="5" text-anchor="middle" font-family="Georgia, serif" font-size="17" font-weight="700" fill="#94714e">${symbol}</text></g>`;
  };
  const dogEar = custom?.species === "dog" && custom.ears === "upright"
    ? `<path d="M-57 -49 C-88 -83 -80 -117 -57 -111 C-40 -107 -35 -76 -26 -54Z" fill="${dogFur.shadow}" stroke="#6d5038" stroke-width="5" stroke-linejoin="round"/>`
    : `<path d="M-58 -43 C-74 -81 -47 -101 -23 -75 L-7 -54" fill="${dogFur.dark}" stroke="#6d5038" stroke-width="5" stroke-linejoin="round"/>`;
  const catEars = custom?.species === "cat" && custom.ears === "soft"
    ? `<path d="M-63 -21 L-74 -61 Q-71 -78 -55 -66 L-22 -43 M24 -43 L49 -67 Q64 -76 68 -59 L62 -20" fill="${catFur.shadow}" stroke="#46515c" stroke-width="5" stroke-linejoin="round"/>`
    : `<path d="M-63 -21 L-65 -64 Q-62 -75 -49 -65 L-22 -43 M24 -43 L52 -70 Q64 -78 68 -63 L63 -22" fill="${catFur.shadow}" stroke="#46515c" stroke-width="5" stroke-linejoin="round"/>`;
  const bunnyEars = custom?.species === "bunny" && custom.ears === "soft"
    ? `<path d="M-55 -42 C-103 -86 -142 -88 -145 -61 C-149 -32 -106 -7 -65 1 M26 -42 C61 -83 103 -91 113 -66 C124 -39 82 -16 49 -7" fill="${bunnyFur.shadow}" stroke="#655541" stroke-width="5" stroke-linejoin="round"/><path d="M-111 -72 Q-126 -84 -131 -67 Q-131 -46 -101 -31 M77 -66 Q98 -81 101 -64 Q97 -43 72 -28" fill="#d8aaa1"/>`
    : `<path d="M-56 -34 C-87 -91 -85 -151 -56 -159 C-32 -164 -19 -108 -13 -51 M18 -43 C26 -108 49 -145 71 -132 C92 -118 71 -61 48 -24" fill="${bunnyFur.shadow}" stroke="#655541" stroke-width="5" stroke-linejoin="round"/><path d="M-54 -117 Q-58 -151 -51 -150 Q-39 -144 -34 -104 M46 -81 Q59 -124 68 -121 Q77 -113 56 -73" fill="#d8aaa1"/>`;
  const gearArt = (species) => {
    if (custom?.species !== species) return "";
    const bag = bagOptions.find((option) => option.id === custom.bag);
    const hat = hatOptions.find((option) => option.id === custom.hat);
    const backpack = bag ? `<g transform="translate(-83 3)"><path d="M-16 -18 Q-18 -31 0 -33 Q18 -31 16 -18 L19 25 Q0 34 -19 25Z" fill="${bag.color}" stroke="#735940" stroke-width="4"/><path d="M-10 -17 Q0 -26 10 -17 L10 15 Q0 22 -10 15Z" fill="none" stroke="#f7e7c8" stroke-width="3"/><circle cy="-2" r="4" fill="#f3d28f"/></g>` : "";
    if (!hat || hat.id === "none") return backpack;
    const hatX = species === "dog" ? 28 : species === "cat" ? 0 : -31;
    const hatY = species === "bunny" ? -158 : -82;
    const headwear = `<g transform="translate(${hatX} ${hatY})"><path d="M-28 4 Q-17 -16 2 -17 Q20 -15 25 4 Q3 0 -28 4Z" fill="#bd8151" stroke="#76583f" stroke-width="3"/><path d="M-40 6 Q0 0 40 7 Q22 17 -31 15Z" fill="#e6bd78" stroke="#76583f" stroke-width="3" stroke-linejoin="round"/>${hat.id === "cap" ? `<path d="M-12 -5 Q-8 -27 12 -14 L19 0Z" fill="#85a7b3" stroke="#76583f" stroke-width="3"/>` : `<path d="M-22 1 Q0 -30 22 1Z" fill="#d89469" stroke="#76583f" stroke-width="3"/>`}</g>`;
    return `${backpack}${headwear}`;
  };
  const focus = (id, x, y, rx, ry) => id === active ? `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff1bd" opacity=".74"/><ellipse cx="${x}" cy="${y}" rx="${rx + 14}" ry="${ry + 9}" fill="none" stroke="#fff8dc" stroke-width="3" stroke-dasharray="2 9" opacity=".9"/>` : "";
  return `
  <g transform="translate(404 546)">
    ${focus("dog", 4, -2, 116, 90)}
    <ellipse cx="0" cy="66" rx="110" ry="17" fill="#455e4b" opacity=".17"/>
    <path d="M-91 27 C-107 3 -90 -33 -55 -42 C-27 -66 33 -65 68 -40 C101 -21 112 21 85 45 C50 70 -38 73 -80 48Z" fill="${dogBody}" stroke="#6d5038" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-95 22 C-132 36 -133 57 -159 58 C-141 39 -143 23 -123 11" fill="${dogFur.shadow}" stroke="#6d5038" stroke-width="5" stroke-linecap="round"/>
    <path d="M-68 45 Q-69 73 -40 69 L-26 50 M53 47 Q58 71 83 62 L86 44" fill="#efd4a0" stroke="#6d5038" stroke-width="4" stroke-linecap="round"/>
    ${dogEar}
    <path d="M-16 -54 C4 -88 48 -82 69 -57 C92 -31 76 8 46 15 C15 24 -19 0 -21 -28Z" fill="${dogFur.main}" stroke="#6d5038" stroke-width="5" stroke-linejoin="round"/>
    <path d="M10 -2 Q25 -20 48 -5 Q45 11 27 13 Q13 12 10 -2" fill="#fff0d5" stroke="#6d5038" stroke-width="3"/>
    <path d="M34 -14 Q44 -18 49 -12 Q46 -6 39 -7Z" fill="#503d31"/>
    ${eyeArt("dog", `<path d="M20 -36 Q26 -44 32 -37 M51 -35 Q57 -42 62 -35" fill="none" stroke="#47382e" stroke-width="4" stroke-linecap="round"/>`, 25, -38)}
    <path d="M35 0 Q42 6 49 -1" fill="none" stroke="#9e5b55" stroke-width="3" stroke-linecap="round"/>
    <path d="M-84 -5 Q-77 5 -72 13 M70 25 Q62 35 54 38" fill="none" stroke="#e1b77a" stroke-width="4" stroke-linecap="round" opacity=".85"/>
    <path d="M-21 -26 Q-15 -29 -10 -24" fill="none" stroke="#fff0d5" stroke-width="4" stroke-linecap="round"/>
    ${gearArt("dog")}
    ${activityBadge("dog", 79, -104)}
  </g>

  <g transform="translate(645 568)">
    ${focus("cat", 0, -3, 105, 79)}
    <ellipse cx="0" cy="57" rx="104" ry="16" fill="#455e4b" opacity=".18"/>
    <path d="M-82 22 C-99 -6 -69 -50 -29 -41 C4 -57 52 -37 68 -4 C91 24 71 53 38 53 L-54 53Z" fill="${catFur.main}" stroke="#46515c" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-42 27 Q-54 52 -25 55 L-17 42 M29 42 Q39 58 61 48 L58 34" fill="#d8d9d2" stroke="#46515c" stroke-width="4" stroke-linecap="round"/>
    ${catEars}
    <path d="M-57 -52 L-54 -39 L-43 -46 M54 -56 L53 -39 L42 -48" fill="#d99d9b"/>
    <path d="M-52 -8 C-48 -32 -19 -40 1 -25 C22 -41 51 -26 51 -4 C48 19 27 31 0 29 C-28 33 -53 17 -52 -8Z" fill="#f2eee5" stroke="#46515c" stroke-width="3"/>
    ${eyeArt("cat", `<path d="M-27 -13 Q-21 -20 -16 -13 M18 -13 Q24 -20 29 -13" fill="none" stroke="#343c43" stroke-width="4" stroke-linecap="round"/>`, -22, -15)}
    <path d="M-6 -2 Q0 -8 6 -2 L1 3Z" fill="#ba7775"/>
    <path d="M1 3 Q-5 12 -12 7 M1 3 Q8 12 14 7" fill="none" stroke="#a45f61" stroke-width="3" stroke-linecap="round"/>
    <path d="M-61 0 l-21 -5 M-60 7 l-21 4 M59 0 l20 -6 M59 8 l22 5" fill="none" stroke="#d8d9d2" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M-12 -39 l7 12 M3 -42 l4 13 M18 -39 l-1 12" stroke="${catFur.shadow}" stroke-width="5" stroke-linecap="round"/>
    ${gearArt("cat")}
    ${activityBadge("cat", 60, -94)}
  </g>

  <g transform="translate(874 545)">
    ${focus("bunny", 1, -1, 94, 90)}
    <ellipse cx="0" cy="67" rx="93" ry="15" fill="#455e4b" opacity=".18"/>
    ${bunnyEars}
    <path d="M-72 20 C-69 -18 -40 -52 2 -48 C47 -48 75 -13 67 27 C63 62 31 71 -24 63 C-62 59 -83 45 -72 20Z" fill="${bunnyFur.main}" stroke="#655541" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-17 51 Q-22 67 1 67 L15 55 M30 55 Q40 70 58 60" fill="#e3d0b2" stroke="#655541" stroke-width="4" stroke-linecap="round"/>
    ${eyeArt("bunny", `<path d="M-3 -4 Q2 -12 8 -4" fill="none" stroke="#332d27" stroke-width="5" stroke-linecap="round"/>`, 2, -6)}
    <path d="M39 5 Q47 0 50 7 Q47 14 42 11Z" fill="#76604d"/>
    <path d="M44 11 Q38 20 30 17 M44 11 Q51 19 57 14" fill="none" stroke="#806451" stroke-width="3" stroke-linecap="round"/>
    <path d="M-51 1 Q-41 13 -40 29 M-13 -33 Q-3 -19 4 -17 M-4 29 Q-13 37 -22 36" fill="none" stroke="${bunnyFur.shadow}" stroke-width="4" stroke-linecap="round" opacity=".85"/>
    ${gearArt("bunny")}
    ${activityBadge("bunny", 70, -177)}
  </g>`;
}

function destinationArt(location, p) {
  if (location === "coast") return `
    <path d="M0 482 Q90 455 190 486 T400 478 T640 487 T870 475 T1200 484 V760 H0Z" fill="#e7cf9e"/>
    <path d="M0 492 Q90 472 190 498 T400 492 T640 501 T870 488 T1200 497" fill="none" stroke="#fff2cf" stroke-width="7" opacity=".85"/>
    <path d="M0 521 Q120 501 240 525 T480 521 T720 529 T960 517 T1200 525" fill="none" stroke="#f5e5bf" stroke-width="5" opacity=".8"/>
    <g transform="translate(1030 310)"><path d="M-37 160 L-24 40 H24 L38 160Z" fill="#f3e6ca" stroke="#795d4a" stroke-width="4"/><path d="M-28 77 H28 L33 101 H-31Z M-32 130 H33 L37 151 H-36Z" fill="#d98262"/><path d="M-30 38 L0 3 30 38Z" fill="#536575"/><rect x="-12" y="-6" width="24" height="38" rx="7" fill="#f6d992" stroke="#795d4a" stroke-width="3"/></g>
    <path d="M116 452 Q132 432 148 452 M160 459 Q177 436 195 457 M254 471 Q274 448 295 472" fill="none" stroke="#d6a875" stroke-width="4" stroke-linecap="round"/>`;
  if (location === "sunflower") {
    let flowers = "";
    for (let i = 0; i < 19; i++) {
      const x = 670 + (i * 83) % 520, y = 418 + (i * 37) % 135, r = 11 + (i % 3) * 2;
      flowers += `<path d="M${x} ${y + 23}v43" stroke="#708951" stroke-width="4"/><g transform="translate(${x} ${y})">${Array.from({ length: 8 }, (_, n) => `<ellipse cx="0" cy="-${r + 5}" rx="4.4" ry="8" fill="#f1ca67" transform="rotate(${n * 45})"/>`).join("")}<circle r="5.5" fill="#76573e"/></g>`;
    }
    return `<path d="M0 495 Q240 455 430 493 T820 485 T1200 492 V760 H0Z" fill="#8da05f"/><path d="M490 760 Q570 647 641 575 Q720 514 822 478" fill="none" stroke="#c8af7c" stroke-width="55" opacity=".8" stroke-linecap="round"/>${flowers}`;
  }
  if (location === "stargarden") {
    let stars = "";
    const points = [[155,112],[289,188],[450,106],[777,146],[968,92],[1094,184],[576,231],[200,276],[923,276]];
    for (const [x,y] of points) stars += `<path d="M${x-5} ${y}h10 M${x} ${y-5}v10" stroke="#fff1c6" stroke-width="3" stroke-linecap="round" opacity=".86"/>`;
    return `<path d="M0 480 Q180 443 350 482 T700 475 T1000 480 T1200 470 V760 H0Z" fill="#536c63"/>${stars}<path d="M0 525 Q250 509 445 528 M832 528 Q1010 500 1200 522" stroke="#7c9280" stroke-width="5" fill="none" opacity=".7"/>`;
  }
  return `<path d="M0 475 Q125 402 278 466 T566 466 T852 448 T1200 464 V760 H0Z" fill="${p.ground}"/><path d="M0 513 Q130 486 268 509 T525 514 T810 496 T1200 510 V760 H0Z" fill="#89a775" opacity=".52"/>`;
}

export function createSceneSvg({ location = "meadow", activePet = "dog", decor = [], traveler = null, petLife = {} } = {}) {
  const p = palettes[location] || palettes.meadow;
  const decorations = new Set(decor.filter((item) => safeDecor.has(item)));
  const night = location === "stargarden" || location === "meadow";
  const trees = Array.from({ length: 11 }, (_, i) => {
    const x = (i * 137 + 33) % 1180, y = 332 + (i * 29) % 81, r = 20 + (i * 7) % 17;
    return `<g opacity=".${6 + (i % 3)}"><path d="M${x} ${y+45}v40" stroke="#6b7658" stroke-width="7"/><circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? p.far : p.mid}"/></g>`;
  }).join("");
  const flowers = Array.from({ length: 24 }, (_, i) => {
    const x = 34 + (i * 71) % 1125, y = 525 + (i * 43) % 151;
    const colors = ["#fff3ce", "#edb5a5", "#f4d77e", "#d8a7bb"];
    return `<g transform="translate(${x} ${y})"><path d="M0 5v17" stroke="#637f5d" stroke-width="2"/><circle r="3.8" fill="${colors[i % colors.length]}"/><path d="M-7 2q-5-6 0-6q5 1 7 6q2-6 7-6q4 4-2 8" fill="${colors[i % colors.length]}" opacity=".86"/></g>`;
  }).join("");
  const decorArt = `${decorations.has("lantern") ? `<g transform="translate(273 301)"><path d="M0 -10v15" stroke="#735540" stroke-width="3"/><path d="M-14 6 Q0 -1 14 6 L11 33 Q0 44 -11 33Z" fill="#ffdc8c" stroke="#805f43" stroke-width="3"/><path d="M-7 11v18M7 11v18" stroke="#dfa75a" stroke-width="2"/></g>` : ""}
  ${decorations.has("flowerbed") ? `<g transform="translate(210 522)"><path d="M0 0q33-21 66 0v24H0Z" fill="#d58e73" stroke="#77543f" stroke-width="3"/><path d="M4 6q28-11 57 0" stroke="#e9c89b" stroke-width="3"/><circle cx="16" cy="-7" r="10" fill="#e8a3a0"/><circle cx="38" cy="-18" r="12" fill="#f1ce72"/><circle cx="57" cy="-6" r="9" fill="#e8a3a0"/><path d="M16 0v8M38-8v16M57 2v7" stroke="#6f885e" stroke-width="3"/></g>` : ""}
  ${decorations.has("telescope") ? `<g transform="translate(1080 483)"><path d="M-24 -31l49 -19 10 17-49 22Z" fill="#708194" stroke="#4f5d64" stroke-width="4"/><path d="M-3 -6l-27 55M3 -3l21 54M1 -4v57" stroke="#735c49" stroke-width="4" stroke-linecap="round"/><circle cx="-25" cy="-31" r="5" fill="#f1d48e"/></g>` : ""}`;
  const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${night ? "#8292a4" : "#faf4df"}" opacity=".86"><path d="M-48 15Q-60-5-42-13Q-30-19-18-8Q-9-34 12-28Q31-25 32-6Q56-11 57 9Q58 24 37 25H-32Q-46 24-48 15Z"/></g>`;
  const treehouse = `<g>
    <path d="M169 466 Q188 401 202 348 Q218 289 248 222 M213 378Q157 352 127 308 M209 349Q274 331 303 281 M194 421Q265 398 291 366" fill="none" stroke="#795f48" stroke-width="28" stroke-linecap="round"/>
    <path d="M144 276 Q139 207 199 197 Q220 137 291 163 Q354 146 374 206 Q426 214 416 274 Q405 323 346 318 L190 315Z" fill="${night ? "#708d76" : "#82a77b"}" stroke="#68785d" stroke-width="5"/>
    <path d="M245 281 Q246 241 281 231 Q316 240 319 281 L319 337 H245Z" fill="#f1d9aa" stroke="#735640" stroke-width="5"/>
    <path d="M228 239 L281 197 L334 239Z" fill="#a86e50" stroke="#735640" stroke-width="5" stroke-linejoin="round"/>
    <path d="M236 240 L281 206 L326 240" fill="none" stroke="#d39163" stroke-width="5" stroke-linecap="round"/>
    <rect x="258" y="260" width="20" height="21" rx="8" fill="#86b7b0" stroke="#76583f" stroke-width="3"/><rect x="284" y="260" width="20" height="21" rx="8" fill="#86b7b0" stroke="#76583f" stroke-width="3"/>
    <path d="M231 334h100 M231 346h100" stroke="#7c553b" stroke-width="5" stroke-linecap="round"/><path d="M258 337v22m47-22v22" stroke="#7c553b" stroke-width="4"/>
    <path d="M194 290q-20 26-3 41m175-100q20 13 14 31" fill="none" stroke="#c5ce94" stroke-width="4" stroke-linecap="round"/>
  </g>`;
  const moonSun = night
    ? `<circle cx="991" cy="119" r="47" fill="#f3e1b5"/><circle cx="1008" cy="103" r="45" fill="${p.sky}"/><circle cx="134" cy="140" r="3" fill="#fff1c6"/><circle cx="713" cy="96" r="3" fill="#fff1c6"/><circle cx="1116" cy="240" r="4" fill="#fff1c6"/>`
    : `<circle cx="1013" cy="124" r="45" fill="${p.sun}" opacity=".96"/><path d="M1003 119q9-9 19 0M1005 132q8 8 16 0" stroke="#c58f59" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const nightStars = night ? [[80,105],[445,99],[586,143],[829,95],[1137,122],[483,268],[1042,289],[86,251],[725,307],[958,239],[337,114]].map(([x,y], index) => `<path d="M${x-4} ${y}h8 M${x} ${y-4}v8" stroke="#fff0c9" stroke-width="2.5" stroke-linecap="round" opacity=".${index % 3 ? "72" : "96"}"/>`).join("") : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="1200" height="760">
    <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${p.sky}"/><stop offset="1" stop-color="${night ? "#758c91" : "#e8edf0"}"/></linearGradient><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".74" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values=".18 0 0 0 .7 .18 0 0 0 .66 .18 0 0 0 .52 0 0 0 .09 0"/></filter></defs>
    <rect width="1200" height="760" fill="url(#sky)"/>${moonSun}${nightStars}${cloud(490,153,.8)}${cloud(763,238,.55)}
    <path d="M0 394 Q122 328 240 389 T474 377 T729 387 T965 361 T1200 382 V760 H0Z" fill="${p.far}" opacity=".91"/><path d="M0 440 Q144 377 271 422 T531 414 T804 423 T1056 399 T1200 418 V760 H0Z" fill="${p.mid}" opacity=".84"/>
    ${location === "coast" ? destinationArt(location,p) : `<path d="M0 472 Q125 402 278 466 T566 466 T852 448 T1200 464 V760 H0Z" fill="${p.ground}"/>`}
    ${location === "sunflower" || location === "stargarden" ? destinationArt(location,p) : ""}${trees}${treehouse}${decorArt}
    <path d="M0 548 Q132 523 270 551 T550 543 T839 554 T1080 536 T1200 544 V760 H0Z" fill="#6d8c62" opacity=".${night ? "58" : "40"}"/>
    ${flowers}${petArt(activePet, traveler, petLife[activePet])}
    <g fill="none" stroke="#f7e6af" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M465 328l3-9 3 9 9 3-9 3-3 9-3-9-9-3z"/><path d="M1098 381l2-7 2 7 7 2-7 2-2 7-2-7-7-2z"/><path d="M380 467l2-6 2 6 6 2-6 2-2 6-2-6-6-2z"/></g>
    <rect width="1200" height="760" filter="url(#paper)" opacity=".19" pointer-events="none"/>
  </svg>`;
}

const safeHouseDecor = new Set(["photo-frame", "star-plush", "window-plant", "souvenir-shelf", "moon-lamp", "postcard-wall"]);

export function createHouseSvg({ activePet = "dog", traveler = null, houseDecor = [], souvenirs = [] } = {}) {
  const species = ["dog", "cat", "bunny"].includes(activePet) ? activePet : "dog";
  const custom = traveler?.species === species ? traveler : null;
  const furDefaults = {
    dog: { main: "#d9a967", shadow: "#b47c43", stroke: "#74543a" },
    cat: { main: "#929da8", shadow: "#687886", stroke: "#4c5c68" },
    bunny: { main: "#b69a75", shadow: "#9b795b", stroke: "#655541" },
  };
  const selectedFur = furOptions.find((option) => option.id === custom?.fur);
  const colors = custom && selectedFur
    ? { main: selectedFur.main, shadow: selectedFur.shadow, stroke: "#735940" }
    : furDefaults[species];
  const decor = new Set(houseDecor.filter((id) => safeHouseDecor.has(id)));
  const ears = species === "dog"
    ? `<path d="M-64 -61Q-113 -117-127 -73Q-128 -35-88 -12Z M30 -68Q62 -119 94 -84Q111 -52 76 -19Z" fill="${colors.shadow}" stroke="${colors.stroke}" stroke-width="6" stroke-linejoin="round"/>`
    : species === "cat"
      ? `<path d="M-68 -55L-76 -122Q-72 -136-58 -123L-20 -82 M33 -76L73 -126Q87 -137 92 -118L82 -51Z" fill="${colors.shadow}" stroke="${colors.stroke}" stroke-width="6" stroke-linejoin="round"/><path d="M-64 -108Q-65 -125-59 -119L-36 -85 M65 -91Q82 -122 84 -115L74 -76" fill="#d7a5a1"/>`
      : `<path d="M-65 -62Q-107 -133-84 -174Q-58 -192-40 -83 M35 -72Q47 -149 82 -160Q110 -149 83 -57" fill="${colors.shadow}" stroke="${colors.stroke}" stroke-width="6" stroke-linejoin="round"/><path d="M-78 -131Q-76 -167-63 -151L-51 -94 M67 -113Q83 -149 91 -142L74 -90" fill="#d7a5a1"/>`;
  const keepsakeIcons = souvenirs.slice(0, 3).map((item) => item.icon).join(" ");
  const photo = decor.has("photo-frame") ? `<g transform="translate(115 248) rotate(-5)"><rect x="-7" y="-7" width="110" height="126" rx="7" fill="#9e704c"/><rect width="96" height="108" rx="3" fill="#f7ead5"/><rect x="8" y="8" width="80" height="69" rx="2" fill="#a8c4cb"/><path d="M8 60Q30 37 51 62T88 51V77H8Z" fill="#7a9c7a"/><circle cx="68" cy="24" r="8" fill="#f3d893"/><text x="48" y="100" text-anchor="middle" font-family="serif" font-size="10" fill="#80634d">OUR LITTLE DAY</text><path d="M48 109l5 5 9-10" fill="none" stroke="#ca8f88" stroke-width="2"/></g>` : "";
  const plush = decor.has("star-plush") ? `<g transform="translate(174 633) rotate(-8)"><ellipse cx="0" cy="25" rx="53" ry="11" fill="#8e7767" opacity=".16"/><path d="M0-34l12 22 26 3-19 17 5 26L0 21-24 34l5-26-19-17 26-3Z" fill="#e9c777" stroke="#aa8851" stroke-width="4" stroke-linejoin="round"/><path d="M-8 5q8 7 16 0" fill="none" stroke="#765b43" stroke-width="3" stroke-linecap="round"/></g>` : "";
  const plant = decor.has("window-plant") ? `<g transform="translate(843 482)"><path d="M-31 0h62l-7 65h-48Z" fill="#ca8f78" stroke="#805d49" stroke-width="4"/><path d="M-27 10h54" stroke="#f1c9a7" stroke-width="4"/><path d="M0 3v-61M-1-25Q-40-21-39-54Q-7-56-1-25M2-37Q34-34 37-66Q11-68 2-37M-1-8Q-32-7-34-33Q-9-34-1-8" fill="#7f9b79" stroke="#637d66" stroke-width="3" stroke-linejoin="round"/></g>` : `<g transform="translate(844 482)"><path d="M-31 0h62l-7 65h-48Z" fill="#c99a77" stroke="#8b6c50" stroke-width="4"/><path d="M-27 10h54" stroke="#e8c89d" stroke-width="4"/><path d="M0 2v-47M-1-18Q-32-15-30-42Q-8-43-1-18M2-30Q29-26 30-52Q9-53 2-30" fill="#829879" stroke="#647a62" stroke-width="3"/></g>`;
  const lamp = decor.has("moon-lamp") ? `<g transform="translate(172 466)"><path d="M0 28v92m-29 0h59" stroke="#765d49" stroke-width="8" stroke-linecap="round"/><path d="M-31 27Q-28-18 0-28Q28-18 31 27Q0 43-31 27Z" fill="#f5d990" stroke="#987448" stroke-width="4"/><path d="M-15 13q12-15 26-3" fill="none" stroke="#fff2c7" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="3" r="65" fill="#f9df9b" opacity=".09"/></g>` : "";
  const postcardWall = decor.has("postcard-wall") ? `<g transform="translate(762 264) rotate(5)"><rect width="124" height="94" rx="7" fill="#fff4dc" stroke="#c9ab7f" stroke-width="4"/><rect x="8" y="8" width="108" height="61" rx="3" fill="#7a8eaf"/><path d="M8 52Q34 28 61 51T116 43V69H8Z" fill="#8daa83"/><circle cx="88" cy="23" r="9" fill="#f3d993"/><text x="62" y="84" text-anchor="middle" font-family="serif" font-size="10" fill="#80664d">WISH YOU WERE HERE</text></g>` : "";
  const shelf = decor.has("souvenir-shelf") ? `<g transform="translate(836 388)"><path d="M-86 0h172l-8 16h-156Z" fill="#8b6144" stroke="#6e503d" stroke-width="4"/><path d="M-72 18v47m144-47v47" stroke="#7e5b42" stroke-width="5"/><text x="0" y="-11" text-anchor="middle" font-size="25">${keepsakeIcons || "✦ ♡ ✿"}</text></g>` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 760" width="1000" height="760" role="img" aria-label="毛孩子在溫暖的小屋裡休息">
    <defs>
      <linearGradient id="wall" x2="0" y2="1"><stop stop-color="#f3dfc9"/><stop offset="1" stop-color="#e7c8a7"/></linearGradient>
      <linearGradient id="night-window" x2="0" y2="1"><stop stop-color="#526987"/><stop offset="1" stop-color="#beac9d"/></linearGradient>
      <linearGradient id="floor" x2="0" y2="1"><stop stop-color="#c58e5e"/><stop offset="1" stop-color="#a8734e"/></linearGradient>
      <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values=".18 0 0 0 .7 .18 0 0 0 .66 .18 0 0 0 .52 0 0 0 .08 0"/></filter>
    </defs>
    <rect width="1000" height="760" fill="url(#wall)"/>
    <path d="M0 65Q176 89 331 63T663 67T1000 58" fill="none" stroke="#b78358" stroke-width="30" opacity=".78"/>
    <path d="M0 83Q160 103 333 81T665 85T1000 75" fill="none" stroke="#e4ba8d" stroke-width="7"/>
    <g opacity=".24" fill="#c88d78"><path d="M80 180q35-62 83 0q47-52 86 4q-10 42-83 43q-71 1-86-47Z"/><path d="M773 130q34-48 70-1q50-42 82 9q-12 34-74 35q-61 0-78-43Z"/></g>
    <g transform="translate(280 125)">
      <rect width="440" height="330" rx="7" fill="#885d43" stroke="#704b38" stroke-width="12"/>
      <rect x="16" y="16" width="408" height="298" fill="url(#night-window)"/>
      <circle cx="339" cy="68" r="31" fill="#f1e1ba"/><circle cx="352" cy="59" r="28" fill="#687b93"/>
      <path d="M18 224Q98 176 173 226T321 218T423 230V312H18Z" fill="#7b8e88"/><path d="M18 258Q104 227 191 257T342 249T423 262V312H18Z" fill="#627968"/>
      <path d="M114 16v298M297 16v298M16 163h408" stroke="#d9af7f" stroke-width="14"/>
      <path d="M104 16v298M288 16v298M16 155h408" stroke="#f1d3aa" stroke-width="4" opacity=".8"/>
      <g fill="#fff3ca"><circle cx="79" cy="71" r="3"/><circle cx="198" cy="47" r="3"/><circle cx="379" cy="126" r="3"/><path d="M239 90h12m-6-6v12" stroke="#fff3ca" stroke-width="3"/></g>
      <path d="M-26 7Q45 30 26 142L-4 319Q-38 281-43 193Z" fill="#d4a276" stroke="#9b6e4d" stroke-width="5"/><path d="M466 7Q394 30 416 142L444 319Q480 281 486 193Z" fill="#d4a276" stroke="#9b6e4d" stroke-width="5"/>
      <path d="M-26 16Q-6 55-17 111m465-95q-22 39-11 95" fill="none" stroke="#f1d0a7" stroke-width="7" opacity=".8"/>
    </g>
    <path d="M0 540Q245 518 505 541T1000 528V760H0Z" fill="url(#floor)"/>
    <g stroke="#8f6246" stroke-width="5" opacity=".55"><path d="M0 605q254-19 505 0t495-7M0 678q249-17 510 1t490-4M180 542v64m165 1v71m201-71v70m190-74v73"/></g>
    <path d="M240 674Q270 562 510 558Q754 560 786 674Q752 744 512 742Q281 741 240 674Z" fill="#829a8a" opacity=".58" stroke="#647e74" stroke-width="6"/>
    <path d="M278 596Q500 555 735 596L780 692Q763 733 510 735Q278 729 245 687Z" fill="#e7d5c0" stroke="#967455" stroke-width="10"/>
    <path d="M297 604Q500 569 718 604L747 672Q697 698 510 697Q340 700 276 673Z" fill="#b5c4bb" stroke="#f7e8d2" stroke-width="8"/>
    <path d="M296 650Q505 618 735 651L759 701Q694 731 510 729Q336 730 263 704Z" fill="#78939a" stroke="#e9d9c3" stroke-width="8"/>
    <path d="M315 666Q500 642 713 667" fill="none" stroke="#9db2ad" stroke-width="6" stroke-linecap="round"/>
    <g transform="translate(514 601)">
      <ellipse cx="3" cy="36" rx="117" ry="59" fill="${colors.main}" stroke="${colors.stroke}" stroke-width="6"/>
      <path d="M92 31q50-16 45-54q-3-25-24-16q-12 7-10 23" fill="none" stroke="${colors.shadow}" stroke-width="14" stroke-linecap="round"/>
      <path d="M-57 73q-16 20 10 23l32-2M24 75q-5 21 21 20l30-5" fill="${colors.main}" stroke="${colors.stroke}" stroke-width="5" stroke-linecap="round"/>
      ${ears}
      <path d="M-89-40Q-75-91-30-90Q20-95 44-55Q62-18 30 4Q-13 29-63 0Q-101-15-89-40Z" fill="${colors.main}" stroke="${colors.stroke}" stroke-width="6"/>
      <path d="M-37-13q9 10 18 0m31 0q9 10 18 0" fill="none" stroke="${colors.stroke}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="-4" cy="10" rx="25" ry="17" fill="#f4e6d3"/><path d="M-7 7q7-8 14 0q-3 7-8 7q-5 0-6-7Z" fill="#5f493b"/><path d="M-1 15q-9 12-20 7m21-7q9 12 20 7" fill="none" stroke="#a5635e" stroke-width="3" stroke-linecap="round"/>
      <path d="M-46-52q9-9 17 0m42 0q9-9 17 0" fill="none" stroke="${colors.stroke}" stroke-width="4" stroke-linecap="round"/>
      ${custom?.species === species ? `<path d="M-96 18q-19 10-25 31q23 7 39-16" fill="${colors.shadow}" stroke="${colors.stroke}" stroke-width="4"/>` : ""}
    </g>
    <g transform="translate(88 390)"><rect width="140" height="112" rx="6" fill="#8c6347" stroke="#704c39" stroke-width="5"/><rect x="9" y="8" width="122" height="92" fill="#e8d4b6"/><path d="M18 79Q48 46 70 73T122 63V94H18Z" fill="#8da587"/><circle cx="98" cy="27" r="12" fill="#f2d797"/><path d="M53 92q18-35 37-3" fill="none" stroke="#b47b55" stroke-width="5"/><text x="70" y="109" text-anchor="middle" font-family="serif" font-size="10" fill="#6d503d">OUR HOME</text></g>
    ${photo}${postcardWall}${shelf}${plant}${lamp}${plush}
    <g transform="translate(84 512)"><path d="M-40 0h80v77h-80Z" fill="#d29a77" stroke="#805c45" stroke-width="5"/><path d="M-46 0h92v-15q-45-12-92 0Z" fill="#e9c39c" stroke="#805c45" stroke-width="5"/><path d="M-21-12q-19-34 1-54q21 17 8 48m12 6q0-46 30-52q12 31-18 54" fill="#7e9974" stroke="#62795f" stroke-width="4"/></g>
    <g fill="#f6e3b9" opacity=".92"><path d="M493 101h15m-7-8v16M226 485h13m-7-7v14M883 421h13m-7-7v14" stroke="#f6e3b9" stroke-width="3"/><circle cx="739" cy="514" r="4"/><circle cx="257" cy="492" r="3"/></g>
    <rect width="1000" height="760" filter="url(#paper)" opacity=".16" pointer-events="none"/>
  </svg>`;
}

export const destinations = [
  { id: "meadow", name: "暮光草地", description: "樹屋旁的青草地，最適合什麼都不做。", stamp: "暮色星光" },
  { id: "coast", name: "海邊郵局", description: "讓浪花替你把心事寄去遠方。", stamp: "藍色浪花" },
  { id: "sunflower", name: "向日葵小徑", description: "走在花田裡，每一步都亮亮的。", stamp: "暖陽花田" },
  { id: "stargarden", name: "星河露台", description: "天黑以後，星星也會陪你坐一會兒。", stamp: "晚安星河" },
];

export const pets = [
  { id: "dog", name: "阿栗", kind: "小狗", icon: "🐕", line: "總把最軟的肚皮留給你。", mood: "在窗邊曬著暖暖的太陽" },
  { id: "cat", name: "咕嚕", kind: "小貓", icon: "🐈", line: "呼嚕聲是牠的小小魔法。", mood: "在你身邊安靜地呼嚕" },
  { id: "bunny", name: "月月", kind: "小兔", icon: "🐇", line: "喜歡和你一起聽風的聲音。", mood: "豎起耳朵聽遠方的風" },
];

export const decorations = [
  { id: "lantern", name: "窗邊小燈", description: "夜裡亮起一點暖光。", price: 18, icon: "☼" },
  { id: "flowerbed", name: "門口花盆", description: "種幾朵不著急盛開的小花。", price: 25, icon: "✿" },
  { id: "telescope", name: "舊舊望遠鏡", description: "看看下一封信從哪顆星星來。", price: 32, icon: "⌖" },
];
