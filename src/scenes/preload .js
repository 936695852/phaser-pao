import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    this.load.image('tiles', 'assets/tiles/dungeon_tiles.png')
    this.load.tilemapTiledJSON('dungeon', 'assets/tiles/dungeon_01.json')

    const percentText = this.add.text(400, 200, '0%', {
      font: '16px monospace',
      color: '#fff',
      align: 'center',
    })

    const assetText = this.add
      .text(400, 350, '', {
        font: '16px monospace',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5, 0.5)

    // bar是進度條
    const progressBar = this.add.graphics()
    // box是進度條的外框
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(300, 300, 200, 30)

    this.load.on('progress', function (value) {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(305, 305, 190 * value, 20)

      percentText.setText(parseInt(value * 100) + '%')
    })

    // 該事件提供第一個參數是當前讀取的素材資訊
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key)
    })

    // 清除畫面
    this.load.on('complete', function () {
      progressBar.destroy()
      progressBox.destroy()
      percentText.destroy()
      assetText.destroy()
    })
  }

  create() {
    this.scene.start('GameScene')
  }
}
