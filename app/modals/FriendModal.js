import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';


export default class FriendModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  async fbLogin() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync("183752602209264", {
        permissions: ['public_profile'],
      });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      Alert.alert(
        'Logged in!',
        `Hi ${(await response.json()).name}!`,
      );
    }
  }

  render() {
    return(
      this.state.fontLoaded ? (
        <View>
          <TouchableOpacity onPress={this.fbLogin.bind(this)}>
            <Text style={styles.font}>
              Login   with    facebook?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.close()}>
            <Text style={styles.font}>
              Login   with    facebook?
            </Text>
          </TouchableOpacity>
        </View>
      ) : (null)
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'arcade',
    fontSize: 20,
  },
})
