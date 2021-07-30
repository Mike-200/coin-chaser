// import Main from './components/Main';
// import Header from './components/Header';
import PixiComponent from "./components/PixiComponent";

import "./App.css";
import * as Pixi from "pixi.js";
import firebase from "./firebase-config";
import { logout, updateCharPosition } from "./utils/firebase";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { getAvatar, useStickyState } from "./utils/backend";
import characters from "./characters";

const auth = firebase.auth();
const fireDB = firebase.database();

const speed = 20;
const gameCanvasSize = { width: 760, height: 520 };

function App() {
  // const [inGame, setInGame] = useState(false);
  const [username, setUsername] = useStickyState("username");
  const [avatar, setAvatar] = useState(0);
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [players, setPlayers] = useState({});
  const [startGame, setStartGame] = useState(false);
  const [characterSnapShot, setCharacterSnapShot] = useState({});
  const [sprites, setSprites] = useState({});

  useEffect(() => {
    if (startGame) {
      if (room === user) {
        Object.keys(players).forEach((player) => {
          fireDB
            .ref(
              "rooms/" +
                auth.currentUser.uid +
                "/gameProps/characters/" +
                player
            )
            .set({ x: 10, y: 10 });
        });
      }
      fireDB
        .ref("rooms/" + room + "/gameProps/characters/")
        .on("value", (snap) => {
          const characterPositions = snap.val();
          if (snap.exists()) {
            setCharacterSnapShot(characterPositions)
          }
        });
    }
  }, [startGame]);

  useEffect(() => {
    Object.keys(characterSnapShot).forEach((uid) => {
              if (!Object.keys(sprites).includes(uid)) { 
                setSprites((prevSprites) => {
                  const sprites = { ...prevSprites };
                  sprites[uid] = Pixi.Sprite.from(
                    getAvatar(players[uid].avatar, characters)
                  );
                  sprites[uid].position.set(
                    characterSnapShot[uid].x,
                    characterSnapShot[uid].y
                  );
                  if (uid === user) {
                      // document.removeEventListener("keydown", true);
                      document.addEventListener("keydown", function (e) {
                        e.preventDefault();
                        updateCharPosition(
                          fireDB,
                          room,
                          user,
                          { x: sprites[user].x, y: sprites[user].y },
                          e.key,
                          speed
                        );
                      });
                  }
                  return sprites;
                });
              } else {
                sprites[uid].x = characterSnapShot[uid].x;
                sprites[uid].y = characterSnapShot[uid].y;
              }
            });
  }, [startGame, characterSnapShot])

  function logoutButton() {
    logout(auth);
  }

  if (!startGame) {
    return (
      <Login
        fireDB={fireDB}
        auth={auth}
        username={username}
        setUsername={setUsername}
        setUser={setUser}
        players={players}
        setPlayers={setPlayers}
        setRoom={setRoom}
        startGame={startGame}
        setStartGame={setStartGame}
        user={user}
        room={room}
        logoutButton={logoutButton}
        avatar={avatar}
        setAvatar={setAvatar}
      />
    );
  } else {
    return (
      <div className="App">
        {/* <Header /> */}
        <PixiComponent sprites={sprites} gameCanvasSize={gameCanvasSize} />
        <p>User: {user}</p>
        {/* <Main /> */}
        <button onClick={logoutButton}>Logout</button>
      </div>
    );
  }
}

export default App;
