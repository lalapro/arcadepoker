import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import { Font } from 'expo';
import database from '../firebase/db';


export default class HereComesANewChallengerModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      highscore: '',
      fontLoaded: false,
      accepted: false,
      countdown: 5,
      fbId: null
    }
  }

  async componentWillMount() {
    this.getChallengerDetails();
    let fbId = await AsyncStorage.getItem('fbId')
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
      fbId: fbId
    })
  }

  getChallengerDetails() {
    database.fbFriends.child(this.props.challenger).once('value', snap => {
      let friend = snap.val();
      this.setState({
        name: friend.name,
        fbPic: friend.fbPic,
        highscore: friend.highscore,
        friendId: this.props.challenger
      })
    })
  }

  tick() {
    this.setState({countdown: this.state.countdown - 1});
    if (this.state.countdown <= 0) {
      clearInterval(this.interval);
      this.props.close('startGame')
    }
  }


  acceptChallenge() {

    this.setState({
      accepted: true
    })
    database.gameRooms.child(this.state.fbId).child('accepted').set(true);

    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  cancelChallenge() {
    clearInterval(this.interval);
    this.props.close('cancelChallenge', this.state.fbId);
  }


  render() {
    // console.log(this.state.friendsOnline)
    return(
      this.state.fontLoaded ? (
        <View style={styles.box}>
          {this.state.accepted ? (
            <View style={[styles.box, {flex: 3}]}>
              <Text style={styles.font}>
                Game  starting in ...
              </Text>
              <Text style={[styles.font, {fontSize: 40}]}>
                {this.state.countdown}
              </Text>
            </View>
          ) : (null)}
          <View style={[styles.box, {flex: 3}]}>
            <View style={styles.box}>
              <Text style={styles.font}>
                You are
              </Text>
              <Text style={styles.font}>
                challenged by...
              </Text>
            </View>
            <View style={styles.box}>
              <Image
                source={{uri: this.state.fbPic}}
                style={{width: 50, height: 50, resizeMode: 'contain'}}
              />
            </View>
            <View style={styles.box}>
              <Text style={[styles.font, {fontSize: 20}]}>
                {this.state.name.replace(/ /g, '  ')}
              </Text>
              <Text style={[styles.font, {fontSize: 20}]}>
                highscore: {this.state.highscore}
              </Text>
            </View>
          </View>
          {this.state.accepted ? (
            <View style={styles.box}>
              <TouchableOpacity onPress={this.cancelChallenge.bind(this)}>
                <Text style={styles.font}>
                  Cancel Match
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.box}>
              <TouchableOpacity onPress={this.acceptChallenge.bind(this)}>
                <Text style={[styles.font, {fontSize: 20}]}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.cancelChallenge.bind(this)}>
                <Text style={[styles.font, {fontSize: 20}]}>
                  Maybe not...
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (null)
    )
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    width: "100%"
  },
  font: {
    fontFamily: 'arcade',
    fontSize: 20,
    color: 'white'
  },
})
