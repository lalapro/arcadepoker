import React from 'react';
import { StyleSheet, Text, View, Image, Animated, Dimensions } from 'react-native';
import Hex from './Hex'


const {height, width} = Dimensions.get('window');

export default class HexGrid extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      numberOfCards: [],
      animatedValue: []
    }

  }

  componentWillMount() {
    this.drawFromDeck(this.props.tiles);
  }

  setTileResponders(e) {
    // console.log(e.nativeEvent.layout.height)
    let difference = 0;
    for (let i = this.props.tiles - 1; i >= 0; i--) {
      let obj = {
        x: e.nativeEvent.layout.x + e.nativeEvent.layout.width / 2 + e.nativeEvent.layout.width / 6,
        y: (e.nativeEvent.layout.y + (height / 9) * 3) + (65 * difference)
      }
      difference++;
      this.props.layoutCreators([this.props.x, i], obj)
    }
  }



  componentWillReceiveProps(oldProps) {
    // lag somewhere here
    if(oldProps.restart) {
      this.setState({
        numberOfCards: [],
        animatedValue: []
      }, () => {
        this.drawFromDeck(oldProps.tiles)
      })
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
      this.drawFromDeck(cardsToReplace)
      // setTimeout(() => {this.drawFromDeck(cardsToReplace)}, 2000);
    }


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

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  drawFromDeck(num) {
    // console.log(this.state.numberOfCards, num)
    for (let i = 0; i < num; i++) {
      let newCardIndex = this.state.numberOfCards.push(this.props.deck.shift()) - 1;
      this.state.animatedValue[newCardIndex] = {
        value: new Animated.Value(0),
        position: -150
      }
    }
    this.setState({
      numberOfCards: this.state.numberOfCards
    })
    // let suite = getRandomIntInclusive(0, 3);
    this.animate()
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
            reHighlight={this.props.reHighlight}
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
  },
});

// const mapStateToProps = (store) => {
//   return {
//     selectedCards: store.selectedCards,
//     deck: store.deck
//   }
// }
//
// const mapDispatcherToProps = (dispatch) => ({
//   addToCard: bindActionCreators(addSelected, dispatch)
// })
//
//
// export default connect(mapStateToProps, mapDispatcherToProps)(HexGrid);
