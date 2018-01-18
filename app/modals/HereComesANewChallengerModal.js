import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage, Alert} from 'react-native';
import database from '../firebase/db';


export default class HereComesANewChallengerModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      highscore: '',
      accepted: false,
      countdown: 5,
      fbId: null,
      isMounted: false,
      gameMode: 'Blitz'
    }
  }

  async componentWillMount() {
    this.getChallengerDetails();
    let fbId = await AsyncStorage.getItem('fbId')
    this.setState({
      fbId: fbId,
      isMounted: true
    }, () => {
      this.listenForCancel();
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
    });
    // Alert.alert(JSON.stringify(this.props.challenger))
    database.gameRooms.child(this.props.challenger).child('gameMode').once('value', snap => {
      if (snap.val()) {
        let gameMode = snap.val();
        this.setState({gameMode});
      }
    });
  }

  tick() {
    this.setState({countdown: this.state.countdown - 1});
    if (this.state.countdown <= 0) {
      clearInterval(this.interval);
      this.setState({
        isMounted: false
      }, () => this.props.close('startGame', null, this.state.gameMode))
    }
  }


  acceptChallenge() {

    this.setState({
      accepted: true
    }, () => {
      this.interval = setInterval(this.tick.bind(this), 1000);
    })
    database.gameRooms.child(this.state.fbId).child('accepted').set(true);

  }

  cancelChallenge() {
    clearInterval(this.interval);
    this.props.close('cancelChallenge', this.state.fbId);
  }

  listenForCancel() {
    database.gameRooms.child(this.state.fbId).child('requesting').on('value', snap => {
      let requestStatus = snap.val();
      if (requestStatus === false && this.state.isMounted) {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.setState({
          isMounted: false
        }, () => this.props.close())
      }
    })
  }


  render() {
    // console.log(this.state.friendsOnline)
    return(
        <View style={styles.box}>
          <View style={[styles.box, {flex: 3}]}>
            <View style={styles.box}>
              <Text style={[styles.font, {fontSize: 35, textDecorationLine: 'underline'}]}>
                {this.state.gameMode} Mode
              </Text>
            </View>
            <View style={[styles.box]}>
              <Text style={styles.font}>
                You are
              </Text>
              <Text style={styles.font}>
                challenged by...
              </Text>
            </View>
            <View style={[styles.box, {flex: 2}]}>
              <Image
                source={{uri: this.state.fbPic}}
                style={{width: 100, height: 100, resizeMode: 'contain'}}
              />
            </View>
            <View style={[styles.box, {flex: 2}]}>
              <Text style={[styles.font, {fontSize: 20}]}>
                {this.state.name.replace(/ /g, '  ')}
              </Text>
              <Text style={[styles.font, {fontSize: 20, color:'gold'}]}>
                highscore: {this.state.highscore}
              </Text>
            </View>
            {this.state.accepted ? (
              <View style={[styles.box, {flex:2}]}>
                <Text style={styles.font}>
                  Game  starting in ...
                </Text>
                <Text style={[styles.font, {fontSize: 40}]}>
                  {this.state.countdown}
                </Text>
                <TouchableOpacity onPress={this.cancelChallenge.bind(this)}>
                  <Text style={styles.font}>
                    Cancel Match
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.box, {flex:2}]}>
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
      </View>
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
    fontFamily: 'ArcadeClassic',
    fontSize: 20,
    color: 'white'
  },
})
