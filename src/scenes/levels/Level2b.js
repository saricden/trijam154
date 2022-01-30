import Level from "../components/Level";

class Level2b extends Level {
  constructor() {
    super('scene-level2b', {
      tilemapKey: 'map-level2b',
      tilesetName: 'gentle forest, jungle palette',
      tilesetKey: 'tileset-jungle',
      bgmKey: 'bgm2'
    });
  }
}

export default Level2b;