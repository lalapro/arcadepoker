import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, AsyncStorage, TextInput } from 'react-native';
import { Font, Constants } from 'expo';
import moment from 'moment';



export default class HallOfFame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fontLoaded: false,
      leaderBoard: [],
      board1: 'black',
      board2: 'white',
      currentBoard: 'Top 100',
      newChallenger: 0,
      blinky: false,
      text: '_ _ _ _ _ _ _ _ _',
      textArray: ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
      fakeText: '',
      positionToInject: -1
    }
  }

  async componentDidMount() {

    this.getHighscores();

    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true
    })
  }

  getHighscores() {
    let newChallenger = this.props.newChallenger;
    this.setState({newChallenger})
    let positionToInject = newChallenger.rank;
    let scoreToInject = newChallenger.score;
    let blinky = false;
    let leaderBoard = this.state.leaderBoard;

    this.props.database.ref('/highscores').limitToLast(100).once('value', (snap) => {
      if (snap.val()) {
        leaderBoard = Object.entries(snap.val()).reverse();
        let newLeaderBoard = [];
        leaderBoard.forEach(scoreEntry => {
          let keys = Object.keys(scoreEntry[1]) // get all instances of score
          for(let i = 0; i < keys.length; i++) { // for each key, store into array
            if (newLeaderBoard.length < 50) {
              let eachUser = scoreEntry[1][keys[i]];
              newLeaderBoard.push([scoreEntry[0], eachUser]);
            }
          }
        })
        leaderBoard = newLeaderBoard;
        console.log(leaderBoard.length)
        while(leaderBoard.length < 100) {
          leaderBoard.push(["0000000", ""])
          // leaderBoard.pop()
        }
        if (positionToInject > 0) {
          positionToInject = positionToInject - 1;
          leaderBoard.splice(positionToInject, 0, [scoreToInject, this.state.text]);
          blinky = true;
          const insertName = setInterval(this.blinky.bind(this), 750)
          this.setState({insertName})
        }
      } else if (newChallenger) {
        positionToInject = 0;
        leaderBoard = [];
        leaderBoard.splice(positionToInject, 0, [scoreToInject, this.state.text]);
        blinky = true;
        const insertName = setInterval(this.blinky.bind(this), 750)
        this.setState({insertName})
      }
      this.setState({leaderBoard, positionToInject})
    })
  }

  blinky() {
    this.setState({
      blinky: !this.state.blinky
    })
  }

  arcadifyScore(num) {
    if (!num) return '';
    let digits = num.toString().split('');
    while(digits.length < 7) {
      digits.unshift('0');
    }
    return digits.join('')
  }

  arcadifyRank(num) {
    if (!num) return '';
    let digits = num.toString();
    let lastDigit = digits[digits.length - 1]
    if (lastDigit === '1' && digits.length === 1) {
      return (
        <View key={num} style={{flexDirection: 'row'}}>
          <Text style={[styles.font, {fontSize: 14}]}>
            {digits}
          </Text>
          <Text style={[styles.font, {fontSize: 12}]}>
            st
          </Text>
        </View>
      )
    }
    else if (lastDigit === '2' && digits.length === 1) {
      return (
        <View key={num} style={{flexDirection: 'row'}}>
          <Text style={[styles.font, {fontSize: 14}]}>
            {digits}
          </Text>
          <Text style={[styles.font, {fontSize: 12}]}>
            nd
          </Text>
        </View>
      )
    } else if (lastDigit === '3' && digits.length === 1) {
      return (
        <View key={num} style={{flexDirection: 'row'}}>
          <Text style={[styles.font, {fontSize: 14}]}>
            {digits}
          </Text>
          <Text style={[styles.font, {fontSize: 12}]}>
            rd
          </Text>
        </View>
      )
    } else {
      return (
        <View key={num} style={{flexDirection: 'row'}}>
          <Text style={[styles.font, {fontSize: 14}]}>
            {digits}
          </Text>
          <Text style={[styles.font, {fontSize: 12}]}>
            th
          </Text>
        </View>
      )
    }
  }





  switchBoard() {
    if (this.state.board1 === 'black') {
      this.setState({
        board1: 'white',
        board2: 'black',
        currentBoard: 'Friends'
      })
    } else {
      this.setState({
        board1: 'black',
        board2: 'white',
        currentBoard: 'Top 100'
      })
    }
  }


  close() {

    if (this.state.positionToInject >= 0) {
      clearInterval(this.state.insertName);
      let deviceId = Constants.deviceId;
      let highscore = Number(this.state.newChallenger.score);
      // let highscore = 70;
      let name = this.state.fakeText;
      let timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
      scoreToSave = [deviceId, name]
      // AsyncStorage.setItem('deviceId', deviceId);
      // AsyncStorage.setItem('highscore', this.props.newChallenger.score);
      this.props.database.ref('/highscores').child(highscore).child(timestamp).set(scoreToSave)
      this.props.close('over');

    } else {
      this.props.close();
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
      text = text.join('')
      this.setState({text, fakeText, textArray})
    }
  }





  render() {
    return(
      this.state.fontLoaded ? (
        <View style={styles.container}>
          <View style={[styles.box, {backgroundColor:'black'}]}>
            <Text style={styles.font}>
              highscores
            </Text>
          </View>
          <View style={[styles.box, {flex: 0.8, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'black', alignItems: 'flex-start'}]}>
            <View style={[styles.box, {backgroundColor: this.state.board2, borderRadius: 4}]}>
              <Text style={[styles.font, {fontSize: 25, color: this.state.board1}]} onPress={this.switchBoard.bind(this)}>
                Top 100
              </Text>
            </View>
            <View style={[styles.box, {backgroundColor: this.state.board1, borderRadius: 4}]}>
              <Text style={[styles.font, {fontSize: 25, color: this.state.board2}]} onPress={this.switchBoard.bind(this)}>
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
            <ScrollView
              style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
              contentContainerStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: "100%"}}
            >
              <View style={[styles.box, {width: "100%"}]}>
                {this.state.leaderBoard.map((hs, i) => (
                  this.arcadifyRank(i + 1)
                ))}
              </View>
              <View style={[styles.box, {width: "100%", flex: 2}]}>
                {this.state.leaderBoard.map((hs, i) => (
                  <Text style={[styles.font, {fontSize: 14}]} key={i}>
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
                                <Text style={[styles.font, {fontSize: 14}]} key={x} onPress={this.reFocus.bind(this)}>
                                  {char}
                                </Text>
                              )
                            } else {
                              return (
                                <Text style={[styles.font, {fontSize: 14}]} key={x} onPress={this.reFocus.bind(this)}>
                                  {char}
                                </Text>
                              )
                            }
                          })}
                        </View>
                      ) : (
                        <Text style={[styles.font, {fontSize: 14, color: 'black'}]} key={i}>
                          _ _ _ _ _ _
                        </Text>
                      )
                    )
                  }
                  return (
                    <Text style={[styles.font, {fontSize: 14}]} key={i}>
                      {hs[1][1]}
                    </Text>
                  )
                })}
              </View>
            </ScrollView>
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
      ) : (null)
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
