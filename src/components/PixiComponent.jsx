// import * as Pixi from 'pixi.js';
import React, { useRef, useEffect } from "react";
//import { Application } from "pixi.js";

const PixiComponent = ({ gameApp, sprites }) => {
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
    Object.keys(sprites).forEach((sprite) => {
      gameApp.stage.addChild(sprites[sprite]);
    });
  }, [sprites, gameApp]);

  return <div className="game-screen" id="pixi_canvas" ref={ref}></div>;
};

export default PixiComponent;
