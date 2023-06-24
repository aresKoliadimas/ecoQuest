import {
  ROCK_UNSUSTAINABLE,
  CONCRETE_UNSUSTAINABLE,
  BUILD_HOUSE,
  CUT_TREES,
  CONGRATS,
  WRONG_ANSWER,
} from "../constants/messages.js";

export default class FirstLevel extends Phaser.Scene {
  cursors = null;
  spacebar = null;
  isHouseBuilt = false;
  allowBuild = false;
  noOfCutTrees = 0;
  player = null;
  points = 0;
  pointsText = null;
  nextLevelPoints = 100;
  houseLayer = null;
  house = null;
  isMessageOn = false;
  shouldShowQuiz = false;
  isQuizFinished = false;

  // Energy-related questions
  questions = [
    {
      question: "What is a renewable energy source?",
      answers: {
        correct: "Solar",
        wrong: ["Gas", "Petrol"],
      },
    },
    {
      question:
        "Which energy source produces the MOST greenhouse gas emissions?",
      answers: {
        correct: "Coal",
        wrong: ["Solar", "Wind"],
      },
    },
    {
      question:
        "What is the primary source of energy for nuclear power plants?",
      answers: {
        correct: "Uranium",
        wrong: ["Coal", "Natural gas"],
      },
    },
    {
      question: "What is the main advantage of wind energy?",
      answers: {
        correct: "Renewable",
        wrong: ["Polluting", "Expensive"],
      },
    },
    {
      question:
        "Which type of energy is obtained from the heat of the Earth's interior?",
      answers: {
        correct: "Geothermal",
        wrong: ["Solar", "Hydroelectric"],
      },
    },
    {
      question:
        "What is the process of converting sunlight into electricity called?",
      answers: {
        correct: "Photovoltaic",
        wrong: ["Combustion", "Fission"],
      },
    },
  ];

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
    firstLevelTilemap.createLayer("grass", firstLevelTileset, 0, 0);
    firstLevelTilemap.createLayer("ground", firstLevelTileset, 0, 0);

    //Create the label group and add label objects
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

    this.physics.add.collider(
      this.player,
      trees,
      this.removeTree,
      undefined,
      this
    );
    this.physics.add.collider(
      this.player,
      this.house,
      undefined,
      undefined,
      this
    );
    this.physics.add.collider(
      this.player,
      label,
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

  update() {
    this.player.anims.play("walk", true);
    this.move();

    if (this.player.x > 400 && this.player.y > 355 && this.player.y < 430) {
      this.moveToNextLevel();
    }
  }

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
    this.noOfCutTrees++;

    if (this.noOfCutTrees >= 10) {
      this.buildHouseWithWood();
    }
  }

  showBuildPopup() {
    if (this.isHouseBuilt) {
      return;
    }

    const selectedMaterial = window.prompt(BUILD_HOUSE);

    if (selectedMaterial !== null) {
      const material = selectedMaterial.toLowerCase();

      switch (material) {
        case "wood":
          this.allowBuild = true;
          this.showMessage(CUT_TREES);
          break;
        case "rock":
          this.showMessage(ROCK_UNSUSTAINABLE);
          if (!this.isMessageOn) {
            this.showBuildPopup();
          }
          break;
        case "concrete":
          this.showMessage(CONCRETE_UNSUSTAINABLE);
          if (!this.isMessageOn) {
            this.showBuildPopup();
          }
          break;
        default:
          break;
      }
    }
  }

  buildHouseWithWood() {
    this.updateScore(100);
    this.isHouseBuilt = true;
    this.allowBuild = false;
    if (this.houseLayer.objects.length > 0) {
      const houseObject = this.houseLayer.objects[0];
      const houseSprite = this.house.get(
        houseObject.x + 64,
        houseObject.y - 64,
        "house"
      );
      houseSprite.setVisible(true);

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
          window.alert("Yes! That's the correct answer.\n\n +50 points");
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
      this.player.clearTint();
      this.player.body.moves = true;
      this.isMessageOn = !this.isMessageOn;
    };

    this.input.keyboard.on("keydown-SPACE", dismissMessage);
  }

  moveToNextLevel() {
    if (!this.isHouseBuilt) {
      this.showMessage(
        "You must built the house. Go to the label...\n\nPress SPACE to continue"
      );
      this.player.setPosition(256, 256);
      return;
    }
  }
}
