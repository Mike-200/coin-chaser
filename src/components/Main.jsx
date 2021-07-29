import up from '../assets/up-arrow.svg';
import down from '../assets/down-arrow.svg';
import left from '../assets/left-arrow.svg';
import right from '../assets/right-arrow.svg';
// import { startNewGame, startNewScreen } from '../utils/frontend';

const Main = () => {
  return (
    <section className="playing container">
      <button
      // onClick={() => {
      //   startNewScreen();
      // }}
      >
        New Screen
      </button>

      <button
      // onClick={() => {
      //   startNewGame();
      // }}
      >
        Start Game
      </button>

      <div className="playing-controls">
        <img
          // onClick={() => {
          //   moveCharacter(char1Sprite, '-x');
          // }}
          value="left"
          src={left}
          alt="left-arrow"
        ></img>
        <div className="up-down-arrows">
          <img
            // onClick={() => {
            //   moveCharacter(char1Sprite, '-y');
            // }}
            value="up"
            src={up}
            alt="up-arrow"
          ></img>
          <img
            // onClick={() => {
            //   moveCharacter(char1Sprite, '+y');
            // }}
            value="down"
            src={down}
            alt="down-arrow"
          ></img>
        </div>
        <img
          // onClick={() => {
          //   moveCharacter(char1Sprite, '+x');
          // }}
          value="right"
          src={right}
          alt="right-arrow"
        ></img>
      </div>
    </section>
  );
};

export default Main;