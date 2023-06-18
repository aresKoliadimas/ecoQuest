import {
  ROCK_UNSUSTAINABLE,
  CONCRETE_UNSUSTAINABLE,
  BUILD_HOUSE,
} from "../constants/messages.js";

export default class FirstLevel extends Phaser.Scene {
  constructor() {
    super("firstLevel");
    this.cursors = null;
    this.spacebar = null;
    this.houseBuilt = false;
    this.player = null;
    this.woods = null;
    this.points = 0;
    this.pointsText = null;
    this.nextLevelPoints = 100;
  }

  preload() {
    this.load.image(
      "firstLevelTilesetImage",
      "first-level/assets/images/firstLevelTileset.png"
    );
    this.load.tilemapTiledJSON(
      "firstLevelTilemap",
      "first-level/assets/images/firstLevelTilemap.json"
    );
    this.load.atlas("player", "shared/player.png", "shared/player_atlas.json");
    this.load.json("player_animation", "shared/player_animation.json");
  }

  create() {
    const playerAnimation = this.cache.json.get("player_animation");
    this.anims.fromJSON(playerAnimation);
    const firstLevelTilemap = this.make.tilemap({ key: "firstLevelTilemap" });
    const firstLevelTileset = firstLevelTilemap.addTilesetImage(
      "firstLevelTileset",
      "firstLevelTilesetImage",
      32,
      32,
      0,
      0
    );
    firstLevelTilemap.createLayer("Tile Layer 1", firstLevelTileset, 0, 0);
    firstLevelTilemap.createLayer("Tile Layer 2", firstLevelTileset, 0, 0);
    this.player = this.physics.add.sprite(
      256,
      256,
      "player",
      "townsfolk_f_idle_1"
    );
    this.player.setCollideWorldBounds(true);

    const trees = this.physics.add.group({
      key: "tree",
      repeat: 5,
      setXY: {
        x: 50,
        y: Phaser.Math.RND.between(100, this.sys.canvas.height / 4),
        stepX: 70,
      },
    });

    this.woods = this.physics.add.group();
    this.physics.add.overlap(this.player, trees, this.cutTree, null, this, {
      overlapOnly: true,
    });

    this.pointsText = this.add.text(17, 17, "Points: 0", {
      fontSize: "15px",
      fill: "#000",
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update() {
    this.player.anims.play("walk", true);
    this.move();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      const treeLayer = this.map.getLayer("Tile Layer 2");
      const treeTile = treeLayer.getTileAtWorldXY(
        this.player.x,
        this.player.y,
        true
      );

      if (treeTile && treeTile.index !== -1) {
        this.cutTree(treeTile);
      }
    }

    // TODO: add condition to check if player is in the correct location
    if (this.woodCount >= 10 && !this.houseBuilt) {
      this.showBuildPopup();
    }

    // TODO: add condition to check if player is in the correct location
    if (this.points >= this.nextLevelPoints) {
      this.moveToNextLevel();
    }
  }

  move() {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown) {
      velocityX = -160;
    } else if (this.cursors.right.isDown) {
      velocityX = 160;
    }

    if (this.cursors.up.isDown) {
      velocityY = -160;
    } else if (this.cursors.down.isDown) {
      velocityY = 160;
    }

    const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (magnitude > 0) {
      velocityX /= magnitude;
      velocityY /= magnitude;
    }

    this.player.setVelocityX(velocityX * 160);
    this.player.setVelocityY(velocityY * 160);
  }

  cutTree(treeTile) {
    const treeX = treeTile.pixelX + treeTile.tilemapLayer.x;
    const treeY = treeTile.pixelY + treeTile.tilemapLayer.y;

    const log = this.woods.create(treeX, treeY, "log");
    log.setOrigin(0, 1); // Adjust the origin to the bottom-left corner
    log.body.setSize(32, 32);
    log.body.setCircle(16);
    log.body.setOffset(0, 0);

    // Remove the tree tile
    treeTile.tilemapLayer.removeTileAt(treeTile.x, treeTile.y);

    // Increment wood count
    this.points++;
    this.pointsText.setText("Points: " + this.points);
  }

  showBuildPopup() {
    const selectedMaterial = window.prompt(BUILD_HOUSE);

    if (selectedMaterial !== null) {
      const material = selectedMaterial.toLowerCase();

      switch (material) {
        case "wood":
          this.buildHouseWithWood();
          break;
        case "rock":
          this.deductPointsAndShowText(ROCK_UNSUSTAINABLE);
          break;
        case "concrete":
          this.deductPointsAndShowText(CONCRETE_UNSUSTAINABLE);
          break;
        default:
          break;
      }
    }
  }

  buildHouseWithWood() {
    this.houseBuilt = true;
    // TODO: Add house sprite
  }

  deductPointsAndShowText(message) {
    this.points = this.points >= 5 ? this.points - 5 : 0;
    this.pointsText.setText("Points: " + this.points);
    this.showMessage(message);
  }

  showMessage(message) {
    const messageText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      message,
      {
        fontSize: "24px",
        fill: "#ffffff",
      }
    );
    messageText.setOrigin(0.5);
    messageText.setVisible(true);
  }

  moveToNextLevel() {
    // TODO: Proceed to the next level or trigger any required actions
  }
}
