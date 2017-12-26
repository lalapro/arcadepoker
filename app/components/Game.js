import React from 'react';
import { StyleSheet, Text, View, Button, PanResponder, Dimensions, Image, Animated, TouchableOpacity, AsyncStorage } from 'react-native';
import { Font, Constants } from 'expo';
import * as firebase from 'firebase';
import Modal from 'react-native-modal';
import HexGrid from './HexGrid.js';
import recordPositions from './recordPositions';
import { adjacentTiles, keyTiles } from '../helpers/tileLogic';
import shuffledDeck from '../helpers/shuffledDeck';
import calculateScore from '../helpers/calculateScore';
import handAnimations from '../helpers/handAnimations';
import cardImages from '../helpers/cardImages';
import DraggingLogic from '../helpers/draggingLogic';
import HelpModal from '../modals/HelpModal';
import FriendModal from '../modals/FriendModal';
import HallOfFameModal from '../modals/HallOfFame';
import GameOverModal from '../modals/GameOverModal';


const {height, width} = Dimensions.get('window');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfeJUbf7LoN7IMIFp7zbE50QK6lMDeTR8",
  authDomain: "arcade-poker.firebaseapp.com",
  databaseURL: "https://arcade-poker.firebaseio.com/",
  // storageBucket: "highscore.appspot.com"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();


export default class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      deck: props.deck,
      currentTile: null,
      startingTiles: [1, 4, 3, 4, 1],
      selectedTiles: [],
      chosenCards:[],
      tileResponders: {},
      adjacentTiles: adjacentTiles,
      availableTiles: [],
      reHighlight: false,
      destroy: false,
      newTileDetected: false,
      completedHands: [],
      animatedHand: handAnimations,
      lastCompletedHand: '',
      hoverHand: [],
      emptyTiles: [],
      restart: false,
      bgColor: 'black',
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
                let newTileDetected = true;
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
                let newTileDetected = true;
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

  async componentDidMount() {
    this.updateScoreFromAsyncStorage()
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
      blinky: true
    })

    this.insertCoin = setInterval(this.blinky.bind(this), 750)
  }

  blinky() {
    this.setState({
      blinky: !this.state.blinky
    })
  }

  noBlanks(arr) {
    return arr.every(card => card["value"] !== "");
  }


  restartGame() {
    this.updateScore();
    this.closeModal();
    this.setState({
      deck: shuffledDeck(),
      currentTile: null,
      startingTiles: [],
      startingTiles: [1, 4, 3, 4, 1],
      chosenCards:[],
      adjacentTiles: adjacentTiles,
      availableTiles: [],
      reHighlight: false,
      destroy: false,
      newTileDetected: false,
      completedHands: [],
      animatedHand: handAnimations,
      lastCompletedHand: '',
      hoverHand: [],
      bgColor: 'black',
      restart: true,
      emptyTiles: [],
      gameStarted: false,
      showScore: false,
      totalscore: 0,
      newChallenger: 0
    }, () => {
      this.setState({
        restart: false
      })
    })
    this.insertCoin = setInterval(this.blinky.bind(this), 750)
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
      this.updateScore();
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
    setTimeout(() => this.switchModal('game over'), 500)
  }

  updateScore() {
    if (this.state.totalscore > this.state.highscore) {
      let highscore = this.state.totalscore.toString();
      this.setState({highscore})
    }
  }

  async updateScoreFromAsyncStorage() {
    let highscore = await AsyncStorage.getItem('highscore');
    this.setState({highscore})
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
    clearInterval(this.insertCoin)
    this.setState({
      gameStarted: true,
      animateStartOfGame: true
    }, () => {
      this.setState({
        animateStartOfGame: false
      })
    })
    setTimeout(() => {
      this.setState({
        showScore: true
      })
    }, 450)
  }


  closeModal(game, challenger) {
    if (game === 'over') {
      this.restartGame();
    } else if (game === 'hof') {
      this.switchModal('hof')
    } else if (game === 'challenger') {
      this.switchModal('challenger', challenger)
    }  else {
      this.setState({
        helpModal: false,
        mainModal: false,
        friendModal: false,
        hofModal: false,
        gameOverModal: false
      })
    }
  }


  switchModal(modal, challenger) {
    this.closeModal();

    if(modal === 'main') {
      this.setState({
        mainModal: true
      })
    } else if (modal === 'help') {
      setTimeout(() => {
        this.setState({
          helpModal: true
        })}, 450)
    } else if (modal === 'friend') {
      setTimeout(() => {
        this.setState({
          friendModal: true
        })}, 450)
    } else if (modal === 'hof') {
      setTimeout(() => {
        this.setState({
          hofModal: true
        })}, 450)
    } else if (modal === 'game over') {
      setTimeout(() => {
        this.setState({
          gameOverModal: true
        })}, 450)
    } else if (modal === 'challenger') {
      setTimeout(() => {
        this.setState({
          hofModal: true,
          newChallenger: challenger
        })}, 450)
    }
  }



  render() {
    const boxes = Object.values(this.state.tileResponders);
    return (
      <View style={[styles.container, {backgroundColor: this.state.bgColor}]}>
        {!this.state.gameStarted ? (
          <View style={[styles.topBanner, /*{backgroundColor: this.state.bgColor}*/]}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {this.state.fontLoaded ? (
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'arcade', fontSize: 65, color: 'white'}}>
                    ARCADE
                  </Text>
                  <Text style={{fontFamily: 'arcade', fontSize: 65, color: 'white'}}>
                    POKER
                  </Text>
                  <Text style={{fontFamily: 'arcade', fontSize: 20, color: 'yellow'}}>
                    highscore: {this.state.highscore}
                  </Text>
                </View>
              ) : (null)}
            </View>
          </View>
        ) : (null)}
        {!this.state.gameStarted ? (
          <TouchableOpacity onPress={() => this.switchModal('hof')}>
            <Image source={require('../assets/trophy.png')} style={{width: 35, height: 35, resizeMode: 'contain'}}/>
          </TouchableOpacity>
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
                    highscore: {this.state.highscore}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this.switchModal('main')}>
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
            <Modal
              isVisible={this.state.mainModal}
              animationIn={'slideInLeft'}
              animationOut={'slideOutRight'}
            >
            {this.state.fontLoaded ? (
              <View style={styles.mainModal}>
                <TouchableOpacity onPress={() => this.switchModal('help')}>
                  <Text style={{fontFamily: 'arcade', fontSize: 35}}>
                    Help
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.switchModal('friend')}>
                  <Text style={{fontFamily: 'arcade', fontSize: 35}}>
                    Friends
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.restartGame.bind(this)}>
                  <Text style={{fontFamily: 'arcade', fontSize: 35}}>
                    Restart
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.closeModal.bind(this)}>
                  <Text style={{fontFamily: 'arcade', fontSize: 35}}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (null)}
            </Modal>
            <Modal
              isVisible={this.state.helpModal}
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
            >
              <View style={styles.otherModal}>
                <HelpModal close={this.closeModal.bind(this)}/>
              </View>
            </Modal>
            <Modal
              isVisible={this.state.friendModal}
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
            >
              <View style={[styles.otherModal, {height: "20%"}]}>
                <FriendModal close={this.closeModal.bind(this)}/>
              </View>
            </Modal>
            <Modal
              isVisible={this.state.gameOverModal}
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
            >
              <View style={[styles.otherModal, {height: "30%"}]}>
                <GameOverModal
                  close={this.closeModal.bind(this)}
                  totalscore={this.state.totalscore}
                  database={database}
                />
              </View>
            </Modal>
          </View>
        ) : (null)}
        <Modal
          isVisible={this.state.hofModal}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
        >
          <View style={[styles.otherModal, {height: "80%"}]}>
            <HallOfFameModal
              close={this.closeModal.bind(this)}
              database={database}
              newChallenger={this.state.newChallenger}
            />
          </View>
        </Modal>
        <View style={styles.gameContainer} {...this._panResponder.panHandlers} ref="mycomp">
          {this.state.pressed ? (
            <View style={{position: 'absolute', zIndex: 99}}>
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
              reHighlight={this.state.reHighlight}
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
          {!this.state.gameStarted && this.state.fontLoaded && this.state.blinky ? (
            <Text style={styles.font} onPress={this.startGame.bind(this)}>
              Press Start
            </Text>
          ) : (
            !this.state.gameStarted ? (
              <Text style={{fontSize: 60}} onPress={this.startGame.bind(this)}>
                Jabroni Code
              </Text>
            ) : (
              //ad space
              null
            )
          )}
        </View>
        {/* {boxes.map((tiles, i) => {
          return (
              <View style={{width: 40, height: 55, top: tiles.y, left: tiles.x ,backgroundColor:'red', position: 'absolute', zIndex: 999}} key={i}/>
          )
        })} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBanner: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    zIndex: 99
  },
  titleCard: {
    width: 200,
    height: 50,
    resizeMode: 'contain'
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
  mainModal: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  otherModal: {
    backgroundColor: 'white',
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: "60%"
  },
  font: {
    fontSize: 40,
    fontFamily: 'arcade',
    color: 'white'
  },
});
