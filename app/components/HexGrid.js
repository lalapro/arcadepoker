import React from 'react';
import { StyleSheet, Text, View, Image, Animated} from 'react-native';
import Svg from 'react-native-svg-uri';
import Hex from './Hex'

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


  componentWillReceiveProps(oldProps) {
    let cardsToReplace = 0;
    let oldCards = this.state.numberOfCards.slice();

    if (oldProps.destroy) {
      oldProps.chosen.forEach((card, i) => {
        exists = this.state.numberOfCards.indexOf(card)
        if (exists !== -1) {
          this.state.numberOfCards.splice(exists, 1);
          cardsToReplace++;
        }
      })

      this.modifyOldCardsAnimation(oldCards);
      this.drawFromDeck(cardsToReplace);
    }
  }

  modifyOldCardsAnimation(oldCards) {
    this.state.numberOfCards.forEach((card, i) => {
      let differenceInPosition = Math.abs(this.state.numberOfCards.indexOf(card) - oldCards.indexOf(card))
      console.log(card, differenceInPosition)
      this.state.animatedValue[i] = {
        value: new Animated.Value(0),
        position: differenceInPosition * -65
      }
    })
  }

  drawFromDeck(num) {
    for (let i = 0; i < num; i++) {
      let newCardIndex = this.state.numberOfCards.push(this.props.deck.shift()) - 1;
      this.state.animatedValue[newCardIndex] = {
        value: new Animated.Value(0),
        position: -150
      }
    }
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
    Animated.stagger(100, animations).start()
  }

  render() {
    return (
      <Animated.View style={styles.row}>
        {this.state.numberOfCards.map((card, i) => (
          <Hex
            card={card}
            key={i}
            x={this.props.x}
            y={i}
            add={this.props.add}
            chosen={this.props.chosen}
            destroy={this.props.destroy}
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
      </Animated.View>

    )
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: -10
  },
  card: {
    width: 75,
    height: 75,
    marginTop: -10
  },
  text: {
    position: 'relative',
    left: 30,
    top: -47,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20
  }
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
