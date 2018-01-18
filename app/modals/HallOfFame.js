import React from 'react';
import { Platform, Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, AsyncStorage, TextInput, Alert } from 'react-native';
import facebookLogin from '../helpers/facebookLogin';
import database from '../firebase/db'
import moment from 'moment';
import uniqueId from 'react-native-unique-id';
const {height, width} = Dimensions.get('window');


const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz'.split('');


export default class HallOfFame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      submitted: false,
      iPhone5s: false,
      android: false
    }
  }

  async componentDidMount() {
    if (Platform.OS === 'android') this.setState({android: true})
    if (width === 320) this.setState({iPhone5s: true})

    this.setState({
      isMounted: true,
      submitted: false,
    }, () => this.getHighscores());
  }

  async getHighscores() {
    let deviceId = await AsyncStorage.getItem('__uniqueId');
    this.setState({uniqueId: deviceId});


    let newChallenger = this.props.newChallenger;
    this.setState({newChallenger});
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
    console.log('called after close?')
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

  getFriendStats() {
    facebookLogin().then(user => {
      if (user !== undefined) {
        this.setState({ownerName: user.name})
        this.props.updateScore(user);
        this.getScoresFromFriends(user.id, user.name, user.highscore);
      }
    })
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

  scrollAnimate(w, h) {
    let inject = this.state.positionToInject;
    if (inject > 10) {
      let y = h * (inject/100) - 50;
      this.refs.scrollz.scrollTo({x: 0, y: y, animated: true})
    }
  }


  async close() {
    let deviceId = await AsyncStorage.getItem('__uniqueId');
    if (this.state.positionToInject >= 0 && !this.state.submitted && this.state.isMounted) {
      this.setState({isMounted: false})
      clearInterval(this.insertName);
      this.checkIfPersonalHigh();
      let highscore = this.state.newChallenger.score;
      let name = this.state.fakeText;
      let timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
      if (name === '') {
        let random = ['magikarp', 'oddish', 'squirtle', 'jabroni', 'bulbasaur'];
        let index = this.getRandomIndex(0, random.length);
        name = random[index];
      }
      scoreToSave = [deviceId, name];
      uniqueSave = [name, highscore];
      database.highscores.child(highscore).child(timestamp).set(scoreToSave);
      this.setState({submitted:true}, () => this.props.close('over'))

    } else {
      clearInterval(this.insertName);
      this.setState({isMounted: false})
      this.props.close();
    }
  }

  getRandomIndex(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
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

    let deviceId = this.state.uniqueId;
    // console.log(deviceId);
    if (Array.isArray(ownerCheck)) {
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
        // onLayout={(e) => this.scrollAnimate(e)}
        onContentSizeChange={(w,h) => this.scrollAnimate(w, h)}
      >
        <View style={[styles.box, {width: "100%"}]}>
          {this.state.leaderBoard.map((hs, i) => (
            <View style={{flex: 1}} key={i*10}>
              {this.arcadifyRank(i + 1, hs)}
            </View>
          ))}
        </View>
        <View style={[styles.box, {width: "100%", flex: 2, zIndex: 1}]}>
          {this.state.leaderBoard.map((hs, i) => {
            if (i < 10) {
              return (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%", height: "100%"}} key={i}>
                  <Text style={[styles.font, {fontSize: 15, color: 'black'}]}>
                    1
                  </Text>
                  <Text style={[styles.font, {fontSize: 15, color: this.checkIfOwner(hs)}]}>
                    {this.arcadifyScore(hs[0])}
                  </Text>
                  <Image
                    source={require('../assets/icons/trophy.png')}
                    style={{left: -5, width: 10, height: 10, resizeMode: 'contain'}}
                  />
                </View>
              )
            } else {
              return (
                <Text style={[styles.font, {fontSize: 15, color: this.checkIfOwner(hs)}]} key={i}>
                  {this.arcadifyScore(hs[0])}
                </Text>
              )
            }
          })}
        </View>
        <View style={[styles.box, {width: "100%", alignItems: 'flex-start', zIndex: 3, height: '100%'}]}>
          {this.state.leaderBoard.map((hs, i) => {
            if (i === this.state.positionToInject) {
              return (
                this.state.blinky ? (
                  <View style={{flexDirection: 'row'}} key={i}>
                    {this.state.textArray.map((char, x) => {
                      if (char === ' _') {
                        return (
                          <Text style={[styles.font, {fontSize: 14, color: 'gold'}]} key={x} onPress={this.reFocus.bind(this)}>
                            {char}
                          </Text>
                        )
                      } else {
                        return (
                          <Text style={[styles.font, {fontSize: 14, color: 'gold'}]} key={x} onPress={this.reFocus.bind(this)}>
                            {char}
                          </Text>
                        )
                      }
                    })}
                  </View>
                ) : (
                  <Text style={[styles.font, {fontSize: 14, color: 'gold'}]} key={i}>
                    {this.state.fakeText}
                  </Text>
                )
              )
            }
            let name = hs[1][1];
            let emoji = false;
            name.codePointAt(0).toString().length >= 6 ? emoji = name : null
            name = name.split('');
            if (emoji) {
              return (
                <Text style={[styles.font, {fontSize: 12, color: this.checkIfOwner(hs)}]} key={i}>
                  {emoji}
                </Text>
              )
            } else {
              return (
                <View style={{flexDirection: 'row', flex: 1}} key={i}>
                  {name.map((char, idx) => {
                    if (ALPHABETS.includes(char.toLowerCase())) {
                      return <Text style={[styles.font, {fontSize: 14, color: this.checkIfOwner(hs)}]} key={idx}>
                        {char}
                      </Text>
                    } else {
                      return <Text style={[styles.font, {fontSize: 11.5, color: this.checkIfOwner(hs)}]} key={idx}>
                        {char}
                      </Text>
                    }
                  })}
                </View>
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
      <View style={styles.container}>
        <View style={[styles.box, {backgroundColor:'black'}]}>
          {this.state.iPhone5s ? (
            <Text style={[styles.font, {fontSize: 30}]}>
              highscores
            </Text>
          ) : (
            <Text style={styles.font}>
              highscores
            </Text>
          )}
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
        {this.state.loadReady ? (
          <View style={{flex: 6, backgroundColor: 'black', position: 'relative', width: "100%"}}>
            {this.state.currentBoard === 'Top 100' ? this.leaderBoardRender() : this.friendLeaderBoardRender()}
          </View>
        ) : (
          <View style={[styles.box, {flex: 6}]}>
            <Text style={[styles.font, {color: 'white'}]}>
              Loading...
            </Text>
          </View>
        )}
        <View style={styles.box}>
          {this.state.iPhone5s || this.state.android ? (
            <TouchableOpacity onPress={() => this.close()}>
              <Text style={[styles.font, {fontSize: 30}]}>
                Close
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.close()}>
              <Text style={styles.font}>
                Close
              </Text>
            </TouchableOpacity>
          )}
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
    width: "100%",
    backgroundColor: 'black'
  },
  font: {
    fontFamily: 'ArcadeClassic',
    fontSize: 50,
    color: 'white'
  }
})
