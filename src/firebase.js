import * as firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';

const config = {
  apiKey: "AIzaSyDjsMu6na3PEIottwAfdQe_zezU1lPC3ZM",
  authDomain: "maigo-399b5.firebaseapp.com",
  databaseURL: "https://maigo-399b5.firebaseio.com",
  projectId: "maigo-399b5"
};

const AUTH = 'FJvGdOdKYj0zyLTuAUytNKYDY0j341ZjgNpbDNdU';

firebase.initializeApp(config);
firebase.auth().signInAnonymously()
.catch((error) => {
  console.log (error.code + '\n' + error.message);
})

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // console.log(user.isAnonymous + ' : ' + user.uid);
    // ...
  } else {
    // User is signed out.
    // ...
  }
  // ...
});

// keep secret

export default {
  likes: {
    data: {},
    get: (cb) => {
      axios.get(`https://maigo-399b5.firebaseio.com/likes.json?auth=${AUTH}`)
        .then((succ) => {
          cb(succ.data);
        })
        .catch((err)=> {
          console.log(err);
      });
    },
    getBySeries: (series, cb) => {
      axios.get(`https://maigo-399b5.firebaseio.com/likes/${series}.json?auth=${AUTH}`)
        .then((succ) => {
          cb(succ.data);
        })
        .catch((err)=> {
          console.log(err);
      });
    },
    add: () => {

    },
    delete: () => {

    }
  }
};