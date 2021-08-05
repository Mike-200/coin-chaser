import { startNewScreen, updateCharPosition } from '../utils/backend';

// styling
import '../css/controls.css';

// Sprites
import up from '../assets/gamepad-up.svg';
import down from '../assets/gamepad-down.svg';
import left from '../assets/gamepad-left.svg';
import right from '../assets/gamepad-right.svg';
import middle from '../assets/gamepad-middle.svg';
import coin from '../assets/coin.svg';
import rocket from '../assets/shuttle.svg';
import slime from '../assets/splash.svg';

// Contexts
import { useContext } from 'react';
import { RoomContext } from '../contexts/Room';
import { UserContext } from '../contexts/User';
import { SpritesContext } from '../contexts/Sprites';
import { PlayersContext } from '../contexts/Players';
import { GameEventContext } from '../contexts/GameEvent';

const Controls = ({ numberOfBoxes, speed, canvasSize, gameEnd }) => {
  const { room } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  const { sprites } = useContext(SpritesContext);
  const { players } = useContext(PlayersContext);
  const { setGameEvent } = useContext(GameEventContext);

  function NewScreenButton() {
    setGameEvent('');
    startNewScreen(room, user, players, numberOfBoxes);
  }

  function move(arrowOrientation) {
    updateCharPosition(
      room,
      user,
      {
        x: sprites[user].x,
        y: sprites[user].y,
      },
      arrowOrientation,
      speed,
      canvasSize
    );
  }

  return (
    <section className="playing-container">
      <div className="playing-rules">
        <h3>Find the box with a coin to get a point. Get 10 points to win!</h3>

        <div className="playing-powerups">
          {/* <div className="playing-powerups-item">
            <img alt="rocket" src={rocket}></img>
            <p>Increase speed</p>
          </div> */}
          {/* <div className="playing-powerups-item">
            <img alt="slime" src={slime}></img>
            <p>Decrease speed</p>
          </div> */}
        </div>
      </div>

      <div className="playing-controls">
        <div className="playing-powerups-item">
          <img alt="rocket" src={rocket}></img>
          <p>Increase speed</p>
        </div>
        <button
          onClick={() => {
            move('ArrowLeft');
          }}
        >
          <img src={left} alt="arrow left"></img>
        </button>
        <div className="up-down-arrows">
          <button
            onClick={() => {
              move('ArrowUp');
            }}
          >
            <img src={up} alt="arrow up"></img>
          </button>
          <img src={middle} alt="middle"></img>
          <button
            onClick={() => {
              move('ArrowDown');
            }}
          >
            <img src={down} alt="arrow down"></img>
          </button>
        </div>
        <button
          onClick={() => {
            move('ArrowRight');
          }}
        >
          <img src={right} alt="arrow right"></img>
        </button>
        <div className="playing-powerups-item">
          <img alt="slime" src={slime}></img>
          <p>Decrease speed</p>
        </div>
      </div>

      {room === user && !gameEnd ? (
        <button className="logout next-level" onClick={NewScreenButton}>
          Next level
        </button>
      ) : null}
    </section>
  );
};

export default Controls;
