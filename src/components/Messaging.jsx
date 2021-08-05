import { useState, useEffect, useContext } from "react";
import MessagesWindow from "./MessagesWindow";
import { startListeningToMessages } from "../utils/messaging";

// styling
import "../css/messaging.css";

// Assets
import chatDownArrow from "../assets/chat-down-arrow.svg";
import chatUpArrow from "../assets/chat-up-arrow.svg";

// Contexts
import { RoomContext } from "../contexts/Room";

const Messaging = ({
  characters,
  stopListenToMouseOverMessenger,
  listenToMouseOverMessenger,
}) => {
  const { room } = useContext(RoomContext);

  const [isOpen, setIsOpen] = useState(false);
  const [sortedMessages, setSortedMessages] = useState([]);

  function toggleCollapse() {
    setIsOpen((isOpen) => !isOpen);
  }

  useEffect(() => {
    startListeningToMessages(room, setSortedMessages);
  }, []);

  return (
    <div>
      {!isOpen && (
        <div
          id="Messaging__Window"
          className="closed_chat"
          onClick={toggleCollapse}
        >
          <h2>Click to chat!</h2>
          <img src={chatUpArrow} alt="chat-up-arrow"></img>
        </div>
      )}

      {isOpen && (
        <div id="Messaging__Window" className="open_chat">
          <div className="Messaging__Title" onClick={toggleCollapse}>
            <h2>Coin Chat!</h2>
            <img src={chatDownArrow} alt="chat-down-arrow"></img>
          </div>
          <MessagesWindow
            characters={characters}
            listenToMouseOverMessenger={listenToMouseOverMessenger}
            stopListenToMouseOverMessenger={stopListenToMouseOverMessenger}
            sortedMessages={sortedMessages}
          />
        </div>
      )}
    </div>
  );
};

export default Messaging;
