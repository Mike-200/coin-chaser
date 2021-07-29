// import * as Pixi from 'pixi.js';
import React, { useRef, useEffect } from 'react';
// import { collisionDetect } from '../utils/pixi';

const PixiComponent = ({
  gameApp,
  char1Sprite,
  boxSpriteClosed,
  boxSpriteOpen,
  coin,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.appendChild(gameApp.view);
    gameApp.start();

    return () => {
      gameApp.destroy(true, true);
    };
  });

  gameApp.stage.addChild(char1Sprite);
  gameApp.stage.addChild(boxSpriteClosed);

  return <div className="game-screen" id="game" ref={ref}></div>;

  // gameApp.stage.addChild(char2Sprite);

  // gameApp.ticker.add((delta) => gameLoop(delta));

  // function gameLoop(delta) {
  //   if (
  //     collisionDetect(char1Sprite, boxSpriteClosed) ||
  //     collisionDetect(char2Sprite, boxSpriteClosed)
  //   ) {
  //     //if there's a collision.. increment score
  //     gameApp.stage.addChild(boxSpriteOpen);
  //     gameApp.stage.addChild(coin);
  //     gameApp.stage.removeChild(boxSpriteClosed);
  //   } else {
  //     //if there's no collision, show different message
  //     gameApp.stage.removeChild(coin);
  //     gameApp.stage.addChild(boxSpriteClosed);
  //   }

  //   if (collisionDetect(char1Sprite, char2Sprite)) {
  //   }
  // }

  // const startNewGame = () => {
  //     // console.log('start new game clicked');
  //     // console.log(char1Sprite.getGlobalPosition());

  //     // let randomXSprite1 = Math.floor(Math.random() * 600);
  //     // let randomYSprite1 = Math.floor(Math.random() * 500);

  //     // let randomXSprite2 = Math.floor(Math.random() * 600);
  //     // let randomYSprite2 = Math.floor(Math.random() * 500);

  //     let randomXBoxClosed = Math.floor(Math.random() * (620 - 100 + 1)) + 100;
  //     let randomYBoxClosed = Math.floor(Math.random() * (370 - 100 + 1)) + 100;

  //     // if (randomXSprite1 && randomYSprite1 === randomXSprite2 && randomYSprite2) {
  //     //   randomXSprite1 = Math.floor(Math.random() * 600);
  //     //   randomYSprite1 = Math.floor(Math.random() * 500);
  //     // }

  //     // On the x axis we have 0 - 760 co-ords
  //     // On the y axis we have 0 - 520 co-ords

  //     boxSpriteClosed.position.set(randomXBoxClosed, randomYBoxClosed);
  //     boxSpriteOpen.position.set(randomXBoxClosed, randomYBoxClosed);
  //     coin.position.set(randomXBoxClosed, randomYBoxClosed - 50);

  //     char2Sprite.position.set(10, 10);
  //     char1Sprite.position.set(700, 450);
  //     // gameApp.stage.addChild(char1Sprite);
  //   };

  //   const startNewScreen = () => {
  //     gameApp.stage.removeChildren();
  //   };

  //   const moveCharacter = (character, direction) => {
  //     const amountOfMovement = 20;
  //     if (direction === '+x') {
  //       character.x += amountOfMovement;
  //     } else if (direction === '-x') {
  //       character.x -= amountOfMovement;
  //     } else if (direction === '+y') {
  //       character.y += amountOfMovement;
  //     } else if (direction === '-y') {
  //       character.y -= amountOfMovement;
  //     }
  //     // now update firebase with the new co-ordinates
  //   };
};

export default PixiComponent;
