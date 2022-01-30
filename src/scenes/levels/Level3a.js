import Level from "../components/Level";

class Level3a extends Level {
  constructor() {
    super('scene-level3a', {
      tilemapKey: 'map-level3a',
      tilesetName: 'gentle forest, moonlight palette',
      tilesetKey: 'tileset-moonlit',
      bgmKey: 'bgm3'
    });
  }
}

export default Level3a;