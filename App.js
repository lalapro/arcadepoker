import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import Game from './app/components/Game.js';
import GameNavigator from './app/components/GameNavigator';
import database from './app/firebase/db';



export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: shuffledDeck().slice(),
      fbId: null
    }
  }


  render() {
    return (
      <GameNavigator/>
    )
  }
}
