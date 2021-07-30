import "./App.css";
// import Header from './components/Header';
import PixiComponent from "./components/PixiComponent";
import Controls from "./components/Controls";
import * as Pixi from "pixi.js";
import ninja from "./assets/ninja-char.svg";
import ghost from "./assets/ghost-char.svg";
import closedBox from "./assets/box-closed.svg";
import openBox from "./assets/opened-box.svg";
import crownCoin from "./assets/coin.svg";
import firebase from "./firebase-config";
// import {
//   randomCharPosition,
//   randomBoxPosition,
//   startNewScreen,
// } from "./utils/frontend";
import { logout, updateCharPosition } from "./utils/firebase";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { useStickyState } from "./utils/backend";

let speed = 25;

const auth = firebase.auth();
const fireDB = firebase.database();

const gameApp = new Pixi.Application({
  width: 760,
  height: 520,
  backgroundColor: 0x8fc0a9,
  antialias: true,
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

const char1Sprite = Pixi.Sprite.from(ninja);
char1Sprite.anchor.set(0.5, 0.5);
char1Sprite.position.set(-400, -100);

// const char2Sprite = Pixi.Sprite.from(ghost);
// char2Sprite.position.set(400, 100);

const boxSpriteClosed = Pixi.Sprite.from(closedBox);
boxSpriteClosed.anchor.set(0.5, 0.5);
boxSpriteClosed.position.set(-200, -300);

const boxSpriteOpen = Pixi.Sprite.from(openBox);
boxSpriteOpen.anchor.set(0.5, 0.5);
boxSpriteOpen.position.set(-600, -600);

const coin = Pixi.Sprite.from(crownCoin);
coin.anchor.set(0.5, 0.5);
coin.position.set(-700, -700);

function App() {
  const [username, setUsername] = useStickyState();
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [players, setPlayers] = useState({});
  const [inGame, setInGame] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [numberOfBoxes, setNumberOfBoxes] = useState(1);
  const [box, setBox] = useState([]);
  // needs to take the form
  // [{1:{x:100,y:200,contents:"empty",state:"closed"}},
  //  {2:{x:100,y:200,contents:"empty",state:"closed"}}]

  useEffect(() => {
    if (startGame) {
      console.log("in game");
      // console.log("user>>>", user);
      // console.log("room>>>", room);
      // console.log("App.boxes>>>", boxes);

      fireDB
        .ref(
          "rooms/" +
            auth.currentUser.uid +
            "/gameProps/characters/" +
            auth.currentUser.uid
        )
        .set({ x: char1Sprite.x, y: char1Sprite.y });

      // listen for changes to char1 position
      // note - it should be room - not user - but the first
      // time it invokes, the db is empty
      fireDB
        .ref("rooms/" + user + "/gameProps/characters/" + user)
        .on("value", (snap) => {
          if (snap.val()) {
            const { x, y } = snap.val();
            char1Sprite.x = x;
            char1Sprite.y = y;
            //console.log("char1-x>>>", boxSpriteClosed.x);
          }
        });

      // listen for changes to box1 positions
      fireDB.ref("rooms/" + room + "/gameProps/boxes/1").on("value", (snap) => {
        if (snap.val()) {
          //console.log("Listener.boxes>>>", boxes);
          const { x, y } = snap.val();
          boxSpriteClosed.x = x;
          boxSpriteClosed.y = y;
          //console.log("box-x>>>", boxSpriteClosed.x);
        }
      });

      // listen to changes to all boxes and allocate to the 'box' array
      // delete the above listener once this is working
      // fireDB.ref("rooms/" + room + "/gameProps/boxes").on("value", (snap) => {

      //   if (snap.val()) {
      //     //console.log("snap.val>>>", snap.val());
      //     const result = snap.val();
      //     //console.log("snap.val>>>", snap.val());
      //     console.log("result>>>", result[1]);
      //     //console.log("box info>>>", snap.val()[1]);
      //     //console.log("lengthOfSnap,val>>>", snap.val().length);
      //     // for (let i = 1; i <= snap.val().length; i++) {

      //     //}
      //     //const { x, y } = snap.val();
      //     //boxSpriteClosed.x = x;
      //     //boxSpriteClosed.y = y;
      //     setBox([1]);
      //     console.log("boxArray>>>", box);
      //   }

      // });

      document.addEventListener("keydown", function (e) {
        e.preventDefault();
        console.log({ x: char1Sprite.x, y: char1Sprite.y });
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
  }, [startGame, box]);

  // const [spriteState, setSpriteState] = useState({
  //   char1: { x: 500, y: 450 },
  //   char2: { x: 10, y: 10 },
  // });

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
      />
    );
  }
  return (
    <div className="App">
      {/* <Header /> */}
      <PixiComponent
        gameApp={gameApp}
        char1Sprite={char1Sprite}
        boxSpriteClosed={boxSpriteClosed}
        boxSpriteOpen={boxSpriteOpen}
        coin={coin}
        fireDB={fireDB}
        room={auth.currentUser.uid}
      />
      <p>User: {username}</p>
      <p>User: {user}</p>
      <Controls
        gameApp={gameApp}
        char1Sprite={char1Sprite}
        boxSpriteClosed={boxSpriteClosed}
        fireDB={fireDB}
        room={auth.currentUser.uid}
        numberOfBoxes={numberOfBoxes}
        setNumberOfBoxes={setNumberOfBoxes}
        user={user}
        speed={speed}
      />
      <button onClick={logoutButton}>Logout</button>
    </div>
  );
}

export default App;
