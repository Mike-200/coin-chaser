import { useState, useContext, useEffect, useRef } from "react";
import { getAvatar } from "../utils/characters";

// styling
import "../css/messaging.css";

// contexts
import { StartGameContext } from "../contexts/StartGame";
import { UsernameContext } from "../contexts/Username";
import { RoomContext } from "../contexts/Room";
import { UserContext } from "../contexts/User";
import { sendMessageToDB, startListeningToMessages } from "../utils/messaging";

const Messaging = (characters) => {
  const { startGame } = useContext(StartGameContext);
  const { username } = useContext(UsernameContext);
  const { room } = useContext(RoomContext);
  const { user } = useContext(UserContext);

  const [messageBody, setMessageBody] = useState("");
  const [sortedMessages, setSortedMessages] = useState([]);

  useEffect(() => {
    if (startGame) {
      startListeningToMessages(room, setSortedMessages);
    }
  }, [startGame]);

  function sendMessage(e) {
    e.preventDefault();
    if (messageBody) {
      sendMessageToDB(room, username, messageBody, user);
      setMessageBody("");
    }
  }

  const dummy = useRef();

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [dummy.current, sortedMessages]);

  return (
    <div id="Messaging__Window">
      <h2>Chat Messages</h2>
      <div id="All__Messages">
        {Object.entries(sortedMessages).map((item) => {
          return (
            <div>
              {username === item[1].username ? (
                <li className="Sent" id="Each__Message" key={item[0]}>
                  <span id="Sent">sent: </span>
                  <span> {item[1].messageBody}</span>
                  <li ref={dummy}></li>
                </li>
              ) : (
                <li className="Received" id="Each__Message" key={item[0]}>
                  <div id="Received">from: {item[1].username}</div>
                  <img
                    alt="avatar"
                    className="Messanging__Avatar"
                    src={getAvatar(user, characters)}
                  ></img>
                  <div> {item[1].messageBody}</div>
                  <li ref={dummy}></li>
                </li>
              )}
            </div>
          );
        })}
      </div>
      <form id="Message__Form">
        <input
          id="Message__Input"
          type="text"
          placeholder="Enter new message..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
        ></input>
        <button id="Message__Button" type="submit" onClick={sendMessage}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Messaging;
