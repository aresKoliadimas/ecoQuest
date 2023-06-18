import {
  ROCK_UNSUSTAINABLE,
  CONCRETE_UNSUSTAINABLE,
  BUILD_HOUSE,
} from "../constants/messages.js";

export default class firstLevel extends Phaser.Scene {
  cursors;
  spacebar;
  houseBuilt = false;
  player;
  woods;
  points = 0;
  pointsText;
  nextLevelPoints = 100;

  constructor() {
    super("firstLevel");
  }

  preload() {
    this.load.image("world1", "first-level/assets/images/world1Tileset.png");
    this.load.tilemapTiledJSON("map1", "first-level/assets/images/map1.json");
    this.load.atlas("player", "shared/player.png", "shared/player_atlas.json");
    this.load.json("player_animation", "shared/player_animation.json");
  }

  create() {
    const animData = this.cache.json.get("player_animation");
    this.anims.fromJSON(animData);
    const map1 = this.make.tilemap({ key: "map1" });
    const world1Tileset = map1.addTilesetImage(
      "world1Tileset",
      "world1",
      32,
      32,
      0,
      0
    );
    map1.createLayer("Tile Layer 1", world1Tileset, 0, 0);
    map1.createLayer("Tile Layer 2", world1Tileset, 0, 0);
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

  update() {
    this.player.anims.play("walk", true);
    this.move();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      const treeTile = map1.getTileAtWorldXY(
        player.x,
        player.y,
        true,
        treeLayer
      );
      if (treeTile && treeTile.index !== -1) {
        cutTree(treeTile);
      }
    }

    // TODO: add condition to check if player is in the correct location
    if (this.woodCount >= 10 && !houseBuilt) {
      showBuildPopup();
    }

    // TODO: add condition to check if player is in the correct location
    if (this.points >= this.nextLevelPoints) {
      moveToNextLevel();
    }
  }

  cutTree(treeTile) {
    const treeX = treeTile.pixelX + treeLayer.x;
    const treeY = treeTile.pixelY + treeLayer.y;

    const log = logs.create(treeX, treeY, "log");
    log.setOrigin(0, 1); // Adjust the origin to the bottom-left corner
    log.body.setSize(32, 32);
    log.body.setCircle(16);
    log.body.setOffset(0, 0);

    // Remove the tree tile
    treeLayer.removeTileAt(treeTile.x, treeTile.y);

    // Increment wood count
    woodCount++;
  }

  showBuildPopup() {
    const selectedMaterial = window.prompt(BUILD_HOUSE);

    if (selectedMaterial !== null) {
      const material = selectedMaterial.toLowerCase();

      switch (material) {
        case "wood":
          buildHouseWithWood();
          break;
        case "rock":
          deductPointsAndShowText(ROCK_UNSUSTAINABLE);
        case "concrete":
          deductPointsAndShowText(CONCRETE_UNSUSTAINABLE);
        default:
          break;
      }
    }
  }

  buildHouseWithWood() {
    houseBuilt = true;
    //TODO: Add house sprite
  }

  deductPointsAndShowText(message) {
    points = points ? points - 5 : 0;
    pointsText.setText("Points: " + points);
    showMessage(message);
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
    //TODO: Proceed to the next level or trigger any required actions
  }
}
