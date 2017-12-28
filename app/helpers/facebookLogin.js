import { AsyncStorage } from 'react-native';
import { Constants } from 'expo';
import database from '../firebase/db';


export default facebookLogin = async () => {
  let highscore = await AsyncStorage.getItem('highscore');

  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('183752602209264', {
    permissions: ['public_profile', 'user_friends', 'user_photos'],
  });
  if (type === 'success') {
    // Get the user's name using Facebook's Graph API
    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    const user = await response.json();

    highscore = highscore || 0;

    const response2 = await fetch(`https://graph.facebook.com/${user.id}/friends?access_token=${token}`)
    const friends = await response2.json();


    AsyncStorage.setItem('fbId', user.id);
    AsyncStorage.setItem('fbName', user.name);
    AsyncStorage.setItem('fbToken', token);


    const promises = [];
    let personalPic;
    getFBPics(user.id).then(pic => personalPic = pic);

    friends.data.forEach((friend) => {
      promises.push(getFBPics(friend.id));
    })

    Promise.all(promises).then(fbPics => {
      friends.data.forEach((friend, i) => {
        friend.profilePic = fbPics[i];
      })

      database.fbFriends.child(user.id).child('highscore').once('value', snap => {
        console.log(snap.val(), 'highscore from fb....')
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
      })
    })

    return {
      user: user,
      friends: friends
    }
  }
}

getFBPics = async (id) => {
  const response3 = await fetch(`https://graph.facebook.com/${id}/picture?type=normal`)
  let pic = await response3.url;
  return pic
}
