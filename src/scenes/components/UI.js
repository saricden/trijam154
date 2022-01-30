import { Scene } from "phaser";

class UI extends Scene {
  constructor() {
    super('scene-ui');
  }

  init({ parentScene }) {
    this.parentScene = parentScene;
  }

  create() {
    const {width, height} = this.game.scale;

    this.dialogText = this.add.text(0, 0, '', {
      fontFamily: 'serif',
      fontSize: 22,
      color: '#FFF',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: 20,
      wordWrap: {
        width
      }
    });

    this.dialogText.setAlpha(0);

    this.option1Btn = this.add.text(10, height - 10, 'Option 1', {
      fontFamily: 'monospace',
      fontSize: 24,
      color: '#000',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: {
        x: 25,
        y: 10
      },
      wordWrap: {
        width: width / 2 - 5
      },
      align: 'center'
    });
    this.option1Btn.setOrigin(0, 1);
    this.option1Btn.setAlpha(0);

    this.option2Btn = this.add.text(width - 10, height - 10, 'Option 2', {
      fontFamily: 'monospace',
      fontSize: 24,
      color: '#000',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: {
        x: 25,
        y: 10
      },
      wordWrap: {
        width: width / 2 - 5
      },
      align: 'center'
    });
    this.option2Btn.setOrigin(1, 1);
    this.option2Btn.setAlpha(0);

    this.option1Btn.on('pointerdown', () => {
      this.option1Btn.removeInteractive();
      this.option2Btn.removeInteractive();
      this.option2Key = false;
      this.sound.play('sfx-dialog2');

      if (this.option1Key === 'restart') {
        this.parentScene.npc.willTalk = false;
        this.parentScene.npc.animationOverride = true;
        this.parentScene.npc.play({ key: 'npc-death', frameRate: 6, repeat: 0 });

        this.parentScene.cameras.main.zoomTo(2, 3000, 'Linear', true, (cam, prog) => {
          if (prog === 1) {
            this.parentScene.scene.start('scene-level1');
            this.scene.stop(this);
          }
        });
      }
      else if (this.option1Key === 'pay-merch') {
        this.parentScene.merch.willTalk = false;
        if (this.registry.gold >= 27) {
          this.tweens.add({
            targets: [this.dialogText, this.option2Btn],
            alpha: 0,
            duration: 500,
            onComplete: () => {
              this.tweens.add({
                targets: this.option1Btn,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                  this.parentScene.cameras.main.zoomTo(2, 3000, 'Linear', true, (cam, prog) => {
                    if (prog === 1) {
                      this.parentScene.scene.start(`scene-level5c`);
                      this.scene.stop(this);
                    }
                  });
                }
              });
            }
          });
        }
        else {
          this.parentScene.merch.willTalk = false;
          this.tweens.add({
            targets: [this.dialogText, this.option2Btn],
            alpha: 0,
            duration: 500,
            onComplete: () => {
              this.tweens.add({
                targets: this.option1Btn,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                  this.sound.play('sfx-fart', {
                    volume: 0.9
                  });
                  this.option1Key = false;
                }
              });
            }
          });
        }
      }
      else if (this.option1Key.startsWith('level')) {
        this.parentScene.npc.willTalk = false;
        this.parentScene.npc.animationOverride = true;
        this.parentScene.npc.play({ key: 'npc-attack', repeat: -1 });

        this.parentScene.cameras.main.zoomTo(2, 3000, 'Linear', true, (cam, prog) => {
          if (prog === 1) {
            this.parentScene.scene.start(`scene-${this.option1Key}`);
            this.scene.stop(this);
          }
        });
      }
      else {
        this.tweens.add({
          targets: [this.dialogText, this.option2Btn],
          alpha: 0,
          duration: 500,
          onComplete: () => this.chooseKey(this.option1Key)
        });
      }

    });

    this.option2Btn.on('pointerdown', () => {
      this.option1Btn.removeInteractive();
      this.option2Btn.removeInteractive();
      this.option1Key = false;
      this.sound.play('sfx-dialog2');

      if (this.option2Key === 'cancel-merch') {
        this.parentScene.merch.willTalk = false;
        this.tweens.add({
          targets: [this.dialogText, this.option1Btn],
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.tweens.add({
              targets: this.option2Btn,
              alpha: 0,
              duration: 500,
              onComplete: () => {
                this.sound.play('sfx-fart', {
                  volume: 0.9
                });
                this.option2Key = false;
              }
            });
          }
        });
      }
      else {
        this.parentScene.npc.willTalk = false;
        this.tweens.add({
          targets: [this.dialogText, this.option1Btn],
          alpha: 0,
          duration: 500,
          onComplete: () => this.chooseKey(this.option2Key)
        });
      }
    });

    this.option1Key = false;
    this.option2Key = false;

    // Resize / reposition UI elements for screen
    this.scale.on('resize', this.resize, this);
    this.resize({width: window.innerWidth, height: window.innerHeight});
  }

  resize({width, height}) {
    this.cameras.resize(width, height);

    this.dialogText.setWordWrapWidth(width);
    this.option1Btn.setPosition(10, height - 10);
    this.option2Btn.setPosition(width - 10, height - 10);
  }

  triggerDialog(text, option1Text = null, option1Key = null, option2Text = null, option2Key = null) {
    this.dialogText.setText(text);

    if (this.option1Key === false) {
      this.option1Key = false;
      this.option2Key = false;

      this.sound.play('sfx-dialog1');

      if (typeof option1Text !== 'undefined' && option1Text.length && typeof option1Key !== 'undefined') {
        this.option1Btn.setText(option1Text[0].value);
        this.option1Btn.setInteractive();
        this.option1Key = option1Key[0].value;
      }

      if (typeof option2Text !== 'undefined' && option2Text.length && typeof option2Key !== 'undefined') {
        this.option2Btn.setText(option2Text[0].value);
        this.option2Btn.setInteractive();
        this.option2Key = option2Key[0].value;
      }

      this.tweens.add({
        targets: this.dialogText,
        alpha: 1,
        duration: 500,
        onComplete: () => {
          if (this.option1Key) {
            this.tweens.add({
              targets: this.option1Btn,
              alpha: 1,
              duration: 500
            });
          }

          if (this.option2Key) {
            this.tweens.add({
              targets: this.option2Btn,
              alpha: 1,
              duration: 500
            });
          }
        }
      });
    }
  }

  chooseKey(optionKey) {
    this.parentScene.npc.setVectorKey(optionKey);
    this.option1Key = false;
    this.option2Key = false;
    this.tweens.add({
      targets: [this.option1Btn, this.option2Btn],
      alpha: 0,
      duration: 500
    });
  }
}

export default UI;