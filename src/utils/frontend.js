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
  boxes,
  setBoxes
) => {
  gameApp.stage.removeChildren();
  occupiedPositions = [];

  const randCharCoOrds = randomCharPosition();
  char1Sprite.position.set(randCharCoOrds.x, randCharCoOrds.y);
  writeCharPosition(fireDB, room, char1Sprite);

  for (let i = 1; i <= boxes; i++) {
    const randBoxCoOrds = randomBoxPosition();
    boxSpriteClosed.position.set(randBoxCoOrds.x, randBoxCoOrds.y);

    writeBoxPosition(fireDB, room, boxSpriteClosed, i);
    //setBoxes();
    console.log("boxes>>>", boxes);
  }

  // gameApp.stage.addChild(char1Sprite);
  // gameApp.stage.addChild(boxSpriteClosed);
  setBoxes((currValue) => {
    return currValue + 1;
  });
};
