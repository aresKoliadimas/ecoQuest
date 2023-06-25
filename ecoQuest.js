import StartingScreen from "./starting-screen/starting-screen.js";
import FirstLevel from "./first-level/first-level.js";
import SecondLevel from "./second-level/second-level.js";

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
  scene: [StartingScreen, FirstLevel, SecondLevel],
  scale: {
    zoom: 1.4,
  },
};

export default new Phaser.Game(config);
