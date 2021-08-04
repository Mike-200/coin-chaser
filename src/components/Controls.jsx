import { startNewScreen, updateCharPosition } from "../utils/backend";

// styling
import "../css/controls.css";

// Sprites
import up from "../assets/up-arrow.svg";
import down from "../assets/down-arrow.svg";
import left from "../assets/left-arrow.svg";
import right from "../assets/right-arrow.svg";
import coin from "../assets/coin.svg";
import rocket from "../assets/shuttle.svg";
import slime from "../assets/splash.svg";

// Contexts
import { useContext } from "react";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { SpritesContext } from "../contexts/Sprites";
import { PlayersContext } from "../contexts/Players";
import { GameEventContext } from "../contexts/GameEvent";

const Controls = ({ numberOfBoxes, speed, canvasSize, gameEnd }) => {
  const { room } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  const { sprites } = useContext(SpritesContext);
  const { players } = useContext(PlayersContext);
  const { gameEvent } = useContext(GameEventContext);

  function NewScreenButton() {
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
          <button
            onClick={() => {
              move("ArrowLeft");
            }}
            className="arrow-button"
          >
            <img src={left} alt="arrow left"></img>
          </button>
          <div className="up-down-arrows">
            <button
              onClick={() => {
                move("ArrowUp");
              }}
              className="arrow-button"
            >
              <img src={up} alt="arrow up"></img>
            </button>
            <button
              onClick={() => {
                move("ArrowDown");
              }}
              className="arrow-button"
            >
              <img src={down} alt="arrow down"></img>
            </button>
          </div>
          <button
            onClick={() => {
              move("ArrowRight");
            }}
            className="arrow-button"
          >
            <img src={right} alt="arrow right"></img>
          </button>
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
