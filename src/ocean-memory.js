import Phaser from "phaser"

const species = [
  {
    id: "green-turtle",
    name: "綠蠵龜",
    emoji: "🐢",
    fact: "綠蠵龜成體主要吃海草與藻類，常在淺海草床覓食。",
    color: 0xa6ba8d
  },
  {
    id: "bottlenose-dolphin",
    name: "瓶鼻海豚",
    emoji: "🐬",
    fact: "海豚會用回聲定位，辨認周圍環境並尋找獵物。",
    color: 0x86b7c2
  },
  {
    id: "clownfish",
    name: "小丑魚",
    emoji: "🐠",
    fact: "小丑魚能躲進海葵觸手間，和海葵形成互利關係。",
    color: 0xe6a06d
  },
  {
    id: "octopus",
    name: "章魚",
    emoji: "🐙",
    fact: "章魚有八條腕足，腕足上的吸盤能協助牠探索和抓取。",
    color: 0xb38caa
  },
  {
    id: "sea-star",
    name: "海星",
    emoji: "⭐",
    fact: "海星是棘皮動物，不是魚，生活在海床附近。",
    color: 0xd7a95d
  },
  {
    id: "jellyfish",
    name: "水母",
    emoji: "🪼",
    fact: "水母身體柔軟，常隨海流漂動，觸手可以捕捉小型生物。",
    color: 0xa9a8c9
  }
]

const fontFamily = '"Kaiti TC", "BiauKai", "DFKai-SB", "Noto Serif TC", serif'
const emojiFont = '"Segoe UI Emoji", "Apple Color Emoji", sans-serif'
const clamp = (value, low, high) => Math.min(high, Math.max(low, value))

class OceanMemoryScene extends Phaser.Scene {
  constructor() {
    super("ocean-memory")
  }

  create() {
    this.matched = new Set()
    this.flipped = []
    this.moves = 0
    this.locked = false
    this.message = "翻開兩張牌，讓生物插圖和名字相遇。"
    this.makeDeck()
    this.drawBoard()
    this.scale.on(Phaser.Scale.Events.RESIZE, () => this.drawBoard())
  }

  makeDeck() {
    this.cards = Phaser.Utils.Array.Shuffle(species.flatMap(animal => [
      { ...animal, kind: "picture", open: false },
      { ...animal, kind: "name", open: false }
    ]))
  }

  restart() {
    this.tweens.killAll()
    this.time.removeAllEvents()
    this.children.removeAll(true)
    this.matched = new Set()
    this.flipped = []
    this.moves = 0
    this.locked = false
    this.message = "翻開兩張牌，讓生物插圖和名字相遇。"
    this.makeDeck()
    this.drawBoard()
    this.announce("新的一輪開始了。翻開兩張牌，試著配對生物和名字。")
  }

  drawBoard() {
    this.children.removeAll(true)

    const width = this.scale.width
    const height = this.scale.height
    const margin = clamp(width * 0.045, 16, 34)
    const columns = width > 820 ? 4 : 3
    const rows = Math.ceil(this.cards.length / columns)
    const gap = clamp(width * 0.018, 8, 17)
    const top = clamp(height * 0.17, 92, 122)
    const footer = clamp(height * 0.13, 58, 82)
    const availableWidth = width - margin * 2 - gap * (columns - 1)
    const cardWidth = Math.min(availableWidth / columns, width > 820 ? 330 : 220)
    const gridWidth = cardWidth * columns + gap * (columns - 1)
    const left = (width - gridWidth) / 2
    const availableHeight = Math.max(180, height - top - footer - gap * (rows - 1) - 18)
    const cardHeight = Math.min(availableHeight / rows, width > 820 ? 220 : 155)
    const gridHeight = cardHeight * rows + gap * (rows - 1)
    const gridTop = top + Math.max(0, (availableHeight - gridHeight) / 2)
    const scale = clamp(Math.min(width / 620, height / 560), 0.72, 1.18)

    const background = this.add.graphics()
    background.fillStyle(0xdcece8, 1)
    background.fillRect(0, 0, width, height)
    background.fillStyle(0xeaf3ec, 0.74)
    background.fillEllipse(width * 0.17, height * 0.36, width * 0.5, height * 0.72)
    background.fillStyle(0xc7deda, 0.25)
    background.fillEllipse(width * 0.88, height * 0.79, width * 0.42, height * 0.58)
    background.lineStyle(2, 0x9cbab0, 0.22)
    for (let index = 0; index < 4; index += 1) {
      const y = height - 18 - index * 10
      background.lineBetween(margin, y, width * 0.34, y - 4)
      background.lineBetween(width * 0.63, y - 2, width - margin, y + 2)
    }

    this.add.text(margin, 18, "海洋生物小圖鑑", {
      color: "#304f43",
      fontFamily,
      fontSize: `${Math.round(25 * scale)}px`,
      fontStyle: "bold"
    })

    this.add.text(margin + 2, 56, "把生物插圖和名字配在一起", {
      color: "#657d72",
      fontFamily,
      fontSize: `${Math.round(14 * scale)}px`
    })

    const progress = this.add.text(margin + 2, 78, `圖鑑 ${this.matched.size} / ${species.length} 種　翻牌 ${this.moves} 回`, {
      color: "#557760",
      fontFamily,
      fontSize: `${Math.round(14 * scale)}px`,
      fontStyle: "bold"
    })
    progress.setName("progress")

    const buttonWidth = clamp(width * 0.2, 104, 142)
    const buttonHeight = 38 * scale
    const restart = this.add.container(width - margin - buttonWidth / 2, 35)
    const restartBg = this.add.graphics()
    restartBg.fillStyle(0xf8f2df, 1)
    restartBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 18)
    restartBg.lineStyle(1.5, 0xc5b990, 0.8)
    restartBg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 18)
    const restartLabel = this.add.text(0, 0, "再玩一次　↻", {
      color: "#596b58",
      fontFamily,
      fontSize: `${Math.round(14 * scale)}px`,
      fontStyle: "bold"
    }).setOrigin(0.5)
    restart.add([restartBg, restartLabel])
    restart.setSize(buttonWidth, buttonHeight)
    restart.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
    restart.on("pointerdown", () => this.restart())
    restart.on("pointerover", () => restart.setScale(1.04))
    restart.on("pointerout", () => restart.setScale(1))

    this.cards.forEach((card, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      const x = left + column * (cardWidth + gap) + cardWidth / 2
      const y = gridTop + row * (cardHeight + gap) + cardHeight / 2
      this.drawCard(card, x, y, cardWidth, cardHeight, scale)
    })

    const noteTop = height - footer + 5
    const noteHeight = Math.max(42, footer - 15)
    const note = this.add.graphics()
    note.fillStyle(0xf9f5e8, 0.95)
    note.fillRoundedRect(margin, noteTop, width - margin * 2, noteHeight, 16)
    note.lineStyle(1.2, 0xc9d7c7, 0.85)
    note.strokeRoundedRect(margin, noteTop, width - margin * 2, noteHeight, 16)
    this.add.text(width / 2, noteTop + noteHeight / 2, this.message, {
      color: "#526b5f",
      fontFamily,
      fontSize: `${Math.round(clamp(width * 0.026, 13, 17) * scale)}px`,
      align: "center",
      wordWrap: { width: width - margin * 2 - 24 },
      lineSpacing: 2
    }).setOrigin(0.5)
  }

  drawCard(card, x, y, width, height, scale) {
    const container = this.add.container(x, y)
    const shadow = this.add.graphics()
    shadow.fillStyle(0x567d73, 0.16)
    shadow.fillRoundedRect(-width / 2 + 2, -height / 2 + 5, width, height, 14)

    const backFace = this.add.graphics()
    backFace.fillStyle(0xf3ecd9, 1)
    backFace.fillRoundedRect(-width / 2, -height / 2, width, height, 14)
    backFace.lineStyle(2, 0x91aaa0, 0.95)
    backFace.strokeRoundedRect(-width / 2, -height / 2, width, height, 14)
    backFace.lineStyle(1, 0xc2cbb1, 0.9)
    backFace.lineBetween(-width * 0.28, -height * 0.18, width * 0.26, -height * 0.18)
    backFace.lineBetween(-width * 0.2, height * 0.19, width * 0.2, height * 0.19)

    const backMark = this.add.text(0, -height * 0.01, "✦", {
      color: "#86a59a",
      fontFamily: emojiFont,
      fontSize: `${Math.round(Math.min(width, height) * 0.38)}px`
    }).setOrigin(0.5)
    const backLabel = this.add.text(0, height * 0.31, "翻開看看", {
      color: "#7b8d7d",
      fontFamily,
      fontSize: `${Math.round(clamp(width * 0.085, 12, 16) * scale)}px`
    }).setOrigin(0.5)

    const frontFace = this.add.graphics()
    const frontFill = card.kind === "picture" ? 0xfffbef : 0xf1f4e9
    frontFace.fillStyle(frontFill, 1)
    frontFace.fillRoundedRect(-width / 2, -height / 2, width, height, 14)
    frontFace.lineStyle(2.5, card.color, 0.88)
    frontFace.strokeRoundedRect(-width / 2 + 1, -height / 2 + 1, width - 2, height - 2, 14)
    frontFace.lineStyle(1, 0xffffff, 0.8)
    frontFace.strokeRoundedRect(-width / 2 + 6, -height / 2 + 6, width - 12, height - 12, 10)

    const faceTitle = card.kind === "picture" ? "猜猜牠是誰" : card.name
    const faceIcon = card.kind === "picture" ? card.emoji : "✿"
    const icon = this.add.text(0, card.kind === "picture" ? -height * 0.14 : -height * 0.11, faceIcon, {
      color: "#3f6256",
      fontFamily: card.kind === "picture" ? emojiFont : fontFamily,
      fontSize: `${Math.round(card.kind === "picture" ? Math.min(width, height) * 0.38 : Math.min(width * 0.21, height * 0.3))}px`
    }).setOrigin(0.5)
    const title = this.add.text(0, card.kind === "picture" ? height * 0.28 : height * 0.31, faceTitle, {
      color: "#3c594d",
      fontFamily,
      fontSize: `${Math.round(clamp(width * (card.kind === "picture" ? 0.09 : 0.13), 14, 23) * scale)}px`,
      fontStyle: "bold",
      align: "center",
      wordWrap: { width: width - 18 }
    }).setOrigin(0.5)
    const hint = this.add.text(0, card.kind === "picture" ? height * 0.41 : height * 0.43, card.kind === "picture" ? "生物插圖" : "生物名字", {
      color: "#8a9b89",
      fontFamily,
      fontSize: `${Math.round(clamp(width * 0.07, 10, 13) * scale)}px`
    }).setOrigin(0.5)
    const matchedMark = this.add.text(width * 0.35, -height * 0.34, "✿", {
      color: "#6b916e",
      fontFamily: emojiFont,
      fontSize: `${Math.round(clamp(width * 0.12, 15, 22) * scale)}px`
    }).setOrigin(0.5)

    container.add([shadow, backFace, backMark, backLabel, frontFace, icon, title, hint, matchedMark])
    container.setSize(width, height)
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains)
    container.on("pointerdown", () => this.choose(card))
    container.on("pointerover", () => {
      if (!card.open && !this.matched.has(card.id) && !this.locked) container.setScale(1.025)
    })
    container.on("pointerout", () => container.setScale(1))

    card.view = { container, backFace, backMark, backLabel, frontFace, icon, title, hint, matchedMark }
    this.updateCard(card)
  }

  updateCard(card) {
    if (!card.view) return
    const visible = card.open || this.matched.has(card.id)
    card.view.backFace.setVisible(!visible)
    card.view.backMark.setVisible(!visible)
    card.view.backLabel.setVisible(!visible)
    card.view.frontFace.setVisible(visible)
    card.view.icon.setVisible(visible)
    card.view.title.setVisible(visible)
    card.view.hint.setVisible(visible)
    card.view.matchedMark.setVisible(this.matched.has(card.id))
    if (this.matched.has(card.id)) {
      card.view.container.setAlpha(0.94)
      card.view.container.disableInteractive()
    }
  }

  choose(card) {
    if (this.locked || card.open || this.matched.has(card.id)) return

    card.open = true
    this.updateCard(card)
    this.tweens.add({
      targets: card.view.container,
      scaleX: { from: 0.94, to: 1 },
      scaleY: { from: 0.94, to: 1 },
      duration: 150,
      ease: "Back.Out"
    })
    this.flipped.push(card)

    if (this.flipped.length === 1) {
      this.message = "再翻一張，看看是不是同一種生物。"
      this.announce("已翻開一張牌，再找一張配對。")
      this.updateStatus()
      return
    }

    this.moves += 1
    const [first, second] = this.flipped
    const isMatch = first.id === second.id && first.kind !== second.kind

    if (isMatch) {
      this.matched.add(first.id)
      this.flipped = []
      this.message = `${first.name}：${first.fact}`
      this.updateCard(first)
      this.updateCard(second)
      this.tweens.add({
        targets: [first.view.container, second.view.container],
        y: "-=5",
        duration: 170,
        yoyo: true,
        ease: "Sine.easeOut"
      })

      if (this.matched.size === species.length) {
        this.message = "太棒了，六種海洋生物都收進圖鑑了。按再玩一次重新洗牌。"
        this.announce("圖鑑完成。你已認識六種海洋生物，按再玩一次可以重新洗牌。")
      } else {
        this.announce(`${first.name}配對成功。${first.fact}`)
      }
    } else {
      this.locked = true
      this.message = "這兩張不一樣，記住牠們的位置再試一次。"
      this.announce("這次沒有配對成功，記住兩張牌的位置再試一次。")
      this.time.delayedCall(900, () => {
        for (const openCard of this.flipped) {
          openCard.open = false
          this.updateCard(openCard)
        }
        this.flipped = []
        this.locked = false
        this.message = "翻開兩張牌，讓生物插圖和名字相遇。"
        this.updateStatus()
      })
    }

    this.updateStatus()
  }

  updateStatus() {
    const progress = this.children.getByName("progress")
    if (progress) progress.setText(`圖鑑 ${this.matched.size} / ${species.length} 種　翻牌 ${this.moves} 回`)
    const note = this.children.list.find(item => item.type === "Text" && item.text === this.message)
    if (note) note.setText(this.message)
    else this.drawBoard()
  }

  announce(message) {
    const liveRegion = document.getElementById("ocean-memory-announcement")
    if (liveRegion) liveRegion.textContent = message
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "ocean-memory-stage",
  backgroundColor: "#dcece8",
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: 760,
    height: 660,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: true,
    roundPixels: false
  },
  scene: [OceanMemoryScene]
})
