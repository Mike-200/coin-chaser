import * as Pixi from "pixi.js";
import React, { useRef, useEffect } from "react";
import closedBox from "../assets/box-closed.svg";
import openBox from "../assets/opened-box.svg";
import crownCoin from "../assets/coin.svg";
// import { collisionDetect } from '../utils/pixi';

const PixiComponent = ({ sprites,gameCanvasSize }) => {
  // const char2Sprite = Pixi.Sprite.from(ghost);
  // char2Sprite.position.set(spriteState.char2.x, spriteState.char2.y);
  // char2Sprite.anchor.set(0.5, 0.5);

  // Creating boxes
  const boxSpriteClosed = Pixi.Sprite.from(closedBox);
  boxSpriteClosed.position.set(300, 300);
  // boxSpriteClosed.anchor.set(0.5, 0.5);

  const boxSpriteOpen = Pixi.Sprite.from(openBox);
  boxSpriteOpen.position.set(300, 300);
  // boxSpriteOpen.anchor.set(0.5, 0.5);

  // Creating coins
  const coin = Pixi.Sprite.from(crownCoin);
  coin.position.set(300, 250);
  // coin.anchor.set(0.5, 0.5);

  const gameApp = new Pixi.Application({
    width: gameCanvasSize.width,
    height: gameCanvasSize.height,
    backgroundColor: 0x8fc0a9,
    antialias: true,
    resolution: window.devicePixelRatio,
    autoDensity: true,
  });

  Object.keys(sprites).forEach((sprite) => {
    gameApp.stage.addChild(sprites[sprite]);
  });
  // gameApp.stage.addChild(char1Sprite);
  // gameApp.stage.addChild(char2Sprite);

  // gameApp.stage.addChild(boxSpriteClosed);

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

  const ref = useRef("pixi_canvas");

  useEffect(() => {
    ref.current.appendChild(gameApp.view);
    gameApp.start();

    return () => {
      gameApp.destroy(true, true);
    };
  });
  return <div className="game-screen" id="game" ref={ref}></div>;
};

export default PixiComponent;
