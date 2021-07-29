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

export const startNewScreen = (gameApp) => {
  // gameApp.stage.removeChildren();
};
