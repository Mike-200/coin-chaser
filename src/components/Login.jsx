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
import rightArrow from "../assets/right-arrow.svg"




const Login = ({
  fireDB,
  auth,
  username,
  setUsername,
  setUser,
  players,
  setPlayers,
  setRoom,
  inGame,
  setInGame,
  startGame,
  setStartGame,
  user,
  room,
  logoutButton,
  avatar,
  setAvatar,
}) => {
  const loginButton = (e) => {
    e.preventDefault();
    if (!username) {
      setUsername("empty");
    }
    login(auth);
  };

  const [roomToBe, setRoomToBe] = useState();
  const [clientsKnocks, setClientsKnocks] = useState({});

  function client() {
    setRoom(roomToBe);
    knockOnRoom(fireDB, roomToBe, user, username);
    startListeningIfInGame(fireDB, roomToBe, user, setInGame);
  }

  function host() {
    setRoom(user);
    acceptPlayer(fireDB, user, user, username);
    setInGame(true);
    startListeningToKnocks(fireDB, user, setClientsKnocks);
  }

  function buttonAcceptPlayer(uid) {
    acceptPlayer(fireDB, room, uid, clientsKnocks[uid]);
    removeKnockPlayer(fireDB, room, uid);
  }

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser.uid);
      } else {
        setUser();
      }
    });
  });

  useEffect(() => {
    if (room) {
      startListeningToStartGame(fireDB, room, setStartGame, setPlayers);
      startListeningToNewPlayers(fireDB, room, setPlayers);
    }
  }, [fireDB, room]);

  function previousAvatar() {
    setAvatar(avatar => { 
      if (avatar - 1 < 0) {
        return Object.keys(characters).length - 1
      } 
      return avatar -1;
    })
  }

  function nextAvatar() {
    setAvatar(avatar => {
      if (avatar + 1 > Object.keys(characters).length - 1) {
        return 0;
      }
      return avatar + 1;
    })
  }

  if (!user)
    return (
      <div className="CardHolder">
        <div className="LoginCard">
          <form>
            <p className="Logo">COIN CHASER</p>
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
          <img className="Avatar" alt="avatar" src={getAvatar(avatar,characters)}></img>
          <button onClick={nextAvatar}>
            <img alt="next avatar" src={rightArrow}></img>
          </button>
          <br />
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
            return <p>{players[uid]}</p>;
          })}
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
              return <p>{players[uid]}</p>;
            })}
            <p>Players waiting to be join...</p>
            {Object.keys(clientsKnocks).map((uid) => (
              <p key={uid}>
                {clientsKnocks[uid]}{" "}
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
                startGameHost(fireDB, room);
              }}
            >
              Start Game!
            </button>
          </div>
        </div>
      );

    return (
      <div className="CardHolder">
        <div className="LoginCard">
          <p>The game has not started yet</p>
          <p>Players in the game...</p>
          {Object.keys(players).map((uid) => {
            return <p>{players[uid]}</p>;
          })}
        </div>
      </div>
    );
  }
};

export default Login;
