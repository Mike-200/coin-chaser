import { useState, useContext, useEffect, useRef } from "react";
import { StartGameContext } from "../contexts/StartGame";
import { UsernameContext } from "../contexts/Username";
import { RoomContext } from "../contexts/Room";
import { AvatarContext } from "../contexts/Avatar";

import { fireDB } from "../App";

import "../css/messaging.css";

const Messaging = () => {
  const { startGame } = useContext(StartGameContext);
  const { username } = useContext(UsernameContext);
  const { room } = useContext(RoomContext);
  const { avatar } = useContext(AvatarContext);

  const [messageBody, setMessageBody] = useState("");
  const [sortedMessages, setSortedMessages] = useState([]);
  useEffect(() => {
    if (startGame) {
      fireDB.ref("rooms/" + room + "/messages/").on("value", (snap) => {
        if (snap.exists()) {
          setSortedMessages(snap.val());
        }
      });
    }
  }, []);
  //   may need to re-oder the other way round
  //(a, b) => new Date(a.created).valueOf() - new Date(b.created).valueOf()
  // );

  function sendMessage(e) {
    e.preventDefault();
    if (messageBody) {
      const timestamp = Date.now();
      fireDB.ref("rooms/" + room + "/messages/" + timestamp).set({
        username,
        messageBody,
      });
      setMessageBody("");
    }
  }

  const dummy = useRef();

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        // inline: "nearest",
      });
    }
  }, [dummy.current, sortedMessages]);

  return (
    <div id="Messaging__Window">
      <h3>Chat Messages</h3>
      <div id="All__Messages">
        {/* <ul id="Messages__Title">Messages</ul> */}
        {Object.entries(sortedMessages).map((item) => {
          return (
            <div>
              {/* note item[0] is the time */}

              {username === item[1].username ? (
                <li className="Sent" id="Each__Message" key={item[0]}>
                  <span id="Sent">sent: </span>
                  <span> {item[1].messageBody}</span>
                  <li ref={dummy}></li>
                </li>
              ) : (
                <li className="Received" id="Each__Message" key={item[0]}>
                  <div id="Received">from: {item[1].username}</div>
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
