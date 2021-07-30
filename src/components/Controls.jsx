import up from "../assets/up-arrow.svg";
import down from "../assets/down-arrow.svg";
import left from "../assets/left-arrow.svg";
import right from "../assets/right-arrow.svg";
import { startNewScreen } from "../utils/frontend";
import { updateCharPosition } from "../utils/firebase";

const Controls = ({
  gameApp,
  boxSpriteClosed,
  fireDB,
  room,
  numberOfBoxes,
  setNumberOfBoxes,
  user,
  speed,
  sprites,
}) => {
  function NewScreenButton() {
    startNewScreen(
      gameApp,
      sprites[user],
      boxSpriteClosed,
      fireDB,
      room,
      numberOfBoxes,
      setNumberOfBoxes
    );
  }

  return (
    <section className="playing container">
      <button onClick={NewScreenButton}>New Screen</button>

      <button
      // onClick={() => {
      //   startNewGame();
      // }}
      >
        Start Game
      </button>

      <div className="playing-controls">
        <img
          onClick={() => {
            updateCharPosition(
              fireDB,
              room,
              user,
              {
                x: sprites[user].x,
                y: sprites[user].y,
              },
              "ArrowLeft",
              speed
            );
          }}
          value="left"
          src={left}
          alt="left-arrow"
        ></img>
        <div className="up-down-arrows">
          <img
            onClick={() => {
              updateCharPosition(
                fireDB,
                room,
                user,
                {
                  x: sprites[user].x,
                  y: sprites[user].y,
                },
                "ArrowUp",
                speed
              );
            }}
            value="up"
            src={up}
            alt="up-arrow"
          ></img>
          <img
            onClick={() => {
              updateCharPosition(
                fireDB,
                room,
                user,
                {
                  x: sprites[user].x,
                  y: sprites[user].y,
                },
                "ArrowDown",
                speed
              );
            }}
            value="down"
            src={down}
            alt="down-arrow"
          ></img>
        </div>
        <img
          onClick={() => {
            updateCharPosition(
              fireDB,
              room,
              user,
              {
                x: sprites[user].x,
                y: sprites[user].y,
              },
              "ArrowRight",
              speed
            );
          }}
          value="right"
          src={right}
          alt="right-arrow"
        ></img>
      </div>
    </section>
  );
};

export default Controls;
