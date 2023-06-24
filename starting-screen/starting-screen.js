import { INSTRUCTIONS, WELCOME } from "../constants/messages.js";

export default class StartingScreen extends Phaser.Scene {
  constructor() {
    super("startingScreen");
  }

  create() {
    this.add.rectangle(0, 0, 512, 512, 0x000000).setOrigin(0);

    this.add
      .text(256, 100, WELCOME, {
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    const instructionsText = this.add
      .text(256, 200, INSTRUCTIONS, {
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 400 },
      })
      .setOrigin(0.5);

    // Start the game when SPACEBAR is pressed
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("firstLevel");
    });
  }
}
