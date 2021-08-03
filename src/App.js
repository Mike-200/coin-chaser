import './App.css';
import PixiComponent from './components/PixiComponent';
import Controls from './components/Controls';
import * as Pixi from 'pixi.js';
import closedBox from './assets/box-closed.svg';
import openBox from './assets/opened-box.svg';
import crownCoin from './assets/coin.svg';
import rocket from './assets/shuttle.svg';
import slime from './assets/splash.svg';

import firebase from './firebase-config';
import { logout, updateCharPosition } from './utils/firebase';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import Scores from './components/Scores';
import Messaging from './components/Messaging';
import { getAvatar, useStickyState, startNewScreen } from './utils/backend';
import characters from './characters';

import { StartGameContext } from './contexts/StartGame';
import { RoomContext } from './contexts/Room';
import { UsernameContext } from './contexts/Username';
import { UserContext } from './contexts/User';
import { AvatarContext } from './contexts/Avatar';
import { SpritesContext } from './contexts/Sprites';
import { ScoresContext } from './contexts/Scores';
import { collisionDetect } from './utils/collision';

const canvasSize = { x: 900, y: 500 };
let speed = 25;

const auth = firebase.auth();
export const fireDB = firebase.database();

const gameApp = new Pixi.Application({
  width: canvasSize.x,
  height: canvasSize.y,
  backgroundColor: 0x8fc0a9,
  antialias: true,
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

export function logoutButton() {
  logout(auth);
}

let listeningToKeyPresses = true;

function App() {
  // User Contexts:-
  const [startGame, setStartGame] = useState(false);
  const [room, setRoom] = useState();
  const [user, setUser] = useState();
  const [username, setUsername] = useStickyState('username');
  const [avatar, setAvatar] = useState(0);
  const [sprites, setSprites] = useState({});
  const [scores, setScores] = useState({});

  // States:-
  const [players, setPlayers] = useState({});
  const [numberOfBoxes, setNumberOfBoxes] = useState(1);
  const [boxesContents, setBoxesContents] = useState({});
  const [characterSnapShot, setCharacterSnapShot] = useState({});
  const [boxSnapShot, setBoxSnapShot] = useState({});
  const [boxesState, setBoxesState] = useState({});

  useEffect(() => {
    if (startGame) {
      if (room === user) {
        startNewScreen(room, user, players, numberOfBoxes);
        const tempScores = {};
        Object.keys(players).forEach((player) => {
          tempScores[player] = 0;
        });
        fireDB.ref('rooms/' + room + '/gameProps/scores').set(tempScores);
      }

      fireDB
        .ref('rooms/' + room + '/gameProps/characters/')
        .on('value', (snap) => {
          if (snap.exists()) {
            setCharacterSnapShot(snap.val());
          }
        });

      fireDB.ref('rooms/' + room + '/gameProps/boxes').on('value', (snap) => {
        if (snap.exists()) {
          setBoxSnapShot(snap.val());
        }
      });

      fireDB.ref('rooms/' + room + '/gameProps/scores').on('value', (snap) => {
        if (snap.exists()) {
          setScores(snap.val());
        }
      });
    }
  }, [startGame]);

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
            const [keyDownHandler, keyUpHandler] = keyHandlers(sprites);
            window.addEventListener('keydown', keyDownHandler);
            window.addEventListener('keyup', keyUpHandler);
            // const pixiCanvas = document.getElementById("pixi_canvas");
            const messenger = document.getElementById('Messaging__Window');
            messenger.addEventListener('mouseout', (event) => {
              if (!listeningToKeyPresses) {
                listeningToKeyPresses = true;
              }
            });
            messenger.addEventListener('mouseover', (event) => {
              if (listeningToKeyPresses) {
                listeningToKeyPresses = false;
              }
            });
          }
          return sprites;
        });
      } else {
        sprites[uid].x = characterSnapShot[uid].x;
        sprites[uid].y = characterSnapShot[uid].y;
        // Collision logic
        Object.keys(sprites).forEach((boxSpriteUid) => {
          if (boxSpriteUid.match(/^box[0-9]*$/)) {
            if (collisionDetect(sprites[boxSpriteUid], sprites[uid])) {
              if (boxesState[boxSpriteUid] === 'closed') {
                // Host collision logic
                if (user === room) {
                  if (boxesContents[boxSpriteUid] === 'coin') {
                    fireDB
                      .ref('rooms/' + room + '/gameProps/scores/' + uid)
                      .set(scores[uid] + 1);
                  }
                }
                const boxPos = {
                  x: sprites[boxSpriteUid].x,
                  y: sprites[boxSpriteUid].y,
                };
                const tempSprite = Pixi.Sprite.from(openBox);
                tempSprite.position.set(boxPos.x, boxPos.y);
                tempSprite.anchor.set(0.5, 0.5);

                let tempBoxContent;
                if (boxesContents[boxSpriteUid] === 'coin') {
                  tempBoxContent = Pixi.Sprite.from(crownCoin);
                  tempBoxContent.position.set(boxPos.x, boxPos.y - 50);
                  tempBoxContent.anchor.set(0.5, 0.5);
                  speed = 25;
                  setNumberOfBoxes((prevNum) => {
                    if (prevNum < 4) return prevNum + 1;
                    return prevNum;
                  });
                }
                if (boxesContents[boxSpriteUid] === 'rocket') {
                  tempBoxContent = Pixi.Sprite.from(rocket);
                  tempBoxContent.position.set(boxPos.x, boxPos.y - 50);
                  tempBoxContent.anchor.set(0.5, 0.5);
                  if (uid === user) speed = 50;
                }
                if (boxesContents[boxSpriteUid] === 'slime') {
                  tempBoxContent = Pixi.Sprite.from(slime);
                  tempBoxContent.position.set(boxPos.x, boxPos.y - 50);
                  tempBoxContent.anchor.set(0.5, 0.5);
                  if (uid === user) speed = 12.5;
                }
                setSprites((prevSprites) => {
                  const sprites = { ...prevSprites };
                  sprites[boxSpriteUid] = tempSprite;
                  if (tempBoxContent) {
                    sprites[boxSpriteUid + 'contents'] = tempBoxContent;
                  }
                  return sprites;
                });

                setBoxesState((prevBoxesState) => {
                  const tempBoxesState = { ...prevBoxesState };
                  tempBoxesState[boxSpriteUid] = 'open';
                  return tempBoxesState;
                });
              }
            }
          }
        });
      }
    });
  }, [startGame, characterSnapShot]);

  useEffect(() => {
    if (
      !Object.keys(sprites).every(
        (spriteUid) => !spriteUid.match(/box[0-9]*contents/)
      )
    ) {
      setSprites((prevSprites) => {
        const tempSprites = { ...prevSprites };
        Object.keys(sprites)
          .filter((spriteUid) => spriteUid.match(/box[0-9]*contents/))
          .forEach((spriteUid) => {
            delete tempSprites[spriteUid];
          });
        return tempSprites;
      });
    }
    Object.keys(boxSnapShot).forEach((uid) => {
      setBoxesState((prevBoxesState) => {
        const tempBoxesState = { ...prevBoxesState };
        tempBoxesState[uid] = 'closed';
        return tempBoxesState;
      });
      setBoxesContents((prevBoxesContents) => {
        const tempBoxesContents = { ...prevBoxesContents };
        tempBoxesContents[uid] = boxSnapShot[uid].contains;
        return tempBoxesContents;
      });
      setSprites((prevSprites) => {
        const sprites = { ...prevSprites };
        sprites[uid] = Pixi.Sprite.from(closedBox);
        sprites[uid].anchor.set(0.5, 0.5);
        sprites[uid].position.set(boxSnapShot[uid].x, boxSnapShot[uid].y);
        return sprites;
      });
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
                          <Header players={players} characters={characters} />
                          <div id="hero">
                            <PixiComponent
                              sprites={sprites}
                              gameApp={gameApp}
                            />

                            <Scores players={players} characters={characters} />
                            <Messaging />
                          </div>

                          {/* <p>User: {username}</p>
                        <p>User: {user}</p> */}

                          <Controls
                            numberOfBoxes={numberOfBoxes}
                            setNumberOfBoxes={setNumberOfBoxes}
                            speed={speed}
                            players={players}
                          />
                          {/* <button onClick={logoutButton}>Logout</button> */}
                        </div>
                      </>
                    )}
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
