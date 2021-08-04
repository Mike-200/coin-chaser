import { fireDB } from "../App";
import * as Pixi from "pixi.js";

const checkIfOccupiedPosition = (occupiedPositions, posObj) => {
  return !occupiedPositions.every(
    (occPos) => occPos.x !== posObj.x || occPos.y !== posObj.y
  );
};

const randomCharPosition = (occupiedPositions) => {
  let tempObj;
  do {
    let randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;
    let randomYPosition = 50 * Math.floor((Math.random() * 470) / 50) + 25;
    tempObj = { x: randomXPosition, y: randomYPosition };
  } while (checkIfOccupiedPosition(occupiedPositions, tempObj));
  occupiedPositions.push(tempObj);
  return tempObj;
};

const randomBoxPosition = (occupiedPositions) => {
  let tempObj;
  do {
    let randomXPosition = 50 * Math.floor((Math.random() * 710) / 50) + 25;
    let randomYPosition = 50 * Math.floor((Math.random() * 420) / 50) + 75;
    tempObj = { x: randomXPosition, y: randomYPosition };
  } while (checkIfOccupiedPosition(occupiedPositions, tempObj));
  occupiedPositions.push(tempObj);
  return tempObj;
};

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

export function cleanup(host, fireDB, room, setStartGame, callback) {
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

export const updateCharPosition = (
  room,
  user,
  origPos,
  direction,
  speed,
  canvasSize
) => {
  const dbRef = fireDB.ref("rooms/" + room + "/gameProps/characters/" + user);
  if (direction === "ArrowRight") {
    const tempX =
      origPos.x + speed <= canvasSize.x - 25 ? origPos.x + speed : origPos.x;
    dbRef.child("x").set(tempX);
  } else if (direction === "ArrowLeft") {
    const tempX = origPos.x - speed >= 25 ? origPos.x - speed : origPos.x;
    dbRef.child("x").set(tempX);
  } else if (direction === "ArrowUp") {
    const tempY = origPos.y - speed >= 25 ? origPos.y - speed : origPos.y;
    dbRef.child("y").set(tempY);
  } else if (direction === "ArrowDown") {
    const tempY =
      origPos.y + speed <= canvasSize.y - 25 ? origPos.y + speed : origPos.y;
    dbRef.child("y").set(tempY);
  }
};

export function initScores(players, room) {
  const tempScores = {};
  Object.keys(players).forEach((player) => {
    tempScores[player] = 0;
  });
  fireDB.ref("rooms/" + room + "/gameProps/scores").set(tempScores);
}

export function startListeningIfRoomDissapears(room, setGameEvent, logoutFn) {
  fireDB.ref("rooms/" + room + "/startGame").on("value", (snap) => {
    if (!snap.val()) {
      setGameEvent({
        message: "Host Disconnected! Logging out in 5",
        error: true,
      });
      setTimeout(() => {
        setGameEvent({
          message: "Host Disconnected! Logging out in 4",
          error: true,
        });
        clearTimeout();
        setTimeout(() => {
          setGameEvent({
            message: "Host Disconnected! Logging out in 3",
            error: true,
          });
          setTimeout(() => {
            setGameEvent({
              message: "Host Disconnected! Logging out in 2",
              error: true,
            });
            setTimeout(() => {
              setGameEvent({
                message: "Host Disconnected! Logging out in 1",
                error: true,
              });
              setTimeout(() => {
                logoutFn();
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  });
}

export function startGenericGameListeners(
  room,
  setCharacters,
  setBoxes,
  setScores
) {
  fireDB.ref("rooms/" + room + "/gameProps/characters/").on("value", (snap) => {
    if (snap.exists()) {
      setCharacters(snap.val());
    }
  });

  fireDB.ref("rooms/" + room + "/gameProps/boxes").on("value", (snap) => {
    if (snap.exists()) {
      setBoxes(snap.val());
    }
  });

  fireDB.ref("rooms/" + room + "/gameProps/scores").on("value", (snap) => {
    if (snap.exists()) {
      setScores(snap.val());
    }
  });
}

export function pixiSpriteBuilder(asset, startPos) {
  const tempSprite = Pixi.Sprite.from(asset);
  tempSprite.anchor.set(0.5, 0.5);
  tempSprite.position.set(startPos.x, startPos.y);
  return tempSprite;
}

export function pixiBoxContentSpriteBuilder(asset, startPos) {
  const newPos = { ...startPos };
  newPos.y -= 50;
  return pixiSpriteBuilder(asset, newPos);
}

export function checkIfSpriteUidIsBox(spriteUid) {
  return spriteUid.match(/^box[0-9]*$/);
}

export function checkIfSpriteUidIsBoxContent(spriteUid) {
  return spriteUid.match(/box[0-9]*contents/);
}
