// import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export async function firebaseUserData(userData) {
  return await firestore().collection('Social-Users').add(userData);
}

export async function getUserData() {
  return await firestore().collection('Social-Users').get();
}

export async function getUserById(uid) {
  return await firestore().collection('Social-Users').doc(uid).get();
}

export async function createThread(thread) {
  return await firestore().collection('Threads').add(thread);
}

export async function sendMessage(id, message) {
  console.log("/Threads",id,message);
  return await firestore()
    .collection('Threads')
    .doc(id)
    .collection('Message')
    .add(id);
}

export async function getMessage(id) {
  return await firestore()
    .collection('Threads')
    .doc(id)
    .collection('Message')
    .orderBy('createdAt', 'asc')
    .get();
}

export function getMessageListener(id, createdAt, userMessage) {
  firestore()
    .collection('Threads')
    .doc(id)
    .collection('Message')
    .where('createdAt', '>', createdAt)
    .orderBy('createdAt', 'asc')
    .onSnapshot(data => {
      data.docs.forEach(e => {
        if (e.data() == null) return
        const newObj = {
          ...e.data(),
          _id: e.id,
        };
        userMessage(newObj);
      });
    });
}

export async function getThread(id, guestId) {
  return await firestore()
    .collection('Threads')
    .where('Social-Users', 'in', [[id, guestId]])
    .get();
}

async function getThreadById(id) {
  return await firestore().collection('Threads').doc(id).get();
}

export function checkThread(user, guest) {
  console.log(user, guest);
  return new Promise((resolve, reject) => {
    getThread(user.uid, guest.uid)
      .then(data => {
        if (data.docs.length > 0) {
          const thread = {
            ...data.docs[0].data(),
            id: data.docs[0].id,
          };
          resolve(thread);
        } else {
          createThread(threadData(user, guest))
            .then(thread => {
              return getThreadById(thread.id);
            })
            .then(e => {
              const thread = {
                ...e.docs[0].data(),
                id: e.docs[0].id,
              };
              resolve(thread);
            })
            .catch(reject);
        }
      })
      .catch(reject);
  });
}

export const searchData = async id => {
  return await firestore().collection('Social-Users').where('uid', '==', id).get();
};

const threadData = (user, guest) => {
  let userObj = {};
  userObj[user.uid] = {
    name: user.name,
    avatar: '',
    id: user.uid,
  };
  userObj[guest.uid] = {
    name: guest.name,
    avatar: '',
    id: guest.uid,
  };
  const userThread = {
    lastMsg: '',
    createdAt: moment().format(),
    updatedAt: moment().format(),
    Users: [user.uid, guest.uid],
    ...userObj,
  };
  return userThread;
};
