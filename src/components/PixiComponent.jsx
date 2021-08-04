import React, { useRef, useEffect, useContext } from "react";
import { SpritesRelativePosContext } from "../contexts/SpritesRelativePos";

const PixiComponent = ({ gameApp, sprites, pixiRatio, resized }) => {
  const { spritesRelativePos } = useContext(SpritesRelativePosContext);

  const ref = useRef("pixi_canvas");

  useEffect(() => {
    ref.current.appendChild(gameApp.view);
    gameApp.start();

    return () => {
      gameApp.destroy(true, true);
    };
  }, []);

  useEffect(() => {
    gameApp.stage.removeChildren();
    Object.keys(spritesRelativePos).forEach((spriteUid) => {
      gameApp.stage.addChild(spritesRelativePos[spriteUid]);
    });
  }, [spritesRelativePos]);

  useEffect(() => {
    console.log("pixiRatio has changed");
    Object.keys(spritesRelativePos).forEach((spriteUid) => {
      spritesRelativePos[spriteUid].position.set(
        spritesRelativePos[spriteUid].origPos.x * pixiRatio,
        spritesRelativePos[spriteUid].origPos.y * pixiRatio
      );
      if (spritesRelativePos[spriteUid].scale.x < 0) {
        spritesRelativePos[spriteUid].scale.x = -pixiRatio;
      } else spritesRelativePos[spriteUid].scale.x = pixiRatio;
      spritesRelativePos[spriteUid].scale.y = pixiRatio;
    });
  }, [resized]);

  return <div id="pixi_canvas" ref={ref}></div>;
};

export default PixiComponent;
