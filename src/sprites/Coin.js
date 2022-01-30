import { GameObjects } from "phaser";
const { Sprite } = GameObjects;

class Coin extends Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'coin');

    this.scene = scene;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.setScale(0.15);
    this.setOrigin(0.5, 1);

    this.play('coin-spin');

    this.setData('isCollected', false);
  }
}

export default Coin;