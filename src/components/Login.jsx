import { useEffect, useState } from "react";
import { getAvatar } from "../utils/backend";
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
} from "../utils/firebase";
import characters from "../characters";
import leftArrow from "../assets/left-arrow.svg";
import rightArrow from "../assets/right-arrow.svg";

import { useContext } from "react";
import { StartGameContext } from "../contexts/StartGame";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { UsernameContext } from "../contexts/Username";
import { AvatarContext } from "../contexts/Avatar";
import { SpritesContext } from "../contexts/Sprites";

import "../css/login.css";
import coin from "../assets/coin.svg";
import "../assets/fonts/coin.ttf";

import { fireDB } from "../App";

const Login = ({ auth, players, setPlayers, logoutButton }) => {
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { room, setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);
  const { username, setUsername } = useContext(UsernameContext);
  const { avatar, setAvatar } = useContext(AvatarContext);
  const { sprites, setSprites } = useContext(SpritesContext);

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
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser.uid);
        // console.log(authUser);
      } else {
        setUser();
      }
    });
  }, []);

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
      <div className="CardHolder">
        <div className="LoginCard">
          <form>
            <div className="Login__Name">
              <span>C</span>
              <span>
                <img className="Header_coin" alt="coin" src={coin}></img>
              </span>
              <span>IN CHASER</span>
            </div>
            <p>Enter a username to play</p>
            <p>(max 10 characters)</p>
            <input
              type="textbox"
              maxLength="10"
              placeholder="Enter username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            ></input>
            <button onClick={loginButton}>Enter</button>
          </form>
          {error ? <p className="errorMessage">{error}</p> : null}
        </div>
      </div>
    );
  else if (!room)
    return (
      <div className="CardHolder">
        <div className="LoginCard">
          <p>Host a new game for other players to join</p>
          <button onClick={host}>Host new game</button>
          <br />
          <br />
          <div>or</div>
          <p>Enter a room key to join another game</p>
          <input
            type="textbox"
            onChange={(event) => {
              setRoomToBe(event.target.value);
            }}
            value={roomToBe}
          ></input>
          <button onClick={client}>Join</button>
          <br />
          <p>Pick your avatar</p>
          <button onClick={previousAvatar}>
            <img alt="previous avatar" src={leftArrow}></img>
          </button>
          <img
            className="Avatar"
            alt="avatar"
            src={getAvatar(avatar, characters)}
          ></img>
          <button onClick={nextAvatar}>
            <img alt="next avatar" src={rightArrow}></img>
          </button>
          <br />
          {error ? <p className="errorMessage">{error}</p> : null}
          <button onClick={logoutButton}>Logout</button>
        </div>
      </div>
    );
  else if (!inGame)
    return (
      <div className="CardHolder">
        <div className="LoginCard">
          <p>Waiting to be let into the game...</p>
          <p>Players already in the game...</p>
          {Object.keys(players).map((uid) => {
            return (
              <p>
                <img
                  alt="avatar"
                  className="Avatar"
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
    );
  else if (!startGame) {
    if (room === user)
      return (
        <div className="CardHolder">
          <div className="LoginCard">
            <p>Provide the room key shown below to the other players</p>
            <p className="Bold">{room}</p>

            <p>Players already in the game...</p>
            {Object.keys(players).map((uid) => {
              return (
                <p key={uid}>
                  <img
                    alt="avatar"
                    className="Avatar"
                    src={getAvatar(players[uid].avatar, characters)}
                  ></img>
                  {players[uid].username}
                </p>
              );
            })}
            <p>Players waiting to join the game...</p>
            {Object.keys(clientsKnocks).map((uid) => (
              <p key={uid}>
                <img
                  alt="avatar"
                  className="Avatar"
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
              onClick={() => {
                startGameHost(room);
              }}
            >
              Start Game!
            </button>
            {error ? <p className="errorMessage">{error}</p> : null}
          </div>
        </div>
      );

    return (
      <div className="CardHolder">
        <div className="LoginCard">
          <p>The game has not started yet</p>
          <p>Players in the game...</p>
          {Object.keys(players).map((uid) => {
            return (
              <p>
                <img
                  alt="avatar"
                  className="Avatar"
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
