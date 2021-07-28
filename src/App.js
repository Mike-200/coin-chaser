import './App.css';
// import Main from './components/Main';
// import Header from './components/Header';
import PixiComponent from './components/PixiComponent';
import * as Pixi from 'pixi.js';
import ninja from './assets/ninja-char.svg';
import firebase from './firebase-config';
import { login, updateCharPosition } from './utils/firebase';
import { useEffect, useState } from 'react';

function App() {
  const auth = firebase.auth();
  const fireDB = firebase.database();

  const char1Sprite = Pixi.Sprite.from(ninja);
  char1Sprite.position.set(50, 400);

  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser.uid);
      } else {
        setUser();
      }
    });
  });

  useEffect(() => {
    if (user) {
      console.log('I ran once');
      fireDB
        .ref(
          'rooms/' +
            auth.currentUser.uid +
            '/gameProps/characters/' +
            auth.currentUser.uid
        )
        .set({ x: char1Sprite.x, y: char1Sprite.y });
      fireDB
        .ref('rooms/' + user + '/gameProps/characters/' + user)
        .on('value', (snap) => {
          const { x, y } = snap.val();
          console.log(x, y);
          char1Sprite.x = x;
          char1Sprite.y = y;
        });
      let speed = 20;

      document.addEventListener('keydown', function (e) {
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
  }, [user]);

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

  const loginButton = () => {
    login(auth);
  };

  return (
    <div className="App">
      {/* <Header /> */}
      {user ? <PixiComponent char1Sprite={char1Sprite} /> : null}
      <button onClick={loginButton}>Login</button>
      <p>User: {user}</p>
      {/* <Main /> */}
    </div>
  );
}

export default App;
