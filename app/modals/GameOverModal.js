import React from 'react';
import { Dimensions, StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage, Alert} from 'react-native';
import database from '../firebase/db';
const {height, width} = Dimensions.get('window');


export default class GameOverModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      newChallenger: false,
      iPhone5s: false,
      finished: false
    }
  }

  componentWillMount() {
    if (width === 320) this.setState({iPhone5s: true})
  }


  render() {
    return(
      this.props.maximumLeaderBoardSpots ? (
        <View style={[styles.box, {backgroundColor: 'black', width: "100%"}]}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[styles.font, {fontSize: 40}]}>
              Game  Over
            </Text>
          </View>
          <View style={{flex: 1 , justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[styles.font, {fontSize: 20, textAlign: 'center'}]}>
              You  already  have  5  spots  on  the  leaderboard!
            </Text>
          </View>
          <View style={{flex: 1 , justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[styles.font, {fontSize: 25}]}>
              You  scored...
            </Text>
            <Text style={[styles.font, {fontSize: 25, color: 'gold'}]}>
              {this.props.totalscore}
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
      ) : (
        this.props.challenger.rank ? (
          <View style={[styles.box, {backgroundColor: 'black', width: "100%"}]}>
            <View style={styles.box}>
              {this.state.iPhone5s ? (
                <Text style={[styles.font, {fontSize: 20}]}>
                  Game  Over
                </Text>
              ) : (
                <Text style={[styles.font, {fontSize: 40}]}>
                  Game  Over
                </Text>
              )}
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
              <TouchableOpacity onPress={() => this.props.close('challenger', this.props.challenger)}>
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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[styles.font, {fontSize: 40}]}>
                Game  Over
              </Text>
            </View>
            <View style={{flex: 1 , justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[styles.font, {fontSize: 25}]}>
                You  scored...
              </Text>
              <Text style={[styles.font, {fontSize: 25, color: 'gold'}]}>
                {this.props.totalscore}
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
