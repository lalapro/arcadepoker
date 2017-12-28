import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage, AppState} from 'react-native';
import { Font, Constants } from 'expo';
import database from '../firebase/db';
import shuffledDeck from '../helpers/shuffledDeck'


export default class ChallengeModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fontLoaded: false,
      newChallenger: false,
      friendsOnline: [],
      waitingForResponse: false,
      appState: false,
      rejected: false,
      countdown: 5
    }
  }

  async componentWillMount() {
    this.grabOnlineFriends(this.props.fbId);
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
      isMounted: true,
      rejected: false
    })
  }

  grabOnlineFriends(fbId) {
    database.fbFriends.child(fbId).child('friends').once('value', snap => {
      let friends = snap.val()[0];
      friends.forEach((friend, i) => {
        database.gameRooms.child(friend.id).child('online').on('value', snap => {
          if (this.state.isMounted && !this.state.accepted) {
            if (snap.val() === true) {
              this.setState({
                friendsOnline: [...this.state.friendsOnline, friend]
              })
            } else {

              for(let i = 0; i < this.state.friendsOnline.length; i++) {
                if (this.state.friendsOnline[i].id === friend.id) {
                  let spliceIndex = i;
                  this.state.friendsOnline.splice(i, 1);
                  this.setState({
                    friendsOnline: this.state.friendsOnline
                  })
                  break;
                }
              }
            }
          }
        })
      })
    })
  }

  challengeFriend(friend) {
    let friendId = friend.id;
    this.setState({friendId})
    database.gameRooms.child(friendId).child('online').once('value', snap => {
      if(snap.val() === true) {
        database.gameRooms.child(friendId).child('requesting').set(this.props.fbId)
      }
    }).then(res => {
      this.getFriendInfo(friendId);
      this.listenForResponse(friendId)
    })
  }

  tick() {
    this.setState({countdown: this.state.countdown - 1});
    if (this.state.countdown === 1) {
      //CREATE GAME ROOM
      let newGameRoom = database.blitzGame.push({
        deck: shuffledDeck('blitz').slice(),
        playerOne: this.props.fbId
      })
      let roomKey = newGameRoom.key;
      database.gameRooms.child(this.state.friendId).child('blitzRoom').set(roomKey);
      database.gameRooms.child(this.props.fbId).child('blitzRoom').set(roomKey);
      this.setState({roomKey});

    }
    if (this.state.countdown <= 0) {
      clearInterval(this.interval);
      this.props.close('startGame')
    }
  }

  listenForResponse(friendId) {
    database.gameRooms.child(friendId).child('requesting').on('value', data => {
      let challenger = data.val();
      if (challenger === false && this.state.isMounted) {
        clearInterval(this.interval);
        this.setState({
          rejected: true,
          accepted: false,
          waitingForResponse: false
        })
      } else if (challenger === true && !this.state.accepted) {
        console.log('this shoudl trigeer...')
        this.interval = setInterval(this.tick.bind(this), 1000);
        this.setState({
          accepted: true
        })
      }
    })
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
    console.log('cancel challege mmodal')
    this.resetRequestStatus();
    this.props.close();
  }

  resetRequestStatus() {
    if (this.state.friendId) {
      database.gameRooms.child(this.state.friendId).child('requesting').set(false);
    }
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false
    })
  }



  render() {
    return(
      this.state.fontLoaded ? (
        <View style={styles.box}>
          {this.state.rejected ? (
            <View style={[styles.box, {flex: 3}]}>
              <Text style={styles.font}>
                You were rejected...
              </Text>
            </View>
          ) : (null)}
          {this.state.accepted ? (
            <View style={[styles.box, {flex: 3}]}>
              <Text style={styles.font}>
                Game  starting in ...
              </Text>
              <Text style={styles.font}>
                {this.state.countdown}
              </Text>
            </View>
          ) : (null)}
          {!this.state.waitingForResponse ? (
            !this.state.rejected ? (
              <View style={[styles.box, {flex: 3}]}>
                {this.state.friendsOnline.map((friend, i) => {
                  let name = friend.name.slice(0, 10);
                  let space = name.indexOf(' ');
                  if (space > 0) { name = name.slice(0, space); };
                  return (
                    <View style={[styles.box, {flexDirection: 'row'}]} key={i}>
                      <View style={styles.box}>
                        <Image
                          source={{uri: friend.profilePic}}
                          style={{width: 40, height: 40, resizeMode: 'contain'}}
                        />
                      </View>
                      <View style={styles.box}>
                        <TouchableOpacity onPress={() => this.challengeFriend(friend)}>
                          <Text style={styles.font}>
                            {name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })}
              </View>
            ) : (null)
          ) : (
            <View style={[styles.box, {flex: 3}]}>
              <View style={styles.box}>
                <Text style={styles.font}>
                  You are
                </Text>
                <Text style={styles.font}>
                  challenging...
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
          )}
          {this.state.rejected ? (
            <TouchableOpacity onPress={() => this.setState({rejected: false})} style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={styles.font}>
                Back to friends list
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.cancelChallenge()} style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={styles.font}>
                Back
              </Text>
            </TouchableOpacity>
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
