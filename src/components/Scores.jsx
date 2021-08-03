import '../css/scores.css';

import { useContext } from 'react';
import { StartGameContext } from '../contexts/StartGame';
import { RoomContext } from '../contexts/Room';
import { UserContext } from '../contexts/User';
import { UsernameContext } from '../contexts/Username';
import { AvatarContext } from '../contexts/Avatar';
import { SpritesContext } from '../contexts/Sprites';
import { ScoresContext } from '../contexts/Scores.js';
import { PlayersContext } from '../contexts/Players';

import { getAvatar } from '../utils/backend';
import crownCoin from '../assets/coin.svg';

const Scores = ({ characters }) => {
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { room, setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);
  const { username, setUsername } = useContext(UsernameContext);
  const { avatar, setAvatar } = useContext(AvatarContext);
  const { sprites, setSprites } = useContext(SpritesContext);
  const { scores } = useContext(ScoresContext);
  const { players, setPlayers } = useContext(PlayersContext);

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
