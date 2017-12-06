import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import HexGrid from './HexGrid.js';

const CARDS = []

for (let i = 0; i < 52; i++) {
  CARDS[i] = i;
}



export default class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      cards: CARDS,
      drag: 'drag me',
      currentlySelected: [],
      destroy: false
    }
  }

  currentlySelected(card) {
    if (this.state.currentlySelected.length < 5) {
      this.setState({currentlySelected: [...this.state.currentlySelected, card]}, () => console.log(this.state.currentlySelected, this.state.currentlySelected.length))
    }
  }

  destroy() {
    this.setState({destroy: true})
  }



  render() {
    // console.log(this.state.cards)
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={{fontSize: 50}}> {this.state.drag} </Text>
        </View>
        <View style={styles.gameContainer} >
          {/* <HexGrid cards={1} deck={this.state.cards} addCard={this.currentlySelected.bind(this)} selected={this.state.currentlySelected} destroy={this.destroy.bind(this)} shouldKill={this.state.destroy}/>
          <HexGrid cards={4} deck={this.state.cards} addCard={this.currentlySelected.bind(this)} selected={this.state.currentlySelected} destroy={this.destroy.bind(this)} shouldKill={this.state.destroy}/>
          <HexGrid cards={3} deck={this.state.cards} addCard={this.currentlySelected.bind(this)} selected={this.state.currentlySelected} destroy={this.destroy.bind(this)} shouldKill={this.state.destroy}/>
          <HexGrid cards={4} deck={this.state.cards} addCard={this.currentlySelected.bind(this)} selected={this.state.currentlySelected} destroy={this.destroy.bind(this)} shouldKill={this.state.destroy}/>
          <HexGrid cards={1} deck={this.state.cards} addCard={this.currentlySelected.bind(this)} selected={this.state.currentlySelected} destroy={this.destroy.bind(this)} shouldKill={this.state.destroy}/> */}
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
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
  },
});
