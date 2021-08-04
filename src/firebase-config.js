import firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyBbWAhWsfXaun3H3rE7DDmUk62Nmi3Ylyo",
  authDomain: "coin-chaser-c9e8e.firebaseapp.com",
  databaseURL:
    "https://coin-chaser-c9e8e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "coin-chaser-c9e8e",
  storageBucket: "coin-chaser-c9e8e.appspot.com",
  messagingSenderId: "86279962983",
  appId: "1:86279962983:web:0d4812c2ed000310daefc2",
  measurementId: "G-G6WKWWVNF6",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
