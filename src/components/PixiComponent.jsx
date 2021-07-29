// import * as Pixi from 'pixi.js';
import React, { useRef, useEffect } from "react";
import { collisionDetect } from "../utils/collision";
import { readBoxPosition } from "../utils/firebase";

const PixiComponent = ({
  gameApp,
  char1Sprite,
  boxSpriteClosed,
  boxSpriteOpen,
  coin,
  fireDB,
  room,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.appendChild(gameApp.view);
    gameApp.start();

    return () => {
      gameApp.destroy(true, true);
    };
  });

  gameApp.ticker.add((delta) => gameLoop(delta));

  function gameLoop(delta) {
    if (
      collisionDetect(char1Sprite, boxSpriteClosed)
      //  || collisionDetect(char2Sprite, boxSpriteClosed)
    ) {
      //if there's a collision.. increment score

      fireDB
        .ref("rooms/" + room + "/gameProps/boxes/box1")
        .get()
        .then((snap) => {
          boxSpriteOpen.position.set(snap.val().x, snap.val().y);
          coin.position.set(snap.val().x, snap.val().y - 50);
        });
      gameApp.stage.removeChild(boxSpriteClosed);
      gameApp.stage.addChild(boxSpriteOpen); // to where?
      gameApp.stage.addChild(coin);
    }

    // else {
    //   //if there's no collision, show different message
    //   console.log("no collision");
    //   // gameApp.stage.removeChild(coin);
    //   // gameApp.stage.addChild(boxSpriteClosed);
    // }
    // if (collisionDetect(char1Sprite, char2Sprite)) {
    // }
  }

  return <div className="game-screen" id="game" ref={ref}></div>;

  //     coin.position.set(randomXBoxClosed, randomYBoxClosed - 50);

  //     char2Sprite.position.set(10, 10);
  //     char1Sprite.position.set(700, 450);
  //   };
};

export default PixiComponent;
