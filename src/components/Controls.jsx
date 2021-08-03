import up from "../assets/up-arrow.svg";
import down from "../assets/down-arrow.svg";
import left from "../assets/left-arrow.svg";
import right from "../assets/right-arrow.svg";
import { startNewScreen } from "../utils/backend";
import { updateCharPosition } from "../utils/firebase";

import { useContext } from "react";
import { StartGameContext } from "../contexts/StartGame";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { UsernameContext } from "../contexts/Username";
import { AvatarContext } from "../contexts/Avatar";
import { SpritesContext } from "../contexts/Sprites";
import { PlayersContext } from "../contexts/Players";

import { fireDB } from "../App";

const Controls = ({ numberOfBoxes, speed }) => {
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { room, setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);
  const { username, setUsername } = useContext(UsernameContext);
  const { avatar, setAvatar } = useContext(AvatarContext);
  const { sprites, setSprites } = useContext(SpritesContext);
  const { players, setPlayers } = useContext(PlayersContext);

  function NewScreenButton() {
    startNewScreen(room, user, players, numberOfBoxes);
  }

  return (
    <section className="playing container">
      {room === user ? (
        <button onClick={NewScreenButton}>Next level</button>
      ) : null}
      <div className="playing-controls">
        <img
          onClick={() => {
            updateCharPosition(
              room,
              user,
              {
                x: sprites[user].x,
                y: sprites[user].y,
              },
              "ArrowLeft",
              speed
            );
          }}
          value="left"
          src={left}
          alt="left-arrow"
        ></img>
        <div className="up-down-arrows">
          <img
            onClick={() => {
              updateCharPosition(
                room,
                user,
                {
                  x: sprites[user].x,
                  y: sprites[user].y,
                },
                "ArrowUp",
                speed
              );
            }}
            value="up"
            src={up}
            alt="up-arrow"
          ></img>
          <img
            onClick={() => {
              updateCharPosition(
                room,
                user,
                {
                  x: sprites[user].x,
                  y: sprites[user].y,
                },
                "ArrowDown",
                speed
              );
            }}
            value="down"
            src={down}
            alt="down-arrow"
          ></img>
        </div>
        <img
          onClick={() => {
            updateCharPosition(
              room,
              user,
              {
                x: sprites[user].x,
                y: sprites[user].y,
              },
              "ArrowRight",
              speed
            );
          }}
          value="right"
          src={right}
          alt="right-arrow"
        ></img>
      </div>
    </section>
  );
};

export default Controls;
