import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, AsyncStorage, TextInput } from 'react-native';
import { Font, Constants } from 'expo';
import facebookLogin from '../helpers/facebookLogin';
import database from '../firebase/db'
import moment from 'moment';
import facebookTokenCheck from '../helpers/facebookTokenCheck';



export default class HallOfFame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fontLoaded: false,
      leaderBoard: [],
      friendLeaderBoard: [],
      board1: 'black',
      board2: 'white',
      currentBoard: 'Top 100',
      newChallenger: 0,
      blinky: false,
      text: '_ _ _ _ _ _ _ _ _',
      textArray: ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
      fakeText: '',
      positionToInject: -1,
      isMounted: false,
      submitted: false
    }
  }

  async componentDidMount() {
    let isMounted = true;
    this.setState({isMounted}, () => this.getHighscores());

    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
      submitted: false,
    })
  }

  getHighscores() {
    let newChallenger = this.props.newChallenger;
    this.setState({newChallenger});
    let deviceId = Constants.deviceId;
    let positionToInject = newChallenger.rank;
    let scoreToInject = newChallenger.score;
    let loadReady = true;
    let leaderBoard = this.state.leaderBoard;


    database.highscores.limitToLast(100).on('value', (snap) => {
      // console.log('called after close2222222', this.state.isMounted)
      if (snap.val() && this.state.isMounted) {
        leaderBoard = Object.entries(snap.val()).reverse();
        let newLeaderBoard = [];
        leaderBoard.forEach(scoreEntry => {
          let keys = Object.keys(scoreEntry[1]) // get all instances of score
          for(let i = 0; i < keys.length; i++) { // for each key, store into array
            if (newLeaderBoard.length < 100) {
              let eachUser = scoreEntry[1][keys[i]];
              newLeaderBoard.push([scoreEntry[0], eachUser]);
            }
          }
        })
        leaderBoard = newLeaderBoard;
        while(leaderBoard.length < 100) {
          leaderBoard.push(["0", ["id", 'AAA']])
        }
        if (positionToInject > 0) {
          positionToInject = positionToInject - 1;
          leaderBoard.splice(positionToInject, 0, [scoreToInject, [deviceId, this.state.text]]);
          leaderBoard.pop();
          // this.insertName = setInterval(this.blinky.bind(this), 750)
          // this.setState({insertName})
        }
      } else if (newChallenger && this.state.isMounted) {
        positionToInject = 0;
        leaderBoard = [];
        while(leaderBoard.length < 100) {
          leaderBoard.push(["0", ["id", 'AAA']])
        }
        leaderBoard.splice(positionToInject, 0, [scoreToInject, [deviceId, this.state.text]]);
        leaderBoard.pop();
        // this.setState({insertName2})
      } else if (this.state.isMounted){
        while(leaderBoard.length < 100) {
          leaderBoard.push(["0", ["id", 'AAA']])
        }
      }
      if (this.state.isMounted) {
        this.setState({leaderBoard, positionToInject, loadReady}, () => {
          this.insertName = setInterval(this.blinky.bind(this), 750)
        })
      }
    })
  }

  blinky() {
    // console.log('called after close?')
    this.setState({
      blinky: !this.state.blinky
    })
  }



  switchBoard(boardToSwitch) {

    if (boardToSwitch === 'Friends' && this.state.currentBoard !== 'Friends') {
      if(this.state.friendLeaderBoard.length === 0) this.getFriendStats();
      this.setState({
        board1: 'white',
        board2: 'black',
        currentBoard: 'Friends'
      })
    } else if (boardToSwitch === 'Top 100' && this.state.currentBoard !== 'Top 100') {
      if (this.state.leaderBoard.length === 0) this.getHighscores();
      this.setState({
        board1: 'black',
        board2: 'white',
        currentBoard: 'Top 100'
      })
    }
  }

  async getFriendStats() {
    const fbId = await AsyncStorage.getItem('fbId');
    const fbName = await AsyncStorage.getItem('fbName');
    let highscore = await AsyncStorage.getItem('highscore');
    let fbToken = await AsyncStorage.getItem('fbToken')
    this.setState({ownerName: fbName})
    if (fbId === null || fbToken === null) {
      facebookLogin().then(resObj => {
        let user = resObj.user;
        let friends = resObj.friends;
        this.setState({ownerName: user.name})
        highscore = highscore || 0;
        this.props.updateScore(user.id);
        this.getScoresFromFriends(user.id, user.name, highscore);
      })
    } else {
      facebookTokenCheck().then(resObj => {
        this.getScoresFromFriends(fbId, fbName, highscore);
      })
    }

  }

  getFBPics = async (id) => {
    const response3 = await fetch(`https://graph.facebook.com/${id}/picture?type=normal`)
    let pic = await response3.url;
    return pic
  }


  getScoresFromFriends(user, name, highscore) {
    database.fbFriends.child(user).once('value', (snap) => {
      if (snap.val()) {
        let friendLeaderBoard = snap.val().friends[0];
        friendLeaderBoard.push({
          id: user,
          name: name,
          score: highscore
        })
        friendLeaderBoard.forEach((friend, i) => {
          database.fbFriends.child(friend.id).on('value', (snap) => {
            if (snap.val()) {
              let newFriendHighscore = snap.val().highscore || 0;
              friend.highscore = newFriendHighscore;
              this.state.isMounted ? this.sortFriendsByScore(friendLeaderBoard) : null
            }
          })
        })
      }
    })
  }

  sortFriendsByScore(friendLeaderBoard) {
    friendLeaderBoard.sort((a, b) => {
      if (a.highscore === undefined) {
        return 1;
      } else if (b.highscore === undefined) {
        return -1;
      } else {
        return b.highscore - a.highscore;
      }
    });
    let youIndex = null;
    friendLeaderBoard.forEach((friend, i) => {
      if (friend.name === this.state.ownerName) {
        youIndex = i;
      }
    })
    this.setState({friendLeaderBoard, youIndex})
  }

  scrollAnimate(e) {
    //TODO need to fix
    console.log(e.nativeEvent)
    let positionToAdd = Math.round(this.state.positionToInject/10)*10
    if (this.state.positionToInject >= 0) {
      let y = e.nativeEvent.target;
      y = (y / e.nativeEvent.layout.height) * (this.state.positionToInject) + positionToAdd;
      this.refs.scrollz.scrollTo({x: 0, y: y, animated: true})
    }
  }


  async close() {
    if (this.state.positionToInject >= 0 && !this.state.submitted && this.state.isMounted) {
      this.setState({isMounted: false})
      clearInterval(this.insertName);
      this.checkIfPersonalHigh();
      let deviceId = Constants.deviceId;
      let highscore = this.state.newChallenger.score;
      let name = this.state.fakeText;
      let timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
      if (name === '') name = 'magikarp'
      scoreToSave = [deviceId, name]
      database.highscores.child(highscore).child(timestamp).set(scoreToSave);
      this.setState({submitted:true}, () => this.props.close('over'))

    } else {
      clearInterval(this.insertName);
      console.log('closing?')
      this.props.close();
    }
  }

  async checkIfPersonalHigh() {
    let personalHigh = await AsyncStorage.getItem('highscore');
    let fbId = await AsyncStorage.getItem('fbId');

    if (this.state.newChallenger.score > personalHigh) {
      AsyncStorage.setItem('highscore', this.state.newChallenger.score.toString());
      this.storeToFB(fbId, this.state.newChallenger.score);
    } else if (personalHigh === undefined){
      AsyncStorage.setItem('highscore', this.state.newChallenger.score.toString());
      this.storeToFB(fbId, this.state.newChallenger.score);
    }
  }

  storeToFB(fbId, newHigh) {
    if (fbId) {
      database.fbFriends.child(fbId).child('highscore').set(newHigh)
    }
  }


  reFocus() {
    this.refs.textInput.focus()
  }

  enterName(text) {
    if (text.length < 10) {
      let fakeText = text;
      text = text.split('');
      while (text.length < 9) {
        text.push(' _');
      }
      let textArray = text;
      text = text.join('');
      this.setState({text, fakeText, textArray});
    }
  }

  checkIfOwner(ownerCheck) {
    if (Array.isArray(ownerCheck)) {
      let deviceId = Constants.deviceId;
      return ownerCheck[1][0] === deviceId ? 'gold' : 'white';
    } else if (typeof ownerCheck === 'number') {
      // console.log(ownerCheck)
      return ownerCheck === this.state.youIndex ? 'gold' : 'white';
    } else {
      return 'white';
    }
  }


  arcadifyScore(num) {
    num = num || '0';
    let digits = num.toString().split('');
    while(digits.length < 7) {
      digits.unshift('0');
    }
    return digits.join('')
  }

  arcadifyRank(num, arr) {
    if (!num) return '';
    let digits = num.toString();
    let lastDigit = digits[digits.length - 1]
    if (lastDigit === '1' && digits.length === 1) {
      return (
        <View key={num} style={{flexDirection: 'row'}}>
          <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(arr)}]}>
            {digits}
          </Text>
          <Text style={[styles.font, {fontSize: 12, color: this.checkIfOwner(arr)}]}>
            st
          </Text>
        </View>
      )
    }
    else if (lastDigit === '2' && digits.length === 1) {
      return (
        <View key={num} style={{flexDirection: 'row'}}>
          <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(arr)}]}>
            {digits}
          </Text>
          <Text style={[styles.font, {fontSize: 12, color: this.checkIfOwner(arr)}]}>
            nd
          </Text>
        </View>
      )
    } else if (lastDigit === '3' && digits.length === 1) {
      return (
        <View key={num} style={{flexDirection: 'row'}}>
          <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(arr)}]}>
            {digits}
          </Text>
          <Text style={[styles.font, {fontSize: 12, color: this.checkIfOwner(arr)}]}>
            rd
          </Text>
        </View>
      )
    } else {
      return (
        <View key={num} style={{flexDirection: 'row'}}>
          <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(arr)}]}>
            {digits}
          </Text>
          <Text style={[styles.font, {fontSize: 12, color: this.checkIfOwner(arr)}]}>
            th
          </Text>
        </View>
      )
    }
  }



  leaderBoardRender() {
    return (
      <ScrollView
        style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
        contentContainerStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: "100%"}}
        ref={"scrollz"}
        onLayout={(e) => this.scrollAnimate(e)}
      >
        <View style={[styles.box, {width: "100%"}]}>
          {this.state.leaderBoard.map((hs, i) => (
            this.arcadifyRank(i + 1, hs)
          ))}
        </View>
        <View style={[styles.box, {width: "100%", flex: 2}]}>
          {this.state.leaderBoard.map((hs, i) => (
            <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(hs)}]} key={i}>
              {this.arcadifyScore(hs[0])}
            </Text>
          ))}
        </View>
        <View style={[styles.box, {width: "100%", alignItems: 'flex-start'}]}>
          {this.state.leaderBoard.map((hs, i) => {
            if (i === this.state.positionToInject) {
              return (
                this.state.blinky ? (
                  <View style={{flexDirection: 'row'}} key={i}>
                    {this.state.textArray.map((char, x) => {
                      if (char === ' _') {
                        return (
                          <Text style={[styles.font, {fontSize: 14, color: 'yellow'}]} key={x} onPress={this.reFocus.bind(this)}>
                            {char}
                          </Text>
                        )
                      } else {
                        return (
                          <Text style={[styles.font, {fontSize: 14, color: 'yellow'}]} key={x} onPress={this.reFocus.bind(this)}>
                            {char}
                          </Text>
                        )
                      }
                    })}
                  </View>
                ) : (
                  <Text style={[styles.font, {fontSize: 14, color: 'yellow'}]} key={i}>
                    {this.state.fakeText}
                  </Text>
                )
              )
            }
            if (i < 10) {
              return (
                <View key={i} style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../assets/trophy.png')}
                    style={{top:2, left: -15, width: 10, height: 10, resizeMode: 'contain', position: 'absolute'}}
                  />
                  <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(hs)}]} key={i}>
                      {hs[1][1]}
                  </Text>
                </View>
              )
            } else {
              return (
                <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(hs)}]} key={i}>
                  {hs[1][1]}
                </Text>
              )
            }
          })}
        </View>
      </ScrollView>
    )
  }

  friendLeaderBoardRender() {
    return (
      <ScrollView
        style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
        contentContainerStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: "100%"}}
        ref={"scrollz"}
        onLayout={(e) => this.scrollAnimate(e)}
      >
        <View style={[styles.box, {width: "100%"}]}>
          {this.state.friendLeaderBoard.map((hs, i) => (
            this.arcadifyRank(i + 1, i)
          ))}
        </View>
        <View style={[styles.box, {width: "100%", flex: 2}]}>
          {this.state.friendLeaderBoard.map((hs, i) => (
            <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(i)}]} key={i}>
              {this.arcadifyScore(hs.highscore)}
            </Text>
          ))}
        </View>
        <View style={[styles.box, {width: "100%", alignItems: 'flex-start'}]}>
          {this.state.friendLeaderBoard.map((hs, i) => {
            let name = hs.name.slice(0, 10);
            let space = name.indexOf(' ');
            if (space > 0) {
              name = name.slice(0, space);
            }
            return (
              <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(i)}]} key={i}>
                {name}
              </Text>
            )
          })}
        </View>
      </ScrollView>
    )
  }

  componentWillUnmount() {
    let isMounted = false;
    this.setState({isMounted})
  }



  render() {
    return(
      this.state.fontLoaded && this.state.loadReady ? (
        <View style={styles.container}>
          <View style={[styles.box, {backgroundColor:'black'}]}>
            <Text style={styles.font}>
              highscores
            </Text>
          </View>
          <View style={[styles.box, {flex: 0.8, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'black', alignItems: 'flex-start'}]}>
            <View style={[styles.box, {backgroundColor: this.state.board2, borderRadius: 4}]}>
              <Text style={[styles.font, {fontSize: 25, color: this.state.board1}]} onPress={() => this.switchBoard('Top 100')}>
                Top 100
              </Text>
            </View>
            <View style={[styles.box, {backgroundColor: this.state.board1, borderRadius: 4}]}>
              <Text style={[styles.font, {fontSize: 25, color: this.state.board2}]} onPress={() => this.switchBoard('Friends')}>
                Friends
              </Text>
            </View>
          </View>
          <View style={[styles.box, {flex: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', width: "80%"}]}>
            <View>
              <Text style={[styles.font, {fontSize: 23, textDecorationLine: 'underline'}]}>
                Rank
              </Text>
            </View>
            <View>
              <Text style={[styles.font, {fontSize: 23, textDecorationLine: 'underline'}]}>
                Score
              </Text>
            </View>
            <View>
              <Text style={[styles.font, {fontSize: 23, textDecorationLine: 'underline'}]}>
                Name
              </Text>
            </View>
          </View>
          <View style={{flex: 6, backgroundColor: 'black', position: 'relative', width: "100%"}}>
            {this.state.currentBoard === 'Top 100' ? this.leaderBoardRender() : this.friendLeaderBoardRender()}
          </View>
          <View style={styles.box}>
            <TouchableOpacity onPress={() => this.close()}>
              <Text style={styles.font}>
                Close
              </Text>
            </TouchableOpacity>
            {this.state.positionToInject >= 0 ? (
              <TextInput
                ref={"textInput"}
                onChangeText={(fakeText) => this.enterName(fakeText)}
                value={this.state.fakeText}
                autoFocus={true}
              />
            ) : (null)}
          </View>
        </View>
      ) : (
        <View>
          <Text style={[styles.font, {color: 'black'}]}>
            Loading...
          </Text>
        </View>
      )
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: "100%",
    alignItems: 'center',
    position: 'relative'
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "90%"
  },
  font: {
    fontFamily: 'arcade',
    fontSize: 50,
    color: 'white'
  }
})


// if (fbId === null) {
//   console.log('asking for permission...')
//   const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('183752602209264', {
//     permissions: ['public_profile', 'user_friends', 'user_photos'],
//   });
//   if (type === 'success') {
//     // Get the user's name using Facebook's Graph API
//     const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
//     const user = await response.json()
//
//     AsyncStorage.setItem('fbId', user.id);
//     AsyncStorage.setItem('fbName', user.name);
//     this.setState({ownerName: user.name})
//     highscore = highscore || 0;
//
//     console.log(highscore, 'highscore from async...')
//     const response2 = await fetch(`https://graph.facebook.com/${user.id}/friends?access_token=${token}`)
//     const friends = await response2.json();
//
//     const promises = [];
//
//     friends.data.forEach((friend) => {
//       promises.push(this.getFBPics(friend.id));
//     })
//     Promise.all(promises).then(fbPics => {
//       friends.data.forEach((friend, i) => {
//         friend.profilePic = fbPics[i];
//       })
//
//       //TODO do logic to check if highscore is greater than what is stored in database...
//       this.props.database.ref('/fbfriends').child(user.id).child('highscore').once('value', snap => {
//         console.log(snap.val(), 'highscore from fb....')
//         if (snap.val() > highscore) {
//           highscore = snap.val();
//           AsyncStorage.setItem('highscore', highscore.toString())
//         }
//
//         this.props.database.ref('/fbfriends').child(user.id).set({
//           name: user.name,
//           friends: [friends.data],
//           highscore: highscore
//         }).then(res => {
//           this.props.updateScore(user.id);
//           this.getScoresFromFriends(user.id, user.name, highscore);
//         })
//       })
//       console.log('is this happening first?')
//     })
//   }
// } else {
//   this.getScoresFromFriends(fbId, fbName, highscore)
// }
