import {
    ROCK_UNSUSTAINABLE,
    CONCRETE_UNSUSTAINABLE,
    BUILD_HOUSE,
  } from "../constants/messages.js";
  
  export default class SecondLevel extends Phaser.Scene {
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
      super("secondLevel");
    }
  
    preload() {
      this.load.image(
        "Beach Tileset.png",
        "second-level/assets/Beach Tileset.png"
      );
      this.load.tilemapTiledJSON(
        "beachtileset",
        "second-level/assets/beach.json"
      );
      this.load.image("trash", "second-level/assets/trash3.png");
      this.load.image("bin1", "second-level/assets/bin1.png");
      
      this.load.atlas("player", "shared/player.png", "shared/player_atlas.json");
      this.load.json("player_animation", "shared/player_animation.json");
    }
  
    create() {
      const playerAnimation = this.cache.json.get("player_animation");
      this.anims.fromJSON(playerAnimation);
      const secondLevelTilemap = this.make.tilemap({ key: "secondLevelTilemap" });
      const secondLevelTileset = secondLevelTilemap.addTilesetImage(
        "seconLevelTileset",
        "secondLevelTilesetImage",
        32,
        32,
        0,
        0
      );
      const groundLayer = secondLevelTilemap.createLayer(
        "ground",
        secondLevelTileset,
        0,
        0
      );
      const obstacleLayer = secondLevelTilemap.createLayer(
        "obstacle",
        secondLevelTileset,
        0,
        0
      );
  
      //label
     /*  const trash = this.physics.add.staticGroup();
      const trashLayer = secondLevelTilemap.getObjectLayer("trash");
      trashLayer.objects.forEach((trashObj) => {
        const trashes = trash.create(trashObj.x, trashObj.y, "trash");
        trashes.setSize(32, 32);
        trashes.setOrigin(0, 0);
      });
      this.physics.world.enable(trash); */
  
      // Create the trees group and add tree objects
      /* const bin = this.physics.add.staticGroup();
      const binLayer = secondLevelTilemap.getObjectLayer("bin");
      binLayer.objects.forEach((binObj) => {
        const bins = trees.create(binObj.x, binObj.y, "bin");
        //tree.setSize(32, 64);
        bins.setOrigin(0, 0);
      });
      this.physics.world.enable(bin); */
  
     
  
      this.player = this.physics.add.sprite(
        256,
        256,
        "player",
        "townsfolk_f_idle_1"
      );
      this.player.setCollideWorldBounds(true);
  
      this.physics.add.collider(this.player, trash, this.removeTrash, null, this);
  
      this.pointsText = this.add.text(17, 17, "Points: 0", {
        fontSize: "15px",
        fill: "#000",
      });
  
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  
    update() {
      this.player.anims.play("walk", true);
      this.move();
  
      this.removeTrash();
  
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
  
    removeTree(player, trash) {
      if (!this.allowBuild) {
        return;
      }
      trash.destroy();
      this.getTrash += 1;
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
  
   /*  buildHouseWithWood() {
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
    } */
  
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
  