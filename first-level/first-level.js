const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let woodCount = 0;
let rockCount = 0;
let houseBuilt = false;
let player;
let woodText;
let rockText;
let points = 0;
let pointsText;
let currentWorld = 1;
let nextLevelPoints = 100;
let worldText;

function preload() {
  console.log("preload");
  this.load.image("tiles", "first-level/assets/images/world1Tileset.png");
  this.load.tilemapTiledJSON("map1", "first-level/assets/images/map1.json");
  this.load.atlas(
    "player",
    "first-level/assets/images/player.png",
    "first-level/assets/images/player_atlas.json"
  );
}

function create() {
  const map1 = this.make.tilemap({ key: "map1" });
  const world1Tileset = map1.addTilesetImage("world1Tileset", "tiles", 32, 32, 0, 0);
  const layer1 = map1.createLayer("Tile Layer 1", world1Tileset, 0, 0);
  const layer2 = map1.createLayer("Tile Layer 2", world1Tileset, 0, 0);
  player = this.physics.add.sprite(400, 300, "player");
  player.setCollideWorldBounds(true);

  // Create the resource objects (wood and rock)
  const trees = this.physics.add.group({
    key: "tree",
    repeat: 9,
    setXY: { x: 100, y: 100, stepX: 70 },
  });

  // Enable overlap with the player for resource objects
  this.physics.add.overlap(player, trees, cutTree, null, this);

  // Create text for resource counters
  woodText = this.add.text(16, 16, "Wood: 0", {
    fontSize: "32px",
    fill: "#000",
  });
  rockText = this.add.text(16, 56, "Rock: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  // Create text for points
  pointsText = this.add.text(16, 96, "Points: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  // Create text for current world
  worldText = this.add.text(16, 136, "World: " + currentWorld, {
    fontSize: "32px",
    fill: "#000",
  });

  // Set up keyboard input
  cursors = this.input.keyboard.createCursorKeys();
  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

// Update function (called per frame)
function update() {
  // Player movement
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

  // Build house if conditions are met
  if (woodCount >= 10 && !houseBuilt) {
    showBuildPopup();
  }

  // Move to next level based on points
  if (points >= nextLevelPoints) {
    moveToNextLevel();
  }
}

// Helper function to check overlap between two sprites
function checkOverlap(spriteA, spriteB) {
  const boundsA = spriteA.getBounds();
  const boundsB = spriteB.getBounds();

  return Phaser.Geom.Rectangle.Overlaps(boundsA, boundsB);
}

// Function to cut trees and gather wood
function cutTree(player, tree) {
  if (woodCount < 10 && !houseBuilt) {
    woodCount++;
    tree.destroy();
    woodText.setText("Wood: " + woodCount);

    if (woodCount >= 10) {
      showBuildPopup();
    }
  }
}

// Function to show the build popup
function showBuildPopup() {
  const buildPopup = window.confirm(
    "You have enough wood to build the house. Select the material to use:\n\nWood\nRock"
  );
  if (buildPopup) {
    const selectedMaterial = buildPopup.toLowerCase();
    if (selectedMaterial === "wood") {
      buildHouseWithWood();
    } else if (selectedMaterial === "rock") {
      deductPointsAndShowText();
    }
  }
}

// Function to build the house with wood
function buildHouseWithWood() {
  houseBuilt = true;
  // Add house sprite and any other visual indicators

  // Add house completion message or trigger next level

  // Move to the next world if all levels are completed in the current world
  if (currentWorld === 1 && houseBuilt) {
    nextLevelPoints = 200; // Update the required points for the next level
    currentWorld = 2;
    worldText.setText("World: " + currentWorld);
    // Set up the new world environment (e.g., different background, resources, etc.)
  }
}

// Function to deduct points and show text
function deductPointsAndShowText() {
  rockCount++;
  points -= 50;
  rockText.setText("Rock: " + rockCount);
  pointsText.setText("Points: " + points);
  // Show text informing the player about the unsustainability of rock material
}

// Function to move to the next level
function moveToNextLevel() {
  // Proceed to the next level or trigger any required actions
}
