import { useContext } from "react";
import { StartGameContext } from "../contexts/StartGame";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { UsernameContext } from "../contexts/Username";
import { AvatarContext } from "../contexts/Avatar";
import { SpritesContext } from "../contexts/Sprites";

import { getAvatar } from "../utils/backend";
import "../css/header.css";
import coin from "../assets/coin.svg";
import "../assets/fonts/coin.ttf";
import { logoutButton } from "../App";

const Header = ({ players, uid, characters }) => {
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { room, setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);
  const { username, setUsername } = useContext(UsernameContext);
  const { avatar, setAvatar } = useContext(AvatarContext);
  const { sprites, setSprites } = useContext(SpritesContext);

  return (
    <header>
      <div className="container">
        <form className="Header_name">
          <span>C</span>
          <span>
            <img className="Header_coin" alt="coin" src={coin}></img>
          </span>
          <span>IN CHASER</span>
        </form>
        <nav>
          <span id="Header__username">
            <div>{username}</div>
            <br></br>
            <button onClick={logoutButton}>Logout</button>
          </span>
          <span>
            {console.log("getavatar>>>", players[user].avatar)}
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
