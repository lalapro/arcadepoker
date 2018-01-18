import React from 'react';
import { Alert, StyleSheet, Text, View, Button, PanResponder, Dimensions, Image, Animated, TouchableOpacity, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import HexGrid from './HexGrid.js';
import { adjacentTiles, keyTiles } from '../helpers/tileLogic';
import shuffledDeck from '../helpers/shuffledDeck';
import calculateScore from '../helpers/calculateScore';
import handAnimations from '../helpers/handAnimations';
import EndBlitzModal from '../modals/EndBlitzModal'
import cardImages from '../helpers/cardImages';
import database from '../firebase/db';
import initializeSounds from '../helpers/initializeSounds';


export default class BlitzJoin extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fbId: null,
      deck: null,
      fakeDeck: null,
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
      gameStarted: false,
      hofModal: false,
      blinky: false,
      gameOverModal: false,
      fbId: null,
      player: "playerOne",
      playerScore: 0,
      friendScore: 0,
      isMounted: false,
      cardsLeft: 0,
      timer: 60,
      status: null,
      endBlitzModal: false,
      bestHand: undefined,
      sound: this.props.navigation.state.params.sound,
      grabTileResponders: false,
      gameMode: this.props.navigation.state.params.gameMode,
      fakeNumber: 0
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

  async componentWillMount() {
    let SOUNDS = initializeSounds();
    this.setState({soundBytes: SOUNDS});

    if (this.state.gameMode === 'Blitz') {
      let fakeDeck = shuffledDeck('blanks').slice();
      this.setState({fakeDeck});
    } else {
      let fakeDeck = [];
      this.setState({fakeDeck})
    }


    let fbId = await AsyncStorage.getItem('fbId');
    this.setState({fbId});
    database.gameRooms.child(fbId).once('value', snap => {
      let data = snap.val();
      // console.log(data)
      let roomKey =  data.blitzRoom;
      this.setState({roomKey}, () => {
        if (typeof data.requesting === 'string') {
          database.blitzGame.child(roomKey).child('playerTwo').child('fbId').set(fbId);
          database.blitzGame.child(roomKey).child('playerTwo').child('score').set(0);
          this.setState({player: "playerTwo"}, () => {
            setTimeout(() => this.playerSetup(fbId, roomKey), 500)
            if (this.state.gameMode === 'Blitz') {
              this.drawFromDatabase(18);
            } else {
              database.blitzGame.child(this.state.roomKey).child('deck').once('value', deck => {
                deck = deck.val().slice();
                if (deck !== null) {
                  this.setState({deck});
                }
              })
            }
          });
        } else {
          setTimeout(() => this.playerSetup(fbId, roomKey), 500)
          if (this.state.gameMode === 'Blitz') {
            this.drawFromDatabase(18);
          } else {
            database.blitzGame.child(this.state.roomKey).child('deck').once('value', deck => {
              deck = deck.val().slice();
              if (deck !== null) {
                this.setState({deck});
              }
            })
          }
        }
      })
    })

  }

  drawFromDatabase(num) {
    database.blitzGame.child(this.state.roomKey).child('deck').once('value', deck => {
      deck = deck.val();
      if (deck !== null) {
        if (deck.length >= 5) {
          let storageDeck;
          if (this.state.player === "playerOne") {
            // draw from top;
            storageDeck = deck.splice(0, num);
          } else {
            // draw from bottom;
            storageDeck = deck.splice(deck.length - num, deck.length);
          }
          this.setState({deck: storageDeck});
          database.blitzGame.child(this.state.roomKey).child('deck').set(deck)
        } else if (deck.length === 1 ){
          deck = deck.concat(this.state.fakeDeck);
          database.blitzGame.child(this.state.roomKey).child('deck').remove()
          this.setState({deck: deck, fakeNumber: 12})
        } else {
          this.setState({deck: this.state.fakeDeck, fakeNumber: 13});
        }
      }
    })
  }

  playerSetup(fbId, roomKey) {
    this.getFbInfo(fbId).then(facebookData => {
      facebookData = facebookData.val()
      let fbName = facebookData.name.slice(0, 10);
      let fbPic = facebookData.fbPic;
      let space = fbName.indexOf(' ');
      if (space > 0) {
        fbName = fbName.slice(0, space);
      }
      this.setState({fbName, fbPic});
    })

    if(this.state.player === "playerOne") {
      database.blitzGame.child(roomKey).child("playerTwo").once('value', snap => {
        let friendId = snap.val().fbId;
        this.getFbInfo(friendId).then(facebookData => {
          facebookData = facebookData.val();
          let friendFbName = facebookData.name.slice(0, 10);
          let friendFbPic = facebookData.fbPic;
          let space = friendFbName.indexOf(' ');
          if (space > 0) {
            friendFbName = friendFbName.slice(0, space);
          }
          this.setState({friendFbName, friendFbPic})
        })
      })
    } else if (this.state.player === "playerTwo") {
      database.blitzGame.child(roomKey).child("playerOne").once('value', snap => {
        let friendId = snap.val().fbId;
        this.getFbInfo(friendId).then(facebookData => {
          facebookData = facebookData.val();
          let friendFbName = facebookData.name.slice(0, 10);
          let friendFbPic = facebookData.fbPic;
          let space = friendFbName.indexOf(' ');
          if (space > 0) {
            friendFbName = friendFbName.slice(0, space);
          }
          this.setState({friendFbName, friendFbPic})
        })
      })
    }

  }

  getFbInfo(fbId) {
    return database.fbFriends.child(fbId).once('value')
  }


  async componentDidMount() {
    this.setState({
      isMounted: true,
    }, () => this.startGame())
  }

  selectNewTile(key) {
    if (this.state.selectedTiles.indexOf(key) === -1) {
      this.playSound('select');
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
    this.state.completedHands.push(this.state.chosenCards);

    hand = calculateScore(this.state.chosenCards);
    // console.log(this.state.player, this.state.friendScore)
    this.playSound('tileDrop');
    this.setState({
      destroy: true,
      pressed: true,
      lastCompletedHand: hand[0],
      playerScore: this.state.playerScore += hand[1],
    }, () => {
      let bestHand = this.findBestHand(this.state.chosenCards);
      this.setState({bestHand})
      this.updateRoomStats(bestHand);
      if (this.state.gameMode === 'Blitz') this.drawFromDatabase(5);
      this.setState({
        destroy: false,
        chosenCards: [],
        selectedTiles: [],
        currentTile: null,
      })
      // connected to scoring animation and storing KEY TILES
      setTimeout(() => {
        this.setState({
          pressed: false,
          hoverHand: []
        })}, 750)
    });
  }

  findBestHand(recentHand) {
    let bestHand = this.state.bestHand;
    let handScore = calculateScore(recentHand);
    if (bestHand === undefined) return recentHand;
    let bestHandScore = calculateScore(bestHand);
    if (handScore[1] > bestHandScore[1]) {
      bestHand = recentHand
    }
    return bestHand
  }

  updateRoomStats(bestHand) {
    database.blitzGame
    .child(this.state.roomKey)
    .child(this.state.player)
    .child('score')
    .set(this.state.playerScore)

    database.blitzGame
    .child(this.state.roomKey)
    .child(this.state.player)
    .child('handsMade')
    .set(this.state.completedHands.length)

    database.blitzGame
    .child(this.state.roomKey)
    .child(this.state.player)
    .child('bestHand')
    .set(bestHand)
  }

  addEmptyTiles(tile) {
    if (!this.state.emptyTiles.includes(tile)) {
      this.setState({
        emptyTiles: [...this.state.emptyTiles, tile]
      }, () => this.checkGameOver())
    }
  }

  checkGameOver() {
    if (this.state.timer <= 0 || this.state.emptyTiles.length >= 5) {
      this.changeGameStatus();
    }
  }

  changeGameStatus() {
    finished = true;
    database.blitzGame.child(this.state.roomKey).child(this.state.player).child('finished').set(true);
    this.setState({finished});
    if (this.state.friendFinished) {
      setTimeout(() => this.gameOver(), 500);
    }
  }

  gameOver() {
    clearInterval(this.timer);
    if (this.state.playerScore > this.state.friendScore) {
      this.showModal('win', 'lose');
    } else if (this.state.friendScore > this.state.playerScore) {
      this.showModal('lose', 'win');
    } else {
      this.showModal('tie', 'tie');
    }

  }

  reset() {
    if (this.state.chosenCards.length > 0) {
      this.playSound('reset');
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
    this.setState({
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
      this.startListening();
      this.timer = setInterval(this.startTimer.bind(this), 1000);
    }, 450)
  }

  goBack() {
    database.blitzGame.child(this.state.roomKey).child(this.state.player).child('finished').set(true);
    clearInterval(this.timer);
    this.setState({
      isMounted: false
    }, () => this.props.navigation.goBack());
  }

  startListening() {

    if (this.state.player === "playerOne") {
      // listen to player two
      database.blitzGame.child(this.state.roomKey).child("playerTwo").child('score').on('value', score => {
        friendScore = score.val();
        if (this.state.isMounted) this.setState({friendScore})
      })

      database.blitzGame.child(this.state.roomKey).child("playerTwo").child('finished').on('value', status => {
        let friendFinished = status.val();
        this.setState({friendFinished})
        if (friendFinished && this.state.finished && this.state.isMounted) {
          this.gameOver()
        }
      })

    } else if (this.state.player === "playerTwo"){
      // listen to player one
      // console.log('should trigger but .....')
      database.blitzGame.child(this.state.roomKey).child("playerOne").child('score').on('value', score => {
        // console.log('listening to player ones scoree....')
        // console.log(friendScore, 'WHAT IS GOING ON')
        friendScore = score.val();
        if (this.state.isMounted) this.setState({friendScore})
      })

      database.blitzGame.child(this.state.roomKey).child("playerOne").child('finished').on('value', status => {
        let friendFinished = status.val();
        this.setState({friendFinished})
        if (friendFinished && this.state.finished && this.state.isMounted) {
          this.gameOver()
        }
      })
    }

    database.blitzGame.child(this.state.roomKey).child("deck").on('value', snap => {
      if (snap.val()) {
        let cardsLeft = snap.val().length;
        if (this.state.isMounted) this.setState({cardsLeft})
      }
    })
  }

  startTimer() {
    this.setState({timer: this.state.timer - 1});
    if (this.state.timer <= 0) {
      clearInterval(this.timer);
      this.gameOver();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    this.setState({
      isMounted: false
    })
  }

  showModal(status, friendStatus) {
    this.setState({status,friendStatus}, () => {
      this.setState({
        endBlitzModal: true
      })
    })
  }

  endDuel() {
    database.gameRooms.child(this.state.fbId).child('requesting').set(false);
    database.gameRooms.child(this.state.fbId).child('accepted').set(false);
    this.setState({
      isMounted: false
    }, () => {
      this.props.navigation.navigate('Classic');
    })
  }


    playSound(byte) {
      let sound = this.state.soundBytes;
      if (this.state.sound === 'on') {
        if (byte === 'startGame') {
          sound.startGameSound.play();
        } else if (byte === 'select') {
          sound.selectSound.stop(() => {
            sound.selectSound.play()
          });
        } else if (byte === 'tileDrop') {
          sound.tileDropSound.play();
        } else if (byte === 'reset') {
          sound.resetSound.play();
        } else if (byte === 'win') {
          sound.winSound.play();
        } else if (byte === 'gameloaded') {
          sound.gameLoaded.play();
        } else if (byte === 'lose') {
          sound.loseSound.play();
        }
      }
    }

  render() {
    // const boxes = Object.values(this.state.tileResponders);
    // console.log(this.state.deck)
    let cardsLeft = 78;
    if (this.state.deck !== null) {
      cardsLeft = this.state.cardsLeft + this.state.deck.length - this.state.fakeNumber;
      if (cardsLeft < 0) cardsLeft = 0;
    }
    if (this.state.gameMode === 'Duel' && this.state.deck !== null) {
      cardsLeft = this.state.deck.length;
    }
    return(
      this.state.deck !== null ? (
        <View style={styles.container}>
          {this.state.gameStarted ? (
            <View style={styles.showCase}>
              {this.state.showScore ? (
                <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', flexDirection: 'row', width: "90%"}}>
                  <View style={[styles.box, {flexDirection: 'column'}]}>
                    <Image source={{uri: this.state.fbPic}} style={{width: 50, height: 50, resizeMode: 'contain'}}/>
                    <Text style={[styles.font, {fontSize: 16}]}>
                      {this.state.fbName}
                    </Text>
                    <Text style={[styles.font, {fontSize: 25}]}>
                      {this.state.playerScore}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'ArcadeClassic', fontSize: 30, color: 'gold'}}>
                      {this.state.gameMode} MODE
                    </Text>
                    <Text style={styles.font}>
                      {this.state.timer}
                    </Text>
                    <TouchableOpacity onPress={this.goBack.bind(this)}>
                      <Text style={[styles.font, {fontSize: 15}]}>
                        Leave  Game
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.box, {flexDirection: 'column'}]}>
                    <Image source={{uri: this.state.friendFbPic}} style={{width: 50, height: 50, resizeMode: 'contain'}}/>
                    <Text style={[styles.font, {fontSize: 16}]}>
                      {this.state.friendFbName}
                    </Text>
                    <Text style={[styles.font, {fontSize: 25}]}>
                      {this.state.friendScore}
                    </Text>
                  </View>
                </View>
              ) : null}
              <View style={{flex: 1, flexDirection: 'row'}}>
                {this.state.pressed ? (
                  <View style={[styles.box, {zIndex: 100}]}>
                    <Image source={this.state.animatedHand[this.state.lastCompletedHand]} style={{width: 300, height: 100, resizeMode: 'contain'}}/>
                  </View>
                ) : (
                  this.state.hoverHand.map((card, i) => {
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
                  })
                )}
              </View>
            </View>
          ) : (null)}
          <Modal
            isVisible={this.state.endBlitzModal}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
          >
            <View style={styles.otherModal}>
              <EndBlitzModal
                close={this.endDuel.bind(this)}
                roomKey={this.state.roomKey}
                status={this.state.status}
                friendStatus={this.state.friendStatus}
                completedHands={this.state.completedHands}
                bestHand={this.state.bestHand}
                playerScore={this.state.playerScore}
                friendScore={this.state.friendScore}
                fbName={this.state.fbName}
                fbPic={this.state.fbPic}
                friendFbName={this.state.friendFbName}
                friendFbPic={this.state.friendFbPic}
                player={this.state.player}
                playSound={this.playSound.bind(this)}
                gameMode={this.state.gameMode}
                fbId={this.state.fbId}
              />
            </View>
          </Modal>
          <View style={styles.gameContainer} {...this._panResponder.panHandlers} ref="mycomp">
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
                blitzRoomKey={this.state.roomKey}
                grabTiles={this.state.grabTileResponders}
              />
            ))}
          </View>
          {!this.state.gameStarted ? (
            <View style={{flex: 1.5, backgroundColor: 'purple'}}>
            </View>
          ) : (null)}
          <View style={styles.botBanner}>
            {this.state.gameStarted ? (
              <Text style={styles.font}>
                Cards  Left:  {cardsLeft}
              </Text>
            ) : (
              <Text style={{fontSize: 60}} onPress={this.startGame.bind(this)}>
                Jabroni Code
              </Text>
            )}
          </View>
          {/* {boxes.map((tiles, i) => {
            return (
                <View style={{width: 40, height: 55, top: tiles.y, left: tiles.x ,backgroundColor:'red', position: 'absolute', zIndex: 999}} key={i}/>
            )
          })} */}
        </View>
      ) : (null)
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
    fontFamily: 'ArcadeClassic',
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
    flex: 5,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
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
  otherModal: {
    backgroundColor: 'white',
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: "60%"
  }
})
