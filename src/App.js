// Styling
import "./App.css";

// Components
import PixiComponent from "./components/PixiComponent";
import Controls from "./components/Controls";
import Login from "./components/Login";
import Header from "./components/Header";
import Scores from "./components/Scores";
import Messaging from "./components/Messaging";

// Sprites
import closedBox from "./assets/box-closed.svg";
import openBox from "./assets/opened-box.svg";
import crownCoin from "./assets/coin.svg";
import rocket from "./assets/shuttle.svg";
import slime from "./assets/splash.svg";
import characters from "./utils/characters";

// Functions, utils, dependencies...
import * as Pixi from "pixi.js";
import firebase from "./firebase-config";
import { logout } from "./utils/login";
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import {
  startNewScreen,
  cleanup,
  updateCharPosition,
  initScores,
  startListeningIfRoomDissapears,
  startGenericGameListeners,
  pixiSpriteBuilder,
  checkIfSpriteUidIsBox,
  pixiBoxContentSpriteBuilder,
  checkIfSpriteUidIsBoxContent,
} from "./utils/backend";
import useStickyState from "./utils/stickyState";
import collisionDetect from "./utils/collision";
import { getAvatar } from "./utils/characters";

// Contexts
import { StartGameContext } from "./contexts/StartGame";
import { RoomContext } from "./contexts/Room";
import { UsernameContext } from "./contexts/Username";
import { UserContext } from "./contexts/User";
import { AvatarContext } from "./contexts/Avatar";
import { SpritesContext } from "./contexts/Sprites";
import { ScoresContext } from "./contexts/Scores";
import { PlayersContext } from "./contexts/Players";
import { GameEventContext } from "./contexts/GameEvent";

// Variables init

const canvasSize = { x: 800, y: 500 };
let speed = 25;

const auth = firebase.auth();
export const fireDB = firebase.database();

const gameApp = new Pixi.Application({
  width: canvasSize.x,
  height: canvasSize.y,
  backgroundColor: 0x69c298,
  antialias: true,
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

let listeningToKeyPresses = true;
let messengerRef;

function App() {
  // User Contexts:-
  const [startGame, setStartGame] = useState(false);
  const [room, setRoom] = useState();
  const [user, setUser] = useState();
  const [username, setUsername] = useStickyState("username");
  const [avatar, setAvatar] = useState(0);
  const [sprites, setSprites] = useState({});
  const [scores, setScores] = useState({});
  const [players, setPlayers] = useState({});
  const [gameEvent, setGameEvent] = useState({ message: null, error: false });

  // States:-
  const [numberOfBoxes, setNumberOfBoxes] = useState(1);
  const [boxesContents, setBoxesContents] = useState({});
  const [characterSnapShot, setCharacterSnapShot] = useState({});
  const [boxSnapShot, setBoxSnapShot] = useState({});
  const [boxesState, setBoxesState] = useState({});
  const [gameEnd, setGameEnd] = useState(false);

  function keyHandlers(sprites) {
    let keyDown = false;
    function keyDownHandler(e) {
      if (listeningToKeyPresses) {
        e.preventDefault();
        if (!keyDown) {
          keyDown = true;
          updateCharPosition(
            room,
            user,
            { x: sprites[user].x, y: sprites[user].y },
            e.key,
            speed,
            canvasSize
          );
        }
      }
    }
    function keyUpHandler(e) {
      keyDown = false;
    }
    return [keyDownHandler, keyUpHandler];
  }

  function setListeningToKeyPressesTrue(event) {
    listeningToKeyPresses = true;
  }

  function setListeningToKeyPressesFalse(event) {
    listeningToKeyPresses = false;
  }

  function listenToMouseOverMessenger() {
    messengerRef = document.getElementById("stopListenKeys");
    messengerRef.addEventListener("mouseout", setListeningToKeyPressesTrue);
    messengerRef.addEventListener("mouseover", setListeningToKeyPressesFalse);
  }

  function stopListenToMouseOverMessenger() {
    messengerRef.removeEventListener("mouseout", setListeningToKeyPressesTrue);
    messengerRef.removeEventListener(
      "mouseover",
      setListeningToKeyPressesFalse
    );
  }

  function logoutButton() {
    cleanup(user === room, fireDB, room, setStartGame, () => {
      logout(auth);
    });
    window.location.reload();
  }

  useBeforeunload(() => {
    cleanup(user === room, fireDB, room, setStartGame, () => {
      logout(auth);
    });
  });

  // Game Init
  useEffect(() => {
    if (startGame) {
      if (room === user) {
        startNewScreen(room, user, players, numberOfBoxes);
        initScores(players, room);
      } else {
        startListeningIfRoomDissapears(room, setGameEvent, logoutButton);
      }
      startGenericGameListeners(
        room,
        setCharacterSnapShot,
        setBoxSnapShot,
        setScores
      );
    }
  }, [startGame]);

  // On Score Change
  useEffect(() => {
    Object.keys(scores).forEach((uid) => {
      if (scores[uid] === 10) {
        setGameEnd(true);
        setGameEvent({
          message: `${players[uid].username} won the game!`,
          error: false,
        });
      }
    });
  }, [scores]);

  // On characters change
  useEffect(() => {
    Object.keys(characterSnapShot).forEach((uid) => {
      if (!Object.keys(sprites).includes(uid)) {
        setSprites((prevSprites) => {
          const sprites = { ...prevSprites };
          sprites[uid] = pixiSpriteBuilder(
            getAvatar(players[uid].avatar, characters),
            characterSnapShot[uid]
          );
          if (uid === user) {
            // Key Presses Listener and zone trigger
            const [keyDownHandler, keyUpHandler] = keyHandlers(sprites);
            window.addEventListener("keydown", keyDownHandler);
            window.addEventListener("keyup", keyUpHandler);
          }
          return sprites;
        });
      } else {
        if (sprites[uid].x > characterSnapShot[uid].x) {
          sprites[uid].scale.x = -1;
        } else if (sprites[uid].x < characterSnapShot[uid].x)
          sprites[uid].scale.x = 1;
        sprites[uid].x = characterSnapShot[uid].x;
        sprites[uid].y = characterSnapShot[uid].y;
        // Collision logic
        Object.keys(sprites)
          .filter((spriteUid) => checkIfSpriteUidIsBox(spriteUid))
          .filter((boxSpriteUid) =>
            collisionDetect(sprites[boxSpriteUid], sprites[uid])
          )
          .filter((boxSpriteUid) => boxesState[boxSpriteUid] === "closed")
          .forEach((boxSpriteUid) => {
            const boxPos = {
              x: sprites[boxSpriteUid].x,
              y: sprites[boxSpriteUid].y,
            };
            const openBoxSprite = Pixi.Sprite.from(openBox);
            openBoxSprite.position.set(boxPos.x, boxPos.y);
            openBoxSprite.anchor.set(0.5, 0.5);

            let boxContentSprite;
            if (boxesContents[boxSpriteUid] === "coin") {
              if (user === room) {
                fireDB
                  .ref("rooms/" + room + "/gameProps/scores/" + uid)
                  .set(scores[uid] + 1);
              }
              boxContentSprite = pixiBoxContentSpriteBuilder(crownCoin, boxPos);
              speed = 25;
              setGameEvent({
                message: `${players[uid].username} got the Coin!`,
                error: false,
              });
              setNumberOfBoxes((prevNum) => {
                if (prevNum < 4) return prevNum + 1;
                return prevNum;
              });
            }
            if (boxesContents[boxSpriteUid] === "rocket") {
              boxContentSprite = pixiBoxContentSpriteBuilder(rocket, boxPos);
              setGameEvent({
                message: `${players[uid].username} got the Rocket!`,
                error: false,
              });
              if (uid === user) speed = 50;
            }
            if (boxesContents[boxSpriteUid] === "slime") {
              boxContentSprite = pixiBoxContentSpriteBuilder(slime, boxPos);
              setGameEvent({
                message: `${players[uid].username} got the Slime!`,
                error: false,
              });
              if (uid === user) speed = 12.5;
            }
            setSprites((prevSprites) => {
              const sprites = { ...prevSprites };
              sprites[boxSpriteUid] = pixiSpriteBuilder(openBox, boxPos);
              if (boxContentSprite) {
                sprites[boxSpriteUid + "contents"] = boxContentSprite;
              }
              return sprites;
            });

            setBoxesState((prevBoxesState) => {
              const tempBoxesState = { ...prevBoxesState };
              tempBoxesState[boxSpriteUid] = "open";
              return tempBoxesState;
            });
          });
      }
    });
  }, [startGame, characterSnapShot]);

  // On boxes change
  useEffect(() => {
    // Clean stage off boxes contents - coins, rockets, slimes
    const boxContentsOnStage = Object.keys(sprites).filter((spriteUid) =>
      checkIfSpriteUidIsBoxContent(spriteUid)
    );
    if (boxContentsOnStage.length > 0) {
      setSprites((prevSprites) => {
        const newSprites = { ...prevSprites };
        boxContentsOnStage.forEach((spriteUid) => delete newSprites[spriteUid]);
        return newSprites;
      });
    }
    // reset boxes sprites
    const newBoxesState = {};
    const newBoxesContents = {};
    const newSprites = {};
    Object.keys(boxSnapShot).forEach((uid) => {
      newBoxesState[uid] = "closed";
      newBoxesContents[uid] = boxSnapShot[uid].contains;
      newSprites[uid] = pixiSpriteBuilder(closedBox, boxSnapShot[uid]);
    });
    setBoxesState(newBoxesState);
    setBoxesContents(newBoxesContents);
    setSprites((prevSprites) => {
      return { ...prevSprites, ...newSprites };
    });
  }, [startGame, boxSnapShot]);

  return (
    <div>
      <StartGameContext.Provider value={{ startGame, setStartGame }}>
        <RoomContext.Provider value={{ room, setRoom }}>
          <UserContext.Provider value={{ user, setUser }}>
            <UsernameContext.Provider value={{ username, setUsername }}>
              <AvatarContext.Provider value={{ avatar, setAvatar }}>
                <SpritesContext.Provider value={{ sprites, setSprites }}>
                  <ScoresContext.Provider value={{ scores, setScores }}>
                    <PlayersContext.Provider value={{ players, setPlayers }}>
                      <GameEventContext.Provider
                        value={{ gameEvent, setGameEvent }}
                      >
                        {!startGame ? (
                          <Login auth={auth} logoutButton={logoutButton} />
                        ) : (
                          <>
                            <div className="App">
                              <Header
                                characters={characters}
                                logoutButton={logoutButton}
                              />

                              <div id="hero">
                                <PixiComponent
                                  sprites={sprites}
                                  gameApp={gameApp}
                                />
                                <Scores
                                  players={players}
                                  characters={characters}
                                />
                                <Messaging
                                  listenToMouseOverMessenger={
                                    listenToMouseOverMessenger
                                  }
                                  stopListenToMouseOverMessenger={
                                    stopListenToMouseOverMessenger
                                  }
                                  characters={characters}
                                />
                              </div>
                              <Controls
                                numberOfBoxes={numberOfBoxes}
                                setNumberOfBoxes={setNumberOfBoxes}
                                speed={speed}
                                canvasSize={canvasSize}
                                gameEnd={gameEnd}
                              />
                            </div>
                          </>
                        )}
                      </GameEventContext.Provider>
                    </PlayersContext.Provider>
                  </ScoresContext.Provider>
                </SpritesContext.Provider>
              </AvatarContext.Provider>
            </UsernameContext.Provider>
          </UserContext.Provider>
        </RoomContext.Provider>
      </StartGameContext.Provider>
    </div>
  );
}

export default App;
