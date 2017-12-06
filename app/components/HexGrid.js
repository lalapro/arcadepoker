// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { addSelected, generateDeck } from '../actions'
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Svg from 'react-native-svg-uri';
import Hex from './Hex'

export default class HexGrid extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      numberOfCards: [],
      chosenCards: []
    }
  }

  componentWillMount() {
    for (let i = 0; i < this.props.tiles; i++) {
      this.state.numberOfCards.push(this.props.deck.shift())
    }
  }

  selectCard(card) {

  }




  render() {
    return (
      <View style={styles.row}>
        {this.state.numberOfCards.map((card, i) => (
          this.state.chosenCards.includes(card) ?
          <Hex image={require('../assets/media.svg')} card={card} key={i}/> :
          <Hex image={require('../assets/hex.svg')} card={card} key={i}/>
        ))}
      </View>

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
