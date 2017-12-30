import { AsyncStorage } from 'react-native';
import { Constants } from 'expo';
import database from '../firebase/db';
import facebookLogin from './facebookLogin';

export default facebookTokenCheck = async () => {
  let token = await AsyncStorage.getItem('fbToken');
  let highscore = await AsyncStorage.getItem('highscore');

  if (token !== null) {
    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    const user = await response.json();

    if (user.error) {
      facebookLogin();
    } else {
      facebookLogin('token');
    }
  }

}
