import './App.css';
// import Main from './components/Main';
// import Header from './components/Header';
import PixiComponent from './components/PixiComponent';
// import { useState } from 'react';
import * as Pixi from 'pixi.js';
import ninja from './assets/ninja-char.svg';
import firebase from './firebase-config';
import { acceptPlayer, login } from './utils/firebase';
import { useEffect } from 'react';

function App() {
  const auth = firebase.auth();
  const fireDB = firebase.database();
  // const [spriteState, setSpriteState] = useState({
  //   char1: { x: 500, y: 450 },
  //   char2: { x: 10, y: 10 },
  // });

  // Create Sprites & add to stage
  const char1Sprite = Pixi.Sprite.from(ninja);
  char1Sprite.position.set(50, 400);

  // Event Listeners for keypress movements
  let speed = 20;

  document.addEventListener('keydown', function (e) {
    e.preventDefault();
    if (e.key === 'ArrowRight') {
      // char1Sprite.x += speed;
      fireDB
        .ref(
          'rooms/' +
            auth.currentUser.uid +
            '/gameProps/characters/' +
            auth.currentUser.uid
        )
        .set({ x: char1Sprite.x + speed, y: char1Sprite.y });
    }
    // if (e.key === 'ArrowLeft') moveCharacter(char1Sprite, '-x');
    // if (e.key === 'ArrowDown') moveCharacter(char1Sprite, '+y');
    // if (e.key === 'ArrowUp') moveCharacter(char1Sprite, '-y');
  });

  // document.addEventListener('keydown', function (e) {
  //   if (e.keyCode === 68) moveCharacter(char2Sprite, '+x');
  //   if (e.keyCode === 65) moveCharacter(char2Sprite, '-x');
  //   if (e.keyCode === 83) moveCharacter(char2Sprite, '+y');
  //   if (e.keyCode === 87) moveCharacter(char2Sprite, '-y');
  // });

  const loginButton = () => {
    login(auth);
  };

  useEffect(() => {
    if (auth.currentUser) {
      fireDB
        .ref(
          'rooms/' +
            auth.currentUser.uid +
            '/gameProps/characters/' +
            auth.currentUser.uid
        )
        .on('value', (snap) => {
          const { x, y } = snap.val();
          char1Sprite.x = x;
          char1Sprite.y = y;
        });
    }
  }, [auth]);

  return (
    <div className="App">
      {/* <Header /> */}
      <PixiComponent char1Sprite={char1Sprite} />
      <button onClick={loginButton}>Login</button>
      <p>User: {auth.currentUser ? auth.currentUser.uid : null}</p>
      {/* <Main /> */}
    </div>
  );
}

export default App;
