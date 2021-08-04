import { useEffect, useState } from 'react';
import { getAvatar } from '../utils/characters';
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
} from '../utils/login';

// styling
import '../css/login.css';
import '../assets/fonts/coin.ttf';

// sprites
import characters from '../utils/characters';
import leftArrow from '../assets/avatar-left-button.svg';
import rightArrow from '../assets/avatar-right-button.svg';
import coin from '../assets/coin.svg';

// contexts
import { useContext } from 'react';
import { StartGameContext } from '../contexts/StartGame';
import { RoomContext } from '../contexts/Room';
import { UserContext } from '../contexts/User';
import { UsernameContext } from '../contexts/Username';
import { AvatarContext } from '../contexts/Avatar';
import { PlayersContext } from '../contexts/Players';

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
      setUsername('empty');
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
      <section className="CardHolder">
        <div className="LoginCard">
          <div className="Login__Name">
            <span>C</span>
            <span>
              <img className="Header_coin" alt="coin" src={coin}></img>
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
      </section>
    );
  else if (!room)
    return (
      <div className="CardHolder">
        <div className="LoggedInCard">
          <div className="pick-your-avatar">
            <h2 className="select">Select</h2>
            <h2 className="your-avatar">Your Avatar</h2>
            <div className="choose-avatar">
              <button className="avatarButton" onClick={previousAvatar}>
                <img alt="previous avatar" src={leftArrow}></img>
              </button>
              <img
                id="LoginAvatar"
                alt="avatar"
                src={getAvatar(avatar, characters)}
              ></img>
              <button className="avatarButton" onClick={nextAvatar}>
                <img alt="next avatar" src={rightArrow}></img>
              </button>
              <br />
              {error ? <p className="errorMessage">{error}</p> : null}
            </div>
          </div>

          <div className="host-new-game">
            <p>Host a new game for other players to join</p>
            <button id="host-game" onClick={host}>
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
            <button className="join" onClick={client}>
              Join
            </button>
            <button className="logout" onClick={logoutButton}>
              Logout
            </button>
          </div>
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
    );
  else if (!startGame) {
    if (room === user)
      return (
        <div className="CardHolder">
          <div className="LoginCard">
            <p>Provide the room key shown below to the other players</p>
            <p className="bold">{room}</p>

            <p>Players already in the game...</p>
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
            <p>Players waiting to join the game...</p>
            {Object.keys(clientsKnocks).map((uid) => (
              <p key={uid}>
                <img
                  alt="avatar"
                  className="avatar"
                  src={getAvatar(clientsKnocks[uid].avatar, characters)}
                ></img>
                {clientsKnocks[uid].username}{' '}
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
