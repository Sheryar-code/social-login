import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  checkThread,
  sendMessage,
  getMessage,
  getMessageListener,
} from '../Utility/firebaseUtility';
import {GiftedChat} from 'react-native-gifted-chat';
import moment from 'moment';
import { LogBox } from "react-native";


const ConversationScreen = ({route}) => {
  const [userThread, setUserThread] = useState(null);
  const guestData = route.params?.data;
  LogBox.ignoreLogs(["EventEmitter.removeListener"]);
  const user = useSelector(state => state.accountReducer.user);
  const messagesState = useSelector(state => state.messageReducer.message);

  const dispatch = useDispatch();
  useEffect(() => {
    checkThread(user, guestData).then(e => {
      setUserThread(e);
    });
  }, []);
  useEffect(() => {
    if (userThread !== null) {
      getMessage(userThread.id).then(e => {
        let element = [];
        e.docs.forEach(ele => {
          const messageObj = {
            ...ele.data(),
            _id: ele.id,
          };
          element.push(messageObj);
        });
        dispatch({
          type: 'SET_MESSAGES',
          payload: element,
        });
      });
    }
  }, [userThread]);

  const userMessage = msg => {
    dispatch({
      type: 'SET_MESSAGES',
      payload: [msg],
    });
  };

  useEffect(() => {
    if (userThread) {
      // if (messagesState.length > 0) {
      // let index = messagesState.length - 1;
      // let createdAt = messagesState[index].createdAt;
      let createdAt = moment().utc().valueOf();
      getMessageListener(userThread.id, createdAt, userMessage);
    }
    // }
  }, [userThread]);

  const [messages, setMessages] = useState([]);
  console.log('messagesState', messagesState);
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: user.name,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: user.imageUrl,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const obj = {
      _id: messages[0]._id,
      text: messages[0].text,
      createdAt: moment().utc().valueOf(),
      user: {
        _id: user.uid,
        name: user.name,
        avatar: user.imageUrl,
      },
    };

    sendMessage(obj).then(e => {
      console.log('response', e);
    });
    // dispatch({
    //   type: 'SET_MESSAGES',
    //   payload: obj.text,
    // });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: user.uid,
      }}
    />
  );
};

export default ConversationScreen;
