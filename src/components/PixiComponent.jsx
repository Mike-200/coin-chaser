// import * as Pixi from 'pixi.js';
import React, { useRef, useEffect } from "react";
//import { Application } from "pixi.js";
import { collisionDetect } from "../utils/collision";

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

  // something wrong here
  // line 21 keeps causing a crash
  // fixed it by adding square brackets on line 27
  useEffect(() => {
    ref.current.appendChild(gameApp.view);
    gameApp.start();

    return () => {
      gameApp.destroy(true, true);
    };
  }, []);

  gameApp.ticker.add((delta) => gameLoop(delta));

  // did have delta in the brackets below but it was never used
  function gameLoop(delta) {
    //console.log("box-x>>>", boxSpriteClosed.x);
    gameApp.stage.addChild(char1Sprite);
    gameApp.stage.addChild(boxSpriteClosed);
    gameApp.stage.removeChild(coin);

    if (collisionDetect(char1Sprite, boxSpriteClosed)) {
      fireDB
        .ref("rooms/" + room + "/gameProps/boxes/1")
        .get()
        .then((snap) => {
          boxSpriteOpen.position.set(snap.val().x, snap.val().y);
          coin.position.set(snap.val().x, snap.val().y - 50);
        });
      gameApp.stage.removeChild(boxSpriteClosed);
      gameApp.stage.addChild(boxSpriteOpen);
      gameApp.stage.addChild(coin);
    }
  }

  return <div className="game-screen" id="game" ref={ref}></div>;

  //     coin.position.set(randomXBoxClosed, randomYBoxClosed - 50);

  //     char2Sprite.position.set(10, 10);
  //     char1Sprite.position.set(700, 450);
  //   };
};

export default PixiComponent;
