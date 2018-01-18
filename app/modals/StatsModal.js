import React from 'react';
import { Animated, Easing, Dimensions, StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage, Alert} from 'react-native';
import database from '../firebase/db';
const {height, width} = Dimensions.get('window');


const HANDKEY = {
  'fiveOfAKind': 3000,
  'royalFlush': 2500,
  'straightFlush': 2000,
  'fourOfAKind': 1750,
  'fullHouse': 1500,
  'flush': 1250,
  'straight': 1000,
  'threeOfAKind': 750,
  'twoPair': 500,
  'onePair': 250,
  'highCard': 100
}

const RENDERKEY = {
  'fiveOfAKind': 'five  of  a  kind',
  'royalFlush': 'royal  flush',
  'straightFlush': 'straight  flush',
  'fourOfAKind': 'four  of  a  kind',
  'fullHouse': 'full  house',
  'flush': 'flush',
  'straight': 'straight',
  'threeOfAKind': 'three  of  a  kind',
  'twoPair': 'two  pair',
  'onePair': 'one  pair',
  'highCard': 'high  card'
}

export default class StatsModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      totalHands: 0,
      totalScore: 0,
      handHistory: [],
      multiplayerStats: []
    }
    this.animatedValue = new Animated.Value(0)
  }


  async componentWillMount() {
    let stats = await AsyncStorage.getItem('personalStats');
    let games = await AsyncStorage.getItem('gamesPlayed');
    let duelWins = await AsyncStorage.getItem('duelWins');
    let blitzWins = await AsyncStorage.getItem('blitzWins');

    if (games === null) games = 0;
    if (stats === null) stats = "{}";
    stats = JSON.parse(stats);
    duelWins === null ? duelWins = 0 : duelWins = duelWins;
    blitzWins === null ? blitzWins = 0 : blitzWins = blitzWins;

    this.setState({
      multiplayerStats: [['Duel  Wins', duelWins], ['Blitz  Wins', blitzWins]]
    })

    let totalHands = 0;
    let totalScore = 0;
    let handHistory = [];


    for (let hand in stats) {
      totalHands++;
      totalScore += HANDKEY[hand] * stats[hand];
    }

    for (let hand in RENDERKEY) {
      if (stats[hand]) {
        handHistory.push([RENDERKEY[hand], stats[hand]])
      } else {
        handHistory.push([RENDERKEY[hand], 0])
      }
    }


    this.setState({
      totalHands,
      totalScore,
      handHistory,
      games
    })

    this.animate();
  }

  animate () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

  doNothing() {
    Alert.alert('Beep boop! \n There is something hidden in the home screen...')
  }

  render() {
    const movingMargin = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-80, 100, -80]
    })
    return(
      <View style={[styles.box, {padding: 25}]}>
        <View style={{flex: 1, justifyContent:'center', alignItems: 'center', flexDirection: 'row'}}>
            <Image source={require('../assets/icons/stats.png')} style={{right: 5, width: 15, height: 15, resizeMode: 'contain'}}/>
            <Text style={[styles.font, {fontSize: 30, textDecorationLine: 'underline'}]}>
              Personal  Stats
            </Text>
            <Image source={require('../assets/icons/stats.png')} style={{left: 5, width: 15, height: 15, resizeMode: 'contain'}}/>
        </View>
        <View style={[styles.box, {flex: 1, justifyContent: 'flex-start', flexDirection:'row'}]}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderColor: 'white', borderWidth: 1}}>
            <Text style={[styles.font, {fontSize: 20}]}>
              Games
            </Text>
            <Text style={[styles.font, {fontSize: 18}]}>
              {this.state.games}
            </Text>
          </View>
          <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderColor: 'white', borderWidth: 1}}>
            <Text style={[styles.font, {fontSize: 20}]}>
              Points
            </Text>
            <Text style={[styles.font, {fontSize: 18}]}>
              {this.state.totalScore}
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderColor: 'white', borderWidth: 1}}>
            <Text style={[styles.font, {fontSize: 20}]}>
              Hands
            </Text>
            <Text style={[styles.font, {fontSize: 18}]}>
              {this.state.totalHands}
            </Text>
          </View>
        </View>
        <View style={[styles.box, {flex: 4, justifyContent: 'flex-start'}]}>
          <Text style={[styles.font, {fontSize: 10, color: 'black'}]}>
            Hands
          </Text>
          <Text style={[styles.font, {fontSize: 10, color: 'black'}]}>
            {this.state.totalHands}
          </Text>
          {this.state.multiplayerStats.map((wins, i) => (
            <View style={styles.line} key={i}>
              <Text style={[styles.font, {fontSize: 17}]}>
                {wins[0]}
              </Text>
              <Text style={[styles.font, {fontSize: 17}]}>
                {wins[1]}
              </Text>
            </View>
          ))}
          <View style={styles.line}>
            <Text style={[styles.font, {fontSize: 17, color: 'black'}]}>
              jabroni
            </Text>
            <Text style={[styles.font, {fontSize: 17, color: 'black'}]}>
              jabroni
            </Text>
          </View>
          {this.state.handHistory.map((hand, i) => (
            <View style={styles.line} key={i}>
              <Text style={[styles.font, {fontSize: 17}]}>
                {hand[0]}
              </Text>
              <Text style={[styles.font, {fontSize: 17}]}>
                {hand[1]}
              </Text>
            </View>
          ))}
        </View>
        <View style={[styles.box, {alignItems: 'center', justifyContent:'center', width: '80%'}]}>
          <Animated.View
            style={{top: -10, width: '100%', alignItems: 'center', justifyContent:'center', marginLeft: movingMargin}}
            >
              <TouchableOpacity onPress={this.doNothing.bind(this)} style={{zIndex: 1}}>
                <Image
                  source={require('../assets/cards/wildBlack.png')}
                  style={{width: 55, height: 55, resizeMode: 'contain', zIndex: 99}}
                />
            </TouchableOpacity>
            </Animated.View>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.props.close()}>
            <Text style={[styles.font, {fontSize: 25}]}>
              back
            </Text>
          </TouchableOpacity>
        </View>
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
    width: '100%'
  },
  font: {
    fontFamily: 'ArcadeClassic',
    fontSize: 20,
    color: 'white'
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%"
  }
})
