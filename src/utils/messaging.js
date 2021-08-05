import { fireDB } from "../App";

export function startListeningToMessages(room, setMessages) {
  fireDB.ref("rooms/" + room + "/messages/").on("value", (snap) => {
    if (snap.exists()) {
      setMessages(snap.val());
    }
  });
}

export function sendMessageToDB(room, username, messageBody, user) {
  const timestamp = Date.now();
  fireDB.ref("rooms/" + room + "/messages/" + timestamp).set({
    username,
    messageBody,
    user,
  });
}
