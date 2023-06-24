import {
  ROCK_UNSUSTAINABLE,
  CONCRETE_UNSUSTAINABLE,
  BUILD_HOUSE,
} from "../constants/messages.js";

export default class FirstLevel extends Phaser.Scene {
  cursors = null;
  spacebar = null;
  houseBuilt = false;
  player = null;
  woods = null;
  points = 0;
  pointsText = null;
  nextLevelPoints = 100;
  houseLayer;
  house;

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
    this.load.atlas("player", "shared/player.png", "shared/player_atlas.json");
    this.load.json("player_animation", "shared/player_animation.json");}

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

   
  const grassLayer = map1.createLayer("grass", firstLevelTileset, 0, 0);
  const groundLayer = map1.createLayer("ground", firstLevelTileset, 0, 0);
  const trees = this.add.group();
  const treesLayer = map1.getObjectLayer("trees");

  treesLayer.objects.forEach(treesObj => {
    const tree = trees.create(treesObj.x, treesObj.y - 64, "trees");
    tree.setSize(32, 64);
    tree.setOrigin(0, 0);
  });

// Enable physics for the trees group if needed
this.physics.world.enable(trees);

// Create a group to hold the house sprites
  house = this.add.group();
  houseLayer = map1.getObjectLayer("house");
 

  houseLayer.objects.forEach(houseObj => {
  const houses = house.create(houseObj.x, houseObj.y - 128, "house");
  //house.setSize(128, 128);
  houses.setOrigin(0, 0);
  houses.setVisible(false);
  });
  
  this.physics.world.enable(house);


  this.player = this.physics.add.sprite(
    256,
    256,
    "player",
    "townsfolk_f_idle_1"
  );
  this.player.setCollideWorldBounds(true);

  // Set collision between player and trees group
  this.physics.add.collider(player, trees, removeTree, null, this);



  this.pointsText = this.add.text(17, 17, "Points: 0", {
    fontSize: "15px",
    fill: "#000",
  });

  this.ursors = this.input.keyboard.createCursorKeys();
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

update() {
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

<<<<<<< HEAD
  update() {
    this.player.anims.play("walk", true);
    this.move();
=======
  // TODO: add condition to check if player has reached the required points
  if (points >= nextLevelPoints) {
    moveToNextLevel();
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

function removeTree(player, tree) {
  tree.destroy(); // Destroy the tree sprite
  woodCount++; // Increment the wood count
  points += 10; // Increment the points
  pointsText.setText("Points: " + points);
}
>>>>>>> marvel

    // TODO: add condition to check if player is in the correct location
    if (this.woodCount >= 10 && !this.houseBuilt) {
      this.showBuildPopup();
    }

<<<<<<< HEAD
    // TODO: add condition to check if player is in the correct location
    if (this.points >= this.nextLevelPoints) {
      this.moveToNextLevel();
=======
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
  }

<<<<<<< HEAD
  
function buildHouseWithWood() {
  houseBuilt = true;
  if (houseLayer.objects.length > 0) {
    const houseObject = houseLayer.objects[0];
    const houseSprite = house.get(houseObject.x +64, houseObject.y -64, "house");
    houseSprite.setVisible(true);
  }

 
}

  
  


  




function deductPointsAndShowText(message) {
  points = Math.max(points - 5, 0); // Deduct points, but ensure it doesn't go below 0
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