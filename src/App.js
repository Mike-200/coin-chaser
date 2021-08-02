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
import { useEffect, useState, useRef } from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Messaging from "./components/Messaging";
import { getAvatar, useStickyState, startNewScreen } from "./utils/backend";
import characters from "./characters";
import { randomCharPosition } from "./utils/frontend";
import { randomBoxPosition } from "./utils/frontend";

import { StartGameContext } from "./contexts/StartGame";
import { RoomContext } from "./contexts/Room";
import { UsernameContext } from "./contexts/Username";
import { UserContext } from "./contexts/User";
import { AvatarContext } from "./contexts/Avatar";
import { SpritesContext } from "./contexts/Sprites";

let speed = 25;

const auth = firebase.auth();
export const fireDB = firebase.database();

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
  // User Contexts:-
  const [startGame, setStartGame] = useState(false);
  const [room, setRoom] = useState();
  const [user, setUser] = useState();
  const [username, setUsername] = useStickyState("username");
  const [avatar, setAvatar] = useState(0);
  const [sprites, setSprites] = useState({});

  // States:-
  const [players, setPlayers] = useState({});
  const [numberOfBoxes, setNumberOfBoxes] = useState(1);
  const [box, setBox] = useState([]);
  const [characterSnapShot, setCharacterSnapShot] = useState({});
  const [boxSnapShot, setBoxSnapShot] = useState({});
  // const [inGame, setInGame] = useState(false);

  useEffect(() => {
    if (startGame) {
      if (room === user) {
        startNewScreen(room, user, players, numberOfBoxes);
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

  //const pixiCanvas = useRef("ref");

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
            //document.getelementbyid does not work in react
            const pixiCanvas = document.getElementById("pixi_canvas");
            console.log("pixicanvas>>>", pixiCanvas);
            pixiCanvas.addEventListener(
              "focus",
              (event) => {
                // console.log("listening for key presses");
                pixiCanvas.addEventListener("keydown", function (e) {
                  e.preventDefault();
                  updateCharPosition(
                    room,
                    user,
                    { x: sprites[user].x, y: sprites[user].y },
                    e.key,
                    speed
                  );
                });
              },
              true
            );
            pixiCanvas.addEventListener(
              "blur",
              (event) => {
                console.log("not listening any more");
                document.removeEventListener("keydown", true);
              },
              true
            );
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

  return (
    <div>
      <StartGameContext.Provider value={{ startGame, setStartGame }}>
        <RoomContext.Provider value={{ room, setRoom }}>
          <UserContext.Provider value={{ user, setUser }}>
            <UsernameContext.Provider value={{ username, setUsername }}>
              <AvatarContext.Provider value={{ avatar, setAvatar }}>
                <SpritesContext.Provider value={{ sprites, setSprites }}>
                  {!startGame ? (
                    <Login
                      auth={auth}
                      players={players}
                      setPlayers={setPlayers}
                      logoutButton={logoutButton}
                    />
                  ) : (
                    <>
                      <div className="App">
                        <Header />
                        <PixiComponent
                          sprites={sprites}
                          gameCanvasSize={gameCanvasSize}
                          gameApp={gameApp}
                          // boxSpriteClosed={boxSpriteClosed}
                        />
                        <p>User: {username}</p>
                        <p>User: {user}</p>

                        <Controls
                          numberOfBoxes={numberOfBoxes}
                          setNumberOfBoxes={setNumberOfBoxes}
                          speed={speed}
                          players={players}
                        />
                        <button onClick={logoutButton}>Logout</button>
                        <Messaging />
                      </div>
                    </>
                  )}
                </SpritesContext.Provider>
              </AvatarContext.Provider>
            </UsernameContext.Provider>
          </UserContext.Provider>
        </RoomContext.Provider>
      </StartGameContext.Provider>
    </div>
  );

  // going to need to sort this out
  // below was mike and johns code to show the pixi component and the controls

  // return (
  //   <div className="App">
  //     {/* <Header /> */}
  //     <PixiComponent
  //       gameApp={gameApp}
  //       // char1Sprite={char1Sprite}
  //       // boxSpriteClosed={boxSpriteClosed}
  //       boxSpriteOpen={boxSpriteOpen}
  //       coin={coin}
  //       fireDB={fireDB}
  //       room={auth.currentUser.uid}
  //     />
  //     <p>User: {username}</p>
  //     <p>User: {user}</p>
  //     <Controls
  //       gameApp={gameApp}
  //       // char1Sprite={char1Sprite}
  //       // boxSpriteClosed={boxSpriteClosed}
  //       fireDB={fireDB}
  //       room={auth.currentUser.uid}
  //       numberOfBoxes={numberOfBoxes}
  //       setNumberOfBoxes={setNumberOfBoxes}
  //       user={user}
  //       speed={speed}
  //     />
  //     <button onClick={logoutButton}>Logout</button>
  //   </div>
  // );
}

export default App;
