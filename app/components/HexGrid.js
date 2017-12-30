import React from 'react';
import { StyleSheet, Text, View, Image, Animated, Dimensions } from 'react-native';
import Hex from './Hex';
import database from '../firebase/db'

const {height, width} = Dimensions.get('window');

export default class HexGrid extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      numberOfCards: [],
      animatedValue: [],
      blitzRoomKey: this.props.blitzRoomKey,
      drawable: false
    }

  }

  componentWillMount() {
    // console.log(this.props.blitzRoomKey)
    this.drawFromDeck(this.props.tiles);
  }

  setTileResponders(e) {
    // console.log(this.props.x)
    //(e.nativeEvent.layout.y + (height / 8.5) * 4.5) + (65 * difference);
    // console.log(e.nativeEvent.layout)
    let difference = 0;
    for (let i = this.props.tiles - 1; i >= 0; i--) {
      x = e.nativeEvent.layout.x + (85/4);
      y = e.nativeEvent.layout.y + ((height / 8.5) * 3.5) + (65 * difference);
      let obj = {
        x: x,
        y: y
      }
      difference++;
      // if (this.props.x === 0) console.log(obj)
      this.props.layoutCreators([this.props.x, i], obj)
    }
  }



  componentWillReceiveProps(oldProps) {
    // lag somewhere here
    if(oldProps.restart) {
      this.setState({
        numberOfCards: [],
        animatedValue: []
      }, () => this.drawFromDeck(oldProps.tiles))
    }

    let cardsToReplace = 0;
    if (oldProps.destroy) {
      // console.log(oldProps.chosen, 'oldprops')
      // console.log(this.state.numberOfCards, 'this.state')
      let oldCards = this.state.numberOfCards.slice();
      oldProps.chosen.forEach((card) => {
        exists = this.state.numberOfCards.indexOf(card)
        if (exists !== -1) {
          this.state.numberOfCards.splice(exists, 1);
          cardsToReplace++;
        }
      })
      // console.log(cardsToReplace)
      this.modifyOldCardsAnimation(oldCards);
      this.drawFromDeck(cardsToReplace);
    }

    if(oldProps.gameStarted) {
      this.animateStartOfGame(this.state.numberOfCards)
    }


  }

  animateStartOfGame(startingCards) {
    for(let i = 0; i < startingCards.length; i++) {
      this.state.animatedValue[i] = {
        value: new Animated.Value(0),
        //TODO might have to make dynamic
        position: -100
      }
    }
    this.animate()
  }

  modifyOldCardsAnimation(oldCards) {
    this.state.numberOfCards.forEach((card, i) => {
      let differenceInPosition = Math.abs(this.state.numberOfCards.indexOf(card) - oldCards.indexOf(card))
      this.state.animatedValue[i] = {
        value: new Animated.Value(0),
        position: differenceInPosition * -65
      }
    })
  }

  drawFromDeck(num) {
    for (let i = 0; i < num; i++) {
      let nextCard = this.props.deck.shift();
      let newCardIndex = this.state.numberOfCards.push(nextCard) - 1;
      this.state.animatedValue[newCardIndex] = {
        value: new Animated.Value(0),
        position: -100
      }
    }
    this.setState({numberOfCards: this.state.numberOfCards});

    this.animate();
  }

  setBlitzRoomDrawable(bool) {
    database.blitzGame.child(this.state.blitzRoomKey).child('drawable').set(bool); //prevent double draw
  }



  animate() {
    const animations = this.state.animatedValue.map((item, i) => {
      return Animated.spring(
        this.state.animatedValue[i].value,
        {
          toValue: 1,
          speed: 20,
          bounciness: 12,
          useNativeDriver: true
        }
      )
    })
    Animated.stagger(50, animations).start()
  }

  render() {
    return (
      <View style={styles.row} onLayout={this.setTileResponders.bind(this)}>
        {this.state.numberOfCards.map((card, i) => (
          <Hex
            card={card}
            key={i}
            x={this.props.x}
            y={i}
            add={this.props.add}
            chosen={this.props.chosen}
            destroy={this.props.destroy}
            selectedTiles={this.props.selectedTiles}
            addEmpty={this.props.addEmpty}
            hoverHand={this.props.hoverHand}
            animate={{
              transform: [{
                translateY: this.state.animatedValue[i].value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [this.state.animatedValue[i].position, 0]
                })
              }]
            }}
          />
        ))}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -13,
    marginRight: -10,
    // backgroundColor: 'red',
    // height: "100%"
  },
});
