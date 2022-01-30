import { GameObjects, Math as pMath } from "phaser";
const { Sprite } = GameObjects;

class Player extends Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    
    this.scene = scene;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setSize(16, 16);
    this.body.setOffset(90, 120);

    this.speed = 100;
    this.targetX = null;
    this.targetY = null;
    this.animationOverride = false;
    this.target = this.scene.add.sprite(0, 0, 'flames');
    this.target.setAlpha(0);
    this.target.play('flames-burn');

    this.scene.input.on('pointerdown', ({y, worldX, worldY}) => {
      this.targetX = worldX;
      this.targetY = worldY;
      this.target.setAlpha(1);
      this.target.setPosition(worldX, worldY);
      this.scene.sound.play('sfx-flames', {
        volume: 0.25
      });
    });

    this.on('animationupdate', ({ key }, { index }) => {
      if (key === 'run') {
        if (index === 2 || index === 5 || index === 8) {
          const ri = pMath.Between(1, 6);
          this.scene.sound.play(`sfx-step${ri}`, {
            volume: 0.25
          });
        }
      }
    });

    this.syncYoyoAnim = this.syncYoyoAnim.bind(this);
  }

  syncYoyoAnim(animKey) {
    this.animationOverride = true;
    this.target.setAlpha(0);

    return new Promise((resolve) => {
      this.scene.sound.play('sfx-plugin');
      this.play({
        key: animKey,
        yoyo: true,
        repeat: 0
      });

      this.once('animationcomplete', () => {
        this.scene.sound.play('sfx-plugout');
        this.animationOverride = false;
        resolve();
      });
      
    });
  }

  update() {
    if (this.animationOverride) {
      this.body.reset(this.x, this.y);
    }
    else {
      if (this.targetX !== null && this.targetY !== null) {
        const d2t = pMath.Distance.Between(this.x, this.y, this.targetX, this.targetY);

        this.target.setAlpha(1 - 15 / d2t);

        if (d2t < 5) {
          this.body.reset(this.targetX, this.targetY);
          this.targetX = null;
          this.targetY = null;
        }
        else {
          this.scene.physics.moveTo(this, this.targetX, this.targetY, this.speed);
        }
      }

      if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.play({
          key: 'idle',
          repeat: -1
        }, true);
      }
      else {
        this.play({
          key: 'run',
          repeat: -1
        }, true);
      }
    }
  }
}

export default Player;