import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import SplashPage from './app/components/SplashPage.js';
import Game from './app/components/Game.js';



export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playPressed: false,
      deck: shuffledDeck().slice()
    }
  }

  insertCoin() {
    this.setState({
      playPressed: true
    })
  }

  removeCoin() {
    this.setState({
      playPressed: false,
      deck: shuffledDeck().slice()
    })
  }

  render() {
    // console.log(this.state.deck.length)
    return (
      // this.state.playPressed ?
      <Game removeCoin={this.removeCoin.bind(this)} deck={this.state.deck}/>
      //  :
      // <SplashPage insertCoin={this.insertCoin.bind(this)} deck={this.state.deck}/>
    )
  }
}
