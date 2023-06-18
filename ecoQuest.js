import firstLevel from "./first-level/first-level.js";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [firstLevel],
  scale: {
    zoom: 1.4,
  },
};

export default new Phaser.Game(config);
