import Phaser from 'phaser'
import 'normalize.css'
import './style/index.scss'

import GameScene from './scenes/game'
import LoadScene from './scenes/load'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200,
      },
      debug: true,
    },
  },
  scene: [ GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

export default new Phaser.Game(config)
