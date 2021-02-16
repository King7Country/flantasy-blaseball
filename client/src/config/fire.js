import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyB3dASusH7T5v4G22EW6OV5tgBQS5n92as",
    authDomain: "flantasy-blaseball.firebaseapp.com",
    projectId: "flantasy-blaseball",
    storageBucket: "flantasy-blaseball.appspot.com",
    messagingSenderId: "310635284339",
    appId: "1:310635284339:web:157e36002c35c26ed4e706",
    measurementId: "G-29D5G6PKEM",
    databaseURL: "https://flantasy-blaseball-default-rtdb.firebaseio.com/",
  };

  const fire = firebase.initializeApp(config);
  export default fire;