import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {getUserData} from '../Utility/firebaseUtility';
import {useSelector, useDispatch} from 'react-redux';

const ChatScreen = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const user = useSelector(state => state.accountReducer.user);
  const dispatch = useDispatch();




  // useEffect(() => {
  //   getUserData().then(e => {
  //     let arr = [];
  //     e.forEach(data => {
  //       arr.push(data.data());
  //     });
  //     setUserData(arr);
  //   });
  // }, [user]);

  // console.log("userData",userData);
  const logout = () => {
    dispatch({
      type: 'SET_USER',
      payload: '',
    });
    navigation.navigate('LoginScreen');
  };

  return (
    <ScrollView>
      <View style={{marginTop: 20}}>
        <Text
          style={{
            color: 'black',
            fontSize: 22,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          Active Users
        </Text>
        <TouchableOpacity onPress={() => logout()}>
          <Text style={{textAlign: 'center', fontSize: 20, color: 'red'}}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      {/* {userData.map((data, index) => { */}

      <View
        // key={index}
        style={{
          marginHorizontal: 20,
          flexDirection: 'column',
          flex: 1,
          // alignItems:"center",
          // backgroundColor:"#000",
          // alignSelf:"flex-start"
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ConversationScreen', {
              data: user,
            });
          }}
          style={{
            flexDirection: 'row',
            marginVertical: 20,
            backgroundColor: '#e5e5e5',
            flex: 1,
          }}>
          <View>
            <Image
              style={{width: 50, height: 50, borderRadius: 45}}
              source={{uri: user?.imageUrl}}
            />
          </View>
          <View style={{marginLeft: 10, justifyContent: 'center'}}>
            <Text style={{fontSize: 16}}>{user?.name}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* })} */}
    </ScrollView>
  );
};

export default ChatScreen;
