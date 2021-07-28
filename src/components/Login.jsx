import { useEffect, useState } from "react";
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

  if (!user)
    return (
      <div>
        <form>
          <input
            type="textbox"
            placeHolder="Enter username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          ></input>
          <button onClick={loginButton}>Login</button>
        </form>
      </div>
    );
  else if (!room)
    return (
      <>
        <button onClick={host}>Host</button>
        <br />
        <input
          type="textbox"
          onChange={(event) => {
            setRoomToBe(event.target.value);
          }}
          value={roomToBe}
        ></input>
        <button onClick={client}>Client</button>
        <button onClick={logoutButton}>Logout</button>
      </>
    );
  else if (!inGame)
    return (
      <div>
        <p>Waiting to be let into the game...</p>
        <p>Players in the game...</p>
        {Object.keys(players).map((uid) => {
          return <p>{players[uid]}</p>;
        })}
        <button onClick={logoutButton}>Logout</button>
      </div>
    );
  else if (!startGame) {
    if (room === user)
      return (
        <>
          <button
            onClick={() => {
              startGameHost(fireDB, room);
            }}
          >
            Start Game!
          </button>
          <p>Room: {room}</p>
          <p>Players in the game...</p>
          {Object.keys(players).map((uid) => {
            return <p>{players[uid]}</p>;
          })}
          <p>Players waiting to be let in</p>
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
        </>
      );

    return (
      <>
        <p>The game has not started yet</p>
        <p>Players in the game...</p>
        {Object.keys(players).map((uid) => {
          return <p>{players[uid]}</p>;
        })}
      </>
    );
  }
};

export default Login;
