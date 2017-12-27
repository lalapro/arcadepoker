import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import Game from './app/components/Game.js';
import GameNavigator from './app/components/GameNavigator'



export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: shuffledDeck().slice()
    }
  }

  render() {
    return (
      <GameNavigator/>
    )
  }
}
