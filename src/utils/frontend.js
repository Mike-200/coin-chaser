import { writeBoxPosition, writeCharPosition } from "./firebase";

let occupiedPositions = [];

// export const startNewScreenOld = (
//   gameApp,
//   char1Sprite,
//   boxSpriteClosed,
//   fireDB,
//   room,
//   numberOfBoxes,
//   setNumberOfBoxes
// ) => {
//   const maxNumberOfBoxes = 10;
//   // console.log("Frontend.boxes.before.change>>>", boxes);

//   //gameApp.stage.removeChildren();

//   occupiedPositions = [];

//   const randCharCoOrds = randomCharPosition();
//   char1Sprite.position.set(randCharCoOrds.x, randCharCoOrds.y);
//   writeCharPosition(fireDB, room, char1Sprite);

//   for (let i = 1; i <= numberOfBoxes; i++) {
//     const randBoxCoOrds = randomBoxPosition();
//     boxSpriteClosed.position.set(randBoxCoOrds.x, randBoxCoOrds.y);
//     writeBoxPosition(fireDB, room, boxSpriteClosed, i);
//   }

//   if (numberOfBoxes <= maxNumberOfBoxes) {
//     setNumberOfBoxes((currValue) => {
//       return currValue + 1;
//     });
//     console.log("Frontend.boxes.after.change>>>", numberOfBoxes);
//   }

//   // gameApp.stage.addChild(char1Sprite);
//   // gameApp.stage.addChild(boxSpriteClosed);
// };
