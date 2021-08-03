import "../css/controls.css";
import up from "../assets/up-arrow.svg";
import down from "../assets/down-arrow.svg";
import left from "../assets/left-arrow.svg";
import right from "../assets/right-arrow.svg";
import coin from "../assets/coin.svg";
import rocket from "../assets/shuttle.svg";
import slime from "../assets/splash.svg";
import { startNewScreen } from "../utils/backend";
import { updateCharPosition } from "../utils/firebase";

import { useContext } from "react";
import { StartGameContext } from "../contexts/StartGame";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { UsernameContext } from "../contexts/Username";
import { AvatarContext } from "../contexts/Avatar";
import { SpritesContext } from "../contexts/Sprites";
import { PlayersContext } from "../contexts/Players";
import { GameEventContext } from "../contexts/GameEvent";

import { fireDB } from "../App";

const Controls = ({ numberOfBoxes, speed, canvasSize }) => {
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { room, setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);
  const { username, setUsername } = useContext(UsernameContext);
  const { avatar, setAvatar } = useContext(AvatarContext);
  const { sprites, setSprites } = useContext(SpritesContext);
  const { players, setPlayers } = useContext(PlayersContext);
  const { gameEvent, setGameEvent } = useContext(GameEventContext);

  function NewScreenButton() {
    startNewScreen(room, user, players, numberOfBoxes);
  }

  return (
    <section className="playing-container">
      <div className="Rules__Window">
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
          {/* <p>Chat with other players using the messaging system</p> */}
        </div>
      </div>
      <div>
        <div className="Controls__GameEvent">
          {gameEvent.message ? (
            gameEvent.error ? (
              <span className="event-error">{gameEvent.message}</span>
            ) : (
              <span className="event">{gameEvent.message}</span>
            )
          ) : null}
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
                "ArrowLeft",
                speed,
                canvasSize
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
                  "ArrowUp",
                  speed,
                  canvasSize
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
                  "ArrowDown",
                  speed,
                  canvasSize
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
                "ArrowRight",
                speed,
                canvasSize
              );
            }}
            value="right"
            className="arrow"
            src={right}
            alt="right-arrow"
          ></img>
        </div>
      </div>
      <div className="Buttons__Image">
        <div className="Key__AllModifiersContainer">
          <div>
            <div className="Key__EachModifer">
              <p>Rockets speed you up</p>
              <img alt="rocket" src={rocket}></img>
            </div>
            <div className="Key__EachModifer">
              <p>Slime slows you down</p>
              <img alt="slime" src={slime}></img>
            </div>
          </div>
          {room === user ? (
            <button onClick={NewScreenButton}>Next level</button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Controls;
