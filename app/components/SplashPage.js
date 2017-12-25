import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import HexGrid from './HexGrid.js';
import LandingPage from './LandingPage.js';
import { Font } from 'expo';
import shuffledDeck from '../helpers/shuffledDeck.js'





export default class SplashPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: props.deck.slice(),
      startingTiles: [1, 4, 3, 4, 1],
      fontLoaded: false,
      blinky: false
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });

    this.setState({
      fontLoaded: true,
      blinky: true
    })

    this.int = setInterval(this.set.bind(this), 750)

  }

  set() {
    this.setState({
      blinky: !this.state.blinky
    })

  }

  clear() {
    this.props.insertCoin()
    clearInterval(this.int)
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.gameTitle}>
          {this.state.fontLoaded ? (
            <View>
              <Text style={{fontSize: 70, fontFamily: 'arcade', color: 'white'}}>
                ARCADE POKER
              </Text>
              <Text style={{fontSize: 30, fontFamily: 'arcade', color: 'white'}}>
                Score: 0
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.grid}>
          {this.state.startingTiles.map((tiles, i) => {
            return (
              <LandingPage
                deck={this.state.deck}
                tiles={tiles}
                x={i}
                key={i}
              />
            )
          })}
        </View>
        <View style={{flex:1}}>
          {this.state.blinky ? (
            <Text style={styles.titleCard} onPress={this.clear.bind(this)}>
              Press Start
            </Text>
          ) :
          <Text style={{fontSize: 50}} onPress={this.clear.bind(this)}>
            Hi mom
          </Text>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameTitle: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: "100%"
  },
  titleCard: {
    fontSize: 40,
    fontFamily: 'arcade',
    color: 'white'
  },
  grid: {
    flex: 5,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
  },
})
