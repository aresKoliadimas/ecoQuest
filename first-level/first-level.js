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
let trees;
let points = 0;
let pointsText;
let currentWorld = 1;
let nextLevelPoints = 100;

function preload() {
  this.load.image("world1", "first-level/assets/images/world1Tileset.png");
  //couldn't understand how to use the fucking tree from the tileset so i made my own image
  this.load.image("trees", "first-level/assets/images/trees.png");
  this.load.tilemapTiledJSON("map1", "first-level/assets/images/tilemap1.json");
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
   // Create the tile layers
  const grassLayer = map1.createLayer("grass", world1Tileset, 0, 0);
  //could add walls around and in the exit path
  const groundLayer = map1.createLayer("ground", world1Tileset, 0, 0);
//original tree code DONT KNOW IF IT WAS MORE HELPFULL FOR THE REST OF THE COLLISIONS AND SHIT

  //const trees = this.physics.add.staticGroup()
  //const treesLayer = map1.getObjectLayer("trees",world1Tileset, 0, 0);
  //treesLayer.objects.forEach(treesObj =>{trees.get(treesObj.x, treesObj.y, 'trees', 'world1Tileset.png')})
  //trees.create(treesObj.x, treesObj.y, "world1")
  // Create the trees group and add tree objects
  const trees = this.add.group();
  const treesLayer = map1.getObjectLayer("trees");

  treesLayer.objects.forEach(treesObj => {
  const tree = trees.create(treesObj.x, treesObj.y - 64, "trees");
  tree.setSize(32, 64);
  tree.setOrigin(0, 0);
});

// Enable physics for the trees group if needed
this.physics.world.enable(trees);

  

  player = this.physics.add.sprite(256, 256, "player");
  player.setCollideWorldBounds(true);

  // Set collision between player and trees group
  this.physics.add.collider(player, trees, removeTree, null, this);


  // Set collision between player and trees group
  //this.physics.add.collider(player, trees, removeTree, null, this);

  pointsText = this.add.text(17, 17, "Points: 0", {
    fontSize: "15px",
    fill: "#000",
  });

  cursors = this.input.keyboard.createCursorKeys();
  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update() {
  player.setVelocity(0); // Reset the player's velocity

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-160);
  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
  }

  // TODO: add condition to check if player is in the correct location
  if (woodCount >= 10 && !houseBuilt) {
    showBuildPopup();
  }

  // TODO: add condition to check if player has reached the required points
  if (points >= nextLevelPoints) {
    moveToNextLevel();
  }
}

function removeTree(player, tree) {
  tree.destroy(); // Destroy the tree sprite
  woodCount++; // Increment the wood count
  points += 10; // Increment the points
  pointsText.setText("Points: " + points);
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
        break;
      case "concrete":
        deductPointsAndShowText(CONCRETE_UNSUSTAINABLE);
        break;
      default:
        break;
    }
  }
}

function buildHouseWithWood() {
  houseBuilt = true;
  // TODO: Add house sprite
}

function deductPointsAndShowText(message) {
  points = Math.max(points - 5, 0); // Deduct points, but ensure it doesn't go below 0
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
  // TODO: Proceed to the next level or trigger any required actions
}


