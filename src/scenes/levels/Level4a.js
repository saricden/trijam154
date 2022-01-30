import Level from "../components/Level";

class Level4a extends Level {
  constructor() {
    super('scene-level4a', {
      tilemapKey: 'map-level4a',
      tilesetName: 'Futuristic Industrial Tileset',
      tilesetKey: 'tileset-city',
      bgmKey: 'bgm4'
    });
  }
}

export default Level4a;