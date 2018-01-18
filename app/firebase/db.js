import * as firebase from 'firebase';
import KEYS from '../../keys.js'

// Initialize Firebase
const firebaseConfig = {
  apiKey: KEYS.firebase,
  authDomain: "arcade-poker.firebaseapp.com",
  databaseURL: "https://arcade-poker.firebaseio.com/",
  // storageBucket: "highscore.appspot.com"
};

firebase.initializeApp(firebaseConfig);

var database = {};

database.fbFriends = firebase.database().ref('/fbfriends');
database.highscores = firebase.database().ref('/highscores');
database.gameRooms = firebase.database().ref('/gameRooms');
database.blitzGame = firebase.database().ref('/blitzGame');
database.uniquePlayers = firebase.database().ref('/uniquePlayers');

export default database;
