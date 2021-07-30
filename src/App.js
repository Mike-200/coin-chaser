import "./App.css";
//import Header from './components/Header';
import PixiComponent from "./components/PixiComponent";
import Controls from "./components/Controls";
import * as Pixi from "pixi.js";
import closedBox from "./assets/box-closed.svg";
import openBox from "./assets/opened-box.svg";
import crownCoin from "./assets/coin.svg";

import firebase from "./firebase-config";
import { logout, updateCharPosition } from "./utils/firebase";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { getAvatar, useStickyState } from "./utils/backend";
import characters from "./characters";
import { randomCharPosition } from "./utils/frontend";
import { randomBoxPosition } from "./utils/frontend";

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

// const char1Sprite = Pixi.Sprite.from(ninja);
// char1Sprite.anchor.set(0.5, 0.5);
// char1Sprite.position.set(-400, -100);

// const char2Sprite = Pixi.Sprite.from(ghost);
// char2Sprite.position.set(400, 100);

// const boxSpriteClosed = Pixi.Sprite.from(closedBox);
// boxSpriteClosed.anchor.set(0.5, 0.5);
// boxSpriteClosed.position.set(400, 300);

const boxSpriteOpen = Pixi.Sprite.from(openBox);
boxSpriteOpen.anchor.set(0.5, 0.5);
boxSpriteOpen.position.set(-600, -600);

const coin = Pixi.Sprite.from(crownCoin);
coin.anchor.set(0.5, 0.5);
coin.position.set(-700, -700);
const gameCanvasSize = { width: 760, height: 520 };

function App() {
  // const [inGame, setInGame] = useState(false);
  const [username, setUsername] = useStickyState("username");
  const [avatar, setAvatar] = useState(0);
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [players, setPlayers] = useState({});
  const [startGame, setStartGame] = useState(false);
  const [numberOfBoxes, setNumberOfBoxes] = useState(1);
  const [box, setBox] = useState([]);

  const [characterSnapShot, setCharacterSnapShot] = useState({});
  const [boxSnapShot, setBoxSnapShot] = useState({});

  const [sprites, setSprites] = useState({});

  useEffect(() => {
    if (startGame) {
      if (room === user) {
        const occupiedPositions = [];
        Object.keys(players).forEach((player) => {
          fireDB
            .ref(
              "rooms/" +
                auth.currentUser.uid +
                "/gameProps/characters/" +
                player
            )
            .set(randomCharPosition(occupiedPositions));
        });

        fireDB
          .ref("rooms/" + room + "/gameProps/boxes")
          .child("box1")
          .set(randomBoxPosition(occupiedPositions));
      }
      fireDB
        .ref("rooms/" + room + "/gameProps/characters/")
        .on("value", (snap) => {
          if (snap.exists()) {
            setCharacterSnapShot(snap.val());
          }
        });

      fireDB.ref("rooms/" + room + "/gameProps/boxes").on("value", (snap) => {
        if (snap.exists()) {
          setBoxSnapShot(snap.val());
        }
      });

      // from mike and john - relates to boxes
      // alts needed to make this work
      // listen for changes to box1 positions
      // fireDB.ref("rooms/" + room + "/gameProps/boxes/1").on("value", (snap) => {
      //   if (snap.val()) {
      //     //console.log("Listener.boxes>>>", boxes);
      //     const { x, y } = snap.val();
      //     boxSpriteClosed.x = x;
      //     boxSpriteClosed.y = y;
      //     //console.log("box-x>>>", boxSpriteClosed.x);
      //   }
      // });

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
    }
  }, [startGame, box]);

  useEffect(() => {
    Object.keys(characterSnapShot).forEach((uid) => {
      if (!Object.keys(sprites).includes(uid)) {
        setSprites((prevSprites) => {
          const sprites = { ...prevSprites };
          sprites[uid] = Pixi.Sprite.from(
            getAvatar(players[uid].avatar, characters)
          );
          sprites[uid].anchor.set(0.5, 0.5);
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
  }, [startGame, characterSnapShot]);

  useEffect(() => {
    Object.keys(boxSnapShot).forEach((uid) => {
      if (!Object.keys(sprites).includes(uid)) {
        setSprites((prevSprites) => {
          const sprites = { ...prevSprites };
          sprites[uid] = Pixi.Sprite.from(closedBox);
          sprites[uid].position.set(boxSnapShot[uid].x, boxSnapShot[uid].y);

          return sprites;
        });
      } else {
        sprites[uid].x = boxSnapShot[uid].x;
        sprites[uid].y = boxSnapShot[uid].y;
      }
    });
  }, [startGame, boxSnapShot]);

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
        <PixiComponent
          sprites={sprites}
          gameCanvasSize={gameCanvasSize}
          gameApp={gameApp}
          // boxSpriteClosed={boxSpriteClosed}
        />
        <p>User: {username}</p>
        <p>User: {user}</p>

        <Controls
          gameApp={gameApp}
          // char1Sprite={char1Sprite}
          // boxSpriteClosed={boxSpriteClosed}
          fireDB={fireDB}
          room={auth.currentUser.uid}
          numberOfBoxes={numberOfBoxes}
          setNumberOfBoxes={setNumberOfBoxes}
          user={user}
          speed={speed}
          sprites={sprites}
        />

        <button onClick={logoutButton}>Logout</button>
      </div>
    );
  }

  // going to need to sort this out
  // below was mike and johns code to show the pixi component and the controls

  return (
    <div className="App">
      {/* <Header /> */}
      <PixiComponent
        gameApp={gameApp}
        // char1Sprite={char1Sprite}
        // boxSpriteClosed={boxSpriteClosed}
        boxSpriteOpen={boxSpriteOpen}
        coin={coin}
        fireDB={fireDB}
        room={auth.currentUser.uid}
      />
      <p>User: {username}</p>
      <p>User: {user}</p>
      <Controls
        gameApp={gameApp}
        // char1Sprite={char1Sprite}
        // boxSpriteClosed={boxSpriteClosed}
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
