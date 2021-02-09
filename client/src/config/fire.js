import firebase from 'firebase';

const config = {
    // apiKey: "AIzaSyB3dASusH7T5v4G22EW6OV5tgBQS5n92as",
    // authDomain: "flantasy-blaseball.firebaseapp.com",
    // projectId: "flantasy-blaseball",
    // storageBucket: "flantasy-blaseball.appspot.com",
    // messagingSenderId: "310635284339",
    // appId: "1:310635284339:web:157e36002c35c26ed4e706",
    // measurementId: "G-29D5G6PKEM",
    // databaseURL: "https://flantasy-blaseball-default-rtdb.firebaseio.com/",

    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket:  process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId:  process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  };

  const fire = firebase.initializeApp(config);
  export default fire;

    // proces.env.REACT_APP_FIREBASE_API_KEY;
    // proces.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
    // proces.env.REACT_APP_FIREBASE_PROJECT_ID;
    // proces.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
    // proces.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
    // proces.env.REACT_APP_FIREBASE_APP_ID;
    // proces.env.REACT_APP_FIREBASE_DATABASE_URL;

    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket:  process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID,
    // measurementId:  process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,