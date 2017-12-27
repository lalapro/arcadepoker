import React from 'react';
import { StyleSheet, Text, View, Button, PanResponder, Dimensions, Image, Animated, TouchableOpacity, AsyncStorage } from 'react-native';
import { Font } from 'expo';
import HexGrid from './HexGrid.js';
import { adjacentTiles, keyTiles } from '../helpers/tileLogic';
import shuffledDeck from '../helpers/shuffledDeck';
import calculateScore from '../helpers/calculateScore';
import handAnimations from '../helpers/handAnimations';
import cardImages from '../helpers/cardImages';
import database from '../firebase/db'

export default class Blitz extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      deck: shuffledDeck('blanks').slice(),
      currentTile: null,
      startingTiles: [1, 4, 3, 4, 1],
      selectedTiles: [],
      chosenCards:[],
      tileResponders: {},
      adjacentTiles: adjacentTiles,
      availableTiles: [],
      destroy: false,
      completedHands: [],
      animatedHand: handAnimations,
      lastCompletedHand: '',
      hoverHand: [],
      emptyTiles: [],
      restart: false,
      fontLoaded: false,
      gameStarted: false,
      hofModal: false,
      blinky: false,
      gameOverModal: false,
      totalscore: 0,
      highscore: 0,
      newChallenger: 0,
    }
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder:(evt, gestureState) => this.state.gameStarted,
      onPanResponderMove: (evt, gestureState) => {
        // console.log(gestureState)
        tileResponders = this.state.tileResponders;
        currentTile = this.state.currentTile;
        // console.log(this.generateAvailableTiles(this.state.currentTile))

        if (currentTile === null) {
          for(key in tileResponders) {
            // if touch gesture is between boxes...
            if (gestureState.numberActiveTouches === 1) {
              insideX = gestureState.moveX >= tileResponders[key].x && gestureState.moveX <= (tileResponders[key].x + 40);
              insideY = gestureState.moveY >= tileResponders[key].y && gestureState.moveY <= (tileResponders[key].y + 55);
              if (insideX && insideY) {
                this.selectNewTile(key);
              }
            }
          }
        }
        else {
          let neighborTiles = this.state.availableTiles
          for (let i = 0; i < neighborTiles.length; i++) {
            if (gestureState.numberActiveTouches === 1) {
              key = neighborTiles[i]
              insideX = gestureState.moveX >= tileResponders[key].x && gestureState.moveX <= (tileResponders[key].x + 40);
              insideY = gestureState.moveY >= tileResponders[key].y && gestureState.moveY <= (tileResponders[key].y + 55);
              if (insideX && insideY) {
                this.selectNewTile(key);
              }
            }
          }
        }
      },
      onPanResponderTerminate: (evt) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.chosenCards.length === 5 && this.state.selectedTiles.length === 5 && this.noBlanks(this.state.chosenCards)) {
          this.destroy();
        } else {
          this.reset();
        }
      }
    });
  }

  noBlanks(arr) {
    return arr.every(card => card["value"] !== "");
  }

  async componentDidMount() {
    console.log('in blitz.js')
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true
    })
  }

  selectNewTile(key) {
    if (this.state.selectedTiles.indexOf(key) === -1) {
      this.setState({
        selectedTiles: [...this.state.selectedTiles, key]
      })
    }
    this.setState({
      currentTile: key,
      availableTiles: adjacentTiles[key]
    })
  }

  setLayout(pos, obj) {
    this.state.tileResponders[pos] = obj;
    this.setState({
      tileResponders: this.state.tileResponders,
    })
  }

  destroy() {
    this.state.completedHands.push(calculateScore(this.state.chosenCards))
    hand = calculateScore(this.state.chosenCards);


    this.setState({
      destroy: true,
      pressed: true,
      lastCompletedHand: hand[0],
      totalscore: this.state.totalscore += hand[1],
    }, () => {
      this.setState({
        destroy: false,
        chosenCards: [],
        selectedTiles: [],
        currentTile: null,
      })
      // connected to scoring animation and storing KEY TILES
      setTimeout(() => {this.setState({
        pressed: false,
        hoverHand: []
      })}, 750)
    });
  }

  addEmptyTiles(tile) {
    if (!this.state.emptyTiles.includes(tile)) {
      this.setState({
        emptyTiles: [...this.state.emptyTiles, tile]
      }, () => this.checkGameOver())
    }
  }

  checkGameOver() {
    if (this.state.emptyTiles.length === 5 || this.state.completedHands.length === 10) {
      this.gameOver();
    }
  }

  gameOver() {
    console.log('game over')
  }

  reset() {
    this.setState({
      destroy: true,
      chosenCards: [],
      selectedTiles: [],
      hoverHand: [],
      currentTile: null
    }, () => {
      this.setState({
        destroy: false
      })
    })
  }

  addToChosenCards(card) {
    let alreadyChosen = this.state.chosenCards.indexOf(card);
    if (alreadyChosen === -1 && this.state.chosenCards.length < 5) {
      this.setState({
        chosenCards: [...this.state.chosenCards, card],
        hoverHand: [...this.state.hoverHand, card]
      })
    }
  }

  startGame() {
    let room = this.props.navigation.state.params.room;
    console.log(room)
    database.gameRooms.child(room).once('value', snap => {
      let sharedDeck = snap.val().deck.slice();
      this.setState({
        deck: sharedDeck,
        gameStarted: true,
        animateStartOfGame: true,
        restart: true,
      }, () => {
        this.setState({
          animateStartOfGame: false,
          restart: false
        })
      })
      setTimeout(() => {
        this.setState({
          showScore: true
        })
      }, 450)
    })
  }

  goBack() {
    this.props.navigation.goBack()
  }

  render() {
    return(
      <View style={styles.container}>
        {!this.state.gameStarted ? (
          <View style={[styles.topBanner]}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', top: 15}}>
              {this.state.fontLoaded ? (
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      source={require('../assets/bolt.png')}
                      style={{width: 40, height: 40, resizeMode: 'contain'}}
                    />
                    <Text style={{fontFamily: 'arcade', fontSize: 65, color: 'white'}} onPress={this.startGame.bind(this)}>
                      BLITZ
                    </Text>
                    <Image
                      source={require('../assets/bolt.png')}
                      style={{width: 40, height: 40, resizeMode: 'contain'}}
                    />
                  </View>
                  <Text style={{fontFamily: 'arcade', fontSize: 65, color: 'white'}}>
                    JOIN
                  </Text>
                </View>
              ) : (null)}
            </View>
          </View>
        ) : (null)}
          {this.state.gameStarted ? (
            <View style={styles.showCase}>
              {this.state.fontLoaded && this.state.showScore ? (
                <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', flexDirection: 'row', width: "90%"}}>
                  <TouchableOpacity onPress={() => this.switchModal('hof')}>
                    <Image source={require('../assets/trophy.png')} style={{width: 35, height: 35, resizeMode: 'contain'}}/>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 45, fontFamily: 'arcade', color: 'white'}}>
                      Score: {this.state.totalscore}
                    </Text>
                    <Text style={{fontFamily: 'arcade', fontSize: 20, color: 'yellow'}}>
                      BLITZ MODE!
                    </Text>
                  </View>
                  <TouchableOpacity onPress={this.goBack.bind(this)}>
                    {this.state.fontLoaded ? (
                      <Image source={require('../assets/menu.png')} style={{width: 35, height: 35, resizeMode: 'contain'}}/>
                    ) : null}
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={{flex: 1, flexDirection: 'row'}}>
                {this.state.hoverHand.map((card, i) => {
                  if (i%2 === 0) {
                    return (
                      <Image source={cardImages[card.value]}
                        style={{top: 15, width: 85, height: 85, resizeMode: 'contain', marginRight: -15}}
                        key={i}
                      />
                    )
                  } else {
                    return (
                      <Image source={cardImages[card.value]}
                        style={{top:40, width: 85, height: 85, resizeMode: 'contain', marginRight: -15}}
                        key={i}
                      />
                    )
                  }
                })}
              </View>
            </View>
          ) : (null)}
          <View style={styles.gameContainer} {...this._panResponder.panHandlers} ref="mycomp">
            {this.state.pressed ? (
              <View style={{position: 'absolute', zIndex: 2}}>
                <Image source={this.state.animatedHand[this.state.lastCompletedHand]} style={{width: 300, height: 100, resizeMode: 'contain'}}/>
              </View>
            ) : null}
            {this.state.startingTiles.map((tiles, i) => (
              <HexGrid
                deck={this.state.deck}
                tiles={tiles}
                add={this.addToChosenCards.bind(this)}
                chosen={this.state.chosenCards}
                destroy={this.state.destroy}
                layoutCreators={this.setLayout.bind(this)}
                selectedTiles={this.state.selectedTiles}
                restart={this.state.restart}
                gameStarted={this.state.animateStartOfGame}
                addEmpty={this.addEmptyTiles.bind(this)}
                hoverHand={this.state.hoverHand}
                x={i}
                key={i}
              />
            ))}
          </View>
          {!this.state.gameStarted ? (
            <View style={{flex: 1.5, backgroundColor: 'purple'}}>
            </View>
          ) : (null)}
          <View style={styles.botBanner}>
            <Text style={{fontSize: 60}} onPress={this.startGame.bind(this)}>
              Jabroni Code
            </Text>
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
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  font: {
    fontSize: 40,
    fontFamily: 'arcade',
    color: 'white'
  },
  topBanner: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    zIndex: 80
  },
  showCase: {
    flex: 3.5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    flexDirection: 'column',
    zIndex: 99
  },
  gameContainer: {
    flex: 4,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
    zIndex: 99
  },
  botBanner: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  },
})
