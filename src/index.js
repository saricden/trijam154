import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import UI from './scenes/components/UI';
import Level1 from './scenes/levels/Level1';
import Level2a from './scenes/levels/Level2a';
import Level3a from './scenes/levels/Level3a';
import Level4a from './scenes/levels/Level4a';

const config = {
    type: Phaser.WEBGL,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.NONE,
        parent: 'game',
        width: window.innerWidth,
        height: window.innerHeight
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        Level1,
        Level2a,
        Level3a,
        Level4a,

        UI
    ],
    pixelArt: true
};

const game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {
    game.scale.resize(window.innerWidth, window.innerHeight);
}, false);