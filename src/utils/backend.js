import { useState } from "react";

import { fireDB } from "../App";

const checkIfOccupiedPosition = (occupiedPositions, posObj) => {
  return !occupiedPositions.every(
    (occPos) => occPos.x !== posObj.x || occPos.y !== posObj.y
  );
};

export const randomCharPosition = (occupiedPositions) => {
  let tempObj;
  do {
    let randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;
    let randomYPosition = 50 * Math.floor((Math.random() * 470) / 50) + 25;
    tempObj = { x: randomXPosition, y: randomYPosition };
  } while (checkIfOccupiedPosition(occupiedPositions, tempObj));
  occupiedPositions.push(tempObj);
  return tempObj;
};

export const randomBoxPosition = (occupiedPositions) => {
  let tempObj;
  do {
    let randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;
    let randomYPosition = 50 * Math.floor((Math.random() * 420) / 50) + 75;
    tempObj = { x: randomXPosition, y: randomYPosition };
  } while (checkIfOccupiedPosition(occupiedPositions, tempObj));
  occupiedPositions.push(tempObj);
  return tempObj;
};

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
  callback
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
  if (callback) {
    callback();
  }
}

export function getAvatar(id, characters) {
  return characters[Object.keys(characters)[id]].default;
}
