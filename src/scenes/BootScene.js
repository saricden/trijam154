import { Scene } from "phaser";
import stormHeadPNG from '../assets/sprites/StormHead.png';
import stormHeadJSON from '../assets/sprites/StormHead.json';
import tilesetRabite from '../assets/maps/tileset-rabite.png';
import tilesetMoonlit from '../assets/maps/tileset-moonlit.png';
import tilesetCity from '../assets/maps/tileset-city.png';
import level1JSON from '../assets/maps/level1.json';
import level2aJSON from '../assets/maps/level2a.json';
import level3aJSON from '../assets/maps/level3a.json';
import level4aJSON from '../assets/maps/level4a.json';
import ballChainPNG from '../assets/sprites/sci ball and chain.png';
import ballChainJSON from '../assets/sprites/sci ball and chain.json';
import bgm1 from '../assets/audio/goodbye-to-friends1.mp3';
import bgm2 from '../assets/audio/goodbye-to-friends2.mp3';
import bgm3 from '../assets/audio/goodbye-to-friends3.mp3';
import bgm4 from '../assets/audio/goodbye-to-friends4.mp3';
import forestAmbience from '../assets/audio/Forest_Ambience.mp3';
import dialog1 from '../assets/audio/Menu1A.wav';
import dialog2 from '../assets/audio/Menu1B.wav';
import stepL1 from '../assets/audio/Fantozzi-SandL1.wav';
import stepL2 from '../assets/audio/Fantozzi-SandL2.wav';
import stepL3 from '../assets/audio/Fantozzi-SandL3.wav';
import stepR1 from '../assets/audio/Fantozzi-SandR1.wav';
import stepR2 from '../assets/audio/Fantozzi-SandR2.wav';
import stepR3 from '../assets/audio/Fantozzi-SandR3.wav';
import spell1 from '../assets/audio/teleport-spell1.wav';
import spell2 from '../assets/audio/teleport-spell2.wav';
import spell3 from '../assets/audio/teleport-spell3.wav';
import spell4 from '../assets/audio/teleport-spell4.wav';
import spell5 from '../assets/audio/teleport-spell5.wav';
import flames from '../assets/sprites/flames.png';
import sfxFlames from '../assets/audio/foom_0.wav';
import merchPNG from '../assets/sprites/Samurai Merchant.png';
import merchJSON from '../assets/sprites/Samurai Merchant.json';
import fart from '../assets/audio/whoopee_2.wav';

class BootScene extends Scene {
  constructor() {
    super('scene-boot');
  }

  preload() {
    this.load.aseprite('player', stormHeadPNG, stormHeadJSON);
    this.load.aseprite('npc', ballChainPNG, ballChainJSON);
    this.load.spritesheet('flames', flames, {
      frameWidth: 16,
      frameHeight: 24
    });
    this.load.aseprite('merch', merchPNG, merchJSON);

    // Map stuff
    this.load.image('tileset-rabite', tilesetRabite);
    this.load.image('tileset-moonlit', tilesetMoonlit);
    this.load.image('tileset-city', tilesetCity);
    this.load.tilemapTiledJSON('map-level1', level1JSON);
    this.load.tilemapTiledJSON('map-level2a', level2aJSON);
    this.load.tilemapTiledJSON('map-level3a', level3aJSON);
    this.load.tilemapTiledJSON('map-level4a', level4aJSON);

    this.load.audio('bgm1', bgm1);
    this.load.audio('bgm2', bgm2);
    this.load.audio('bgm3', bgm3);
    this.load.audio('bgm4', bgm4);
    this.load.audio('forest-ambience', forestAmbience);
    this.load.audio('sfx-dialog1', dialog1);
    this.load.audio('sfx-dialog2', dialog2);
    this.load.audio('sfx-step1', stepL1);
    this.load.audio('sfx-step2', stepL2);
    this.load.audio('sfx-step3', stepL3);
    this.load.audio('sfx-step4', stepR1);
    this.load.audio('sfx-step5', stepR2);
    this.load.audio('sfx-step6', stepR3);
    this.load.audio('sfx-spell1', spell1);
    this.load.audio('sfx-spell2', spell2);
    this.load.audio('sfx-spell3', spell3);
    this.load.audio('sfx-spell4', spell4);
    this.load.audio('sfx-spell5', spell5);
    this.load.audio('sfx-flames', sfxFlames);
    this.load.audio('sfx-fart', fart);

    // Preloader
    this.loader = this.add.text(window.innerWidth / 2, window.innerHeight / 2, '0%', {
      color: '#FFF',
      fontFamily: 'sans-serif',
      fontSize: 18
    });
    this.loader.setOrigin(0.5);

    this.loader2 = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 30, '0%', {
      color: '#FFF',
      fontFamily: 'sans-serif',
      fontSize: 16
    });
    this.loader2.setOrigin(0.5);

    this.load.on('progress', (value) => {
      this.loader.setText(`${Math.round(value * 100)}%`);
    });

    this.load.on('fileprogress', (file) => {
      this.loader2.setText(file.key);
    });
  }

  create() {
    // Create animations
    this.anims.createFromAseprite('player');
    this.anims.createFromAseprite('npc');
    this.anims.createFromAseprite('merch');

    this.anims.create({
      key: 'flames-burn',
      frames: this.anims.generateFrameNumbers('flames', { start: 0, end: 11 }),
      frameRate: 18,
      repeat: -1
    });

    // Resize / reposition UI elements for screen
    this.scale.on('resize', this.resize, this);
    this.resize({width: window.innerWidth, height: window.innerHeight});

    // Setup global game data
    this.registry.gold = 0;

    // Start game
    this.loader2.setText('Ready, press anywhere to start.');

    this.input.once('pointerdown', () => {
      this.sound.play('forest-ambience', { loop: true });
      this.scene.start('scene-level1');
    });
  }

  resize({width, height}) {
    this.cameras.resize(width, height);

    // Do any UI repositioning here...
  }
}

export default BootScene;