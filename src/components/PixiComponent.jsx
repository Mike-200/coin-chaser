
import * as Pixi from 'pixi.js';
import React, { useRef, useEffect } from 'react';
import ninja from '../assets/ninja-char.svg';
import ghost from '../assets/ghost-char.svg';
import { moveCharacter } from '../utils/utils-BE';
import closedBox from '../assets/box-closed.svg';
import openBox from '../assets/opened-box.svg';
import crownCoin from '../assets/coin.svg';


const PixiComponent = () => {
    const gameApp = new Pixi.Application({
        width: 760,
        height: 520,
        backgroundColor: 0x8fc0a9,
        antialias: true,
        resolution: window.devicePixelRatio,
        autoDensity: true,
      });

       // Create Sprites & add to stage
const char1Sprite = Pixi.Sprite.from(ninja);
char1Sprite.position.set(700, 450);
// char1Sprite.anchor.set(0.5, 0.5);

const char2Sprite = Pixi.Sprite.from(ghost);
char2Sprite.position.set(10, 10);
// char2Sprite.anchor.set(0.5, 0.5);

gameApp.stage.addChild(char1Sprite);
gameApp.stage.addChild(char2Sprite);

// Creating boxes
const boxSpriteClosed = Pixi.Sprite.from(closedBox);
boxSpriteClosed.position.set(300, 300);
// boxSpriteClosed.anchor.set(0.5, 0.5);

gameApp.stage.addChild(boxSpriteClosed);

const boxSpriteOpen = Pixi.Sprite.from(openBox);
boxSpriteOpen.position.set(300, 300);
// boxSpriteOpen.anchor.set(0.5, 0.5);

// Creating coins
const coin = Pixi.Sprite.from(crownCoin);
coin.position.set(300, 250);
// coin.anchor.set(0.5, 0.5);

// Event Listeners for keypress movements
document.addEventListener('keydown', function (e) {
  e.preventDefault();
  if (e.key === 'ArrowRight') moveCharacter(char1Sprite, '+x');
  if (e.key === 'ArrowLeft') moveCharacter(char1Sprite, '-x');
  if (e.key === 'ArrowDown') moveCharacter(char1Sprite, '+y');
  if (e.key === 'ArrowUp') moveCharacter(char1Sprite, '-y');
});

document.addEventListener('keydown', function (e) {
  if (e.keyCode === 68) moveCharacter(char2Sprite, '+x');
  if (e.keyCode === 65) moveCharacter(char2Sprite, '-x');
  if (e.keyCode === 83) moveCharacter(char2Sprite, '+y');
  if (e.keyCode === 87) moveCharacter(char2Sprite, '-y');
});

// Collision detection function copied from a repo I found on learning Pixi
function collisionDetect(char1, char2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  char1.centerX = char1.x + char1.width / 2;
  char1.centerY = char1.y + char1.height / 2;
  char2.centerX = char2.x + char2.width / 2;
  char2.centerY = char2.y + char2.height / 2;

  //Find the half-widths and half-heights of each sprite
  char1.halfWidth = char1.width / 2;
  char1.halfHeight = char1.height / 2;
  char2.halfWidth = char2.width / 2;
  char2.halfHeight = char2.height / 2;

  //Calculate the distance vector between the sprites
  vx = char1.centerX - char2.centerX;
  vy = char1.centerY - char2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = char1.halfWidth + char2.halfWidth;
  combinedHalfHeights = char1.halfHeight + char2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

// let message = new Text('No collisions here...');
// message.position.set(40, 40);
// gameApp.stage.addChild(message);

gameApp.ticker.add((delta) => gameLoop(delta));

function gameLoop(delta) {
  if (
    collisionDetect(char1Sprite, boxSpriteClosed) ||
    collisionDetect(char2Sprite, boxSpriteClosed)
  ) {
    //if there's a collision.. increment score
    gameApp.stage.addChild(boxSpriteOpen);
    gameApp.stage.addChild(coin);
    gameApp.stage.removeChild(boxSpriteClosed);
  } else {
    //if there's no collision, show different message
    gameApp.stage.removeChild(coin);
    gameApp.stage.addChild(boxSpriteClosed);
  }

  if (collisionDetect(char1Sprite, char2Sprite)) {
  }
}

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


      const ref = useRef(null);

  useEffect(() => {
    ref.current.appendChild(gameApp.view);
    gameApp.start();

    return () => {
      gameApp.destroy(true, true);
    };
  });
    return (
        <div className="game-screen" id="game" ref={ref}></div>
    );
};


export default PixiComponent;

