// weightCategories.js

// Gender and Division Categories
const genderAndDivisionCategories = [
  "Beginner - Male",
  "Beginner - Female",
  "Official - Male",
  "Official - Female",
];

// Arm and Weight Categories
const armAndWeightCategories = {
  Beginner: {
    Male: {
      Right: ["+86Kg", "-86Kg"],
      Left: ["+86Kg", "-86Kg"],
    },
    Female: {
      Right: ["-70Kg", "+70Kg"],
      Left: ["-70Kg", "+70Kg"],
    },
  },
  Official: {
    Male: {
      Right: ["-70Kg", "-78Kg", "-86Kg", "-95Kg", "+95Kg", "Overall"],
      Left: ["-70Kg", "-78Kg", "-86Kg", "-95Kg", "+95Kg", "Overall"],
    },
    Female: {
      Right: ["-70Kg", "+70Kg"],
      Left: ["-70Kg", "+70Kg"],
    },
  },
};

export { genderAndDivisionCategories, armAndWeightCategories };
