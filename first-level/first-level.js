import {
  ROCK_UNSUSTAINABLE,
  CONCRETE_UNSUSTAINABLE,
  BUILD_HOUSE,
} from "../constants/messages.js";

export default class FirstLevel extends Phaser.Scene {
  cursors = null;
  spacebar = null;
  houseBuilt = false;
  allowBuild = false;
  cutTrees = 0;
  player = null;
  points = 0;
  pointsText = null;
  nextLevelPoints = 100;
  houseLayer = null;
  house = null;

  constructor() {
    super("firstLevel");
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
    this.load.image("trees", "first-level/assets/images/trees.png");
    this.load.image("house", "first-level/assets/images/house.png");
    this.load.image("label", "first-level/assets/images/label.png");
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
    const grassLayer = firstLevelTilemap.createLayer(
      "grass",
      firstLevelTileset,
      0,
      0
    );
    const groundLayer = firstLevelTilemap.createLayer(
      "ground",
      firstLevelTileset,
      0,
      0
    );

    //label
    const label = this.physics.add.staticGroup();
    const labelLayer = firstLevelTilemap.getObjectLayer("label");
    labelLayer.objects.forEach((labelObj) => {
      const labels = label.create(labelObj.x, labelObj.y, "label");
      labels.setSize(32, 32);
      labels.setOrigin(0, 0);
    });
    this.physics.world.enable(label);

    // Create the trees group and add tree objects
    const trees = this.physics.add.staticGroup();
    const treesLayer = firstLevelTilemap.getObjectLayer("trees");
    treesLayer.objects.forEach((treesObj) => {
      const tree = trees.create(treesObj.x, treesObj.y - 64, "trees");
      tree.setSize(32, 64);
      tree.setOrigin(0, 0);
    });
    this.physics.world.enable(trees);

    // Create a group to hold the house sprites
    this.house = this.physics.add.staticGroup();
    this.houseLayer = firstLevelTilemap.getObjectLayer("house");
    this.houseLayer.objects.forEach((houseObj) => {
      const house = this.house.create(houseObj.x, houseObj.y - 128, "house");
      house.setOrigin(0, 0);
      house.setVisible(false);
    });
    this.physics.world.enable(this.house);

    this.player = this.physics.add.sprite(
      256,
      256,
      "player",
      "townsfolk_f_idle_1"
    );
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, trees, this.removeTree, null, this);

    this.pointsText = this.add.text(17, 17, "Points: 0", {
      fontSize: "15px",
      fill: "#000",
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.anims.play("walk", true);
    this.move();

    this.removeTree();

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

  removeTree(player, tree) {
    if (!this.allowBuild) {
      return;
    }
    tree.destroy();
    this.cutTrees += 1;
    this.points += 10;
    this.pointsText.setText("Points: " + this.points);
  }

  showBuildPopup() {
    const selectedMaterial = window.prompt(BUILD_HOUSE);

    if (selectedMaterial !== null) {
      const material = selectedMaterial.toLowerCase();

      switch (material) {
        case "wood":
          this.allowBuild = true;
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
    if (this.houseLayer.objects.length > 0) {
      const houseObject = this.houseLayer.objects[0];
      const houseSprite = this.house.get(
        houseObject.x + 64,
        houseObject.y - 64,
        "house"
      );
      houseSprite.setVisible(true);
    }
  }

  deductPointsAndShowText(message) {
    this.points = Math.max(this.points - 5, 0);
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
