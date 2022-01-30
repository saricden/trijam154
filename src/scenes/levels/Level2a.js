import Level from "../components/Level";

class Level2a extends Level {
  constructor() {
    super('scene-level2a', {
      tilemapKey: 'map-level2a',
      tilesetName: 'gentle forest, moonlight palette',
      tilesetKey: 'tileset-moonlit',
      bgmKey: 'bgm2'
    });
  }
}

export default Level2a;