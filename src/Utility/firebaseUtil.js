import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import  auth from '@react-native-firebase/auth';
import { initializeApp, getApp } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';
import { getAuth } from "@react-native-firebase/auth";

// Your secondary Firebase project credentials...
const credentials = {
  clientId: "127753223118-hb24iflsrn68mc2eig24btun2r72afpl.apps.googleusercontent.com",
  appId: '1:127753223118:android:af96bf51a1b847c170c99f',
  apiKey: 'AIzaSyC6o1cRI1qewzeyUJQNktG76j3IBF3ppgs',
  databaseURL: 'https://assignment-7d7e0.firebaseio.com',
  storageBucket: "assignment-7d7e0.appspot.com",
//   messagingSenderId: '',
  projectId: "assignment-7d7e0",
};


// if (firebase.apps.length === 0) {
//     firebase.initializeApp(credentials);
// }

// firebase.firestore();

if (!firebase.apps.length) {
    firebase.initializeApp(credentials);
  }
  
  export const auths = firebase.auth();
  export const firestores = firebase.firestore()