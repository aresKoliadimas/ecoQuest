export default class FirstLevel extends Phaser.scene {
  constructor() {
    super("FirstLevel");
  }

  preload() {
    console.log("preload");
    this.preload.atlas(
      "player",
      "assets/images/player.png",
      "assets/images/player_atlas.json"
    );
  }
}
