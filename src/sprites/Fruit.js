import { GameObjects } from "phaser";
const { Sprite } = GameObjects;

class Fruit extends Sprite {
  constructor(scene, x, y, id) {
    super(scene, x, y, 'fruit', id);

    this.scene = scene;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.setOrigin(0.5, 1);

    this.setData('isCollected', false);
    this.setData('fruit_id', id);
  }
}

export default Fruit;