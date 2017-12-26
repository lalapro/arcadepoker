import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import { Font, Constants } from 'expo';


export default class FriendModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fontLoaded: false,
      newChallenger: false
    }
  }

  async componentWillMount() {
    this.checkHallOfFame();
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
    })
  }

  // async checkOwnHighscore() {
  //   let ownHighscore = await AsyncStorage.getItem('highscore');
  //   ownHighscore = Number(ownHighscore)
  //   if (this.props.totalscore > ownHighscore) {
  //     this.setState({
  //       newPersonalHigh: true
  //     })
  //   }
  // }

  checkHallOfFame() {
    this.props.database.ref('/highscores').limitToLast(100).once('value', (snap) => {

      if (snap.val()) {
        let leaderBoard = Object.entries(snap.val());
        let newLeaderBoard = [];
        leaderBoard.forEach(scoreEntry => {
          let keys = Object.keys(scoreEntry[1]) // get all instances of score
          for(let i = 0; i < keys.length; i++) { // for each key, store into array
            let eachUser = scoreEntry[1][keys[i]];
            newLeaderBoard.push([scoreEntry[0], eachUser]);
          }
        })
        leaderBoard = newLeaderBoard.reverse();
        let position;
        for (let i = 0; i < leaderBoard.length; i++) {
          if (this.props.totalscore > leaderBoard[i][0]) {
            position = i + 1;
            this.hereComesANewChallenger(position);
            // this.saveToDB();
            break;
          }
        }
        if (leaderBoard.length < 100 && position === undefined) {
          position = leaderBoard.length + 1;
          this.hereComesANewChallenger(position);
          // this.saveToDB();
        }
      } else {
        this.hereComesANewChallenger(1);
      }
    })
  }

  hereComesANewChallenger(position) {
    this.setState({
      newChallenger: true,
      challenger: {
        rank: position,
        score: this.props.totalscore
      }
    })
  }

  saveToDB() {
    // let deviceId = Constants.deviceId;
    // AsyncStorage.setItem('deviceId', deviceId)
    // let scoreToSave = {
    //   score: this.props.totalscore,
    //   deviceId:
    // }
    // database.ref('/highscores').child(deviceId).setWithPriority( scoreToSave, -highscore );
  }



  render() {
    return(
      this.state.fontLoaded ? (
        this.state.newChallenger ? (
          <View>
            <Text style={styles.font}>
              Congratulations, you've made the leaderboard!
            </Text>
            <TouchableOpacity onPress={() => this.props.close('challenger', this.state.challenger)}>
              <Text style={[styles.font, {fontSize: 20}]}>
                Click here to go to board
              </Text>
            </TouchableOpacity>
          </View>
        ) :
        (
          <View>
            <Text style={styles.font}>
              Game  Over
            </Text>
            <TouchableOpacity onPress={() => this.props.close('hof')}>
              <Text style={[styles.font, {fontSize: 20}]}>
                View  highscores
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.close('over')}>
              <Text style={[styles.font, {fontSize: 20}]}>
                Play  Again
              </Text>
            </TouchableOpacity>
          </View>
        )
      ) : (null)
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'arcade',
    fontSize: 40,
  },
})
