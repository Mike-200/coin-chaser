import { useEffect, useState } from "react";
import { getAvatar } from "../utils/characters";
import {
  login,
  startListeningToNewPlayers,
  knockOnRoom,
  startListeningIfInGame,
  acceptPlayer,
  startListeningToKnocks,
  removeKnockPlayer,
  startGameHost,
  startListeningToStartGame,
} from "../utils/login";

// styling
import "../css/login.css";
import "../assets/fonts/coin.ttf";

// sprites
import characters from "../utils/characters";
import leftArrow from "../assets/avatar-left-button.svg";
import rightArrow from "../assets/avatar-right-button.svg";
import coin from "../assets/coin.svg";

// contexts
import { useContext } from "react";
import { StartGameContext } from "../contexts/StartGame";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { UsernameContext } from "../contexts/Username";
import { AvatarContext } from "../contexts/Avatar";
import { PlayersContext } from "../contexts/Players";

const Login = ({ auth, logoutButton }) => {
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { room, setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);
  const { username, setUsername } = useContext(UsernameContext);
  const { avatar, setAvatar } = useContext(AvatarContext);
  const { players, setPlayers } = useContext(PlayersContext);

  const [roomToBe, setRoomToBe] = useState();
  const [clientsKnocks, setClientsKnocks] = useState({});
  const [error, setError] = useState();
  const [inGame, setInGame] = useState(false);

  function loginButton(e) {
    e.preventDefault();
    if (!username) {
      setUsername("empty");
    }
    login(auth);
  }

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser.uid);
      } else {
        setUser();
      }
    });
  }, []);

  function client() {
    knockOnRoom(roomToBe, user, username, avatar).then((error) => {
      if (error) {
        setError(error);
      } else {
        setError();
        setRoom(roomToBe);
        startListeningIfInGame(roomToBe, user, setInGame);
      }
    });
  }

  function host() {
    setRoom(user);
    acceptPlayer(user, user, username, avatar);
    setInGame(true);
    startListeningToKnocks(user, setClientsKnocks);
  }

  function buttonAcceptPlayer(uid) {
    acceptPlayer(
      room,
      uid,
      clientsKnocks[uid].username,
      clientsKnocks[uid].avatar
    );
    removeKnockPlayer(room, uid);
  }

  useEffect(() => {
    if (room) {
      startListeningToStartGame(room, setStartGame, setPlayers);
      startListeningToNewPlayers(room, setPlayers);
    }
  }, [room]);

  function previousAvatar() {
    setAvatar((avatar) => {
      if (avatar - 1 < 0) {
        return Object.keys(characters).length - 1;
      }
      return avatar - 1;
    });
  }

  function nextAvatar() {
    setAvatar((avatar) => {
      if (avatar + 1 > Object.keys(characters).length - 1) {
        return 0;
      }
      return avatar + 1;
    });
  }

  if (!user)
    return (
      <section className="Card_Holder">
        <div className="Login_Positioning">
          <div className="LoginCard">
            <div className="Login_Name">
              <span>C</span>
              <span>
                <img className="Login_Header_Coin" alt="coin" src={coin}></img>
              </span>
              <span>IN CHASER</span>
            </div>
            <form className="Login__Name_form">
              <p>Enter a username to play</p>

              <input
                type="textbox"
                className="Login__Name_input"
                maxLength="10"
                placeholder="Enter username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
              ></input>
              <button className="Login__Name_button" onClick={loginButton}>
                Enter
              </button>
            </form>
            {error ? <p className="errorMessage">{error}</p> : null}
          </div>
        </div>
      </section>
    );
  else if (!room)
    return (
      <div className="Card_Holder">
        <div className="Login_Positioning">
          <div className="LoginCard">
            <div className="pick-your-avatar">
              <h2>Select your avatar</h2>
              <div className="choose-avatar">
                <button className="avatarButton" onClick={previousAvatar}>
                  <img
                    className="Login_arrow"
                    alt="previous avatar"
                    src={leftArrow}
                  ></img>
                </button>
                <img
                  className="LoginAvatar"
                  alt="avatar"
                  src={getAvatar(avatar, characters)}
                ></img>
                <button className="avatarButton" onClick={nextAvatar}>
                  <img
                    className="Login_arrow"
                    alt="next avatar"
                    src={rightArrow}
                  ></img>
                </button>
                <br />
                {error ? <p className="errorMessage">{error}</p> : null}
              </div>
            </div>

            <div className="host-new-game">
              <p>Host a new game for other players to join</p>
              <button id="host-game" className="host-btn" onClick={host}>
                Host new game
              </button>
              <p className="new-game-p">
                Or enter a room key to join another game
              </p>
              <input
                type="textbox"
                placeholder="Enter room key..."
                onChange={(event) => {
                  setRoomToBe(event.target.value);
                }}
                value={roomToBe}
              ></input>
            </div>

            <div className="host-new-game-buttons">
              <button className="logout" onClick={logoutButton}>
                Logout
              </button>

              <button className="join" onClick={client}>
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  else if (!inGame)
    return (
      <div className="LoginCard">
        <div className="Login_Positioning">
          <div className="Card_Holder">
            <p>Waiting to be let into the game...</p>
            <p>Players already in the game...</p>
            {Object.keys(players).map((uid) => {
              return (
                <p>
                  <img
                    alt="avatar"
                    className="avatar"
                    src={getAvatar(players[uid].avatar, characters)}
                  ></img>
                  {players[uid].username}
                </p>
              );
            })}
            {error ? <p className="errorMessage">{error}</p> : null}
            <button onClick={logoutButton}>Logout</button>
          </div>
        </div>
      </div>
    );
  else if (!startGame) {
    if (room === user)
      return (
        <div className="Card_Holder">
          <div className="Login_Positioning">
            <div className="LoginCard">
              <div className="room_key">
                <p>Provide this room key for other players to join:</p>
                <p className="room">{room}</p>

                <p>Players already joined:</p>
              </div>
              {Object.keys(players).map((uid) => {
                return (
                  <p key={uid}>
                    <img
                      alt="avatar"
                      className="avatar"
                      src={getAvatar(players[uid].avatar, characters)}
                    ></img>
                    {players[uid].username}
                  </p>
                );
              })}
              <p className="room_key">Players waiting to join:</p>
              {Object.keys(clientsKnocks).map((uid) => (
                <p key={uid}>
                  <img
                    alt="avatar"
                    className="avatar"
                    src={getAvatar(clientsKnocks[uid].avatar, characters)}
                  ></img>
                  {clientsKnocks[uid].username}{" "}
                  <button
                    onClick={() => {
                      buttonAcceptPlayer(uid);
                    }}
                  >
                    Accept?
                  </button>
                </p>
              ))}
              <button
                className="startGame"
                onClick={() => {
                  startGameHost(room);
                }}
              >
                Start Game!
              </button>
              {error ? <p className="errorMessage">{error}</p> : null}
            </div>
          </div>
        </div>
      );
    return (
      <div className="Card_Holder">
        <div className="LoginCard">
          <p>The game has not started yet</p>
          <p>Players in the game...</p>
          {Object.keys(players).map((uid) => {
            return (
              <p>
                <img
                  alt="avatar"
                  className="avatar"
                  src={getAvatar(players[uid].avatar, characters)}
                ></img>
                {players[uid].username}
              </p>
            );
          })}
          {error ? <p className="errorMessage">{error}</p> : null}
        </div>
      </div>
    );
  }
};

export default Login;
