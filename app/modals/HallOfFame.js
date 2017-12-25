import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { Font } from 'expo';
// import * as firebase from 'firebase';


//
// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCfeJUbf7LoN7IMIFp7zbE50QK6lMDeTR8",
//   authDomain: "arcade-poker.firebaseapp.com",
//   databaseURL: "https://arcade-poker.firebaseio.com/",
//   // storageBucket: "Highscore.appspot.com"
// };
//
// firebase.initializeApp(firebaseConfig);
//
// var database = firebase.database();


export default class HallOfFame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fontLoaded: false,
      leaderBoard: []
    }
  }

  async componentDidMount() {
    this.getHighScores();
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true
    })
  }

  getHighScores() {
    this.props.database.ref('/highscores').limitToLast(100).once('value', (snap) => {
      let leaderBoard = Object.entries(snap.val());
      console.log(leaderBoard)
      this.setState({leaderBoard})
    })
  }

  arcadify(num) {
    let digits = num.toString().split('');
    while(digits.length < 5) {
      digits.unshift('0');
    }
    return digits.join('')
  }



  render() {
    return(
      this.state.fontLoaded ? (
        <View style={styles.container}>
          <View style={[styles.box, {backgroundColor:'red'}]}>
            <Text style={styles.font}>
              HighScores
            </Text>
          </View>
          <View style={[styles.box, {flex: 6, backgroundColor: 'lightgreen'}]}>
            <View style={[styles.box, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}]}>
              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.font, {fontSize: 23}]}>
                  Rank
                </Text>
                {this.state.leaderBoard.map((hs, i) => (
                  <Text style={[styles.font, {fontSize: 10}]} key={i}>
                    {i + 1}
                  </Text>
                ))}
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.font, {fontSize: 23}]}>
                  Score
                </Text>
                {this.state.leaderBoard.map((hs, i) => (
                  <Text style={[styles.font, {fontSize: 10}]} key={i}>
                    {this.arcadify(hs[1].score)}
                  </Text>
                ))}

              </View>


              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.font, {fontSize: 23}]}>
                  Best
                </Text>
                <Text style={[styles.font, {fontSize: 23}]}>
                  Hand
                </Text>
                {this.state.leaderBoard.map((hs, i) => (
                  <Text style={[styles.font, {fontSize: 10}]} key={i}>
                    {hs[1].bestHand}
                  </Text>
                ))}
              </View>

              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.font, {fontSize: 23}]}>
                  Name
                </Text>
                {this.state.leaderBoard.map((hs, i) => (
                  <Text style={[styles.font, {fontSize: 10}]} key={i}>
                    {hs[0]}
                  </Text>
                ))}
              </View>
            </View>
            {/* <View style={[styles.box, {flex: 9, flexDirection: 'row', alignItems: 'flex-start'}]}> */}
              {/* <ScrollView>
                {this.state.leaderBoard.map((highscore, i) => (
                  <View style={{width: "60%", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} key={i}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.font, {fontSize: 20}]}>
                      {i + 1}
                    </Text>
                    <Text style={[styles.font, {fontSize: 20}]}>
                      {highscore[1].score}
                    </Text>
                    <Text style={[styles.font, {fontSize: 20}]}>
                      {highscore[1].bestHand}
                    </Text>
                    <Text style={[styles.font, {fontSize: 20}]}>
                      {highscore[0]}
                    </Text>
                    </View>
                  </View>
                ))}
              </ScrollView> */}
            {/* </View> */}
          </View>
          <View style={styles.box}>
            <TouchableOpacity onPress={() => this.props.close()}>
              <Text style={styles.font}>
                Close
              </Text>
            </TouchableOpacity>
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
