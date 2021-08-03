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
    }
  });
}
