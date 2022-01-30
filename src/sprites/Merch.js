import { GameObjects, Math as pMath } from "phaser";
const { Sprite } = GameObjects;

class Merch extends Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'merch');

    this.scene = scene;
    this.swapKey = null;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setSize(16, 16);
    this.body.setOffset(84, 106);

    this.setInteractive();

    this.willTalk = false;
    this.speed = 105;
    this.moveToX = null;
    this.moveToY = null;

    this.on('pointerdown', () => {
      this.willTalk = true;
    });

    this.on('pointerdownoutside', () => {
      this.willTalk = false;
    });

    this.on('animationupdate', ({ key }, { index }) => {
      if (key === 'merch-walk') {
        if (index === 2 || index === 5 || index === 8) {
          const d2p = pMath.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
          const ri = pMath.Between(1, 6);

          this.scene.sound.play(`sfx-step${ri}`, {
            volume: ((0.25) - (Math.min(d2p / 300, 1) * 0.25))
          });
        }
      }
    });
  }

  update() {
    // Trigger dialog if near Player and player has clicked on me
    if (this.willTalk) {
      const d2p = pMath.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);

      if (d2p < 25) {
        this.scene.ui.triggerDialog("Why waste time wandering with a witch? Bring me 27 gold pieces, and I can show you the answers you seek...\n", [{value: "Okay, here you go"}], [{value: "pay-merch"}], [{value: "I don't have that much"}], [{value: "cancel-merch"}]);
      }
    }

    if (this.moveToX !== null && this.moveToY !== null) {
      const d2m = pMath.Distance.Between(this.x, this.y, this.moveToX, this.moveToY);

      if (d2m < 5) {
        this.body.reset(this.moveToX, this.moveToY);
        this.moveToX = null;
        this.moveToY = null;
        this.currentDialogIndex = this.swapKey;
      }
      else {
        this.scene.physics.moveTo(this, this.moveToX, this.moveToY, this.speed);
      }
    }

    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.play({
        key: 'merch-idle',
        repeat: -1
      }, true);
    }
    else {
      this.play({
        key: 'merch-walk',
        repeat: -1
      }, true);
    }
  }
}

export default Merch;