import { useContext } from "react";
import { getAvatar } from "../utils/characters";

// sprites
import coin from "../assets/coin.svg";

// Styling
import "../css/header.css";
import "../assets/fonts/coin.ttf";

// Contexts
import { UserContext } from "../contexts/User";
import { UsernameContext } from "../contexts/Username";
import { PlayersContext } from "../contexts/Players";
import { GameEventContext } from "../contexts/GameEvent";

const Header = ({ characters, logoutButton }) => {
  const { user } = useContext(UserContext);
  const { username } = useContext(UsernameContext);
  const { players } = useContext(PlayersContext);
  const { gameEvent } = useContext(GameEventContext);

  return (
    <header>
      <div className="container">
        <div className="Header_name">
          C<img className="Header_coin" alt="coin" src={coin}></img>
          IN CHASER
        </div>
        <br />
        {gameEvent.message ? (
          gameEvent.error ? (
            <span className="event-error">{gameEvent.message}</span>
          ) : (
            <span className="event">{gameEvent.message}</span>
          )
        ) : null}
        <nav>
          <span id="Header__username">
            <div>{username}</div>
            <br />
            <button onClick={logoutButton}>Logout</button>
          </span>
          <span>
            <img
              id="Header__Avatar"
              alt="avatar"
              src={getAvatar(players[user].avatar, characters)}
            ></img>
          </span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
