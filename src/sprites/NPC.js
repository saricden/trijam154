import { GameObjects, Math as pMath } from "phaser";
const { Sprite } = GameObjects;

class NPC extends Sprite {
  constructor(scene, dialogVectorTree) {
    // Get first vector
    const {x, y} = dialogVectorTree[Object.keys(dialogVectorTree)[0]];

    // Init at first vector
    super(scene, x, y, 'npc');

    this.scene = scene;
    this.dialogVectorTree = dialogVectorTree;
    this.currentDialogIndex = Object.keys(dialogVectorTree)[0];
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
    this.animationOverride = false;

    this.on('pointerdown', () => {
      this.willTalk = true;
    });

    this.on('pointerdownoutside', () => {
      this.willTalk = false;
    });

    this.on('animationupdate', ({ key }, { index }) => {
      if (key === 'npc-run') {
        if (index === 2 || index === 5 || index === 8) {
          const d2p = pMath.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
          const ri = pMath.Between(1, 6);

          this.scene.sound.play(`sfx-step${ri}`, {
            volume: ((0.25) - (Math.min(d2p / 300, 1) * 0.25))
          });
        }
      }
      else if (key === 'npc-attack') {
        if (index === 4) {
          const ri = pMath.Between(1, 5);
          this.scene.sound.play(`sfx-spell${ri}`, {
            volume: 0.35
          });
        }
      }
    });
  }

  setVectorKey(key) {
    this.swapKey = key;
    const {x, y} = this.dialogVectorTree[key];

    this.moveToX = x;
    this.moveToY = y;
  }

  update() {
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

    // Trigger dialog if near Player and player has clicked on me (and I'm not moving)
    if (this.willTalk && this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      const d2p = pMath.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);

      if (d2p < 25) {
        this.scene.ui.triggerDialog(this.dialogVectorTree[this.currentDialogIndex].dialog, this.dialogVectorTree[this.currentDialogIndex].option1, this.dialogVectorTree[this.currentDialogIndex].link1, this.dialogVectorTree[this.currentDialogIndex].option2, this.dialogVectorTree[this.currentDialogIndex].link2);
      }
    }

    if (!this.animationOverride) {
      if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.play({
          key: 'npc-idle',
          repeat: -1
        }, true);
      }
      else {
        this.play({
          key: 'npc-run',
          repeat: -1
        }, true);
      }
    }
  }
}

export default NPC;