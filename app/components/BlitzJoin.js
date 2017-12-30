import React from 'react';
import { StyleSheet, Text, View, Button, PanResponder, Dimensions, Image, Animated, TouchableOpacity, AsyncStorage } from 'react-native';
import { Font } from 'expo';
import Modal from 'react-native-modal';
import HexGrid from './HexGrid.js';
import { adjacentTiles, keyTiles } from '../helpers/tileLogic';
import shuffledDeck from '../helpers/shuffledDeck';
import calculateScore from '../helpers/calculateBlitzScore';
import handAnimations from '../helpers/handAnimations';
import EndBlitzModal from '../modals/EndBlitzModal'
import cardImages from '../helpers/cardImages';
import database from '../firebase/db';


export default class BlitzJoin extends React.Component {
  constructor(props){
    super(props)
    this.state = {
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
      fontLoaded: false,
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
      timer: 5,
      status: null,
      endBlitzModal: false,
      bestHand: undefined
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
    let fakeDeck = shuffledDeck('blanks').slice();
    this.setState({fakeDeck})
    let fbId = await AsyncStorage.getItem('fbId');
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
            this.drawFromDatabase(18)
          });
        } else {
          this.drawFromDatabase(18);
          setTimeout(() => this.playerSetup(fbId, roomKey), 500)
        }
      })
    })

  }

  drawFromDatabase(num) {
    database.blitzGame.child(this.state.roomKey).child('deck').once('value', deck => {

      deck = deck.val();
      if (deck.length >= 5) {
        let storageDeck;
        if (this.state.player === "playerOne") {
          // draw from top
          storageDeck = deck.splice(0, num);
        } else {
          // draw from bottom
          storageDeck = deck.splice(deck.length - num, deck.length);
        }
        this.setState({deck: storageDeck});
        database.blitzGame.child(this.state.roomKey).child('deck').set(deck)
      } else if (deck.length === 1 ){
        deck = deck.concat(this.state.fakeDeck);
        database.blitzGame.child(this.state.roomKey).child('deck').remove(deck)
        this.setState({deck})
      } else {
        this.setState({deck: this.state.fakeDeck});
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
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
      isMounted: true,
    }, () => this.startGame())
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
    this.state.completedHands.push(this.state.chosenCards);

    hand = calculateScore(this.state.chosenCards);
    // console.log(this.state.player, this.state.friendScore)
    this.setState({
      destroy: true,
      pressed: true,
      lastCompletedHand: hand[0],
      playerScore: this.state.playerScore += hand[1],
    }, () => {
      let bestHand = this.findBestHand(this.state.chosenCards);

      this.updateRoomStats(bestHand);
      this.drawFromDatabase(5);
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
    let bestHand = this.state.bestHand || ['highCard', 5];
    let handScore = calculateScore(recentHand);
    let bestHandScore = calculateScore(bestHandScore);
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
    if (this.state.emptyTiles.length === 5 || this.state.completedHands.length === 10) {
      this.gameOver();
    }
  }

  gameOver() {
    if (this.state.playerScore > this.state.friendScore) {
      this.showModal('win', 'lose');
    } else if (this.state.friendScore > this.state.playerScore) {
      this.showModal('lose', 'win');
    } else {
      this.showModal('tie', 'tie');
    }

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
    this.props.navigation.goBack()
  }

  startListening() {

    if (this.state.player === "playerOne") {
      // listen to player two
      database.blitzGame.child(this.state.roomKey).child("playerTwo").child('score').on('value', score => {
        friendScore = score.val();
        if (this.state.isMounted) this.setState({friendScore}, () => 'this triggering for jimmy?')
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
    }

    database.blitzGame.child(this.state.roomKey).child("deck").on('value', snap => {
      let cardsLeft = snap.val().length;
      if (this.state.isMounted) this.setState({cardsLeft})
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
    this.props.navigation.navigate('Classic');
  }

  render() {
    // const boxes = Object.values(this.state.tileResponders);
    // console.log(this.state.deck)
    return(
      this.state.deck !== null ? (
        <View style={styles.container}>
          {this.state.gameStarted ? (
            <View style={styles.showCase}>
              {this.state.fontLoaded && this.state.showScore ? (
                <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', flexDirection: 'row', width: "90%"}}>
                  <View style={[styles.box, {flexDirection: 'column'}]}>
                    <TouchableOpacity onPress={() => this.switchModal('hof')}>
                      <Image source={{uri: this.state.fbPic}} style={{width: 50, height: 50, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <Text style={[styles.font, {fontSize: 15}]}>
                      {this.state.fbName}
                    </Text>
                    <Text style={[styles.font, {fontSize: 15}]}>
                      {this.state.playerScore}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'arcade', fontSize: 30, color: 'yellow'}}>
                      BLITZ MODE!
                    </Text>
                    <Text style={styles.font}>
                      {this.state.timer}
                    </Text>
                  </View>
                  <View style={[styles.box, {flexDirection: 'column'}]}>
                    <TouchableOpacity onPress={this.goBack.bind(this)}>
                      {this.state.fontLoaded ? (
                        <Image source={{uri: this.state.friendFbPic}} style={{width: 50, height: 50, resizeMode: 'contain'}}/>
                      ) : null}
                    </TouchableOpacity>
                    <Text style={[styles.font, {fontSize: 15}]}>
                      {this.state.friendFbName}
                    </Text>
                    <Text style={[styles.font, {fontSize: 15}]}>
                      {this.state.friendScore}
                    </Text>
                  </View>
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
              />
            </View>
          </Modal>
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
                blitzRoomKey={this.state.roomKey}
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
                Cards  Left:  {this.state.cardsLeft + this.state.deck.length}
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
