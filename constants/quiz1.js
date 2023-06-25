export const QUESTIONS = [
  {
    question: "What is a renewable energy source?",
    answers: {
      correct: "Solar",
      wrong: ["Gas", "Petrol"],
    },
  },
  {
    question: "Which energy source produces the MOST greenhouse gas emissions?",
    answers: {
      correct: "Coal",
      wrong: ["Solar", "Wind"],
    },
  },
  {
    question: "What is the primary source of energy for nuclear power plants?",
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

export const EXPLANATIONS = {
  solar:
    "Solar energy is derived from the sun and is considered a renewable energy source because it is constantly replenished.",
  coal: "Coal is a fossil fuel that produces the most greenhouse gas emissions when burned for energy.",
  uranium:
    "Uranium is the primary source of fuel for nuclear power plants, where nuclear reactions produce heat to generate electricity.",
  renewable:
    "The main advantage of wind energy is that it is a renewable resource, meaning it can be continuously replenished.",
  geothermal:
    "Geothermal energy is obtained from the heat stored within the Earth's interior, which can be harnessed for power generation.",
  photovoltaic:
    "Photovoltaic is the process of converting sunlight directly into electricity using solar panels or cells.",
};
