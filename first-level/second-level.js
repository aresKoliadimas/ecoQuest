import {
    ROCK_UNSUSTAINABLE,
    CONCRETE_UNSUSTAINABLE,
    BUILD_HOUSE,
  } from "../constants/messages.js";
  
  export default class SecondLevel extends Phaser.Scene {
    cursors = null;
    spacebar = null;
    houseBuilt = false;
    allowRecycle = false;
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
        "secondLevelTilesetImage",
        "first-level/assets/images/secondLevelTileset.png"
      );
      this.load.tilemapTiledJSON("secondLevelTilemap", "first-level/assets/images/secondLevelTilemap1.json"); 
      this.load.image('plastic1', 'first-level/assets/images/plastic1.png');
      this.load.image('plastic2', 'first-level/assets/images/plastic2.png');
      this.load.image('food1', 'first-level/assets/images/food1.png');
      this.load.image('food2', 'first-level/assets/images/food2.png');
      this.load.image('paper', 'first-level/assets/images/paper.png');
      this.load.image('bin', 'first-level/assets/images/bin1.png')
      
      this.load.atlas("player", "shared/player.png", "shared/player_atlas.json");
      this.load.json("player_animation", "shared/player_animation.json");
    }
  
    create() {
      const playerAnimation = this.cache.json.get("player_animation");
      this.anims.fromJSON(playerAnimation);

      const secondLevelTilemap = this.make.tilemap({ key: "secondLevelTilemap" });
      const secondLevelTileset = secondLevelTilemap.addTilesetImage(
        "secondLevelTileset",
        "secondLevelTilesetImage",
        32,
        32,
        0,
        0
      );

      const groundLayer = secondLevelTilemap.createLayer('ground', secondLevelTileset, 0, 0);
      //groundLayer.setCollisionProperty({collides: true});
      const treesLayer = secondLevelTilemap.createLayer('trees', secondLevelTileset, 0, 0);  
      //treesLayer.setCollisionProperty({collides: true});

      const plastic1 = this.physics.add.staticGroup();
      const plastic1Layer = secondLevelTilemap.getObjectLayer("plastic1");
      plastic1Layer.objects.forEach((plastic1Obj) => {
        const plastic = plastic1.create(plastic1Obj.x-32, plastic1Obj.y-32, "plastic1");
        plastic.setOrigin(0, 0);
      });
      this.physics.world.enable(plastic1); 

      const plastic2 = this.physics.add.staticGroup();
      const plastic2Layer = secondLevelTilemap.getObjectLayer("plastic2");
      plastic2Layer.objects.forEach((plastic2Obj) => {
        const plastics = plastic2.create(plastic2Obj.x, plastic2Obj.y, "plastic2");
        plastic2.setOrigin(0, 0);
      });
      this.physics.world.enable(plastic2); 
      
      const paper = this.physics.add.staticGroup();
      const paperLayer = secondLevelTilemap.getObjectLayer("paper");
      paperLayer.objects.forEach((paperObj) => {
        const papers = paper.create(paperObj.x, paperObj.y, "paper");
        papers.setOrigin(0, 0);
      });
      this.physics.world.enable(paper);

      const food1 = this.physics.add.staticGroup();
      const food1Layer = secondLevelTilemap.getObjectLayer("food1");
      food1Layer.objects.forEach((food1Obj) => {
        const food = food1.create(food1Obj.x, food1Obj.y, "food1");
        food1.setOrigin(0, 0);
      });
      this.physics.world.enable(food1);

      const food2 = this.physics.add.staticGroup();
      const food2Layer = secondLevelTilemap.getObjectLayer("food2");
      food2Layer.objects.forEach((food2Obj) => {
        const foods = plastic2.create(food2Obj.x, food2Obj.y, "food2");
        food2.setOrigin(0, 0);
      });
      this.physics.world.enable(food2);

      const bin = this.physics.add.staticGroup();
      const binLayer = secondLevelTilemap.getObjectLayer("bin");
      binLayer.objects.forEach((binObj) => {
        const bins = bin.create(binObj.x, binObj.y, "bin");
        bin.setOrigin(0, 0);
      });
      this.physics.world.enable(bin);

      this.player = this.physics.add.sprite(
        256,
        256,
        "player",
        "townsfolk_f_idle_1"
      );
      this.player.setCollideWorldBounds(true);
  
     this.physics.add.collider(this.player, plastic1, this.removeplastic1, null, this);
     this.physics.add.collider(
        this.player,
        plastic1,
        this.removeplastic1,
        undefined,
        this
      );
      this.physics.add.collider(
        this.player,
        paper,
        this.removepaper,
        undefined,
        this
      );
      this.physics.add.collider(
        this.player,
        food1,
        this.removefood1,
        undefined,
        this
      );
      this.physics.add.collider(
        this.player,
        food2,
        this.removefood2,
        undefined,
        this
      );
      this.physics.add.collider(
        this.player,
        bin,
        this.showBuildPopup,
        null,
        this
      );
  
      this.pointsText = this.add.text(17, 17, "Points: 0", {
        fontSize: "15px",
        fill: "#000",
      });
  
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  //ti akrivos tha kanei otan teleiosei?
    update() {
      this.player.anims.play("walk", true);
      this.move();
      // if (this.points >= this.nextLevelPoints) {
        //this.moveToNextLevel();
     }
    /* this.removeplastic1();
    this.removeplastic2();
    this.removefood1();
    this.removefood2();
    this.removepaper(); }*/

    updateScore(points) {
        this.points += points;
        this.pointsText.setText("Points: " + this.points);
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
        this.treeCutSound.play();
        this.noOfCutTrees++;
    
        if (this.noOfCutTrees >= 10) {
          this.buildHouseWithWood();
        }
      }
     removeplastic1(player, plastic1) {
      if (!this.allowRecycle) {
        return;
      }
      plastic1.destroy();
      this.treeCutSound.play();
      this.noOfCutTrees++;
      if (this.noOfCutTrees >= 10) {
        this.buildHouseWithWood();
      }
    } 
    removeplastic2(player, plastic2) {
        if (!this.allowRecycle) {
          return;
        }
        plastic2.destroy();
        this.getplastic2 += 1;
        this.points += 10;
        this.pointsText.setText("Points: " + this.points);
      }
      
      removepaper(player, paper) {
        if (!this.allowRecycle) {
          return;
        }
        paper.destroy();
        this.paper += 1;
        this.points += 10;
        this.pointsText.setText("Points: " + this.points);
      } 
      removefood1(player, food1) {
        if (!this.allowRecycle) {
          return;
        }
        food1.destroy();
        this.food1 += 1;
        this.points += 10;
        this.pointsText.setText("Points: " + this.points);
      } 
      removefood2(player, food2) {
        if (!this.allowRecycle) {
          return;
        }
        food2.destroy();
        this.food2 += 1;
        this.points += 10;
        this.pointsText.setText("Points: " + this.points);
      } 
  
    showBuildPopup() {
      const selectedMaterial = window.prompt(BUILD_HOUSE);
  
      if (selectedMaterial !== null) {
        const material = selectedMaterial.toLowerCase();
  
        switch (material) {
          case "wood":
            this.allowRecycle = true;
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
  