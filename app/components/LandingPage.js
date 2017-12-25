import React from 'react';
import { StyleSheet, Text, View, Image, Animated, Dimensions } from 'react-native';
import Hex from './Hex'


const {height, width} = Dimensions.get('window');

export default class LandingPage extends React.Component {
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

  drawFromDeck(num) {
    // console.log(this.state.numberOfCards, num)
    for (let i = 0; i < num; i++) {
      let newCardIndex = this.state.numberOfCards.push(this.props.deck.shift()) - 1;
      // this.state.animatedValue[newCardIndex] = {
      //   value: new Animated.Value(0),
      //   position: -150
      // }
    }
    this.setState({
      numberOfCards: this.state.numberOfCards
    })
    // let suite = getRandomIntInclusive(0, 3);
    // this.animate()
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

  shouldComponentUpdate() {
    return false
  }

  render() {
    let newCards = this.state.numberOfCards.reverse()
    return (
      <View style={styles.row}>
        {newCards.map((card, i) => (
          <Image
            source={card.image}
            key={i}
            style={{width: 85, height: 85, resizeMode: 'contain', marginBottom: -15}}
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
