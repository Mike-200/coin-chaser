// Firebase Auth
import { fireDB } from "../App";

export function login(auth) {
  auth.signInAnonymously();
}
export function logout(auth) {
  auth.signOut();
}

export function acceptPlayer(room, uid, username, avatar) {
  fireDB.ref("rooms/" + room + "/players/" + uid).set({ username, avatar });
}

export function removeKnockPlayer(room, uid) {
  fireDB.ref("rooms/" + room + "/knock/" + uid).remove();
}

// export function changeBallPos(fireDB, room, uid, toWhere) {
//   fireDB.ref("rooms/" + room + "/gameProps/characters/" + uid).set(toWhere);
// }

export function authenticationListener(auth, setUser) {
  auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      setUser(authUser.uid);
    } else {
      setUser(null);
    }
  });
}

export function startListeningToNewPlayers(room, setPlayers) {
  fireDB
    .ref("rooms/" + room + "/players")
    .on("value", (snap) => setPlayers(snap.val()));
}

export function stopListeningToNewPlayers(room) {
  fireDB.ref("rooms/" + room + "/players").off("value");
}

export function startGameHost(room) {
  fireDB.ref("rooms/" + room + "/startGame").set(true);
  fireDB.ref("rooms/" + room + "/knock").off();
}

export function startListeningToStartGame(room, setStartGame, setPlayers) {
  fireDB.ref("rooms/" + room + "/startGame").on("value", (snap) => {
    if (snap.val()) {
      fireDB
        .ref("rooms/" + room + "/players")
        .get()
        .then((snap) => {
          setPlayers(snap.val());
        });
      fireDB.ref("rooms/" + room + "/players").off();
      fireDB.ref("rooms/" + room + "/startGame").off();
      setStartGame(true);
    }
  });
}

// export function listenToPlayersPositions(
//   fireDB,
//   room,
//   players,
//   gameBoardCoordsRelationalFunc,
//   gameBoardCoordsInverseRelationalFunc,
//   boardWidth,
//   setGameBoard
// ) {
//   fireDB
//     .ref('rooms')
//     .child(room)
//     .child('gameProps')
//     .child('characters')
//     .on('value', (snap) => {
//       if (snap.exists()) {
//         const ballsPositions = snap.val();
//         const newGameBoard = Array.from({
//           length: boardWidth * boardWidth,
//         }).map((_, index) => {
//           return {
//             xy: gameBoardCoordsRelationalFunc(index, boardWidth),
//             value: null,
//           };
//         });
//         Object.keys(ballsPositions).forEach((uid) => {
//           const toWhere = ballsPositions[uid];
//           newGameBoard[
//             gameBoardCoordsInverseRelationalFunc(toWhere, boardWidth)
//           ].value = players[uid].slice(0, 1);
//         });
//         setGameBoard(newGameBoard);
//       }
//     });
// }

export function startListeningToKnocks(room, setKnocks) {
  fireDB.ref("rooms/" + room + "/knock").on("value", (snap) => {
    if (snap.exists()) {
      setKnocks(snap.val());
    } else {
      setKnocks({});
    }
  });
}

export function knockOnRoom(room, uid, username, avatar) {
  return fireDB
    .ref("rooms/" + room + "/players")
    .get()
    .then((snap) => {
      const players = snap.val();
      if (Object.keys(players).every((uid) => players[uid].avatar !== avatar)) {
        fireDB
          .ref("rooms/" + room + "/knock")
          .child(uid)
          .set({ username, avatar });
      } else
        return "Avatar chosen is already taken - Please choose a different avatar";
    });
}

export function startListeningIfInGame(room, uid, setInGame) {
  fireDB.ref("rooms/" + room + "/players").on("value", (snap) => {
    if (uid in snap.val()) {
      setInGame(true);
      fireDB.ref("rooms/" + room + "/players").off();
    }
  });
}

export const updateCharPosition = (room, user, origPos, direction, speed) => {
  const dbRef = fireDB.ref("rooms/" + room + "/gameProps/characters/" + user);
  if (direction === "ArrowRight") {
    dbRef.child("x").set(origPos.x + speed);
  } else if (direction === "ArrowLeft") {
    dbRef.child("x").set(origPos.x - speed);
  } else if (direction === "ArrowUp") {
    dbRef.child("y").set(origPos.y - speed);
  } else if (direction === "ArrowDown") {
    dbRef.child("y").set(origPos.y + speed);
  }
};

export const writeCharPosition = (room, char) => {
  fireDB
    .ref("rooms/" + room + "/gameProps/characters/" + room)
    .set({ x: char.x, y: char.y });
};

export const writeBoxPosition = (room, box, boxNo) => {
  //console.log("boxNo>>>", boxNo);
  fireDB
    .ref("rooms/" + room + "/gameProps/boxes")
    .child(boxNo)
    .set({ x: box.x, y: box.y, contents: "empty", state: "closed" });
};

export const readBoxPosition = (room) => {
  fireDB
    .ref("rooms/" + room + "/gameProps/boxes/1")
    .get()
    .then((snap) => {
      console.log("box position>>>", snap.val());
      // setPlayers(snap.val());
      // fireDB.ref("rooms/" + room + "/startGame").off();
      // setStartGame(true);
      //    return snap.val();
    });
};
