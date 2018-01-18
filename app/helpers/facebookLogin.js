import { AsyncStorage, Alert, Platform } from 'react-native';
import database from '../firebase/db';
const FBSDK = require('react-native-fbsdk');
const { LoginManager, AccessToken } = FBSDK;
const axios = require('axios');
import uniqueId from 'react-native-unique-id';




export default facebookLogin = async (status) => {
  let highscore = await AsyncStorage.getItem('highscore');
  let token = await AsyncStorage.getItem('fbToken');
  if (token === null || status !== undefined) {
    return LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'user_photos']).then(
      function(result) {
        if (result.isCancelled) {
          // Alert.alert('Login cancelled');
        } else {
          // Alert.alert('Login success with permissions: ')
          //   +result.grantedPermissions.toString());
          return AccessToken.getCurrentAccessToken()
          .then((data) => {
            let token = data.accessToken.toString();
            // Alert.alert(token)
          //   // console.log('AT THE BEGINNING OF FBLOGINS')
            return updateData(highscore, token);
          //   // console.log(dataToReturn)
          })
        }
      },
      function(error) {
        // Alert.alert('Login fail with error: ' + error);
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
  const response2 = await fetch(`https://graph.facebook.com/${user.id}/friends?access_token=${token}`)
  const friends = await response2.json();
  let deviceId;
  uniqueId().then(id => deviceId = id);

  let duelWins = await AsyncStorage.getItem('duelWins');
  let blitzWins = await AsyncStorage.getItem('blitzWins');

  duelWins === null ? duelWins = 0 : duelWins = Number(duelWins);
  blitzWins === null ? blitzWins = 0 : blitzWins = Number(blitzWins);

  AsyncStorage.setItem('fbId', user.id);
  AsyncStorage.setItem('fbName', user.name);
  AsyncStorage.setItem('fbToken', token);

  highscore = highscore || 0;
  let userRef = database.fbFriends.child(user.id).child('highscore');

  return userRef.once('value', snap => {
    let highscoreInDB = snap.val();
    if (Number(highscore) > Number(highscoreInDB)) {
      userRef.set(highscore);
      AsyncStorage.setItem('highscore', highscore.toString());
    } else if (Number(highscoreInDB) > Number(highscore)) {
      highscore = highscoreInDB;
      AsyncStorage.setItem('highscore', highscoreInDB.toString());
    }
    user.highscore = highscore;
  }).then(res => {

    if (Platform.OS === 'android') return user
    const promises = [];
    let personalPic;
    return getFBPics(user.id).then(pic => {
      personalPic = pic
    }).then(wait => {
      friends.data.forEach((friend) => {
        promises.push(getFBPics(friend.id));
      })

      return Promise.all(promises).then(fbPics => {
        friends.data.forEach((friend, i) => {
          friend.profilePic = fbPics[i];
        })

        database.fbFriends.child(user.id).child('highscore').once('value', snap => {
          database.fbFriends.child(user.id).set({
            name: user.name,
            friends: [friends.data],
            highscore: highscore,
            deviceId: deviceId,
            fbPic: personalPic,
            duelWins: duelWins,
            blitzWins: blitzWins
          })
          finished = true;
        })
      }).then(res => {
        return user
      })
    })
  })

  //TODO FOR BLITZ MODe
  // const promises = [];
  // let personalPic;
  // return getFBPics(user.id).then(pic => {
  //   // database.test.child('hello').set(pic)
  //   personalPic = pic
  // }).then(wait => {
  //   friends.data.forEach((friend) => {
  //     promises.push(getFBPics(friend.id));
  //   })
  //
  //   return Promise.all(promises).then(fbPics => {
  //     friends.data.forEach((friend, i) => {
  //       friend.profilePic = fbPics[i];
  //     })
  //     console.log('INSIDE UPDATE DATA, after PROMISESS', personalPic)
  //     database.fbFriends.child(user.id).child('highscore').once('value', snap => {
  //       // console.log(snap.val(), 'highscore from fb....')
  //       if (snap.val() > highscore) {
  //         highscore = snap.val();
  //         AsyncStorage.setItem('highscore', highscore.toString())
  //       }
  //       database.fbFriends.child(user.id).set({
  //         name: user.name,
  //         friends: [friends.data],
  //         highscore: highscore,
  //         fbPic: personalPic
  //       })
  //       finished = true;
  //     })
  //   }).then(res => {
  //     console.log('INSIDE UPDATE DATA, RIGHT BEFORE . THENNNN', user)
  //     return user
  //   })
  // })

}

getFBPics = async (id) => {
  // let numID = Number(id);
  if (Platform.OS === 'android') {
    return 'none';
  } else {
    response3 = await fetch(`https://graph.facebook.com/${id}/picture?type=normal`)
    let pic = await response3.url;
    return pic
  }
}
