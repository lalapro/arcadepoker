import React from 'react';
import { StyleSheet, Text, View, Button, PanResponder, Dimensions, Image, Animated, TouchableOpacity } from 'react-native';
import HexGrid from './HexGrid.js';
import recordPositions from './recordPositions';
import adjacentTiles from '../helpers/adjacentTiles';
import shuffledDeck from '../helpers/shuffledDeck';
import calculateScore from '../helpers/calculateScore';
import handAnimations from '../helpers/handAnimations';
import cardImages from '../helpers/cardImages';



const {height, width} = Dimensions.get('window');


export default class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      deck: shuffledDeck(),
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
      restart: false,
      bgColor: 'lightgreen',
      totalScore: 0
    }
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder:(evt, gestureState) => true,
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
                if (this.state.selectedTiles.indexOf(key) === -1) { // if not exists...
                  this.selectNewTile(key);
                }
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
                if (this.state.selectedTiles.indexOf(key) === -1) { // if not exists...
                  this.selectNewTile(key);
                }
              }
            }
          }
        }
      },
      onPanResponderTerminate: (evt) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.chosenCards.length === 5 && this.state.selectedTiles.length === 5) {
          this.destroy();
        } else {
          this.reset();
        }
      }
    });
  }


  restartGame() {
    // console.log('restarting')
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
      bgColor: 'lightgreen',
      restart: true,
      totalScore: 0
    }, () => {
      this.setState({
        restart: false
      })
    })
  }


  selectNewTile(key) {
    this.setState({
      selectedTiles: [...this.state.selectedTiles, key],
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
    // this.animateCompletedHand()
    this.state.completedHands.push(calculateScore(this.state.chosenCards))
    hand = calculateScore(this.state.chosenCards);

    this.setState({
      destroy: true,
      pressed: true,
      lastCompletedHand: hand[0],
      totalScore: this.state.totalScore += hand[1],
    }, () => {
      this.setState({
        destroy: false,
        chosenCards: [],
        selectedTiles: [],
        currentTile: null,
      })
      setTimeout(() => {this.setState({
        pressed: false,
        hoverHand: []
      })}, 750)
    }, () => {console.log(this.state.completedHands)});
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

  //
  // testGoogle = async () => {
  //   // let redirect = `https://auth.expo.io/@lalapro/habitation`;
  //   let redirect = `https://www.google.com`;
  //   let clientID = "153167299359-2cpffomr751msrk0gnenekd8kq8jipcc.apps.googleusercontent.com"
  //   await AuthSession.startAsync({
  //       authUrl:
  //       `https://accounts.google.com/o/oauth2/v2/auth` +
  //       `?scope=https://www.googleapis.com/auth/calendar` +
  //       `&response_type=token` +
  //       `&redirect_uri=${redirect}` +
  //       `&client_id=${clientID}`
  //   })
  //   .then(result => {
  //     console.log('got something back', result.type)
  //   })
  //   .catch(err => {
  //       console.error(err, ' first')
  //   })
  // }

  changeBg() {
    if (this.state.bgColor === 'black') {
      this.setState({
        bgColor: 'lightgreen'
      })
    } else {
      this.setState({
        bgColor: 'black'
      })
    }
  }

  // animateCompletedHand() {
  //   this.state.completedHands.push(calculateScore(this.state.chosenCards))
  //   this.state.animatedHand = new Animated.Value(0);
  //   Animated.spring(                  // Animate over time
  //     this.state.animatedHand,            // The animated value to drive
  //     {
  //       toValue: 1,                   // Animate to opacity: 1 (opaque)
  //       speed: 20,              // Make it take a while
  //       bounciness: 12
  //     }
  //   ).start();
  //
  // }


  render() {
    const boxes = Object.values(this.state.tileResponders);
    return (
      <View style={[styles.container, {backgroundColor: this.state.bgColor}]}>
        <View style={[styles.topBanner, /*{backgroundColor: this.state.bgColor}*/]}>
          <TouchableOpacity onPress={this.restartGame.bind(this)}>
            <Image source={require('../assets/refresh.png')} style={{width: 50, height: 50}}/>
          </TouchableOpacity>
          <View style={{flexDirection: 'column'}}>
            <Image
              style={{width: 200, height: 50, resizeMode: 'contain'}}
              source={require('../assets/vidya.png')}
            />
            <Image
              style={{width: 200, height: 50, resizeMode: 'contain'}}
              source={require('../assets/poker.png')}
            />
          </View>
          <TouchableOpacity onPress={this.restartGame.bind(this)}>
            <Image source={require('../assets/refresh.png')} style={{width: 50, height: 50}}/>
          </TouchableOpacity>
        </View>
        <View style={[styles.showCase, /*{backgroundColor: this.state.bgColor}*/]}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 50}}>{this.state.totalScore}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {this.state.hoverHand.map((card, i) => {
              if (i%2 === 0) {
                return (
                  <Image source={cardImages[card.value]}
                    style={{top: 15, width: 65, height: 65, resizeMode: 'contain', marginRight: -15}}
                    key={i}
                  />
                )
              } else {
                return (
                  <Image source={cardImages[card.value]}
                    style={{top:40, width: 65, height: 65, resizeMode: 'contain', marginRight: -15}}
                    key={i}
                  />
                )
              }
            })}
          </View>
        </View>
        <View style={[styles.gameContainer, {backgroundColor: 'transparent'}]} {...this._panResponder.panHandlers} ref="mycomp">
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
              x={i}
              key={i}
            />
          ))}
        </View>
        <View style={styles.botBanner}>

        </View>
        {/* {boxes.map((tiles, i) => {
          return (
              <View style={{width: 40, height: 55, top: tiles.y, left: tiles.x ,backgroundColor:'red', position: 'absolute'}} key={i}/>
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
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    zIndex: 99
  },
  showCase: {
    flex: 1,
    backgroundColor: 'lightgreen',
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
    height: "100%",
  },
  botBanner: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  }
});


// const mapStateToProps = (store) => {
//   return {
//     deck: store.deck,
//     selectedCards: store.selectedCards
//   }
// }
//
// const mapDispatcherToProps = (dispatch) => ({
//   saveDeck: bindActionCreators(generateDeck, dispatch)
// })
//
//
// export default connect(mapStateToProps, mapDispatcherToProps)(Game);
