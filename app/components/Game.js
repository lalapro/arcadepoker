// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { generateDeck } from '../actions'
import React from 'react';
import { StyleSheet, Text, View, Button, PanResponder} from 'react-native';
import HexGrid from './HexGrid.js';
import StackNav from './StackNav'


const DECK = [];

for (let i = 0; i < 52; i++) {
  DECK[i] = i
}

const TILES = [];

for(let i = 0; i < 13; i++) {
  TILES[i] = i
}


export default class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      deck: DECK,
      tiles: TILES,
      startingTiles: [1, 4, 3, 4, 1],
      chosenCards:[],
      destroy: false
    }
  }

  componentWillMount() {

  }

  destroy() {
    if (this.state.chosenCards.length === 5) {
      this.setState({
        destroy: true
      }, () => {
        this.setState({
          destroy: false,
          chosenCards: []
        })
      })
    } else {
      console.log('choose 5 cards')
    }
  }

  addToChosenCards(card) {
    let alreadyChosen = this.state.chosenCards.indexOf(card);
    if (alreadyChosen === -1) {
      this.setState({chosenCards: [...this.state.chosenCards, card]})
    } else {
      this.state.chosenCards.splice(alreadyChosen, 1);
      this.setState({chosenCards: [...this.state.chosenCards]})
    }
  }



  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <Text style={{fontSize: 50}}> {this.state.drag} </Text>
        </View>
        <View style={styles.gameContainer}>
          {this.state.startingTiles.map((tiles, i) => (
            <HexGrid
              deck={this.state.deck}
              tiles={tiles}
              add={this.addToChosenCards.bind(this)}
              chosen={this.state.chosenCards}
              destroy={this.state.destroy}
              x={i}
              key={i}
            />
          ))}
        </View>
        <View style={styles.container}>
          <Button onPress={this.destroy.bind(this)} title="Destroy"/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    zIndex: 99
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
  },
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
