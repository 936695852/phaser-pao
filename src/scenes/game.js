import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
    this.platforms = null
    this.cursors = null
    this.player = null
    this.stars = null
    this.bombs = null
    this.score = 0
    this.scoreText = null
    this.gameOver = false
  }

  preload() {
    this.load.image('sky', 'assets/images/sky.png')
    this.load.image('ground', 'assets/images/platform.png')
    this.load.image('star', 'assets/images/star.png')
    this.load.spritesheet('dude', 'assets/images/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
  }

  create() {
    this.add.image(400, 300, 'sky')
    this.add.image(400, 300, 'star')
    this.platforms = this.physics.add.staticGroup()
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()
    this.platforms.create(600, 400, 'ground')
    this.platforms.create(50, 250, 'ground')
    this.platforms.create(750, 220, 'ground')
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'turn',
      frames: [
        {
          key: 'dude',
          frame: 4,
        },
      ],
      frameRate: 20,
    })
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.cursors = this.input.keyboard.createCursorKeys()
    this.player = this.physics.add.sprite(100, 450, 'dude').setBounce(0.2).setCollideWorldBounds(true)
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        stepX: 70,
      },
    })
    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.stars, this.platforms)
    this.physics.add.overlap(this.player, this.stars, collectStar, null, this)
    
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      color: '#fff',
      resolution: 2,
      fontFamily: 'Tahoma',
    })
    function collectStar(player, star) {
      const _this = this

      star.disableBody(true, true)
      this.score += 10
      this.scoreText.setText('Score: '.concat(this.score))

      if (this.stars.countActive(true) === 0) {
        // 星星收集完了
        this.stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true)
          const x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

          const bomb = _this.bombs.create(x, 16, 'bomb')

          bomb.setBounce(1)
          bomb.setCollideWorldBounds(true)
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
        })
      }
    }

    this.bombs = this.physics.add.group()
    this.physics.add.collider(this.bombs, this.platforms)
    this.physics.add.collider(this.player, this.bombs, hitBomb, null, this)

    function hitBomb(player, bomb) {
      this.physics.pause() // 將重力系統暫停

      player.setTint(0xff0000)
      player.anims.play('turn')
      this.gameOver = true
    }
  }

  update() {
    if (this.gameOver) return

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)
      this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)
      this.player.anims.play('right', true)
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(360)
      this.player.anims.play('turn')
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play('turn')
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330)
    }
  }
}

