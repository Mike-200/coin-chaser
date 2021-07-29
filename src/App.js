import "./App.css";
// import Main from './components/Main';
// import Header from './components/Header';
import PixiComponent from "./components/PixiComponent";
import * as Pixi from "pixi.js";
import ninja from "./assets/ninja-char.svg";
import ghost from "./assets/ghost-char.svg";
import firebase from "./firebase-config";
import { logout, updateCharPosition } from "./utils/firebase";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { useStickyState } from "./utils/backend";
import characters from "./characters";

const auth = firebase.auth();
const fireDB = firebase.database();

const char1Sprite = Pixi.Sprite.from(ninja);
char1Sprite.position.set(50, 400);

const char2Sprite = Pixi.Sprite.from(ghost);
char2Sprite.position.set(400, 100);

let speed = 20;

function App() {
  const [username, setUsername] = useStickyState();
  const [avatar, setAvatar] = useState(0);
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [players, setPlayers] = useState({});
  const [inGame, setInGame] = useState(false);
  const [startGame, setStartGame] = useState(false);


  useEffect(() => {
    if (startGame) {
      fireDB
        .ref(
          "rooms/" +
            auth.currentUser.uid +
            "/gameProps/characters/" +
            auth.currentUser.uid
        )
        .set({ x: char1Sprite.x, y: char1Sprite.y });

      fireDB
        .ref("rooms/" + user + "/gameProps/characters/" + user)
        .on("value", (snap) => {
          const { x, y } = snap.val();
          console.log(x, y);
          char1Sprite.x = x;
          char1Sprite.y = y;
        });

      document.addEventListener("keydown", function (e) {
        e.preventDefault();
        updateCharPosition(
          fireDB,
          user,
          user,
          { x: char1Sprite.x, y: char1Sprite.y },
          e.key,
          speed
        );
      });
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
      <PixiComponent char1Sprite={char1Sprite} />
      <p>User: {user}</p>
      {/* <Main /> */}
      <button onClick={logoutButton}>Logout</button>
    </div>
  );
}

export default App;
