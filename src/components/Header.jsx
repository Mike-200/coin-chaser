import { useContext } from 'react';
import { getAvatar } from '../utils/characters';

// sprites
import coin from '../assets/coin.svg';

// Styling
import '../css/header.css';
import '../assets/fonts/coin.ttf';

// Contexts
import { UserContext } from '../contexts/User';
import { UsernameContext } from '../contexts/Username';
import { PlayersContext } from '../contexts/Players';
import { GameEventContext } from '../contexts/GameEvent';

const Header = ({ characters, logoutButton }) => {
  const { user } = useContext(UserContext);
  const { username } = useContext(UsernameContext);
  const { players } = useContext(PlayersContext);
  const { gameEvent } = useContext(GameEventContext);

  return (
    <header>
      <div className="container top">
        <button className="header-margin logout" onClick={logoutButton}>
          Logout
        </button>
        <div className="Header_name">
          <span>C</span>
          <span>
            <img className="Header_coin" alt="coin" src={coin}></img>
          </span>
          <span>IN CHASER</span>
          <div className="Controls__GameEvent">
            {gameEvent.message ? (
              gameEvent.error ? (
                <p className="event-error">{gameEvent.message}</p>
              ) : (
                <p>{gameEvent.message}</p>
              )
            ) : null}
          </div>
        </div>
        <div className="user">
          <p className="header-margin">{username}</p>
          <img
            id="Header__Avatar"
            alt="avatar"
            src={getAvatar(players[user].avatar, characters)}
          ></img>
        </div>
      </div>
    </header>
  );
};

export default Header;
