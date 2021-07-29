import { updateBoxPosition } from './firebase';

export const randomCharPosition = () => {
  let randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;

  let randomYPosition = 50 * Math.floor((Math.random() * 470) / 50) + 25;

  return { x: randomXPosition, y: randomYPosition };
};

export const randomBoxPosition = () => {
  let randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;

  let randomYPosition = 50 * Math.floor((Math.random() * 420) / 50) + 75;

  return { x: randomXPosition, y: randomYPosition };
};

export const startNewScreen = (
  gameApp,
  char1Sprite,
  boxSpriteClosed,
  fireDB,
  room
) => {
  gameApp.stage.removeChildren();
  char1Sprite.position.set(randomCharPosition().x, randomCharPosition().y);
  boxSpriteClosed.position.set(randomCharPosition().x, randomCharPosition().y);

  updateBoxPosition(fireDB, room, boxSpriteClosed);
  // console.log(room);
  // console.log(boxSpriteClosed.x);

  gameApp.stage.addChild(char1Sprite);
  gameApp.stage.addChild(boxSpriteClosed);
};
