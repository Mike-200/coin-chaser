import { getAvatar } from '../utils/characters';

// styling
import '../css/scores.css';

// contexts
import { useContext } from 'react';
import { ScoresContext } from '../contexts/Scores.js';
import { PlayersContext } from '../contexts/Players';

// sprites
import crownCoin from '../assets/coin.svg';

const Scores = ({ characters }) => {
  const { scores } = useContext(ScoresContext);
  const { players } = useContext(PlayersContext);

  return (
    <div id="Scores__Window">
      <h2>Scores</h2>
      {Object.keys(players).map((uid) => {
        return (
          <div id="Scores__List">
            <div id="Scores__Characters">
              <div id="Scores__Users">
                <img
                  alt="avatar"
                  id="Scores__Icons"
                  src={getAvatar(players[uid].avatar, characters)}
                ></img>
                {players[uid].username}
              </div>

              <div id="Scores__Scores">
                <p>{scores[uid]}</p>
                <img id="Scores__Icons" alt="coin" src={crownCoin}></img>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Scores;
