import { useState } from "react";

import { fireDB } from "../App";

let randomXPosition = 0;
let randomYPosition = 0;
let tempObj = {};

export const randomCharPosition = (occupiedPositions) => {
  do {
    let randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;
    let randomYPosition = 50 * Math.floor((Math.random() * 470) / 50) + 25;
    tempObj = { x: randomXPosition, y: randomYPosition };
  } while (occupiedPositions.includes(tempObj));
  occupiedPositions.push(tempObj);
  return tempObj;
};

export const randomBoxPosition = (occupiedPositions) => {
  do {
    randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;
    randomYPosition = 50 * Math.floor((Math.random() * 420) / 50) + 75;
    tempObj = { x: randomXPosition, y: randomYPosition };
  } while (occupiedPositions.includes(tempObj));
  occupiedPositions.push(tempObj);
  return tempObj;
};

// export function coordsToIndex(coords, base) {
//   let encodingBase = 10;
//   while (encodingBase < base) {
//     encodingBase = encodingBase * 10;
//   }
//   const yCoords = Math.floor(coords / encodingBase);
//   return yCoords * base + coords - yCoords * encodingBase;
// }

// export function indexToCoords(index, base) {
//   let encodingBase = 10;
//   while (encodingBase < base) {
//     encodingBase = encodingBase * 10;
//   }
//   const yCoords = Math.floor(index / base);
//   return yCoords * encodingBase + index - yCoords * base;
// }

// export function coordsToXY(coords, base) {
//   let encodingBase = 10;
//   while (encodingBase < base) {
//     encodingBase = encodingBase * 10;
//   }
//   const yCoords = Math.floor(coords / encodingBase);
//   return { x: coords - yCoords * encodingBase, y: yCoords };
// }

// export function XYToCoords(xy, base) {
//   let encodingBase = 10;
//   while (encodingBase < base) {
//     encodingBase = encodingBase * 10;
//   }
//   return xy.y * encodingBase + xy.x;
// }

// export function XYToIndex(xy, base) {
//   return xy.y * base + xy.x;
// }

// export function indexToXY(index, base) {
//   const y = Math.floor(index / base);
//   return { x: index - y * base, y };
// }

function isFunction(functionToCheck) {
  return (
    (functionToCheck &&
      {}.toString.call(functionToCheck) === "[object Function]") ||
    (functionToCheck &&
      {}.toString.call(functionToCheck) === "[object AsyncFunction]")
  );
}

export function useStickyState(key, initialState) {
  const storedState = localStorage.getItem(key);
  const [tempState, setTempState] = useState(storedState ?? initialState);
  function setStickyState(newState) {
    if (isFunction(newState)) {
      setTempState((previousState) => {
        const tempNewState = newState(previousState);
        if (tempNewState) {
          localStorage.setItem(key, tempNewState);
        } else {
          localStorage.removeItem(key);
        }
        return tempNewState;
      });
    } else {
      if (newState) {
        localStorage.setItem(key, newState);
      } else localStorage.removeItem(key, newState);
      setTempState(newState);
    }
  }
  return [tempState, setStickyState];
}

export function startNewScreen(room, user, players, numberOfBoxes) {
  const occupiedPositions = [];
  Object.keys(players).forEach((player) => {
    fireDB
      .ref("rooms/" + user + "/gameProps/characters/" + player)
      .set(randomCharPosition(occupiedPositions));
  });

  for (let i = 1; i <= numberOfBoxes; i++) {
    fireDB
      .ref("rooms/" + room + "/gameProps/boxes")
      .child(`box${i}`)
      .set(randomBoxPosition(occupiedPositions));
  }
  fireDB
    .ref("rooms/" + room + "/gameProps/boxes")
    .child(`box1`)
    .child("contains")
    .set("coin");
  if (numberOfBoxes > 2) {
    fireDB
      .ref("rooms/" + room + "/gameProps/boxes")
      .child(`box3`)
      .child("contains")
      .set("slime");
  }
  if (numberOfBoxes > 3) {
    fireDB
      .ref("rooms/" + room + "/gameProps/boxes")
      .child(`box4`)
      .child("contains")
      .set("rocket");
  }
}

export function cleanup(
  host,
  fireDB,
  room,
  setStartGame,
  setInGame,
  setPlayers,
  setRoom
) {
  // client/host listening to players moves
  fireDB.ref("rooms/" + room + "/gameProps/characters").off();
  // host listening to knocks
  fireDB.ref("rooms/" + room + "/knock").off();
  // client/host waiting to start game
  fireDB.ref("rooms/" + room + "/startGame").off();
  // if you are the client waiting to be let in
  fireDB.ref("rooms/" + room + "/players").off();
  if (host) {
    fireDB.ref("rooms/" + room).remove();
  }
  setStartGame(false);
  setInGame(false);
  setPlayers({});
  setRoom();
}

export function getAvatar(id, characters) {
  return characters[Object.keys(characters)[id]].default;
}
