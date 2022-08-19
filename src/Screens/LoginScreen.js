import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {firestores, auths} from '../Utility/firebaseUtil';
import auth from '@react-native-firebase/auth';
// import 'firebase/database';
import firebase from '@react-native-firebase/app';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {firebaseUserData, searchData} from '../Utility/firebaseUtility';

const credentials = {
  clientId:
    '127753223118-hb24iflsrn68mc2eig24btun2r72afpl.apps.googleusercontent.com',
  appId: '1:127753223118:android:af96bf51a1b847c170c99f',
  apiKey: 'AIzaSyC6o1cRI1qewzeyUJQNktG76j3IBF3ppgs',
  databaseURL: 'https://assignment-7d7e0.firebaseio.com',
  storageBucket: 'assignment-7d7e0.appspot.com',
  messagingSenderId: '',
  projectId: 'assignment-7d7e0',
};




if (!firebase.apps.length) {
  const app = firebase.initializeApp(credentials);
  // firebase.initializeApp(credentials);
}
// FACEBOOK LOGIN FUNCTION
function onFacebookButtonPress() {
  return LoginManager.logInWithPermissions(['public_profile', 'email'])
    .then(ele => {
      if (ele.isCancelled) {
        throw 'user cancelled';
      } else {
        return AccessToken.getCurrentAccessToken();
      }
    })
    .then(ele => {
      if (!ele) {
        throw 'Something went wrong obtaining access token';
      } else {
        return ele;
      }
    })
    .then(ele2 => {
      return firebase.FacebookAuthProvider.credential(ele2.accessToken);
    })
    .then(ele3 => {
      return firebase().signInWithCredential(ele3);
    })
    .catch(e => {
      console.log(e, 'Error');
    });
}

function onGoogleButtonPress() {
  // Get the users ID token
  return GoogleSignin.signIn()
    .then(e => {
      // Create a Google credential with the token
      return auth.GoogleAuthProvider.credential(e.idToken);
    })
    .then(ele => {
      // Sign-in the user with the credential
      return auth().signInWithCredential(ele);
    })
    .catch(error => console.log(error, 'Login Error'));
}

const LoginScreen = ({navigation}) => {
  const user = useSelector(state => state.accountReducer);
  console.log('user', user);
  const dispatch = useDispatch();



  useEffect(() => {
    // dispatch({
    //   type: 'SET_USER',
    //   payload: null,
    // });
  }, []);

  GoogleSignin.configure({
    webClientId:
      '127753223118-0l54u6593kj1mcaf64uv0166ccqm9f6a.apps.googleusercontent.com',
  });
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: '#DB4437',
            paddingVertical: 20,
            paddingHorizontal: 50,
            borderRadius: 5,
            marginBottom: 20,
          }}
          title="Google Sign-In"
          onPress={() => {
            onGoogleButtonPress()
              .then(e => {
                obj = {
                  name: e.user.displayName,
                  email: e.user.email,
                  uid: e.user.uid,
                  imageUrl: e.user.photoURL,
                };
                return searchData(e.user.uid);
              })
              .then(e => {
                if (e.docs.length > 0) {
                  dispatch({
                    type: 'SET_USER',
                    payload: obj,
                  });
                  navigation.navigate('ChatScreen');
                } else {
                  return firebaseUserData(obj);
                }
              })
              .then(e => {
                dispatch({
                  type: 'SET_USER',
                  payload: obj,
                });
                navigation.navigate('ChatScreen');
              })
              .catch(error => console.log(error));
          }}>
          <Text style={{color: 'white', fontWeight: '700'}}>GOOGLE LOGIN</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: '#4267B2',
            paddingVertical: 20,
            paddingHorizontal: 50,
            borderRadius: 5,
          }}
          onPress={() => {
            let obj = {};
            onFacebookButtonPress()
              .then(e => {
                obj = {
                  name: e.user.displayName,
                  email: e.user.email,
                  uid: e.user.uid,
                  imageUrl: e.user.photoURL,
                };
                return searchData(e.user.uid);
              })
              .then(e => {
                if (e.docs.length > 0) {
                  dispatch({
                    type: 'SET_USER',
                    payload: obj,
                  });
                  navigation.navigate('ConversationScreen');
                } else {
                  return firebaseUserData(obj);
                }
              })
              .then(e => {
                dispatch({
                  type: 'SET_USER',
                  payload: obj,
                });
                navigation.navigate('ChatScreen');
              })
              .catch(error => console.log(error));
          }}>
          <Text style={{color: 'white', fontWeight: '700'}}>
            FACEBOOK LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
