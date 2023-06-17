import FirstLevel from "./first-level/first-level";

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  backgroundColor: "#880808",
  parent: "ecoQuest",
  scene: [FirstLevel],
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

// Preload assets
function preload() {
  this.preload.atlas;
}

// Create the game scene
function create() {
  // Add the background image

  // Create the player character
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
  if (points >= 100) {
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