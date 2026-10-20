import Phaser from "phaser"

const GAME_INFO = {
  "reef-fill": {
    title: "珊瑚礁色彩復育",
    subtitle: "選擇一種顏色，讓相連的珊瑚與海草慢慢長成一片。",
    hint: "點選下方顏色，看看棲地如何連成一片。",
    status: "用最少步數，讓整座珊瑚礁連成同一片。"
  },
  "reef-rescue": {
    title: "海龜救援泡泡",
    subtitle: "移動清潔船接住泡泡，清除海中的塑膠垃圾。",
    hint: "移動滑鼠或手指控制清潔船，點一下發射泡泡。",
    status: "清除漂浮垃圾，讓海洋生物有更安全的家。"
  },
  "ocean-sort": {
    title: "海洋生物棲地分類",
    subtitle: "觀察生物的習性，替牠找到適合生活的海域。",
    hint: "看一看生物特徵，再選擇牠常出現的棲地。",
    status: "答對後會收到一則海洋生物小知識。"
  },
  "food-chain": {
    title: "海洋食物鏈排序",
    subtitle: "從陽光與微小生物開始，排出海洋能量的旅程。",
    hint: "依序點兩張卡片交換位置，排出能量傳遞順序。",
    status: "想想看：誰把陽光變成養分，誰又會吃小魚？"
  },
  "reef-survey": {
    title: "珊瑚礁安全巡查",
    subtitle: "運用附近線索找出廢棄漁網，為珊瑚礁標記安全區。",
    hint: "點格子巡查，切換插旗模式標記你推理出的漁網。",
    status: "數字代表周圍八格裡有幾個廢棄漁網。"
  },
  "turtle-run": {
    title: "海龜穿越清潔洋流",
    subtitle: "游過洋流收集水母，同時避開塑膠袋與漁網。",
    hint: "移動滑鼠、手指或方向鍵帶著海龜游動。",
    status: "找到 6 隻水母就能完成旅程，最多承受 3 次碰撞。"
  },
  "turtle-route": {
    title: "海龜尋找水母",
    subtitle: "規劃安全路線，帶著海龜穿過海草床與珊瑚礁。",
    hint: "用方向鍵或下方方向鈕移動，避開垃圾並尋找水母。",
    status: "棱皮龜會吃水母，誤食塑膠袋卻可能危害健康。"
  },
  "deep-sea": {
    title: "深海探索圖鑑",
    subtitle: "駕駛小潛艇分層探索，認識不同深度的海洋居民。",
    hint: "用方向鍵、點擊鄰近海域或下方方向鈕移動。",
    status: "找到陽光層、暮光層與午夜層的生物。"
  },
  "seagrass-stack": {
    title: "海草床棲地復育",
    subtitle: "對準每一塊海草苗床，為小魚與海龜搭起棲地。",
    hint: "點一下放下正在移動的苗床，重疊越整齊棲地越穩固。",
    status: "連續疊起海草床，看看能迎來多少海洋鄰居。"
  }
}

const colors = {
  paper: 0xf7f1e3,
  ink: 0x314a53,
  muted: 0x6d807c,
  green: 0x779b82,
  deep: 0x36576c,
  water: 0xd9e9e5,
  pale: 0xfffcf3,
  line: 0xcbd8ca,
  gold: 0xe9bd70,
  coral: 0xdf9479,
  blue: 0x85aebd
}

const font = '"Kaiti TC", "BiauKai", "DFKai-SB", "Noto Serif TC", serif'
const emojiFont = '"Segoe UI Emoji", "Apple Color Emoji", sans-serif'
const clamp = (value, low, high) => Math.min(high, Math.max(low, value))
const randomItem = list => list[Phaser.Math.Between(0, list.length - 1)]

const habitatQuestions = [
  { name: "小丑魚", emoji: "🐠", habitat: "珊瑚礁", fact: "小丑魚常躲在海葵觸手間，海葵也能得到牠的幫助。" },
  { name: "綠蠵龜", emoji: "🐢", habitat: "海草床", fact: "成年綠蠵龜常在淺海海草床覓食海草與藻類。" },
  { name: "鮟鱇魚", emoji: "🐟", habitat: "深海", fact: "鮟鱇魚生活在深海，有些種類會用發光的誘餌吸引獵物。" },
  { name: "海馬", emoji: "🐠", habitat: "海草床", fact: "海馬會用尾巴纏住海草，避免被海流帶走。" },
  { name: "瓶鼻海豚", emoji: "🐬", habitat: "開放海域", fact: "瓶鼻海豚會用回聲定位，辨認周圍環境並尋找獵物。" },
  { name: "章魚", emoji: "🐙", habitat: "珊瑚礁", fact: "章魚能改變體色與皮膚紋理，躲藏在岩礁縫隙中。" },
  { name: "燈籠魚", emoji: "🐟", habitat: "深海", fact: "許多燈籠魚會發出生物光，在昏暗海水中傳遞訊號。" },
  { name: "飛魚", emoji: "🐟", habitat: "開放海域", fact: "飛魚能張開胸鰭滑翔一段距離，躲避水中的掠食者。" }
]

const foodChain = [
  { name: "浮游植物", emoji: "🌱", caption: "生產者", fact: "浮游植物利用陽光進行光合作用，是許多海洋食物網的基礎。" },
  { name: "浮游動物", emoji: "🦐", caption: "初級消費者", fact: "浮游動物會攝食浮游植物，也成為許多小魚的食物。" },
  { name: "小魚", emoji: "🐟", caption: "中型消費者", fact: "小魚把能量傳給更大的魚類，也連結起海洋食物網。" },
  { name: "鮪魚", emoji: "🐟", caption: "大型掠食者", fact: "鮪魚會捕食小魚與魷魚，游泳速度很快。" },
  { name: "鯊魚", emoji: "🦈", caption: "頂級掠食者", fact: "鯊魚種類很多，牠們在海洋食物網中扮演多樣角色。" }
]

class MarineMechanismScene extends Phaser.Scene {
  constructor() {
    super("marine-mechanism")
    this.kind = new URLSearchParams(window.location.search).get("game") || "reef-fill"
    if (!GAME_INFO[this.kind]) this.kind = "reef-fill"
    this.info = GAME_INFO[this.kind]
  }

  create() {
    this.input.mouse.disableContextMenu()
    this.input.on("pointerdown", this.onPointerDown, this)
    this.input.on("pointermove", this.onPointerMove, this)
    this.input.keyboard.on("keydown", this.onKeyDown, this)
    this.scale.on(Phaser.Scale.Events.RESIZE, this.buildFrame, this)
    const width = Math.max(320, this.scale.width)
    const height = Math.max(480, this.scale.height)
    const margin = clamp(width * 0.05, 22, 36)
    this.width = width
    this.height = height
    this.play = { x: margin, y: 144, w: width - margin * 2, h: height - 212 }
    this.resetModel()
    this.buildFrame()
  }

  update(_time, delta) {
    const seconds = Math.min(delta / 1000, 0.05)
    if (this.kind === "reef-rescue") this.updateRescue(seconds)
    if (this.kind === "turtle-run") this.updateTurtleRun(seconds)
    if (this.kind === "turtle-route") this.updateTurtleRoute(seconds)
    if (this.kind === "seagrass-stack") this.updateStack(seconds)
  }

  resetModel() {
    this.status = this.info.status
    this.message = ""
    this.over = false
    this.started = false
    this.moves = 0

    if (this.kind === "reef-fill") this.resetReefFill()
    if (this.kind === "reef-rescue") this.resetRescue()
    if (this.kind === "ocean-sort") this.resetSort()
    if (this.kind === "food-chain") this.resetFoodChain()
    if (this.kind === "reef-survey") this.resetSurvey()
    if (this.kind === "turtle-run") this.resetTurtleRun()
    if (this.kind === "turtle-route") this.resetTurtleRoute()
    if (this.kind === "deep-sea") this.resetDeepSea()
    if (this.kind === "seagrass-stack") this.resetStack()
  }

  buildFrame() {
    this.children.removeAll(true)
    this.dynamicTexts = []
    const width = Math.max(320, this.scale.width)
    const height = Math.max(480, this.scale.height)
    this.width = width
    this.height = height
    this.uiScale = clamp(Math.min(width / 620, height / 760), 0.72, 1.15)
    const margin = clamp(width * 0.05, 22, 36)
    const top = 144
    const bottom = 68
    this.play = {
      x: margin,
      y: top,
      w: width - margin * 2,
      h: height - top - bottom
    }
    if (this.kind === "reef-rescue" && this.ball && !this.launched) {
      this.paddleX = clamp(this.paddleX, this.play.x + 56, this.play.x + this.play.w - 56)
      this.ball.x = this.paddleX
      this.ball.y = this.play.y + this.play.h - 76
    }

    this.backdrop = this.add.graphics()
    this.backdrop.fillStyle(colors.paper, 1)
    this.backdrop.fillRect(0, 0, width, height)
    this.backdrop.fillStyle(0xe7efe5, 0.58)
    this.backdrop.fillEllipse(width * 0.1, height * 0.08, width * 0.38, height * 0.2)
    this.backdrop.fillStyle(0xf0e4c9, 0.55)
    this.backdrop.fillEllipse(width * 0.9, height * 0.92, width * 0.42, height * 0.23)
    this.backdrop.lineStyle(1, 0xc9d7ce, 0.18)
    for (let i = 0; i < 30; i += 1) {
      const x = Phaser.Math.Between(8, width - 8)
      const y = Phaser.Math.Between(10, height - 10)
      this.backdrop.fillStyle(i % 2 ? 0x718e81 : 0xd6b97f, 0.12)
      this.backdrop.fillCircle(x, y, Phaser.Math.Between(1, 2))
    }
    this.backdrop.fillStyle(colors.pale, 0.82)
    this.backdrop.fillRoundedRect(this.play.x, this.play.y, this.play.w, this.play.h, 24)
    this.backdrop.lineStyle(2, colors.line, 0.9)
    this.backdrop.strokeRoundedRect(this.play.x, this.play.y, this.play.w, this.play.h, 24)
    this.backdrop.lineStyle(1, 0xffffff, 0.85)
    this.backdrop.strokeRoundedRect(this.play.x + 6, this.play.y + 6, this.play.w - 12, this.play.h - 12, 19)

    this.add.text(margin, 19, this.info.title, {
      fontFamily: font,
      fontSize: Math.round(clamp(width * 0.049, 18, 29)) + "px",
      color: "#314a53",
      fontStyle: "bold",
      wordWrap: { width: width - margin * 2 - 132 }
    })
    this.add.text(margin + 1, 57, this.info.subtitle, {
      fontFamily: font,
      fontSize: Math.round(clamp(width * 0.025, 12, 15)) + "px",
      color: "#6d807c",
      wordWrap: { width: width - margin * 2 - 8 },
      lineSpacing: 2
    })

    this.statusText = this.add.text(margin + 2, 103, this.status, {
      fontFamily: font,
      fontSize: Math.round(clamp(width * 0.024, 12, 15)) + "px",
      color: "#4e6b67",
      fontStyle: "bold",
      wordWrap: { width: width - margin * 2 - 135 },
      lineSpacing: 2
    })

    this.backdrop.fillStyle(0x75927f, 0.17)
    this.backdrop.fillRoundedRect(width - margin - 112, 91, 112, 38, 19)
    this.backdrop.lineStyle(1.3, 0x9caf98, 0.8)
    this.backdrop.strokeRoundedRect(width - margin - 112, 91, 112, 38, 19)
    this.add.text(width - margin - 56, 110, "重新開始　↻", {
      fontFamily: font,
      fontSize: "13px",
      color: "#466056",
      fontStyle: "bold"
    }).setOrigin(0.5)

    this.hintText = this.add.text(width / 2, height - 31, this.info.hint, {
      fontFamily: font,
      fontSize: Math.round(clamp(width * 0.022, 11, 14)) + "px",
      color: "#71817a",
      align: "center",
      wordWrap: { width: width - margin * 2 - 10 }
    }).setOrigin(0.5)
    this.art = this.add.graphics()
    this.renderGame()
  }

  setStatus(text) {
    this.status = text
    if (this.statusText) this.statusText.setText(text)
  }

  label(text, x, y, size, color, options = {}) {
    const item = this.add.text(x, y, text, {
      fontFamily: options.emoji ? emojiFont : font,
      fontSize: Math.round(size) + "px",
      color: color || "#314a53",
      fontStyle: options.bold ? "bold" : "normal",
      align: options.align || "center",
      wordWrap: options.wrap ? { width: options.wrap } : undefined,
      lineSpacing: options.lineSpacing || 2
    }).setOrigin(options.originX === undefined ? 0.5 : options.originX, options.originY === undefined ? 0.5 : options.originY)
    this.dynamicTexts.push(item)
    return item
  }

  renderGame() {
    if (!this.art) return
    this.dynamicTexts.forEach(item => item.destroy())
    this.dynamicTexts = []
    this.art.clear()
    if (this.kind === "reef-fill") this.drawReefFill()
    if (this.kind === "reef-rescue") this.drawRescue()
    if (this.kind === "ocean-sort") this.drawSort()
    if (this.kind === "food-chain") this.drawFoodChain()
    if (this.kind === "reef-survey") this.drawSurvey()
    if (this.kind === "turtle-run") this.drawTurtleRun()
    if (this.kind === "turtle-route") this.drawTurtleRoute()
    if (this.kind === "deep-sea") this.drawDeepSea()
    if (this.kind === "seagrass-stack") this.drawStack()
  }

  onPointerDown(pointer) {
    const margin = clamp(this.width * 0.05, 22, 36)
    if (pointer.y >= 82 && pointer.y <= 138 && pointer.x >= this.width - margin - 120) {
      this.resetModel()
      this.setStatus(this.status)
      this.renderGame()
      return
    }
    if (this.kind === "reef-survey" && this.surveyModeRect &&
      pointer.x >= this.surveyModeRect.x && pointer.x <= this.surveyModeRect.x + this.surveyModeRect.w &&
      pointer.y >= this.surveyModeRect.y && pointer.y <= this.surveyModeRect.y + this.surveyModeRect.h) {
      this.surveyMode = this.surveyMode === "reveal" ? "flag" : "reveal"
      this.setStatus(this.surveyMode === "reveal" ? "巡查模式：點格子查看線索。" : "插旗模式：標記你推理出的廢棄漁網。")
      this.renderGame()
      return
    }
    if (this.kind === "reef-fill") this.handleReefFill(pointer)
    if (this.kind === "reef-rescue") this.handleRescue(pointer)
    if (this.kind === "ocean-sort") this.handleSort(pointer)
    if (this.kind === "food-chain") this.handleFoodChain(pointer)
    if (this.kind === "reef-survey") this.handleSurvey(pointer)
    if (this.kind === "turtle-run") this.handleTurtleRun(pointer)
    if (this.kind === "turtle-route") this.handleTurtleRoutePointer(pointer)
    if (this.kind === "deep-sea") this.handleDeepSeaPointer(pointer)
    if (this.kind === "seagrass-stack") this.handleStack(pointer)
  }

  onPointerMove(pointer) {
    if (this.kind === "reef-rescue" && this.play) {
      this.paddleX = clamp(pointer.x, this.play.x + 56, this.play.x + this.play.w - 56)
      this.paintRescue()
    }
    if (this.kind === "turtle-run" && this.started && !this.over) {
      this.player.x = clamp(pointer.x, this.play.x + 22, this.play.x + this.play.w - 22)
      this.player.y = clamp(pointer.y, this.play.y + 22, this.play.y + this.play.h - 22)
      this.paintTurtleRun()
    }
  }

  onKeyDown(event) {
    const key = event.key.toLowerCase()
    if (this.kind === "turtle-route") {
      const map = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }
      if (map[key]) this.setSnakeDirection(map[key][0], map[key][1])
    }
    if (this.kind === "deep-sea") {
      const map = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }
      if (map[key]) this.moveDeepSea(map[key][0], map[key][1])
    }
    if (this.kind === "turtle-run" && !this.over &&
      ["arrowup", "w", "arrowdown", "s", "arrowleft", "a", "arrowright", "d"].includes(key)) {
      this.started = true
      const step = 18
      if (key === "arrowup" || key === "w") this.player.y = clamp(this.player.y - step, this.play.y + 20, this.play.y + this.play.h - 20)
      if (key === "arrowdown" || key === "s") this.player.y = clamp(this.player.y + step, this.play.y + 20, this.play.y + this.play.h - 20)
      if (key === "arrowleft" || key === "a") this.player.x = clamp(this.player.x - step, this.play.x + 20, this.play.x + this.play.w - 20)
      if (key === "arrowright" || key === "d") this.player.x = clamp(this.player.x + step, this.play.x + 20, this.play.x + this.play.w - 20)
      this.paintTurtleRun()
    }
    if (this.kind === "seagrass-stack" && (key === " " || key === "enter")) this.dropStack()
  }

  drawDpad(y) {
    const p = this.play
    const size = 36
    const gap = 5
    const centerX = p.x + p.w / 2
    const baseY = y
    const buttons = [
      { x: centerX, y: baseY - size - gap, label: "↑", dx: 0, dy: -1 },
      { x: centerX - size - gap, y: baseY, label: "←", dx: -1, dy: 0 },
      { x: centerX, y: baseY, label: "↓", dx: 0, dy: 1 },
      { x: centerX + size + gap, y: baseY, label: "→", dx: 1, dy: 0 }
    ]
    buttons.forEach(button => {
      this.art.fillStyle(0xe9eee3, 1)
      this.art.fillRoundedRect(button.x - size / 2, button.y - size / 2, size, size, 12)
      this.art.lineStyle(1.2, 0xb8c9bc, 0.9)
      this.art.strokeRoundedRect(button.x - size / 2, button.y - size / 2, size, size, 12)
      this.label(button.label, button.x, button.y, 19, "#4f6d63", { bold: true })
    })
    this.dpadButtons = buttons.map(button => ({ ...button, size }))
  }

  handleDpad(pointer, callback) {
    if (!this.dpadButtons) return false
    for (const button of this.dpadButtons) {
      if (Math.abs(pointer.x - button.x) <= button.size / 2 && Math.abs(pointer.y - button.y) <= button.size / 2) {
        callback(button.dx, button.dy)
        return true
      }
    }
    return false
  }

  fillCell(x, y, w, h, color, stroke = 0xffffff, radius = 7) {
    this.art.fillStyle(color, 1)
    this.art.fillRoundedRect(x, y, w, h, radius)
    this.art.lineStyle(1.4, stroke, 0.9)
    this.art.strokeRoundedRect(x + 0.5, y + 0.5, w - 1, h - 1, radius)
  }

  drawTurtle(graphics, x, y, size, tint = 0x739a81) {
    graphics.fillStyle(0x536b5d, 0.13)
    graphics.fillEllipse(x + 2, y + size * 0.5, size * 1.5, size * 0.45)
    graphics.fillStyle(tint, 1)
    graphics.fillEllipse(x, y, size * 1.1, size * 0.82)
    graphics.lineStyle(2, 0x4d6c5d, 0.8)
    graphics.strokeEllipse(x, y, size * 1.1, size * 0.82)
    graphics.lineBetween(x - size * 0.32, y - size * 0.2, x - size * 0.1, y + size * 0.12)
    graphics.lineBetween(x + size * 0.32, y - size * 0.2, x + size * 0.1, y + size * 0.12)
    graphics.fillStyle(0x9bb89a, 1)
    graphics.fillCircle(x + size * 0.68, y - size * 0.04, size * 0.22)
    graphics.fillStyle(0x314a53, 1)
    graphics.fillCircle(x + size * 0.76, y - size * 0.08, Math.max(2, size * 0.035))
  }

  // 01：珊瑚礁色塊復育
  resetReefFill() {
    const palette = [0xe79b7e, 0x7fa98b, 0x85b4c3, 0xe4c36f]
    this.reefPalette = palette
    this.reefNames = ["珊瑚", "海草", "礁岩", "海綿"]
    this.reefGrid = Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => Phaser.Math.Between(0, 3)))
    this.reefMoves = 0
    this.reefLimit = 18
    this.reefRegion = this.getReefRegion(this.reefGrid[0][0])
    this.reefDone = false
    this.setStatus("復育步數 0 / " + this.reefLimit + "　已連成 " + this.reefRegion.length + " 格")
  }

  getReefRegion(color) {
    const found = new Set(["0,0"])
    const queue = [[0, 0]]
    while (queue.length) {
      const [row, col] = queue.shift()
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = row + dr
        const nc = col + dc
        const key = nr + "," + nc
        if (nr >= 0 && nr < 7 && nc >= 0 && nc < 7 && !found.has(key) && this.reefGrid[nr][nc] === color) {
          found.add(key)
          queue.push([nr, nc])
        }
      }
    }
    return Array.from(found, key => key.split(",").map(Number))
  }

  handleReefFill(pointer) {
    if (this.reefDone || this.over) return
    const boardSize = Math.min((this.play.w - 54), (this.play.h - 150)) 
    const cell = boardSize / 7
    const boardX = this.play.x + (this.play.w - boardSize) / 2
    const boardY = this.play.y + 40
    const buttonY = boardY + boardSize + 50
    if (Math.abs(pointer.y - buttonY) > 26) return
    const buttonGap = 10
    const buttonW = Math.min(98, (this.play.w - 40 - buttonGap * 3) / 4)
    const total = buttonW * 4 + buttonGap * 3
    const start = this.play.x + (this.play.w - total) / 2
    for (let i = 0; i < 4; i += 1) {
      const x = start + i * (buttonW + buttonGap)
      if (pointer.x >= x && pointer.x <= x + buttonW) {
        const old = this.reefGrid[0][0]
        if (old === i) return
        this.reefRegion = this.getReefRegion(old)
        this.reefRegion.forEach(([row, col]) => { this.reefGrid[row][col] = i })
        this.reefMoves += 1
        this.reefRegion = this.getReefRegion(i)
        this.reefDone = this.reefRegion.length === 49
        if (this.reefDone) {
          this.setStatus("珊瑚礁復育完成！多樣的棲地能提供魚類躲藏與覓食空間。")
        } else if (this.reefMoves >= this.reefLimit) {
          this.setStatus("再試一輪，看看能不能用更少步數連起棲地。")
        } else {
          this.setStatus("復育步數 " + this.reefMoves + " / " + this.reefLimit + "　已連成 " + this.reefRegion.length + " 格")
        }
        this.renderGame()
        return
      }
    }
  }

  drawReefFill() {
    const p = this.play
    const boardSize = Math.min(p.w - 54, p.h - 150)
    const cell = boardSize / 7
    const boardX = p.x + (p.w - boardSize) / 2
    const boardY = p.y + 40
    this.label("珊瑚礁拼圖　✦　連接相鄰的棲地色塊", p.x + p.w / 2, p.y + 22, 14, "#597267", { bold: true })
    this.reefGrid.forEach((row, r) => row.forEach((color, c) => {
      const x = boardX + c * cell + 2
      const y = boardY + r * cell + 2
      this.fillCell(x, y, cell - 4, cell - 4, this.reefPalette[color], 0xfff9e8, 8)
      this.art.fillStyle(0xffffff, 0.25)
      this.art.fillCircle(x + cell * 0.35, y + cell * 0.3, Math.max(2, cell * 0.045))
      if (color === 0) {
        this.art.lineStyle(1.3, 0xffe6d2, 0.7)
        this.art.lineBetween(x + cell * 0.55, y + cell * 0.7, x + cell * 0.68, y + cell * 0.43)
      }
      if (color === 1) {
        this.art.lineStyle(1.4, 0xe5f0d7, 0.7)
        this.art.lineBetween(x + cell * 0.5, y + cell * 0.82, x + cell * 0.48, y + cell * 0.3)
      }
    }))
    const buttonY = boardY + boardSize + 50
    const buttonGap = 10
    const buttonW = Math.min(98, (p.w - 40 - buttonGap * 3) / 4)
    const total = buttonW * 4 + buttonGap * 3
    const start = p.x + (p.w - total) / 2
    this.reefPalette.forEach((color, index) => {
      const x = start + index * (buttonW + buttonGap)
      this.fillCell(x, buttonY - 18, buttonW, 36, color, 0xffffff, 17)
      this.label(this.reefNames[index], x + buttonW / 2, buttonY, 12, "#fffdf5", { bold: true })
    })
    if (this.reefDone) this.label("珊瑚礁生態有許多不同棲地，", p.x + p.w / 2, p.y + p.h - 22, 13, "#567366")
  }

  // 02：以清潔船擊落塑膠垃圾
  resetRescue() {
    this.rescueScore = 0
    this.rescueLives = 3
    this.rescueOver = false
    this.launched = false
    this.paddleX = this.play ? this.play.x + this.play.w / 2 : (this.scale.width || 600) / 2
    this.ball = { x: this.paddleX, y: 0, vx: 180, vy: -250, r: 9 }
    this.bricks = Array.from({ length: 18 }, (_, index) => ({ col: index % 6, row: Math.floor(index / 6), alive: true }))
    this.setStatus("垃圾清除 " + this.rescueScore + " / " + this.bricks.length + "　船員 " + this.rescueLives + " 顆愛心")
  }

  handleRescue(pointer) {
    if (this.rescueOver) {
      this.resetRescue()
      this.renderGame()
      return
    }
    if (!this.launched) {
      this.launched = true
      const direction = pointer.x < this.paddleX ? -1 : 1
      this.ball.vx = direction * 190
      this.ball.vy = -255
      this.setStatus("泡泡出發！把漂浮塑膠從海裡清出去。")
    }
  }

  updateRescue(dt) {
    if (!this.play || !this.ball) return
    if (!this.launched || this.rescueOver) {
      this.ball.x = this.paddleX
      this.ball.y = this.play.y + this.play.h - 76
      return
    }
    const p = this.play
    const paddleY = p.y + p.h - 48
    this.ball.x += this.ball.vx * dt
    this.ball.y += this.ball.vy * dt
    if (this.ball.x < p.x + 14 || this.ball.x > p.x + p.w - 14) this.ball.vx *= -1
    if (this.ball.y < p.y + 18) this.ball.vy = Math.abs(this.ball.vy)
    if (this.ball.y + this.ball.r >= paddleY - 4 && this.ball.y <= paddleY + 14 &&
      this.ball.x >= this.paddleX - 54 && this.ball.x <= this.paddleX + 54 && this.ball.vy > 0) {
      const offset = (this.ball.x - this.paddleX) / 54
      this.ball.vx = offset * 260
      this.ball.vy = -Math.max(210, Math.abs(this.ball.vy))
    }

    const blockW = (p.w - 58) / 6
    const blockH = 31
    const blockX = p.x + 29
    const blockY = p.y + 76
    const hit = this.bricks.find(brick => brick.alive &&
      this.ball.x >= blockX + brick.col * blockW &&
      this.ball.x <= blockX + (brick.col + 1) * blockW &&
      this.ball.y >= blockY + brick.row * (blockH + 10) &&
      this.ball.y <= blockY + brick.row * (blockH + 10) + blockH)
    if (hit) {
      hit.alive = false
      this.rescueScore += 1
      this.ball.vy *= -1
      this.setStatus("已清除 " + this.rescueScore + " 件塑膠垃圾　船員 " + this.rescueLives + " 顆愛心")
      if (this.bricks.every(brick => !brick.alive)) {
        this.rescueOver = true
        this.setStatus("海面清理完成！減少塑膠能降低動物誤食與纏繞風險。")
      }
    }
    if (this.ball.y > p.y + p.h) {
      this.rescueLives -= 1
      if (this.rescueLives <= 0) {
        this.rescueOver = true
        this.setStatus("清潔船需要休息，再試一次幫海龜整理海面吧。")
      } else {
        this.launched = false
        this.setStatus("泡泡回到船上　剩下 " + this.rescueLives + " 次機會，點擊再發射。")
      }
    }
    this.paintRescue()
  }

  drawRescue() {
    const p = this.play
    this.art.fillStyle(0xdcece9, 0.7)
    this.art.fillRoundedRect(p.x + 16, p.y + 18, p.w - 32, p.h - 36, 20)
    for (let i = 0; i < 4; i += 1) {
      this.art.lineStyle(1, 0x8fb8ba, 0.24)
      this.art.lineBetween(p.x + 20, p.y + p.h * 0.48 + i * 15, p.x + p.w - 20, p.y + p.h * 0.48 + i * 15)
    }
    const blockW = (p.w - 58) / 6
    const blockH = 31
    const blockX = p.x + 29
    const blockY = p.y + 76
    const trashColors = [0xe9b86b, 0xd88970, 0x8eabc1, 0xc5a6bd, 0x86a992, 0xdcbf7d]
    this.bricks.forEach((brick, index) => {
      if (!brick.alive) return
      const x = blockX + brick.col * blockW + 3
      const y = blockY + brick.row * (blockH + 10)
      this.art.fillStyle(0x728981, 0.14)
      this.art.fillRoundedRect(x + 2, y + 3, blockW - 7, blockH, 8)
      this.art.fillStyle(trashColors[index % trashColors.length], 1)
      this.art.fillRoundedRect(x, y, blockW - 7, blockH, 8)
      this.art.lineStyle(1.2, 0xfffbef, 0.8)
      this.art.strokeRoundedRect(x, y, blockW - 7, blockH, 8)
      const iconX = x + (blockW - 7) / 2
      this.art.fillStyle(0xfffbef, 0.74)
      if (index % 3 === 0) {
        this.art.fillRoundedRect(iconX - 5, y + 10, 10, 15, 4)
        this.art.fillRect(iconX - 3, y + 6, 6, 5)
        this.art.fillRoundedRect(iconX - 4, y + 4, 8, 3, 1)
      } else if (index % 3 === 1) {
        this.art.fillRoundedRect(iconX - 7, y + 11, 14, 14, 4)
        this.art.lineStyle(1.6, 0xfffbef, 0.74)
        this.art.lineBetween(iconX - 4, y + 12, iconX - 2, y + 7)
        this.art.lineBetween(iconX + 4, y + 12, iconX + 2, y + 7)
      } else {
        this.art.fillRoundedRect(iconX - 5, y + 7, 10, 18, 3)
        this.art.lineStyle(1.4, 0xfffbef, 0.8)
        this.art.lineBetween(iconX - 4, y + 13, iconX + 4, y + 13)
      }
    })
    const paddleY = p.y + p.h - 48
    this.art.fillStyle(0x668b97, 1)
    this.art.fillRoundedRect(this.paddleX - 51, paddleY, 102, 20, 10)
    this.art.fillStyle(0xf6f3e6, 0.78)
    this.art.fillRoundedRect(this.paddleX - 27, paddleY + 4, 54, 4, 2)
    this.art.fillStyle(0xfdf9eb, 1)
    this.art.fillCircle(this.ball.x, this.ball.y, this.ball.r)
    this.art.lineStyle(2, 0x94c3ca, 0.9)
    this.art.strokeCircle(this.ball.x, this.ball.y, this.ball.r)
    if (!this.launched && !this.rescueOver) {
      this.label("泡泡正在船上等你", p.x + p.w / 2, paddleY - 28, 14, "#58736f", { bold: true })
    }
    if (this.rescueOver) this.label(this.rescueScore === this.bricks.length ? "海龜與魚群向你揮揮鰭！" : "再玩一次，繼續守護海洋", p.x + p.w / 2, p.y + p.h - 24, 14, "#567366", { bold: true })
  }

  paintRescue() {
    if (!this.art) return
    this.dynamicTexts.forEach(item => item.destroy())
    this.dynamicTexts = []
    this.art.clear()
    this.drawRescue()
  }

  // 04：依照棲地分類，不使用翻牌配對
  resetSort() {
    this.sortDeck = Phaser.Utils.Array.Shuffle(habitatQuestions.slice())
    this.sortIndex = 0
    this.sortScore = 0
    this.sortAnswered = false
    this.sortResult = ""
    this.setStatus("答對後會收到一則海洋生物小知識。")
  }

  handleSort(pointer) {
    const p = this.play
    const choices = ["珊瑚礁", "海草床", "開放海域", "深海"]
    const buttonW = Math.min(210, (p.w - 40) / 2)
    const gap = 14
    const totalW = buttonW * 2 + gap
    const startX = p.x + (p.w - totalW) / 2
    const startY = p.y + p.h - 130
    let chosen = null
    choices.forEach((choice, index) => {
      const x = startX + (index % 2) * (buttonW + gap)
      const y = startY + Math.floor(index / 2) * 48
      if (pointer.x >= x && pointer.x <= x + buttonW && pointer.y >= y && pointer.y <= y + 38) chosen = choice
    })
    if (!chosen) return
    const question = this.sortDeck[this.sortIndex]
    if (this.sortAnswered) {
      this.sortIndex += 1
      if (this.sortIndex >= this.sortDeck.length) {
        this.sortDeck = Phaser.Utils.Array.Shuffle(habitatQuestions.slice())
        this.sortIndex = 0
        this.sortScore = 0
      }
      this.sortAnswered = false
      this.sortResult = ""
      this.setStatus("答對 " + this.sortScore + " / " + (this.sortIndex + 1) + "　觀察下一位海洋居民。")
    } else if (chosen === question.habitat) {
      this.sortScore += 1
      this.sortAnswered = true
      this.sortResult = question.fact
      this.setStatus("答對了！" + question.name + "常在" + question.habitat + "活動。")
    } else {
      this.sortResult = "再觀察一次線索：這位居民常在「" + question.habitat + "」活動。"
      this.setStatus("這次不太一樣，再想想牠的棲地。")
    }
    this.renderGame()
  }

  drawSort() {
    const p = this.play
    const q = this.sortDeck[this.sortIndex]
    this.label("第 " + (this.sortIndex + 1) + " / " + this.sortDeck.length + " 位海洋居民", p.x + p.w / 2, p.y + 25, 14, "#688078", { bold: true })
    const cardW = Math.min(270, p.w - 46)
    const cardH = Math.min(190, p.h * 0.36)
    const cardX = p.x + (p.w - cardW) / 2
    const cardY = p.y + 54
    this.fillCell(cardX, cardY, cardW, cardH, 0xf5efdc, 0xe1d5b8, 20)
    this.label(q.emoji, p.x + p.w / 2, cardY + 62, 55, "#314a53", { emoji: true })
    this.label(q.name, p.x + p.w / 2, cardY + 125, 23, "#415d58", { bold: true })
    this.label("牠最常在哪一種海域生活？", p.x + p.w / 2, cardY + cardH - 23, 14, "#75827b")
    const choices = ["珊瑚礁", "海草床", "開放海域", "深海"]
    const buttonW = Math.min(210, (p.w - 40) / 2)
    const gap = 14
    const totalW = buttonW * 2 + gap
    const startX = p.x + (p.w - totalW) / 2
    const startY = p.y + p.h - 130
    choices.forEach((choice, index) => {
      const x = startX + (index % 2) * (buttonW + gap)
      const y = startY + Math.floor(index / 2) * 48
      this.fillCell(x, y, buttonW, 38, 0xe8eee2, 0xc3d1c4, 17)
      this.label(choice, x + buttonW / 2, y + 19, 14, "#536e64", { bold: true })
    })
    if (this.sortResult) {
      this.label(this.sortResult, p.x + p.w / 2, p.y + p.h - 20, 13, this.sortAnswered ? "#557464" : "#966b58", { wrap: p.w - 40 })
      if (this.sortAnswered) this.label("點選任一棲地，看看下一位居民", p.x + p.w / 2, p.y + p.h - 45, 12, "#8a8b79")
    }
  }

  // 05：交換卡片整理海洋食物鏈
  resetFoodChain() {
    this.chainOrder = Phaser.Utils.Array.Shuffle([0, 1, 2, 3, 4])
    if (this.chainOrder.every((value, index) => value === index)) this.chainOrder.reverse()
    this.chainSelected = -1
    this.chainMoves = 0
    this.chainDone = false
    this.chainFact = ""
    this.setStatus("從浮游植物開始，排出能量傳遞的方向。")
  }

  chainCardRect(index) {
    const p = this.play
    const col = index % 3
    const row = Math.floor(index / 3)
    const gap = 12
    const w = Math.min(142, (p.w - 56) / 3)
    const h = 132
    const totalW = w * 3 + gap * 2
    const left = p.x + (p.w - totalW) / 2
    return { x: left + col * (w + gap), y: p.y + 130 + row * (h + 24), w, h }
  }

  handleFoodChain(pointer) {
    if (this.chainDone) return
    let hit = -1
    for (let i = 0; i < 5; i += 1) {
      const r = this.chainCardRect(i)
      if (pointer.x >= r.x && pointer.x <= r.x + r.w && pointer.y >= r.y && pointer.y <= r.y + r.h) hit = i
    }
    if (hit < 0) return
    if (this.chainSelected < 0) {
      this.chainSelected = hit
    } else if (this.chainSelected === hit) {
      this.chainSelected = -1
    } else {
      const temp = this.chainOrder[this.chainSelected]
      this.chainOrder[this.chainSelected] = this.chainOrder[hit]
      this.chainOrder[hit] = temp
      this.chainSelected = -1
      this.chainMoves += 1
      if (this.chainOrder.every((value, index) => value === index)) {
        this.chainDone = true
        this.chainFact = "能量從生產者一路傳遞，海洋生物彼此連結成食物網。"
        this.setStatus("排列正確！" + this.chainFact)
      } else {
        this.setStatus("交換卡片 " + this.chainMoves + " 次　繼續整理能量傳遞順序。")
      }
    }
    this.renderGame()
  }

  drawFoodChain() {
    const p = this.play
    this.label("從左上開始閱讀，依序排出海洋食物鏈", p.x + p.w / 2, p.y + 44, 14, "#647a71", { bold: true })
    this.chainOrder.forEach((itemId, position) => {
      const r = this.chainCardRect(position)
      const item = foodChain[itemId]
      const selected = position === this.chainSelected
      this.fillCell(r.x, r.y, r.w, r.h, selected ? 0xf4e6c8 : 0xf6f0e0, selected ? 0xd3a663 : 0xd8d2bb, 16)
      this.label(item.emoji, r.x + r.w / 2, r.y + 34, 33, "#425b58", { emoji: true })
      this.label(item.name, r.x + r.w / 2, r.y + 73, 16, "#425b58", { bold: true })
      this.label(item.caption, r.x + r.w / 2, r.y + 103, 11, "#75837a")
      this.label(String(position + 1), r.x + 16, r.y + 15, 11, "#8a927c", { bold: true })
      if (position === 0 || position === 1) this.label("→", r.x + r.w + 6, r.y + r.h / 2, 18, "#8aa28d", { bold: true })
      if (position === 2) this.label("↓", r.x + r.w / 2, r.y + r.h + 12, 18, "#8aa28d", { bold: true })
      if (position === 3) this.label("→", r.x + r.w + 6, r.y + r.h / 2, 18, "#8aa28d", { bold: true })
    })
    if (this.chainDone) this.label(this.chainFact, p.x + p.w / 2, p.y + p.h - 25, 13, "#567366", { wrap: p.w - 40 })
  }

  // 06：用數字線索巡查珊瑚礁中的廢網
  resetSurvey() {
    this.surveyWidth = 8
    this.surveyHeight = 8
    this.surveyMode = "reveal"
    this.surveyGameOver = false
    this.surveyWon = false
    this.surveyCells = Array.from({ length: this.surveyHeight }, () => Array.from({ length: this.surveyWidth }, () => ({ mine: false, revealed: false, flag: false, count: 0 })))
    let placed = 0
    while (placed < 10) {
      const row = Phaser.Math.Between(0, this.surveyHeight - 1)
      const col = Phaser.Math.Between(0, this.surveyWidth - 1)
      if (!this.surveyCells[row][col].mine) {
        this.surveyCells[row][col].mine = true
        placed += 1
      }
    }
    this.surveyCells.forEach((row, r) => row.forEach((cell, c) => {
      cell.count = this.surveyNeighbors(r, c).filter(([nr, nc]) => this.surveyCells[nr][nc].mine).length
    }))
    this.surveyModeRect = null
    this.setStatus("數字代表周圍八格裡有幾個廢棄漁網。")
  }

  surveyNeighbors(row, col) {
    const result = []
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (!dr && !dc) continue
        const r = row + dr
        const c = col + dc
        if (r >= 0 && r < this.surveyHeight && c >= 0 && c < this.surveyWidth) result.push([r, c])
      }
    }
    return result
  }

  handleSurvey(pointer) {
    if (this.surveyGameOver || this.surveyWon) return
    const layout = this.surveyLayout
    if (!layout || pointer.x < layout.x || pointer.x >= layout.x + layout.size * 8 || pointer.y < layout.y || pointer.y >= layout.y + layout.size * 8) return
    const col = Math.floor((pointer.x - layout.x) / layout.size)
    const row = Math.floor((pointer.y - layout.y) / layout.size)
    const cell = this.surveyCells[row][col]
    if (pointer.button === 2 || this.surveyMode === "flag") {
      if (!cell.revealed) cell.flag = !cell.flag
      this.renderGame()
      return
    }
    if (cell.flag || cell.revealed) return
    if (cell.mine) {
      const safeCell = this.surveyCells.flat().find(item => !item.mine && !item.revealed)
      if (safeCell) {
        cell.mine = false
        safeCell.mine = true
        this.surveyCells.forEach((line, r) => line.forEach((item, c) => {
          item.count = this.surveyNeighbors(r, c).filter(([nr, nc]) => this.surveyCells[nr][nc].mine).length
        }))
      }
    }
    this.revealSurvey(row, col)
    const revealed = this.surveyCells.flat().filter(item => item.revealed).length
    if (revealed === this.surveyWidth * this.surveyHeight - 10) {
      this.surveyWon = true
      this.setStatus("巡查完成！廢網可能纏住海龜、海鳥與其他海洋生物。")
    } else {
      this.setStatus("已巡查 " + revealed + " 格　插旗 " + this.surveyCells.flat().filter(item => item.flag).length + " 面")
    }
    this.renderGame()
  }

  revealSurvey(row, col) {
    const cell = this.surveyCells[row][col]
    if (cell.revealed || cell.flag) return
    cell.revealed = true
    if (cell.count === 0) {
      this.surveyNeighbors(row, col).forEach(([r, c]) => {
        if (!this.surveyCells[r][c].mine) this.revealSurvey(r, c)
      })
    }
  }

  drawSurvey() {
    const p = this.play
    const size = Math.min((p.w - 30) / 8, (p.h - 110) / 8)
    const boardSize = size * 8
    const x = p.x + (p.w - boardSize) / 2
    const y = p.y + 70
    this.surveyLayout = { x, y, size }
    this.surveyModeRect = { x: p.x + p.w - 143, y: p.y + 17, w: 122, h: 36 }
    this.label("珊瑚礁觀測站　✦　安全區巡查", p.x + p.w / 2, p.y + 27, 14, "#5d776e", { bold: true })
    this.art.fillStyle(0xe9eee1, 1)
    this.art.fillRoundedRect(this.surveyModeRect.x, this.surveyModeRect.y, this.surveyModeRect.w, this.surveyModeRect.h, 17)
    this.art.lineStyle(1, 0xc3d1c1, 0.9)
    this.art.strokeRoundedRect(this.surveyModeRect.x, this.surveyModeRect.y, this.surveyModeRect.w, this.surveyModeRect.h, 17)
    this.label(this.surveyMode === "reveal" ? "模式：巡查" : "模式：插旗", this.surveyModeRect.x + this.surveyModeRect.w / 2, this.surveyModeRect.y + 18, 12, "#516c62", { bold: true })
    const numbers = ["", "#698d82", "#7399b0", "#d49a71", "#ae7e92", "#7f907a", "#a5826b", "#68878c", "#7b7370"]
    this.surveyCells.forEach((row, r) => row.forEach((cell, c) => {
      const rx = x + c * size + 2
      const ry = y + r * size + 2
      const side = size - 4
      if (cell.revealed) {
        this.fillCell(rx, ry, side, side, cell.mine ? 0xe5a08a : 0xf5f1e5, cell.mine ? 0xc57c69 : 0xd7dfd1, 6)
        if (cell.mine && this.surveyGameOver) this.label("網", rx + side / 2, ry + side / 2, 14, "#805c52", { bold: true })
        else if (cell.count > 0) this.label(String(cell.count), rx + side / 2, ry + side / 2, 17, numbers[cell.count], { bold: true })
      } else {
        this.fillCell(rx, ry, side, side, 0xc5d8ce, 0xf8f4e8, 6)
        this.art.fillStyle(0xffffff, 0.27)
        this.art.fillCircle(rx + side * 0.31, ry + side * 0.27, 2.5)
        if (cell.flag) this.label("⚑", rx + side / 2, ry + side / 2, 17, "#c9816c", { emoji: true })
      }
    }))
    if (this.surveyWon) this.label("謝謝你替礁區完成巡查！", p.x + p.w / 2, p.y + p.h - 22, 13, "#557464", { bold: true })
  }

  // 07：收集水母、避開海洋垃圾
  resetTurtleRun() {
    this.started = false
    this.over = false
    this.runScore = 0
    this.runLives = 3
    this.runElapsed = 0
    this.runClockShown = -1
    this.runInvulnerable = 0
    const p = this.play || { x: 0, y: 0, w: 600, h: 500 }
    this.player = { x: p.x + p.w / 2, y: p.y + p.h * 0.65 }
    this.runObjects = []
    const objectTypes = ["jelly", "jelly", "jelly", "trash", "trash", "net", "trash"]
    objectTypes.forEach((type, index) => {
      this.runObjects.push({
        type,
        x: p.x + p.w * (0.13 + (index * 0.137) % 0.74),
        y: p.y + p.h * (0.17 + (index * 0.139) % 0.7),
        vx: Phaser.Math.Between(-32, 32),
        vy: Phaser.Math.Between(25, 68),
        collected: false,
        angle: index
      })
    })
    this.setStatus("找到 6 隻水母就能完成旅程，最多承受 3 次碰撞。")
  }

  handleTurtleRun(pointer) {
    if (this.over) {
      this.resetTurtleRun()
      this.renderGame()
      return
    }
    this.started = true
    this.player.x = clamp(pointer.x, this.play.x + 22, this.play.x + this.play.w - 22)
    this.player.y = clamp(pointer.y, this.play.y + 22, this.play.y + this.play.h - 22)
    this.paintTurtleRun()
    this.setStatus("水母 " + this.runScore + " / 6　愛心 " + this.runLives + "　避開塑膠與漁網。")
  }

  updateTurtleRun(dt) {
    if (!this.started || this.over || !this.play) return
    this.runElapsed += dt
    this.runInvulnerable = Math.max(0, this.runInvulnerable - dt)
    this.player.x = clamp(this.player.x, this.play.x + 22, this.play.x + this.play.w - 22)
    this.player.y = clamp(this.player.y, this.play.y + 22, this.play.y + this.play.h - 22)
    this.runObjects.forEach(object => {
      if (object.collected) return
      object.x += object.vx * dt
      object.y += object.vy * dt
      if (object.x < this.play.x + 18 || object.x > this.play.x + this.play.w - 18) object.vx *= -1
      if (object.y > this.play.y + this.play.h - 16) {
        object.y = this.play.y + 18
        object.x = Phaser.Math.Between(this.play.x + 24, this.play.x + this.play.w - 24)
      }
      if (Phaser.Math.Distance.Between(object.x, object.y, this.player.x, this.player.y) < 28) {
        if (object.type === "jelly") {
          this.runScore += 1
          object.y = this.play.y + 18
          object.x = Phaser.Math.Between(this.play.x + 24, this.play.x + this.play.w - 24)
          this.setStatus("水母 " + this.runScore + " / 6　愛心 " + this.runLives + "　棱皮龜以水母為食。")
          if (this.runScore >= 6) {
            this.over = true
            this.setStatus("旅程完成！有些海龜會吃水母，減少塑膠袋能降低誤食風險。")
          }
        } else if (this.runInvulnerable <= 0) {
          this.runLives -= 1
          this.runInvulnerable = 1.2
          object.y = this.play.y + 18
          object.x = Phaser.Math.Between(this.play.x + 24, this.play.x + this.play.w - 24)
          this.setStatus("碰到海洋垃圾了　水母 " + this.runScore + " / 6　愛心 " + this.runLives)
          if (this.runLives <= 0) {
            this.over = true
            this.setStatus("海龜需要休息，再試一次穿越洋流吧。")
          }
        }
      }
    })
    const shown = Math.floor(this.runElapsed)
    if (shown !== this.runClockShown) this.runClockShown = shown
    this.paintTurtleRun()
  }

  paintTurtleRun() {
    if (!this.art) return
    this.dynamicTexts.forEach(item => item.destroy())
    this.dynamicTexts = []
    this.art.clear()
    this.drawTurtleRun()
  }

  drawTurtleRun() {
    const p = this.play
    this.art.fillStyle(0xddece8, 0.7)
    this.art.fillRoundedRect(p.x + 15, p.y + 16, p.w - 30, p.h - 32, 20)
    for (let i = 0; i < 9; i += 1) {
      const x = p.x + 28 + i * (p.w - 56) / 8
      this.art.lineStyle(1, 0x86b5b1, 0.18)
      this.art.lineBetween(x, p.y + 26, x + 22, p.y + p.h - 25)
    }
    this.runObjects.forEach(object => {
      if (object.type === "jelly") {
        this.art.fillStyle(0xc2a9d0, 0.9)
        this.art.fillEllipse(object.x, object.y - 3, 28, 22)
        this.art.lineStyle(2, 0x9d86b5, 0.8)
        this.art.strokeEllipse(object.x, object.y - 3, 28, 22)
        this.art.lineBetween(object.x - 7, object.y + 7, object.x - 10, object.y + 17)
        this.art.lineBetween(object.x, object.y + 7, object.x, object.y + 19)
        this.art.lineBetween(object.x + 7, object.y + 7, object.x + 10, object.y + 17)
      } else {
        this.art.fillStyle(object.type === "net" ? 0x927f74 : 0xd9a66e, 0.95)
        if (object.type === "net") {
          this.art.lineStyle(2.2, 0x8d786f, 0.92)
          this.art.strokeCircle(object.x, object.y, 17)
          this.art.lineBetween(object.x - 13, object.y - 11, object.x + 13, object.y + 11)
          this.art.lineBetween(object.x + 13, object.y - 11, object.x - 13, object.y + 11)
        } else {
          this.art.fillRoundedRect(object.x - 9, object.y - 14, 18, 28, 5)
          this.art.fillStyle(0xf3e6c6, 0.72)
          this.art.fillRoundedRect(object.x - 5, object.y - 8, 10, 4, 2)
        }
      }
    })
    if (!this.over || this.runScore >= 6) this.drawTurtle(this.art, this.player.x, this.player.y, 31, this.runInvulnerable > 0 ? 0xb8a673 : 0x719b80)
    if (!this.started) this.label("點一下海水，陪小海龜出發", p.x + p.w / 2, p.y + p.h - 32, 16, "#58736f", { bold: true })
    if (this.over) this.label(this.runScore >= 6 ? "海龜安全抵達！" : "點一下再出發", p.x + p.w / 2, p.y + p.h - 28, 16, "#567366", { bold: true })
  }

  // 08：海龜以格線路徑尋找水母
  resetTurtleRoute() {
    this.routeSize = 12
    this.routeSnake = [{ x: 3, y: 6 }, { x: 2, y: 6 }, { x: 1, y: 6 }]
    this.routeDirection = { x: 1, y: 0 }
    this.nextRouteDirection = { x: 1, y: 0 }
    this.routeScore = 0
    this.routeOver = false
    this.routeStarted = false
    this.routeTimer = 0
    this.routeHazards = new Set(["5,2", "8,4", "4,9", "9,8", "6,10", "2,3", "10,5", "7,1"])
    this.routeFood = { x: 9, y: 5 }
    this.setStatus("水母 0　方向鍵或下方按鈕可帶海龜轉彎。")
  }

  setSnakeDirection(dx, dy) {
    if (this.routeDirection.x + dx === 0 && this.routeDirection.y + dy === 0) return
    this.nextRouteDirection = { x: dx, y: dy }
    this.routeStarted = true
  }

  handleTurtleRoutePointer(pointer) {
    if (this.handleDpad(pointer, (dx, dy) => this.setSnakeDirection(dx, dy))) return
    if (this.routeOver) {
      this.resetTurtleRoute()
      this.renderGame()
    }
  }

  updateTurtleRoute(dt) {
    if (this.routeOver || !this.routeStarted) return
    this.routeTimer += dt
    if (this.routeTimer < 0.2) return
    this.routeTimer = 0
    this.routeDirection = this.nextRouteDirection
    const head = this.routeSnake[0]
    const next = { x: head.x + this.routeDirection.x, y: head.y + this.routeDirection.y }
    if (next.x < 0 || next.y < 0 || next.x >= this.routeSize || next.y >= this.routeSize ||
      this.routeHazards.has(next.x + "," + next.y) ||
      this.routeSnake.some(segment => segment.x === next.x && segment.y === next.y)) {
      this.routeOver = true
      this.setStatus("海龜碰到塑膠或游出安全海域，點一下可以再試一次。")
      this.renderGame()
      return
    }
    this.routeSnake.unshift(next)
    if (next.x === this.routeFood.x && next.y === this.routeFood.y) {
      this.routeScore += 1
      this.setStatus("找到 " + this.routeScore + " 隻水母　棱皮龜常以水母為食。")
      const open = []
      for (let y = 0; y < this.routeSize; y += 1) {
        for (let x = 0; x < this.routeSize; x += 1) {
          const blocked = this.routeHazards.has(x + "," + y) || this.routeSnake.some(part => part.x === x && part.y === y)
          if (!blocked) open.push({ x, y })
        }
      }
      this.routeFood = randomItem(open)
      if (this.routeScore >= 8) {
        this.routeOver = true
        this.setStatus("海龜找到 8 隻水母！保持海洋乾淨，牠們才能安心覓食。")
      }
    } else {
      this.routeSnake.pop()
    }
    this.renderGame()
  }

  drawTurtleRoute() {
    const p = this.play
    const cols = this.routeSize
    const size = Math.min((p.w - 38) / cols, (p.h - 126) / cols)
    const boardW = size * cols
    const x = p.x + (p.w - boardW) / 2
    const y = p.y + 26
    this.routeLayout = { x, y, size }
    this.art.fillStyle(0xddece8, 0.72)
    this.art.fillRoundedRect(x - 7, y - 7, boardW + 14, boardW + 14, 16)
    for (let row = 0; row < cols; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const color = (row + col) % 2 ? 0xe8f0e7 : 0xd7e8e4
        this.art.fillStyle(color, 0.86)
        this.art.fillRoundedRect(x + col * size + 1, y + row * size + 1, size - 2, size - 2, 4)
        if (this.routeHazards.has(col + "," + row)) {
          this.art.fillStyle(0xd9a36d, 1)
          this.art.fillRoundedRect(x + col * size + size * 0.3, y + row * size + size * 0.2, size * 0.4, size * 0.58, 5)
          this.art.fillStyle(0xf8edcf, 0.8)
          this.art.fillRect(x + col * size + size * 0.4, y + row * size + size * 0.34, size * 0.2, size * 0.08)
        }
      }
    }
    const food = { x: x + (this.routeFood.x + 0.5) * size, y: y + (this.routeFood.y + 0.5) * size }
    this.art.fillStyle(0xbfa4c7, 1)
    this.art.fillEllipse(food.x, food.y, size * 0.56, size * 0.48)
    this.art.lineStyle(1.5, 0x967fa8, 0.8)
    this.art.strokeEllipse(food.x, food.y, size * 0.56, size * 0.48)
    this.routeSnake.slice(1).forEach((part, index) => {
      this.art.fillStyle(index % 2 ? 0x95ad83 : 0x819c78, 1)
      this.art.fillRoundedRect(x + part.x * size + 4, y + part.y * size + 4, size - 8, size - 8, 10)
    })
    const head = this.routeSnake[0]
    this.drawTurtle(this.art, x + (head.x + 0.5) * size, y + (head.y + 0.5) * size, size * 0.45)
    this.drawDpad(p.y + p.h - 39)
    if (this.routeOver) this.label(this.routeScore >= 8 ? "海龜找到回家的路！" : "點一下再試一次", p.x + p.w / 2, p.y + p.h - 105, 13, "#557464", { bold: true })
  }

  // 09：分層探索海域並找出不同生物
  resetDeepSea() {
    this.deepCols = 10
    this.deepRows = 8
    this.deepPlayer = { x: 1, y: 1 }
    this.deepFound = new Set()
    this.deepSeen = new Set()
    this.deepMoveCount = 0
    this.deepCreatures = [
      { x: 7, y: 1, name: "珊瑚", emoji: "🪸", fact: "珊瑚礁是許多魚類、甲殼類與軟體動物的棲地。", zone: 0 },
      { x: 4, y: 2, name: "海龜", emoji: "🐢", fact: "海龜會在不同海域移動，有些種類會長途洄游。", zone: 0 },
      { x: 8, y: 3, name: "燈籠魚", emoji: "🐟", fact: "許多燈籠魚生活在暮光層，能利用生物光。", zone: 1 },
      { x: 3, y: 4, name: "大王烏賊", emoji: "🦑", fact: "大王烏賊是深海大型無脊椎動物，眼睛非常大。", zone: 1 },
      { x: 6, y: 6, name: "鮟鱇魚", emoji: "🐟", fact: "鮟鱇魚能在黑暗海域使用發光誘餌吸引獵物。", zone: 2 },
      { x: 2, y: 7, name: "水晶水母", emoji: "🪼", fact: "有些深海水母透明發亮，能在黑暗中被看見。", zone: 2 }
    ]
    this.revealDeepArea()
    this.setStatus("圖鑑 0 / 6　探索陽光層、暮光層與午夜層。")
  }

  revealDeepArea() {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const x = this.deepPlayer.x + dx
        const y = this.deepPlayer.y + dy
        if (x >= 0 && x < this.deepCols && y >= 0 && y < this.deepRows) this.deepSeen.add(x + "," + y)
      }
    }
  }

  moveDeepSea(dx, dy) {
    if (this.deepFound.size >= 6) return
    const x = this.deepPlayer.x + dx
    const y = this.deepPlayer.y + dy
    if (x < 0 || x >= this.deepCols || y < 0 || y >= this.deepRows) return
    this.deepPlayer = { x, y }
    this.deepMoveCount += 1
    this.revealDeepArea()
    const creature = this.deepCreatures.find(item => item.x === x && item.y === y)
    if (creature && !this.deepFound.has(creature.name)) {
      this.deepFound.add(creature.name)
      this.setStatus("新發現：" + creature.name + "。 " + creature.fact)
    } else {
      this.setStatus("圖鑑 " + this.deepFound.size + " / 6　已探索 " + this.deepSeen.size + " 格海域。")
    }
    if (this.deepFound.size >= 6) this.setStatus("深海圖鑑完成！不同深度都有獨特的海洋居民。")
    this.renderGame()
  }

  handleDeepSeaPointer(pointer) {
    if (this.handleDpad(pointer, (dx, dy) => this.moveDeepSea(dx, dy))) return
    const layout = this.deepLayout
    if (!layout) return
    const col = Math.floor((pointer.x - layout.x) / layout.size)
    const row = Math.floor((pointer.y - layout.y) / layout.size)
    if (col < 0 || col >= this.deepCols || row < 0 || row >= this.deepRows) return
    const dx = col - this.deepPlayer.x
    const dy = row - this.deepPlayer.y
    if (Math.abs(dx) + Math.abs(dy) === 1) this.moveDeepSea(Math.sign(dx), Math.sign(dy))
  }

  drawDeepSea() {
    const p = this.play
    const size = Math.min((p.w - 24) / this.deepCols, (p.h - 135) / this.deepRows)
    const boardW = size * this.deepCols
    const x = p.x + (p.w - boardW) / 2
    const y = p.y + 63
    this.deepLayout = { x, y, size }
    const zoneColors = [0xb9d8cd, 0x829faf, 0x415a72]
    const zoneNames = ["陽光層", "暮光層", "午夜層"]
    const zoneCenters = [1, 4, 6.5]
    for (let row = 0; row < this.deepRows; row += 1) {
      const zone = Math.floor(row / 3)
      for (let col = 0; col < this.deepCols; col += 1) {
        const key = col + "," + row
        const visible = this.deepSeen.has(key)
        const color = visible ? zoneColors[zone] : 0x344c62
        this.art.fillStyle(color, visible ? 0.76 : 0.92)
        this.art.fillRoundedRect(x + col * size + 1, y + row * size + 1, size - 2, size - 2, 4)
        if (visible) {
          this.art.fillStyle(0xffffff, 0.17)
          this.art.fillCircle(x + col * size + size * 0.3, y + row * size + size * 0.3, 2)
          const creature = this.deepCreatures.find(item => item.x === col && item.y === row)
          if (creature && this.deepFound.has(creature.name)) this.label(creature.emoji, x + (col + 0.5) * size, y + (row + 0.5) * size, 21, "#314a53", { emoji: true })
        } else {
          this.art.fillStyle(0x9bb3bb, 0.38)
          this.art.fillCircle(x + col * size + size * 0.5, y + row * size + size * 0.5, 2)
        }
      }
    }
    zoneNames.forEach((name, index) => {
      const centerY = y + size * zoneCenters[index]
      this.art.fillStyle(0xf6f1e3, 0.9)
      this.art.fillRoundedRect(x + boardW - 60, centerY - 9, 55, 18, 8)
      this.label(name, x + boardW - 32, centerY, 10, "#536b63", { bold: true })
    })
    const playerX = x + (this.deepPlayer.x + 0.5) * size
    const playerY = y + (this.deepPlayer.y + 0.5) * size
    this.art.fillStyle(0xf3d190, 1)
    this.art.fillCircle(playerX, playerY, size * 0.3)
    this.art.fillStyle(0xfffae8, 0.9)
    this.art.fillCircle(playerX - size * 0.08, playerY - size * 0.08, size * 0.08)
    this.label("小潛艇", playerX, playerY + size * 0.47, 10, "#415f62", { bold: true })
    this.label("認識不同深度的海洋居民", p.x + p.w / 2, p.y + 24, 14, "#61786f", { bold: true })
    this.drawDpad(p.y + p.h - 39)
  }

  // 10：重疊苗床復育海草棲地
  resetStack() {
    const p = this.play || { x: 20, y: 144, w: (this.scale.width || 600) - 40, h: (this.scale.height || 760) - 212 }
    const baseW = p.w * 0.6
    const baseY = p.y + p.h - 48
    this.stackLayers = [{ x: p.x + (p.w - baseW) / 2, y: baseY, w: baseW, h: 34, label: "海床" }]
    this.stackLevel = 0
    this.stackCurrent = { x: p.x + p.w * 0.1, y: baseY - 37, w: baseW, h: 30 }
    this.stackDirection = 1
    this.stackStarted = false
    this.stackOver = false
    this.stackSpeed = 135
    this.setStatus("海草床層 0 / 9　點一下開始移動，再點一下放下苗床。")
  }

  handleStack(pointer) {
    if (this.stackOver) {
      this.resetStack()
      this.renderGame()
      return
    }
    if (!this.stackStarted) {
      this.stackStarted = true
      this.setStatus("苗床開始移動，對準下方的海草床再放下。")
    } else {
      this.dropStack()
    }
    this.renderGame()
  }

  dropStack() {
    if (!this.stackStarted || this.stackOver) return
    const previous = this.stackLayers[this.stackLayers.length - 1]
    const left = Math.max(previous.x, this.stackCurrent.x)
    const right = Math.min(previous.x + previous.w, this.stackCurrent.x + this.stackCurrent.w)
    const overlap = right - left
    if (overlap < 22) {
      this.stackOver = true
      this.stackStarted = false
      this.setStatus("苗床沒有接上，再試一次讓海草棲地連起來。")
      this.renderGame()
      return
    }
    this.stackLayers.push({
      x: left,
      y: previous.y - 34,
      w: overlap,
      h: 30,
      label: ["海草", "小魚", "海馬", "螃蟹", "海龜", "貝類", "蝦子", "幼魚", "珊瑚"][this.stackLevel]
    })
    this.stackLevel += 1
    if (this.stackLevel >= 9) {
      this.stackOver = true
      this.stackStarted = false
      this.setStatus("海草床復育完成！海草能固定海床，也為許多生物提供棲地。")
    } else {
      this.stackCurrent = {
        x: this.stackDirection > 0 ? this.play.x + 8 : this.play.x + this.play.w - this.stackLayers[this.stackLayers.length - 1].w - 8,
        y: previous.y - 34,
        w: overlap,
        h: 30
      }
      this.stackDirection *= -1
      this.setStatus("成功接上海草床 " + this.stackLevel + " 層　下一層：" + this.stackLayers[this.stackLayers.length - 1].label)
    }
    this.renderGame()
  }

  updateStack(dt) {
    if (!this.stackStarted || this.stackOver || !this.play) return
    const current = this.stackCurrent
    current.x += this.stackDirection * this.stackSpeed * dt
    if (current.x <= this.play.x + 7) {
      current.x = this.play.x + 7
      this.stackDirection = 1
    }
    if (current.x + current.w >= this.play.x + this.play.w - 7) {
      current.x = this.play.x + this.play.w - current.w - 7
      this.stackDirection = -1
    }
    this.paintStack()
  }

  drawStack(animationOnly = false) {
    const p = this.play
    this.art.fillStyle(0xdcece8, 0.7)
    this.art.fillRoundedRect(p.x + 15, p.y + 16, p.w - 30, p.h - 32, 20)
    for (let i = 0; i < 6; i += 1) {
      this.art.lineStyle(1, 0x8eafaa, 0.24)
      this.art.lineBetween(p.x + 25, p.y + p.h - 35 - i * 9, p.x + p.w - 25, p.y + p.h - 35 - i * 9)
    }
    const layerColors = [0x73a58d, 0x8caf9a, 0x79a9a6, 0x9eb68d, 0x86a8b7, 0xb8ae7f, 0x91ad8c, 0x81a4a5, 0xa9b993]
    this.stackLayers.forEach((layer, index) => {
      const x = layer.x
      const y = layer.y
      this.art.fillStyle(0x597c72, 0.16)
      this.art.fillRoundedRect(x + 3, y + 4, layer.w, layer.h, 8)
      this.art.fillStyle(index === 0 ? 0x9a9d7a : layerColors[(index - 1) % layerColors.length], 1)
      this.art.fillRoundedRect(x, y, layer.w, layer.h, 8)
      this.art.lineStyle(1.5, 0xf7f1e3, 0.84)
      this.art.strokeRoundedRect(x, y, layer.w, layer.h, 8)
      this.art.lineStyle(1.2, 0xf0f3d6, 0.5)
      for (let blade = 0; blade < 4; blade += 1) {
        const bx = x + 12 + blade * Math.max(18, (layer.w - 24) / 4)
        this.art.lineBetween(bx, y + layer.h - 3, bx + 3, y + 7 + (blade % 2) * 5)
      }
    })
    if (!this.stackOver) {
      const layer = this.stackCurrent
      this.art.fillStyle(0x82aa87, 0.93)
      this.art.fillRoundedRect(layer.x, layer.y, layer.w, layer.h, 8)
      this.art.lineStyle(2, 0xfff8e4, 0.9)
      this.art.strokeRoundedRect(layer.x, layer.y, layer.w, layer.h, 8)
      this.art.lineStyle(1.2, 0xf7f1d7, 0.7)
      this.art.lineBetween(layer.x + 12, layer.y + 25, layer.x + 20, layer.y + 5)
      this.art.lineBetween(layer.x + layer.w - 18, layer.y + 26, layer.x + layer.w - 23, layer.y + 6)
    }
    if (!animationOnly) {
      const neighbor = ["🐟", "🦐", "🐠", "🦀", "🐢", "🐚", "🐠", "🐟", "🪸"]
      this.label("棲地裡的鄰居", p.x + p.w / 2, p.y + 34, 14, "#62796f", { bold: true })
      neighbor.slice(0, this.stackLevel).forEach((emoji, index) => {
        this.label(emoji, p.x + 42 + index * Math.min(40, (p.w - 84) / 9), p.y + 71, 22, "#526b65", { emoji: true })
      })
      if (this.stackOver) this.label(this.stackLevel >= 9 ? "海草床迎來好多新鄰居！" : "點一下再試一次", p.x + p.w / 2, p.y + p.h - 20, 14, "#567366", { bold: true })
    }
  }

  paintStack() {
    if (!this.art) return
    this.art.clear()
    this.drawStack(true)
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-stage",
  backgroundColor: "#f7f1e3",
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: 640,
    height: 760,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: true,
    roundPixels: false
  },
  scene: [MarineMechanismScene]
})
