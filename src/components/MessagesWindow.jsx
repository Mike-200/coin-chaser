import { useState, useEffect, useContext, useRef } from "react";
import { getAvatar } from "../utils/characters";
import { sendMessageToDB } from "../utils/messaging";

// Assets
import paperPlane from "../assets/send-paper-plane.svg";

// Contexts
import { UsernameContext } from "../contexts/Username";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { PlayersContext } from "../contexts/Players";

const MessagesWindow = ({
  characters,
  listenToMouseOverMessenger,
  stopListenToMouseOverMessenger,
  sortedMessages,
}) => {
  const dummy = useRef();
  const [messageBody, setMessageBody] = useState("");

  const { username } = useContext(UsernameContext);
  const { room } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  const { players } = useContext(PlayersContext);

  function sendMessage(e) {
    e.preventDefault();
    if (messageBody) {
      sendMessageToDB(room, username, messageBody, user);
      setMessageBody("");
    }
  }

  useEffect(() => {
    listenToMouseOverMessenger();
    return stopListenToMouseOverMessenger;
  }, []);

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [dummy.current, sortedMessages]);

  return (
    <div id="stopListenKeys">
      <div id="All__Messages">
        {Object.entries(sortedMessages).map((item) => {
          return (
            <div>
              {username === item[1].username ? (
                <div className="Sent" id="Each__Message" key={item[0]}>
                  {/* <span id="Sent">sent: </span> */}
                  <img
                    alt="avatar"
                    className="Messaging__Avatar"
                    src={getAvatar(players[item[1].user].avatar, characters)}
                  ></img>

                  <p> {item[1].messageBody}</p>
                  <li ref={dummy}></li>
                </div>
              ) : (
                <div className="Received" id="Each__Message" key={item[0]}>
                  {/* <div id="Received">from: {item[1].username}</div> */}
                  <img
                    alt="avatar"
                    className="Messaging__Avatar"
                    src={getAvatar(players[item[1].user].avatar, characters)}
                  ></img>
                  <div> {item[1].messageBody}</div>
                  <li ref={dummy}></li>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <form id="Message__Form">
        <input
          id="Message__Input"
          type="text"
          placeholder="Type your message..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
        ></input>
        <button id="Message__Button" type="submit" onClick={sendMessage}>
          <img src={paperPlane} alt="paper-plane"></img>
        </button>
      </form>
    </div>
  );
};

export default MessagesWindow;
