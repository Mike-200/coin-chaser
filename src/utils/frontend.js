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
  room
) => {
  gameApp.stage.removeChildren();
  occupiedPositions = [];
  char1Sprite.position.set(randomCharPosition().x, randomCharPosition().y);
  writeCharPosition(fireDB, room, char1Sprite);

  boxSpriteClosed.position.set(randomBoxPosition().x, randomBoxPosition().y);
  writeBoxPosition(fireDB, room, boxSpriteClosed);

  // gameApp.stage.addChild(char1Sprite);
  // gameApp.stage.addChild(boxSpriteClosed);
};
