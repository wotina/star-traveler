const palettes = {
  meadow: { sky: "#b8ddd0", far: "#97bfaa", mid: "#7cab82", ground: "#75976b", sun: "#f4d77e", accent: "#e7a65f", whisper: "微風把草葉吹得沙沙響。" },
  coast: { sky: "#b7dfe0", far: "#94c8c8", mid: "#78b5b7", ground: "#e5ce9b", sun: "#f6d488", accent: "#d98464", whisper: "海浪把一封沒寫完的信送上岸。" },
  sunflower: { sky: "#d3e6d0", far: "#b5cb8d", mid: "#a0b96d", ground: "#8ca262", sun: "#f6d678", accent: "#d69048", whisper: "向日葵們正朝著同一個方向發呆。" },
  stargarden: { sky: "#41556e", far: "#627b83", mid: "#637f73", ground: "#60745f", sun: "#f7e3af", accent: "#cfacb0", whisper: "有幾顆星星，今晚打算陪我們久一點。" },
};

const safeDecor = new Set(["lantern", "flowerbed", "telescope"]);

function petArt(active) {
  const focus = (id, x, y, rx, ry) => id === active ? `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff1bd" opacity=".74"/><ellipse cx="${x}" cy="${y}" rx="${rx + 14}" ry="${ry + 9}" fill="none" stroke="#fff8dc" stroke-width="3" stroke-dasharray="2 9" opacity=".9"/>` : "";
  return `
  <g transform="translate(404 546)">
    ${focus("dog", 4, -2, 116, 90)}
    <ellipse cx="0" cy="66" rx="110" ry="17" fill="#455e4b" opacity=".17"/>
    <path d="M-91 27 C-107 3 -90 -33 -55 -42 C-27 -66 33 -65 68 -40 C101 -21 112 21 85 45 C50 70 -38 73 -80 48Z" fill="#c89254" stroke="#6d5038" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-95 22 C-132 36 -133 57 -159 58 C-141 39 -143 23 -123 11" fill="#b47c43" stroke="#6d5038" stroke-width="5" stroke-linecap="round"/>
    <path d="M-68 45 Q-69 73 -40 69 L-26 50 M53 47 Q58 71 83 62 L86 44" fill="#efd4a0" stroke="#6d5038" stroke-width="4" stroke-linecap="round"/>
    <path d="M-58 -43 C-74 -81 -47 -101 -23 -75 L-7 -54" fill="#896843" stroke="#6d5038" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-16 -54 C4 -88 48 -82 69 -57 C92 -31 76 8 46 15 C15 24 -19 0 -21 -28Z" fill="#d9a967" stroke="#6d5038" stroke-width="5" stroke-linejoin="round"/>
    <path d="M10 -2 Q25 -20 48 -5 Q45 11 27 13 Q13 12 10 -2" fill="#fff0d5" stroke="#6d5038" stroke-width="3"/>
    <path d="M34 -14 Q44 -18 49 -12 Q46 -6 39 -7Z" fill="#503d31"/>
    <path d="M20 -36 Q26 -44 32 -37 M51 -35 Q57 -42 62 -35" fill="none" stroke="#47382e" stroke-width="4" stroke-linecap="round"/>
    <path d="M35 0 Q42 6 49 -1" fill="none" stroke="#9e5b55" stroke-width="3" stroke-linecap="round"/>
    <path d="M-84 -5 Q-77 5 -72 13 M70 25 Q62 35 54 38" fill="none" stroke="#e1b77a" stroke-width="4" stroke-linecap="round" opacity=".85"/>
    <path d="M-21 -26 Q-15 -29 -10 -24" fill="none" stroke="#fff0d5" stroke-width="4" stroke-linecap="round"/>
  </g>

  <g transform="translate(645 568)">
    ${focus("cat", 0, -3, 105, 79)}
    <ellipse cx="0" cy="57" rx="104" ry="16" fill="#455e4b" opacity=".18"/>
    <path d="M-82 22 C-99 -6 -69 -50 -29 -41 C4 -57 52 -37 68 -4 C91 24 71 53 38 53 L-54 53Z" fill="#798493" stroke="#46515c" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-42 27 Q-54 52 -25 55 L-17 42 M29 42 Q39 58 61 48 L58 34" fill="#d8d9d2" stroke="#46515c" stroke-width="4" stroke-linecap="round"/>
    <path d="M-63 -21 L-65 -64 Q-62 -75 -49 -65 L-22 -43 M24 -43 L52 -70 Q64 -78 68 -63 L63 -22" fill="#667381" stroke="#46515c" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-57 -52 L-54 -39 L-43 -46 M54 -56 L53 -39 L42 -48" fill="#d99d9b"/>
    <path d="M-52 -8 C-48 -32 -19 -40 1 -25 C22 -41 51 -26 51 -4 C48 19 27 31 0 29 C-28 33 -53 17 -52 -8Z" fill="#f2eee5" stroke="#46515c" stroke-width="3"/>
    <path d="M-27 -13 Q-21 -20 -16 -13 M18 -13 Q24 -20 29 -13" fill="none" stroke="#343c43" stroke-width="4" stroke-linecap="round"/>
    <path d="M-6 -2 Q0 -8 6 -2 L1 3Z" fill="#ba7775"/>
    <path d="M1 3 Q-5 12 -12 7 M1 3 Q8 12 14 7" fill="none" stroke="#a45f61" stroke-width="3" stroke-linecap="round"/>
    <path d="M-61 0 l-21 -5 M-60 7 l-21 4 M59 0 l20 -6 M59 8 l22 5" fill="none" stroke="#d8d9d2" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M-12 -39 l7 12 M3 -42 l4 13 M18 -39 l-1 12" stroke="#4c5864" stroke-width="5" stroke-linecap="round"/>
  </g>

  <g transform="translate(874 545)">
    ${focus("bunny", 1, -1, 94, 90)}
    <ellipse cx="0" cy="67" rx="93" ry="15" fill="#455e4b" opacity=".18"/>
    <path d="M-56 -34 C-87 -91 -85 -151 -56 -159 C-32 -164 -19 -108 -13 -51 M18 -43 C26 -108 49 -145 71 -132 C92 -118 71 -61 48 -24" fill="#a68a68" stroke="#655541" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-54 -117 Q-58 -151 -51 -150 Q-39 -144 -34 -104 M46 -81 Q59 -124 68 -121 Q77 -113 56 -73" fill="#d8aaa1"/>
    <path d="M-72 20 C-69 -18 -40 -52 2 -48 C47 -48 75 -13 67 27 C63 62 31 71 -24 63 C-62 59 -83 45 -72 20Z" fill="#b69a75" stroke="#655541" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-17 51 Q-22 67 1 67 L15 55 M30 55 Q40 70 58 60" fill="#e3d0b2" stroke="#655541" stroke-width="4" stroke-linecap="round"/>
    <path d="M-3 -4 Q2 -12 8 -4" fill="none" stroke="#332d27" stroke-width="5" stroke-linecap="round"/>
    <path d="M39 5 Q47 0 50 7 Q47 14 42 11Z" fill="#76604d"/>
    <path d="M44 11 Q38 20 30 17 M44 11 Q51 19 57 14" fill="none" stroke="#806451" stroke-width="3" stroke-linecap="round"/>
    <path d="M-51 1 Q-41 13 -40 29 M-13 -33 Q-3 -19 4 -17 M-4 29 Q-13 37 -22 36" fill="none" stroke="#c8b08e" stroke-width="4" stroke-linecap="round" opacity=".85"/>
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

export function createSceneSvg({ location = "meadow", activePet = "dog", decor = [] } = {}) {
  const p = palettes[location] || palettes.meadow;
  const decorations = new Set(decor.filter((item) => safeDecor.has(item)));
  const night = location === "stargarden";
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

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="1200" height="760">
    <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${p.sky}"/><stop offset="1" stop-color="${night ? "#849c91" : "#e5ead0"}"/></linearGradient><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".74" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values=".18 0 0 0 .7 .18 0 0 0 .66 .18 0 0 0 .52 0 0 0 .09 0"/></filter></defs>
    <rect width="1200" height="760" fill="url(#sky)"/>${moonSun}${cloud(490,153,.8)}${cloud(763,238,.55)}
    <path d="M0 394 Q122 328 240 389 T474 377 T729 387 T965 361 T1200 382 V760 H0Z" fill="${p.far}" opacity=".91"/><path d="M0 440 Q144 377 271 422 T531 414 T804 423 T1056 399 T1200 418 V760 H0Z" fill="${p.mid}" opacity=".84"/>
    ${location === "coast" ? destinationArt(location,p) : `<path d="M0 472 Q125 402 278 466 T566 466 T852 448 T1200 464 V760 H0Z" fill="${p.ground}"/>`}
    ${location === "sunflower" || location === "stargarden" ? destinationArt(location,p) : ""}${trees}${treehouse}${decorArt}
    <path d="M0 548 Q132 523 270 551 T550 543 T839 554 T1080 536 T1200 544 V760 H0Z" fill="#6d8c62" opacity=".${night ? "58" : "40"}"/>
    ${flowers}${petArt(activePet)}
    <g fill="none" stroke="#f7e6af" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M465 328l3-9 3 9 9 3-9 3-3 9-3-9-9-3z"/><path d="M1098 381l2-7 2 7 7 2-7 2-2 7-2-7-7-2z"/><path d="M380 467l2-6 2 6 6 2-6 2-2 6-2-6-6-2z"/></g>
    <rect width="1200" height="760" filter="url(#paper)" opacity=".19" pointer-events="none"/>
  </svg>`;
}

export const destinations = [
  { id: "meadow", name: "午後草地", description: "樹屋旁的青草地，最適合什麼都不做。", stamp: "午後的風" },
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
