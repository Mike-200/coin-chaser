import "./App.css";
// import Main from './components/Main';
// import Header from './components/Header';
import PixiComponent from "./components/PixiComponent";
import * as Pixi from "pixi.js";
import firebase from "./firebase-config";
import { logout } from "./utils/firebase";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { getAvatar, useStickyState } from "./utils/backend";
import characters from "./characters";

const auth = firebase.auth();
const fireDB = firebase.database();

const speed = 20;
const gameCanvasSize = { width: 760, height: 520 };

function App() {
  const [username, setUsername] = useStickyState("username");
  const [avatar, setAvatar] = useState(0);
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [players, setPlayers] = useState({});
  const [inGame, setInGame] = useState(false);
  const [startGame, setStartGame] = useState(false);
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
        .ref("rooms/" + user + "/gameProps/characters/")
        .on("value", (snap) => {
          const characterPositions = snap.val();
          Object.keys(characterPositions).forEach((uid) => {
            if (!(uid in sprites)) {
              setSprites((sprites) => {
                sprites[uid] = Pixi.Sprite.from(
                  getAvatar(players[uid].avatar, characters)
                );
                sprites[uid].position.set(
                  characterPositions[uid].x,
                  characterPositions[uid].y
                );
                return sprites;
              });
            } else {
              sprites[uid].x = characterPositions[uid].x;
              sprites[uid].y = characterPositions[uid].y;
            }
          });
        });

      // ToDo change position of own character
      // document.addEventListener("keydown", function (e) {
      //   e.preventDefault();
      //   updateCharPosition(
      //     fireDB,
      //     user,
      //     user,
      //     { x: char1Sprite.x, y: char1Sprite.y },
      //     e.key,
      //     speed
      //   );
      // });
    }
  }, [startGame]);

  // const [spriteState, setSpriteState] = useState({
  //   char1: { x: 500, y: 450 },
  //   char2: { x: 10, y: 10 },
  // });

  // Create Sprites & add to stage

  // Event Listeners for keypress movements

  // document.addEventListener('keydown', function (e) {
  //   if (e.keyCode === 68) moveCharacter(char2Sprite, '+x');
  //   if (e.keyCode === 65) moveCharacter(char2Sprite, '-x');
  //   if (e.keyCode === 83) moveCharacter(char2Sprite, '+y');
  //   if (e.keyCode === 87) moveCharacter(char2Sprite, '-y');
  // });

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
        inGame={inGame}
        setInGame={setInGame}
        startGame={startGame}
        setStartGame={setStartGame}
        user={user}
        room={room}
        logoutButton={logoutButton}
        avatar={avatar}
        setAvatar={setAvatar}
      />
    );
  }
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

export default App;
