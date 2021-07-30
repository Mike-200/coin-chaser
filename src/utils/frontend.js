import { writeBoxPosition, writeCharPosition } from "./firebase";

let occupiedPositions = [];
let randomXPosition = 0;
let randomYPosition = 0;
let tempObj = {};

export const randomCharPosition = () => {
  do {
    let randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;
    let randomYPosition = 50 * Math.floor((Math.random() * 470) / 50) + 25;
    tempObj = { x: randomXPosition, y: randomYPosition };
  } while (occupiedPositions.includes(tempObj));
  occupiedPositions.push(tempObj);
  return tempObj;
};

export const randomBoxPosition = () => {
  do {
    randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;
    randomYPosition = 50 * Math.floor((Math.random() * 420) / 50) + 75;
    tempObj = { x: randomXPosition, y: randomYPosition };
  } while (occupiedPositions.includes(tempObj));
  occupiedPositions.push(tempObj);
  return tempObj;
};

export const startNewScreen = (
  gameApp,
  char1Sprite,
  boxSpriteClosed,
  fireDB,
  room,
  numberOfBoxes,
  setNumberOfBoxes
) => {
  const maxNumberOfBoxes = 6;
  // console.log("Frontend.boxes.before.change>>>", boxes);

  //gameApp.stage.removeChildren();

  occupiedPositions = [];

  const randCharCoOrds = randomCharPosition();
  char1Sprite.position.set(randCharCoOrds.x, randCharCoOrds.y);
  writeCharPosition(fireDB, room, char1Sprite);

  for (let i = 1; i <= numberOfBoxes; i++) {
    const randBoxCoOrds = randomBoxPosition();
    boxSpriteClosed.position.set(randBoxCoOrds.x, randBoxCoOrds.y);
    writeBoxPosition(fireDB, room, boxSpriteClosed, i);
  }

  if (numberOfBoxes < maxNumberOfBoxes) {
    setNumberOfBoxes((currValue) => {
      return currValue + 1;
    });
    console.log("Frontend.boxes.after.change>>>", numberOfBoxes);
  }

  // gameApp.stage.addChild(char1Sprite);
  // gameApp.stage.addChild(boxSpriteClosed);
};
