import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import { Font } from 'expo';
import database from '../firebase/db'


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
      this.state.fontLoaded ? (
        this.state.newChallenger ? (
          <View style={styles.box}>
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
                  source={require('../assets/continue.png')}
                  style={{width: 25, height: 25, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) :
        (
          <View style={{flex: 1}}>
            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[styles.font, {fontSize: 65}]}>
                Game
              </Text>
              <Text style={[styles.font, {fontSize: 65}]}>
                Over
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.props.close('hof')}>
                <Text style={styles.font}>
                  View  highscores
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.close('hof')}>
                <Image source={require('../assets/trophy.png')} style={{width: 20, height: 20, resizeMode: 'contain'}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.box}>
              <TouchableOpacity onPress={() => this.props.close('over')}>
                <Text style={styles.font}>
                  Play  Again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      ) : (null)
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
    fontFamily: 'arcade',
    fontSize: 20,
  },
})
