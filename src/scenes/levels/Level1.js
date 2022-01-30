import Level from "../components/Level";

class Level1 extends Level {
  constructor() {
    super('scene-level1', {
      tilemapKey: 'map-level1',
      bgmKey: 'bgm1'
    });
  }
}

export default Level1;