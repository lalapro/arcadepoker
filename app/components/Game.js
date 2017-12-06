// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { generateDeck } from '../actions'
import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import HexGrid from './HexGrid.js';

const DECK = [];

for (let i = 0; i < 52; i++) {
  DECK[i] = i
}


export default class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      deck: DECK,
      startingPositions: [1, 4, 3, 4, 1],
      chosenCards:[]
    }
  }

  componentWillMount() {
    // this.generateDeck()
  }




  showStore() {
    console.log(this.props)
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={{fontSize: 50}}> {this.state.drag} </Text>
        </View>
        <View style={styles.gameContainer}>
          {this.state.startingPositions.map((tiles, i) => (
            <HexGrid
              deck={this.state.deck}
              tiles={tiles}
              key={i}
            />
          ))}
        </View>
        <View style={styles.container}>
          <Button onPress={this.showStore.bind(this)} title="Destroy"/>
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
