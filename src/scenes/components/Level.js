import { Scene } from "phaser";
import Player from "../../sprites/Player";
import NPC from "../../sprites/NPC";
import Merch from "../../sprites/Merch";

class Level extends Scene {
  constructor(mapKey, { tilemapKey, bgmKey = null, tilesetName = 'gentle forest, rabite palette', tilesetKey = 'tileset-rabite' }) {
    super(mapKey);

    this.tilemapKey = tilemapKey;
    this.bgmKey = bgmKey;
    this.tilesetName = tilesetName;
    this.tilesetKey = tilesetKey;
  }

  create() {
    // BGM
    if (this.bgmKey !== null) {
      this.bgm = this.sound.add(this.bgmKey);
      this.bgm.play({
        volume: 0.7
      });
    }
    
    this.map = this.add.tilemap(this.tilemapKey);
    const tiles = this.map.addTilesetImage(this.tilesetName, this.tilesetKey, 16, 16, 1, 2);

    this.mapGround = this.map.createLayer('ground', tiles);
    this.mapFG = this.map.createLayer('foreground', tiles);
    this.mapBG = this.map.createLayer('background', tiles);

    this.mapGround.setCollisionByProperty({ collides: true });
    this.mapFG.setCollisionByProperty({ collides: true });
    this.mapBG.setCollisionByProperty({ collides: true });

    this.player = null;
    this.dialogVectorTree = {};

    this.physics.moveTo

    this.map.getObjectLayer('points').objects.forEach((object, i) => {
      if (object.name === 'player') {
        const {x, y} = object;

        this.player = new Player(this, x, y);
      }
      else if (object.name === 'merch') {
        const {x, y} = object;

        this.merch = new Merch(this, x, y);
      }
      else if (object.name === 'npc-vector') {
        this.dialogVectorTree[object.id] = {
          x: object.x,
          y: object.y,
          dialog: object.properties.filter((prop) => {
            return prop.name === 'dialog'
          })[0].value,
          option1: object.properties.filter((prop) => {
            return prop.name === 'option1'
          }),
          option2: object.properties.filter((prop) => {
            return prop.name === 'option2'
          }),
          link1: object.properties.filter((prop) => {
            return prop.name === 'link1'
          }),
          link2: object.properties.filter((prop) => {
            return prop.name === 'link2'
          })
        };
      }
      else if (object.name === 'title') {
        const {x, y, text} = object;
        
        this.title = this.add.text(x + 100, y, text.text, {
          fontFamily: 'monospace',
          fontSize: 24,
          color: 'rgba(0, 0, 0, 0.6)',
          align: 'left'
        });

        this.title.setOrigin(1, 0);

        this.subtitle = this.add.text(x - 2, y + this.title.displayHeight + 10, 'A game of exploration\nby Kirk M. (@saricden)', {
          fontFamily: 'sans-serif',
          fontStyle: 'bold',
          fontSize: 16,
          color: 'rgba(0, 0, 0, 0.6)',
          align: 'left'
        });
      }
      else if (object.name === 'guide') {
        const {x, y, text} = object;

        this.tutorialText = this.add.text(x, y, text.text, {
          fontFamily: 'sans-serif',
          fontSize: 18,
          color: 'rgba(0, 0, 0, 0.45)',
          align: 'center'
        });
      }
    });
    
    this.npc = new NPC(this, this.dialogVectorTree);

    // Collisions
    this.physics.add.collider(this.player, this.mapFG);
    this.physics.add.collider(this.player, this.mapBG);
    this.physics.add.collider(this.player, this.mapGround);

    // Camera config
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.cameras.main.zoomTo(2, 4000);
    this.cameras.main.flash(3000);

    // Launch UI
    this.scene.launch('scene-ui', {
      parentScene: this
    });
    this.ui = this.scene.get('scene-ui');

    // Resize / reposition UI elements for screen
    this.scale.on('resize', this.resize, this);
    this.resize({width: window.innerWidth, height: window.innerHeight});
  }

  resize({width, height}) {
    this.cameras.resize(width, height);
  }

  update() {
    this.player.update();
    this.npc.update();
    if (this.merch) this.merch.update();

    // Dynamic layering
    this.mapFG.setDepth(this.map.heightInPixels);
    this.player.setDepth(this.player.y + 1);
    this.player.target.setDepth(this.player.target.y + 1);
    this.npc.setDepth(this.npc.y + 1);
    if (this.merch) this.merch.setDepth(this.merch.y + 1);
    this.mapBG.setDepth(1);
    this.mapGround.setDepth(0);
  }
}

export default Level;