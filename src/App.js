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
import { SpritesRelativePosContext } from "./contexts/SpritesRelativePos";

// Variables init
let speed = 25;

const auth = firebase.auth();
export const fireDB = firebase.database();

// Pixi Setup
const canvasSize = { x: 800, y: 500 }; //ratio 1.6
let pixiRatio = 1;
let listeningToKeyPresses = true;

const gameApp = new Pixi.Application({
  autoResize: true,
  resolution: window.devicePixelRatio,
  backgroundColor: 0x69c298,
  antialias: true,
  autoDensity: true,
});

function App() {
  // User Contexts:-
  const [startGame, setStartGame] = useState(false);
  const [room, setRoom] = useState();
  const [user, setUser] = useState();
  const [username, setUsername] = useStickyState("username");
  const [avatar, setAvatar] = useState(0);
  const [sprites, setSprites] = useState({});
  const [spritesRelativePos, setSpritesRelativePos] = useState({});
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
  const [resized, setResized] = useState(0);

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

  function listenToMouseOverMessenger() {
    const messenger = document.getElementById("Messaging__Window");
    messenger.addEventListener("mouseout", (event) => {
      if (!listeningToKeyPresses) {
        listeningToKeyPresses = true;
      }
    });
    messenger.addEventListener("mouseover", (event) => {
      if (listeningToKeyPresses) {
        listeningToKeyPresses = false;
      }
    });
  }

  function logoutButton() {
    cleanup(user === room, fireDB, room, setStartGame, () => {
      logout(auth);
    });
    window.location.reload();
  }

  function resizePixiCanvas() {
    gameApp.renderer.resize(canvasSize.x * pixiRatio, canvasSize.y * pixiRatio);
    setResized((prevNum) => prevNum + 1);
  }

  useBeforeunload(() => {
    cleanup(user === room, fireDB, room, setStartGame, () => {
      logout(auth);
    });
  });

  // Game Init
  useEffect(() => {
    // Detect screen size on open
    window.onload = function (event) {
      if (window.innerWidth >= 1340) {
        pixiRatio = (window.innerWidth - 540) / canvasSize.x;
        resizePixiCanvas();
      }
    };
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

      // Detect change in screen size
      window.onresize = function (event) {
        if (window.innerWidth >= 1340) {
          pixiRatio = (window.innerWidth - 540) / canvasSize.x;
          resizePixiCanvas();
        }
      };
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
      const tempSpritesRelativePos = {};
      if (!Object.keys(sprites).includes(uid)) {
        setSprites((prevSprites) => {
          const sprites = { ...prevSprites };
          sprites[uid] = pixiSpriteBuilder(
            getAvatar(players[uid].avatar, characters),
            characterSnapShot[uid]
          );
          tempSpritesRelativePos[uid] = pixiSpriteBuilder(
            getAvatar(players[uid].avatar, characters),
            {
              x: characterSnapShot[uid].x * pixiRatio,
              y: characterSnapShot[uid].y * pixiRatio,
            }
          );
          tempSpritesRelativePos[uid].scale.set(pixiRatio, pixiRatio);
          tempSpritesRelativePos[uid].origPos = {
            x: characterSnapShot[uid].x,
            y: characterSnapShot[uid].y,
          };

          if (uid === user) {
            // Key Presses Listener and zone trigger
            const [keyDownHandler, keyUpHandler] = keyHandlers(sprites);
            window.addEventListener("keydown", keyDownHandler);
            window.addEventListener("keyup", keyUpHandler);
            listenToMouseOverMessenger();
          }
          return sprites;
        });
      } else {
        if (sprites[uid].x > characterSnapShot[uid].x) {
          sprites[uid].scale.x = -1;
          spritesRelativePos[uid].scale.x = -Math.abs(
            spritesRelativePos[uid].scale.x
          );
        } else if (sprites[uid].x < characterSnapShot[uid].x) {
          sprites[uid].scale.x = 1;
          spritesRelativePos[uid].scale.x = Math.abs(
            spritesRelativePos[uid].scale.x
          );
        }
        sprites[uid].x = characterSnapShot[uid].x;
        sprites[uid].y = characterSnapShot[uid].y;
        spritesRelativePos[uid].position.set(
          characterSnapShot[uid].x * pixiRatio,
          characterSnapShot[uid].y * pixiRatio
        );
        spritesRelativePos[uid].origPos = {
          x: characterSnapShot[uid].x,
          y: characterSnapShot[uid].y,
        };
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
            let boxContentSpriteToBuild;
            if (boxesContents[boxSpriteUid] === "coin") {
              if (user === room) {
                fireDB
                  .ref("rooms/" + room + "/gameProps/scores/" + uid)
                  .set(scores[uid] + 1);
              }
              boxContentSpriteToBuild = "coin";
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
              boxContentSpriteToBuild = "rocket";
              setGameEvent({
                message: `${players[uid].username} got the Rocket!`,
                error: false,
              });
              if (uid === user) speed = 50;
            }
            if (boxesContents[boxSpriteUid] === "slime") {
              boxContentSpriteToBuild = "slime";
              setGameEvent({
                message: `${players[uid].username} got the Slime!`,
                error: false,
              });
              if (uid === user) speed = 12.5;
            }
            setSprites((prevSprites) => {
              const tempSprites = { ...prevSprites };
              tempSprites[boxSpriteUid] = pixiSpriteBuilder(openBox, boxPos);
              if (boxContentSpriteToBuild === "coin") {
                tempSprites[boxSpriteUid + "contents"] =
                  pixiBoxContentSpriteBuilder(crownCoin, boxPos);
              } else if (boxContentSpriteToBuild === "rocket") {
                tempSprites[boxSpriteUid + "contents"] =
                  pixiBoxContentSpriteBuilder(rocket, boxPos);
              } else if (boxContentSpriteToBuild === "slime") {
                tempSprites[boxSpriteUid + "contents"] =
                  pixiBoxContentSpriteBuilder(slime, boxPos);
              }
              return tempSprites;
            });
            setSpritesRelativePos((prevSprites) => {
              const tempSprites = { ...prevSprites };
              tempSprites[boxSpriteUid] = pixiSpriteBuilder(openBox, {
                x: boxPos.x * pixiRatio,
                y: boxPos.y * pixiRatio,
              });
              tempSprites[boxSpriteUid].scale.set(pixiRatio, pixiRatio);
              tempSprites[boxSpriteUid].origPos = {
                x: boxPos.x,
                y: boxPos.y,
              };
              if (boxContentSpriteToBuild === "coin") {
                tempSprites[boxSpriteUid + "contents"] =
                  pixiBoxContentSpriteBuilder(crownCoin, {
                    x: boxPos.x * pixiRatio,
                    y: boxPos.y * pixiRatio,
                  });
              } else if (boxContentSpriteToBuild === "rocket") {
                tempSprites[boxSpriteUid + "contents"] =
                  pixiBoxContentSpriteBuilder(rocket, {
                    x: boxPos.x * pixiRatio,
                    y: boxPos.y * pixiRatio,
                  });
              } else if (boxContentSpriteToBuild === "slime") {
                tempSprites[boxSpriteUid + "contents"] =
                  pixiBoxContentSpriteBuilder(slime, {
                    x: boxPos.x * pixiRatio,
                    y: boxPos.y * pixiRatio,
                  });
              }
              if (boxContentSpriteToBuild) {
                tempSprites[boxSpriteUid + "contents"].scale.set(
                  pixiRatio,
                  pixiRatio
                );
                tempSprites[boxSpriteUid + "contents"].origPos = {
                  x: boxPos.x,
                  y: boxPos.y - 50,
                };
              }
              return tempSprites;
            });
            setBoxesState((prevBoxesState) => {
              const tempBoxesState = { ...prevBoxesState };
              tempBoxesState[boxSpriteUid] = "open";
              return tempBoxesState;
            });
          });
      }
      if (tempSpritesRelativePos) {
        setSpritesRelativePos((prevSpritesRelativePos) => {
          return { ...prevSpritesRelativePos, ...tempSpritesRelativePos };
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
      setSpritesRelativePos((prevSprites) => {
        const newSprites = { ...prevSprites };
        boxContentsOnStage.forEach((spriteUid) => delete newSprites[spriteUid]);
        return newSprites;
      });
    }
    // reset boxes sprites
    const newBoxesState = {};
    const newBoxesContents = {};
    const newSprites = {};
    const newSpritesRelativePos = {};
    Object.keys(boxSnapShot).forEach((uid) => {
      newBoxesState[uid] = "closed";
      newBoxesContents[uid] = boxSnapShot[uid].contains;
      newSprites[uid] = pixiSpriteBuilder(closedBox, boxSnapShot[uid]);
      newSpritesRelativePos[uid] = pixiSpriteBuilder(closedBox, {
        x: boxSnapShot[uid].x * pixiRatio,
        y: boxSnapShot[uid].y * pixiRatio,
      });
      newSpritesRelativePos[uid].scale.set(pixiRatio, pixiRatio);
      newSpritesRelativePos[uid].origPos = {
        x: boxSnapShot[uid].x,
        y: boxSnapShot[uid].y,
      };
    });
    setBoxesState(newBoxesState);
    setBoxesContents(newBoxesContents);
    setSprites((prevSprites) => {
      return { ...prevSprites, ...newSprites };
    });
    setSpritesRelativePos((prevSprites) => {
      return { ...prevSprites, ...newSpritesRelativePos };
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
                  <SpritesRelativePosContext.Provider
                    value={{ spritesRelativePos, setSpritesRelativePos }}
                  >
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
                                    gameApp={gameApp}
                                    resized={resized}
                                    pixiRatio={pixiRatio}
                                  />
                                  <Scores
                                    players={players}
                                    characters={characters}
                                  />
                                  <Messaging />
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
                  </SpritesRelativePosContext.Provider>
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
