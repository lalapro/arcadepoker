import { AsyncStorage, Alert } from 'react-native';
import database from '../firebase/db';
const FBSDK = require('react-native-fbsdk');
const { LoginManager, AccessToken } = FBSDK;



export default facebookLogin = async (status) => {
  let highscore = await AsyncStorage.getItem('highscore');
  let token = await AsyncStorage.getItem('fbToken');
  if (token === null || status) {
    return LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'user_photos']).then(
      function(result) {
        if (result.isCancelled) {
          // Alert.alert('Login cancelled');
        } else {
          // Alert.alert('Login success with permissions: '
          //   +result.grantedPermissions.toString());
          return AccessToken.getCurrentAccessToken()
          .then((data) => {
            let token = data.accessToken.toString();
            // Alert.alert(token)
            return updateData(highscore, token);
            // console.log(dataToReturn)
          })
        }
      },
      function(error) {
        Alert.alert('Login fail with error: ' + error);
      }
    );
  } else {
    // check if token is valid....
    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    const user = await response.json();
    if (user.error) { // if error exists grab another token
      facebookLogin();
    } else {
      return updateData(highscore, token);
    }
  }
}

updateData = async (highscore, token) => {

  let finished = false;
  const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
  const user = await response.json();

  // console.log(user);

  highscore = highscore || 0;

  const response2 = await fetch(`https://graph.facebook.com/${user.id}/friends?access_token=${token}`)
  const friends = await response2.json();


  AsyncStorage.setItem('fbId', user.id);
  AsyncStorage.setItem('fbName', user.name);
  AsyncStorage.setItem('fbToken', token);


  const promises = [];
  let personalPic;
  getFBPics(user.id).then(pic => {
    database.test.child('hello').set(user)
    personalPic = pic
  });

  friends.data.forEach((friend) => {
    promises.push(getFBPics(friend.id));
  })

  return Promise.all(promises).then(fbPics => {
    friends.data.forEach((friend, i) => {
      friend.profilePic = fbPics[i];
    })

    database.fbFriends.child(user.id).child('highscore').once('value', snap => {
      // console.log(snap.val(), 'highscore from fb....')
      if (snap.val() > highscore) {
        highscore = snap.val();
        AsyncStorage.setItem('highscore', highscore.toString())
      }

      database.fbFriends.child(user.id).set({
        name: user.name,
        friends: [friends.data],
        highscore: highscore,
        fbPic: personalPic
      })
      finished = true;
    })
  }).then(res => {
    return user
  })

}

getFBPics = async (id) => {
  const response3 = await fetch(`https://graph.facebook.com/${id}/picture?type=normal`)
  let pic = await response3.url;
  return pic
}
