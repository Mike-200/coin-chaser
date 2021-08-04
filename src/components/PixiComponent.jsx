import React, { useRef, useState, useEffect } from "react";

const PixiComponent = ({ gameApp, sprites, pixiRatio, spritesRelativePos }) => {
  const ref = useRef("pixi_canvas");

  useEffect(() => {
    ref.current.appendChild(gameApp.view);
    gameApp.start();

    return () => {
      gameApp.destroy(true, true);
    };
  }, []);

  useEffect(() => {
    Object.keys(spritesRelativePos).forEach((spriteUid) => {
      console.log(spriteUid, spritesRelativePos[spriteUid]);
      spritesRelativePos[spriteUid].position.set(
        spritesRelativePos[spriteUid].origPos.x * pixiRatio,
        spritesRelativePos[spriteUid].origPos.y * pixiRatio
      );

      spritesRelativePos[spriteUid].scale.set(
        sprites[spriteUid].scale.x * pixiRatio,
        pixiRatio
      );
    });
    gameApp.stage.removeChildren();
    Object.keys(spritesRelativePos).forEach((spriteUid) => {
      gameApp.stage.addChild(spritesRelativePos[spriteUid]);
    });
  }, [pixiRatio, sprites, gameApp]);

  return <div id="pixi_canvas" ref={ref}></div>;
};

export default PixiComponent;
