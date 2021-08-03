import '../css/controls.css';
import up from '../assets/up-arrow.svg';
import down from '../assets/down-arrow.svg';
import left from '../assets/left-arrow.svg';
import right from '../assets/right-arrow.svg';
import coin from '../assets/coin.svg';
import rocket from '../assets/shuttle.svg';
import slime from '../assets/splash.svg';
import { startNewScreen } from '../utils/backend';
import { updateCharPosition } from '../utils/firebase';

import { useContext } from 'react';
import { StartGameContext } from '../contexts/StartGame';
import { RoomContext } from '../contexts/Room';
import { UserContext } from '../contexts/User';
import { UsernameContext } from '../contexts/Username';
import { AvatarContext } from '../contexts/Avatar';
import { SpritesContext } from '../contexts/Sprites';

import { fireDB } from '../App';

const Controls = ({ numberOfBoxes, speed, players }) => {
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { room, setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);
  const { username, setUsername } = useContext(UsernameContext);
  const { avatar, setAvatar } = useContext(AvatarContext);
  const { sprites, setSprites } = useContext(SpritesContext);

  function NewScreenButton() {
    startNewScreen(room, user, players, numberOfBoxes);
  }

  return (
    <section className="playing-container">
      <div className="Key__Window">
        <div className="Key__Title">
          <img alt="coin" src={coin}></img>
          <h2>RULES</h2>
          <img alt="coin" src={coin}></img>
        </div>
        <div className="Key__Instructions">
          <p>Be the first to fist to get to the box and win the coin !</p>
          <p>Be the first to collect 10 coins, to win</p>
          <p>Use the arrow keys on your keyboard</p>
          <p>or select the arrow keys at the bottom of the screen</p>
          <p>Be careful as not all the boxes contain coins</p>
          <p>Chat with other players using the messaging system</p>
        </div>
        <div className="Key__AllModifiersContainer">
          <div className="Key__EachModifer">
            <img alt="rocket" src={rocket}></img>
            <p>Finding a rocket in a box will speed you up</p>
          </div>
          <div className="Key__EachModifer">
            <img alt="slime" src={slime}></img>
            <p>Finding slime in a box will slow you down</p>
          </div>
        </div>
      </div>
      <div className="playing-controls">
        <img
          onClick={() => {
            updateCharPosition(
              room,
              user,
              {
                x: sprites[user].x,
                y: sprites[user].y,
              },
              'ArrowLeft',
              speed
            );
          }}
          value="left"
          className="arrow"
          src={left}
          alt="left-arrow"
        ></img>
        <div className="up-down-arrows">
          <img
            onClick={() => {
              updateCharPosition(
                room,
                user,
                {
                  x: sprites[user].x,
                  y: sprites[user].y,
                },
                'ArrowUp',
                speed
              );
            }}
            value="up"
            className="arrow"
            src={up}
            alt="up-arrow"
          ></img>
          <img
            onClick={() => {
              updateCharPosition(
                room,
                user,
                {
                  x: sprites[user].x,
                  y: sprites[user].y,
                },
                'ArrowDown',
                speed
              );
            }}
            value="down"
            className="arrow"
            src={down}
            alt="down-arrow"
          ></img>
        </div>
        <img
          onClick={() => {
            updateCharPosition(
              room,
              user,
              {
                x: sprites[user].x,
                y: sprites[user].y,
              },
              'ArrowRight',
              speed
            );
          }}
          value="right"
          className="arrow"
          src={right}
          alt="right-arrow"
        ></img>
      </div>
      <div className="Buttons__Image">
        {room === user ? (
          <button onClick={NewScreenButton}>Next level</button>
        ) : null}
      </div>
    </section>
  );
};

export default Controls;
