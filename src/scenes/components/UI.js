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

    this.topBarGfx = this.add.graphics();
    this.topBarGfx.fillStyle(0xFFFFFF, 0.5);
    this.topBarGfx.fillRect(0, 0, width, 48);
    this.fruits = this.add.group();
    
    this.registry.fruitsCollected.forEach((hasFruit, i) => {
      const fruit = this.add.sprite(i * width / 16 + 16, 24, 'fruit', i);
      
      if (!hasFruit) {
        fruit.setAlpha(0.35);
      }
      else {
        fruit.setAlpha(1);
        fruit.setScale(2);
      }

      fruit.setData('fruitIndex', i);

      this.fruits.add(fruit);
    });

    this.muteButton = this.add.sprite(width - 24, 72, 'ui-audio-on');

    if (this.sound.volume === 0) {
      this.muteButton.setTexture('ui-audio-off');
    }

    this.muteButton.setInteractive();

    this.muteButton.on('pointerdown', () => {
      if (this.sound.volume === 0) {
        this.sound.setVolume(1);
        this.muteButton.setTexture('ui-audio-on');
      }
      else {
        this.sound.setVolume(0);
        this.muteButton.setTexture('ui-audio-off');
      }
    });

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
    this.dialogText.setOrigin(0, 1);
    this.dialogText.setAlpha(0);

    this.paddingGfx = this.add.graphics();

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

        this.parentScene.cameras.main.zoomTo(1.5, 4000, 'Linear', true, (cam, prog) => {
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
            targets: [this.dialogText, this.paddingGfx, this.option2Btn],
            alpha: 0,
            duration: 500,
            onComplete: () => {
              this.tweens.add({
                targets: this.option1Btn,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                  this.parentScene.cameras.main.zoomTo(1.5, 4000, 'Linear', true, (cam, prog) => {
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
            targets: [this.dialogText, this.paddingGfx, this.option2Btn],
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

        this.parentScene.cameras.main.zoomTo(1.5, 4000, 'Linear', true, (cam, prog) => {
          if (prog === 1) {
            this.parentScene.scene.start(`scene-${this.option1Key}`);
            this.scene.stop(this);
          }
        });
      }
      else {
        this.tweens.add({
          targets: [this.dialogText, this.paddingGfx, this.option2Btn],
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
          targets: [this.dialogText, this.paddingGfx, this.option1Btn],
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
          targets: [this.dialogText, this.paddingGfx, this.option1Btn],
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

    this.dialogText.setWordWrapWidth(width - 40); // padding on both sides
    this.dialogText.setFixedSize(width, 0);
    this.option1Btn.setWordWrapWidth(width / 2 - 55); // padding on both sides + 5*2 for 10px gap
    this.option1Btn.setFixedSize(width / 2 - 15, 0);
    this.option2Btn.setWordWrapWidth(width / 2 - 55);
    this.option2Btn.setFixedSize(width / 2 - 15, 0);
    this.option1Btn.setPosition(10, height - 10);
    this.option2Btn.setPosition(width - 10, height - 10);

    this.topBarGfx.clear();
    this.topBarGfx.fillStyle(0xFFFFFF, 0.5);
    this.topBarGfx.fillRect(0, 0, width, 48);
    
    // const fruit = this.add.sprite(i * width / 16 + 16, 24, 'fruit', i);

    this.registry.fruitsCollected.forEach((hasFruit, i) => {
      const fruit = this.fruits.getChildren()[i];
      
      if (fruit) {
        fruit.setPosition(i * width / 16 + 16, 24);
        
        if (!hasFruit) {
          fruit.setAlpha(0.35);
        }
        else {
          fruit.setAlpha(1);
          fruit.setScale(2);
        }
      }
    });
  }

  triggerDialog(text, option1Text = null, option1Key = null, option2Text = null, option2Key = null) {
    const {width, height} = this.game.scale;
    
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

      const largerButtonHeight = (typeof option2Text === 'undefined' || !option2Text.length || this.option1Btn.displayHeight > this.option2Btn.displayHeight ? this.option1Btn.displayHeight : this.option2Btn.displayHeight);

      this.dialogText.setPosition(0, height - largerButtonHeight - 10);

      this.paddingGfx.clear();
      this.paddingGfx.fillStyle(0x000000, 0.9);
      this.paddingGfx.fillRect(0, height - largerButtonHeight - 10, width, largerButtonHeight + 20);
      this.paddingGfx.setAlpha(0);

      this.tweens.add({
        targets: [this.dialogText, this.paddingGfx],
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

  addFruit(fruitIndex) {
    const uiFruit = this.fruits.getChildren()[parseInt(fruitIndex, 10)];
    this.registry.fruitsCollected[fruitIndex] = true;

    uiFruit.setScale(8);
    uiFruit.setAlpha(1);

    this.tweens.add({
      targets: uiFruit,
      scale: 2,
      duration: 1000
    });
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