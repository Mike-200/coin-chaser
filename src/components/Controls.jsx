import { startNewScreen, updateCharPosition } from "../utils/backend";

// styling
import "../css/controls.css";

// Sprites
import up from "../assets/up-arrow.svg";
import down from "../assets/down-arrow.svg";
import left from "../assets/left-arrow.svg";
import right from "../assets/right-arrow.svg";

// Contexts
import { useContext } from "react";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { SpritesContext } from "../contexts/Sprites";
import { PlayersContext } from "../contexts/Players";

const Controls = ({ numberOfBoxes, speed, canvasSize }) => {
  const { room } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  const { sprites } = useContext(SpritesContext);
  const { players } = useContext(PlayersContext);

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
    <section className="container">
      {room === user ? (
        <button onClick={NewScreenButton}>Next level</button>
      ) : null}
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
    </section>
  );
};

export default Controls;
