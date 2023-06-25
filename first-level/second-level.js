import {
    POLUTED_BEACH,
    LEAVE_POLUTED,
    CLEAN_BEACH,
    CONGRATS,
    WRONG_ANSWER,
    CORRECT_ANSWER,
    MUST_CLEAN_BEACH,
} from "../constants/messages.js";
import { EXPLANATIONS, QUESTIONS } from "../constants/quiz.js";
  
  export default class SecondLevel extends Phaser.Scene {
    cursors = null;
    spacebar = null;
    isBeachClean = false;
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
      this.questions = QUESTIONS;
      this.explanations = EXPLANATIONS;
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
  
    
     this.physics.add.collider(
        this.player,
        plastic1,
        this.removeplastic1,
        undefined,
        this
      );
      this.physics.add.collider(
        this.player,
        plastic2,
        this.removeplastic2,
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
        this.showCleanPopup,
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
  
    removeplastic1(player, plastic1) {
      if (!this.allowRecycle) {
        return;
      }
      plastic1.destroy();
      //this.treeCutSound.play();
      this.noOfRecycled++;
      if (this.noOfRecycled >= 10) {
        this.cleanedBeach();
      }
    } 
    removeplastic2(player, plastic2) {
        if (!this.allowRecycle) {
          return;
        }
        plastic2.destroy();
        this.noOfRecycled++;
        if (this.noOfRecycled >= 10) {
          this.cleanedBeach();
        }
    }
      
    removepaper(player, paper) {
        if (!this.allowRecycle) {
          return;
        }
        paper.destroy();
        this.noOfRecycled++;
        if (this.noOfRecycled >= 10) {
          this.cleanedBeach();
        }
    } 
    removefood1(player, food1) {
        if (!this.allowRecycle) {
          return;
        }
        food1.destroy();
        this.noOfRecycled++;
        if (this.noOfRecycled >= 10) {
          this.cleanedBeach();
        }
    }
    removefood2(player, food2) {
        if (!this.allowRecycle) {
          return;
        }
        food2.destroy();
        if (this.noOfRecycled >= 10) {
            this.cleanedBeach();
        }
    }  

  
    showCleanPopup() {
        if (this.isBeachClean) {
            return;
          }

        const selectedAction = window.prompt(POLUTED_BEACH);
  
        if (selectedAction !== null) {
            const action = selectedAction.toLowerCase();
  
        switch (action) {
          case "clean":
            this.allowRecycle = true;
            this.showMessage(CLEAN_BEACH);
          break;;
          case "leave_poluted":
            this.deductPointsAndShowText(LEAVE_POLUTED);
            if (!this.isMessageOn) {
                this.showCleanPopup();
              }
            break;
          default:
            break;
        }
      }
    }
    cleanedBeach() {
        this.updateScore(100);
        this.isBeachClean = true;
        this.allowRecycle = false;
        //TI THELO NA KANEI ?
        if (this.houseLayer.objects.length > 0) {
          this.shouldShowQuiz = !this.shouldShowQuiz;
          this.showQuiz();
        }
    }

    showQuiz() {
        // Iterate over the questions
        let currentQuestionIndex = 0;
        const showNextQuestion = () => {
          const currentQuestion = this.questions[currentQuestionIndex];
    
          // Construct the prompt message with the question and options
          let promptMessage = `${currentQuestion.question}\n`;
          const options = this.shuffle(
            currentQuestion.answers.wrong.concat(currentQuestion.answers.correct)
          );
    
          for (let i = 0; i < options.length; i++) {
            promptMessage += `${options[i]}\n`;
          }
    
          const playerAnswer = window.prompt(promptMessage);
    
          if (playerAnswer !== null) {
            const formattedAnswer = playerAnswer.trim().toLowerCase();
            if (formattedAnswer === currentQuestion.answers.correct.toLowerCase()) {
              this.correctEffect.play();
              window.alert(
                `${CORRECT_ANSWER}\n\n${this.explanations[formattedAnswer]}`
              );
              this.updateScore(50);
              currentQuestionIndex++;
    
              if (currentQuestionIndex < this.questions.length) {
                // Show the next question
                showNextQuestion();
              } else {
                // All questions answered correctly
                this.shouldShowQuiz = false;
                this.showMessage(CONGRATS);
                this.isQuizFinished = true;
              }
            } else {
              // Incorrect answer
              this.wrongEffect.play();
              window.alert(WRONG_ANSWER);
              showNextQuestion();
            }
          }
        };
    
        // Start showing questions
        if (this.shouldShowQuiz) {
          showNextQuestion();
        }
      }
      shuffle(array) {
        let currentIndex = array.length,
          randomIndex;
    
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
    
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
          ];
        }
    
        return array;
      }
    
      showMessage(message) {
        const messageText = this.add.text(50, 100, message, {
          backgroundColor: "#000",
          fixedWidth: 400,
          wordWrap: { width: 400 },
        });
        this.isMessageOn = !this.isMessageOn;
    
        // Disable player input
        this.player.setVelocity(0, 0);
        this.player.body.moves = false;
    
        const dismissMessage = () => {
          messageText.destroy();
          this.input.keyboard.off("keydown-SPACE", dismissMessage);
    
          // Re-enable player input
          this.player.body.moves = true;
          this.isMessageOn = !this.isMessageOn;
        };
    
        this.input.keyboard.on("keydown-SPACE", dismissMessage);
      }
    //FINISH THE GAME
      moveToNextLevel() {
        if (!this.isBeachClean) {
          this.showMessage(MUST_CLEAN_BEACH);
          this.player.setPosition(256, 256);
          return;
        }
        this.scene.start("secondLevel", { points: this.points });
      }
}

    
   
      
