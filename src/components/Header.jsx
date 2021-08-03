// Styling
import "../css/header.css";
import "../assets/fonts/coin.ttf";

// Dependencies
import { useContext } from "react";
import { getAvatar } from "../utils/backend";
import coin from "../assets/coin.svg";

// Contexts
import { StartGameContext } from "../contexts/StartGame";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { UsernameContext } from "../contexts/Username";
import { AvatarContext } from "../contexts/Avatar";
import { SpritesContext } from "../contexts/Sprites";
import { PlayersContext } from "../contexts/Players";
import { GameEventContext } from "../contexts/GameEvent";

const Header = ({ characters, logoutButton }) => {
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { room, setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);
  const { username, setUsername } = useContext(UsernameContext);
  const { avatar, setAvatar } = useContext(AvatarContext);
  const { sprites, setSprites } = useContext(SpritesContext);
  const { players, setPlayers } = useContext(PlayersContext);
  const { gameEvent } = useContext(GameEventContext);

  return (
    <header>
      <div className="container">
        <button onClick={logoutButton}>Logout</button>

        <div className="Header_name">
          <span>C</span>
          <span>
            <img className="Header_coin" alt="coin" src={coin}></img>
          </span>
          <span>IN CHASER</span>
        </div>

        {/* {gameEvent.message ? (
          gameEvent.error ? (
            <span className="event-error">{gameEvent.message}</span>
          ) : (
            <span className="event">{gameEvent.message}</span>
          )
        ) : null} */}

        <div className="user">
          <p>{username}</p>
          <img
            id="Header__Avatar"
            alt="avatar"
            src={getAvatar(players[user].avatar, characters)}
          ></img>
        </div>

        {/* <div className="Header_name">
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
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
