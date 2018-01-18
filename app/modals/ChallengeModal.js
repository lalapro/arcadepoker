import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage, AppState} from 'react-native';
import database from '../firebase/db';
import shuffledDeck from '../helpers/shuffledDeck';
import moment from 'moment';


export default class ChallengeModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      newChallenger: false,
      friendsOnline: [],
      waitingForResponse: false,
      appState: false,
      rejected: false,
      accepted: false,
      countDown: 5
    }
    this.startCountdown = this.startCountdown.bind(this);
    this.clearCountdown = this.clearCountdown.bind(this);
  }

  async componentWillMount() {
    // this.grabOnlineFriends(this.props.fbId);
    this.setState({
      fontLoaded: true,
      isMounted: true,
      rejected: false,
    })
  }

  componentDidMount() {
    // this.startCountdown();
    this.getFriendInfo(this.props.friendId);
    this.listenForAccept(this.props.friendId);
    this.listenForCancel(this.props.friendId);
  }

  listenForAccept(friendId) {
    database.gameRooms.child(friendId).on('value', snap => {
      let friendResponse = snap.val();
      if (friendResponse.accepted === true && this.state.isMounted && this.state.accepted === false) {
        this.setState({accepted: true}, () => {
          this.startCountdown();
        });
      }
    })
  }

  listenForCancel(friendId) {
    database.gameRooms.child(friendId).on('value', snap => {
      let friendResponse = snap.val();
      if (friendResponse.requesting === false && this.state.isMounted) {
        this.clearCountdown();
        this.props.close();
      }
    })
  }


  tick() {
    this.setState({countDown: this.state.countDown - 1});
    if (this.state.countDown === 1) {
      //CREATE GAME ROOM
      var blitzDeck;
      if (this.props.gameMode === 'Blitz') {
        blitzDeck = shuffledDeck('blitz').slice();
      } else {
        blitzDeck = shuffledDeck().slice();
      }
      let timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
      let newGameRoom = database.blitzGame.push({
        deck: blitzDeck,
        playerOne: {
          fbId: this.props.fbId,
          score: 0,
          timestamp: timestamp,
          drawable: true
        },
        timestamp: timestamp
      })
      let roomKey = newGameRoom.key;
      database.gameRooms.child(this.props.friendId).child('blitzRoom').set(roomKey);
      database.gameRooms.child(this.props.fbId).child('blitzRoom').set(roomKey);
      this.setState({roomKey});

    }
    if (this.state.countDown <= 0) {
      this.clearCountdown();
      this.forceUnmount();
      this.props.close('startGame');
    }
  }


  startCountdown() {
    this.timer = setInterval(this.tick.bind(this), 1000);
  }

  clearCountdown() {
    clearInterval(this.timer);
  }

  getFriendInfo(friendId) {
    database.fbFriends.child(friendId).once('value', snap => {
      let friend = snap.val();
      this.setState({
        name: friend.name,
        fbPic: friend.fbPic,
        highscore: friend.highscore,
        waitingForResponse: true
      })
    })
  }

  cancelChallenge() {
    if (this.state.accepted === true) {
      this.resetRequestStatus();
    }
    this.clearCountdown();
    this.setState({
      isMounted: false
    }, () => {
      this.resetRequestStatus();
      this.props.close();
    });
  }

  resetRequestStatus() {
    if (this.props.friendId) {
      database.gameRooms.child(this.props.friendId).child('requesting').set(false);
      database.gameRooms.child(this.props.friendId).child('accepted').set(false);
    }
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false,
      accepted: false,
      rejected: false,
      waitingForResponse: false
    }, () => console.log('unmounting..'))
  }

  forceUnmount() {
    this.setState({
      isMounted: false,
      accepted: false,
      rejected: false,
      waitingForResponse: false
    }, () => console.log('unmounting..'))
  }




  render() {
    return(
        <View style={styles.box}>
          {this.state.rejected ? (
            <View style={[styles.box, {flex: 3}]}>
              <Text style={styles.font}>
                You were rejected...
              </Text>
            </View>
          ) : (null)}
          {this.state.waitingForResponse ? (
            <View style={[styles.box, {flex: 3}]}>
              <View style={styles.box}>
                <Text style={[styles.font, {fontSize: 35, textDecorationLine: 'underline'}]}>
                  {this.props.gameMode} Mode
                </Text>
              </View>
              <View style={[styles.box]}>
                <Text style={styles.font}>
                  You are
                </Text>
                <Text style={styles.font}>
                  challenging...
                </Text>
              </View>
              {this.state.fbPic === 'none' ? (
                //TODO PLACEHOLDER
                null
              ) : (
                <View style={[styles.box, {flex: 2}]}>
                  <Image
                    source={{uri: this.state.fbPic}}
                    style={{width: 100, height: 100, resizeMode: 'contain'}}
                  />
                </View>
              )}
              <View style={[styles.box, {flex: 2}]}>
                <Text style={[styles.font, {fontSize: 20}]}>
                  {this.state.name.replace(/ /g, '  ')}
                </Text>
                <Text style={[styles.font, {fontSize: 20, color: 'gold'}]}>
                  highscore: {this.state.highscore}
                </Text>
              </View>
              {this.state.accepted ? (
                <View style={[styles.box, {flex: 2}]}>
                  <Text style={styles.font}>
                    Game  starting in ...
                  </Text>
                  <Text style={[styles.font, {fontSize: 40}]}>
                    {this.state.countDown}
                  </Text>
                  <TouchableOpacity onPress={() => this.cancelChallenge()}>
                    <Text style={styles.font}>
                      Cancel  Challenge
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
              <View style={[styles.box, {flex: 2}]}>
                <TouchableOpacity onPress={() => this.cancelChallenge()}>
                  <Text style={styles.font}>
                    Cancel  Challenge
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            </View>
          ) : (null)}
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
