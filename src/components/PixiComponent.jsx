import * as Pixi from "pixi.js";
import React, { useState, useRef, useEffect } from "react";


const gameApp =
  new Pixi.Application({
    width: 760,
    height: 520,
    backgroundColor: 0x8fc0a9,
    antialias: true,
    resolution: window.devicePixelRatio,
    autoDensity: true,
  })

const PixiComponent = ({ sprites, gameCanvasSize }) => {
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

  return <div className="game-screen" id="game" ref={ref}></div>;
};

export default PixiComponent;
