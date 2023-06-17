import {
  ROCK_UNSUSTAINABLE,
  CONCRETE_UNSUSTAINABLE,
  BUILD_HOUSE,
} from "../constants/messages.js";

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
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let cursors;
let spacebar;
let woodCount = 0;
let houseBuilt = false;
let player;
let woods;
let points = 0;
let pointsText;
let currentWorld = 1;
let nextLevelPoints = 100;

function preload() {
  this.load.image("world1", "first-level/assets/images/world1Tileset.png");
  this.load.tilemapTiledJSON("map1", "first-level/assets/images/map1.json");
  this.load.atlas(
    "player",
    "first-level/assets/images/player.png",
    "first-level/assets/images/player_atlas.json"
  );
}

function create() {
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
  player = this.physics.add.sprite(256, 256, "player");
  player.setCollideWorldBounds(true);

  const trees = this.physics.add.group({
    key: "tree",
    repeat: 5,
    setXY: {
      x: 50,
      y: Phaser.Math.RND.between(100, this.sys.canvas.height / 4),
      stepX: 70,
    },
  });

  woods = this.physics.add.group();
  this.physics.add.overlap(player, trees, cutTree, null, this, {
    overlapOnly: true,
  });

  pointsText = this.add.text(17, 17, "Points: 0", {
    fontSize: "15px",
    fill: "#000",
  });

  cursors = this.input.keyboard.createCursorKeys();
  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-160);
  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
  } else {
    player.setVelocityY(0);
  }

  // TODO: add condition to check if player is in the correct location
  if (woodCount >= 10 && !houseBuilt) {
    showBuildPopup();
  }

  // TODO: add condition to check if player is in the correct location
  if (points >= nextLevelPoints) {
    moveToNextLevel();
  }
}

function cutTree(player, tree) {
  if (woodCount < 10 && !houseBuilt) {
    woodCount++;
    tree.disableBody(true, true);

    const wood = woods.create(tree.x, tree.y, "wood");
    wood.setOrigin(0.5);
    wood.body.setSize(32, 32);
    wood.body.setCircle(16);
    wood.body.setOffset(0, 0);
  }
}

function showBuildPopup() {
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

function buildHouseWithWood() {
  houseBuilt = true;
  //TODO: Add house sprite
}

function deductPointsAndShowText(message) {
  points = points ? points - 5 : 0;
  pointsText.setText("Points: " + points);
  showMessage(message);
}

function showMessage(message) {
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

function moveToNextLevel() {
  //TODO: Proceed to the next level or trigger any required actions
}
