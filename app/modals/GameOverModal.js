import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import database from '../firebase/db'


export default class FriendModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      newChallenger: false
    }
  }

  async componentWillMount() {
    this.checkHallOfFame();

  }

  checkHallOfFame() {
    database.highscores.limitToLast(100).once('value', (snap) => {
      if (snap.val()) {
        let leaderBoard = Object.entries(snap.val()).reverse();
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
        let position;
        for (let i = 0; i < leaderBoard.length; i++) {
          if (this.props.totalscore > leaderBoard[i][0]) {
            position = i + 1;
            this.hereComesANewChallenger(position);
            break;
          }
        }
        if (leaderBoard.length < 100 && position === undefined) {
          position = leaderBoard.length + 1;
          this.hereComesANewChallenger(position);
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
      },
    })
  }



  render() {
    return(
      this.state.newChallenger ? (
        <View style={[styles.box, {backgroundColor: 'black', width: "100%"}]}>
          <View style={styles.box}>
            <Text style={[styles.font, {fontSize: 30}]}>
              Congratulations!!
            </Text>
          </View>
          <View style={styles.box}>
            <Text style={[styles.font, {fontSize: 23}]}>
              You've  made
            </Text>
            <Text style={[styles.font, {fontSize: 23}]}>
              the  top  100!
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => this.props.close('challenger', this.state.challenger)}>
              <Image
                source={require('../assets/icons/continue.png')}
                style={{width: 25, height: 25, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) :
      (
        <View style={[styles.box, {backgroundColor: 'black', width: "100%"}]}>
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[styles.font, {fontSize: 45}]}>
              Game
            </Text>
            <Text style={[styles.font, {fontSize: 45}]}>
              Over
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.props.close('hof')}>
                <Text style={styles.font}>
                  View  highscores
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.close('over')}>
                <Text style={styles.font}>
                  Play  Again
                </Text>
              </TouchableOpacity>
          </View>
        </View>
      )
    )
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  font: {
    fontFamily: 'ArcadeClassic',
    fontSize: 20,
    color: 'white'
  },
})
