// Initialize the Phaser game
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

// Global variables
let woodCount = 0;
let rockCount = 0;
let houseBuilt = false;
let player;
let woodText;
let rockText;

// Preload assets
function preload() {
  // Load assets
}

// Create the game scene
function create() {
  // Add the background image

  // Create the player character
  player = this.physics.add.sprite(400, 300, "player");
  player.setCollideWorldBounds(true);

  // Create the resource objects (wood and rock)
  const wood = this.physics.add.sprite(200, 300, "wood");
  const rock = this.physics.add.sprite(600, 300, "rock");

  // Enable overlap with the player for resource objects
  this.physics.add.overlap(player, wood, collectWood, null, this);
  this.physics.add.overlap(player, rock, collectRock, null, this);

  // Create text for resource counters
  woodText = this.add.text(16, 16, "Wood: 0", {
    fontSize: "32px",
    fill: "#000",
  });
  rockText = this.add.text(16, 56, "Rock: 0", {
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

  // Mining resources
  if (Phaser.Input.Keyboard.JustDown(spacebar)) {
    const nearbyWood = woodCount === 0 && checkOverlap(player, wood);
    const nearbyRock = rockCount === 0 && checkOverlap(player, rock);

    if (nearbyWood) {
      collectWood();
    } else if (nearbyRock) {
      collectRock();
    }
  }
}

// Helper function to check overlap between two sprites
function checkOverlap(spriteA, spriteB) {
  const boundsA = spriteA.getBounds();
  const boundsB = spriteB.getBounds();

  return Phaser.Geom.Rectangle.Overlaps(boundsA, boundsB);
}

// Function to collect wood
function collectWood() {
  woodCount++;
  wood.destroy();
  woodText.setText("Wood: " + woodCount);

  checkBuildHouse();
}

// Function to collect rock
function collectRock() {
  rockCount++;
  rock.destroy();
  rockText.setText("Rock: " + rockCount);

  checkBuildHouse();
}

// Function to build the house
function checkBuildHouse() {
  if (woodCount >= 5 && rockCount >= 3 && !houseBuilt) {
    houseBuilt = true;
    // Add house sprite and any other visual indicators

    // Add house completion message or trigger next level
  }
}
