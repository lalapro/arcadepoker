import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import GameNavigator from './app/components/GameNavigator';
import database from './app/firebase/db';
import Splash from './Splash'



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
      <GameNavigator />
    )
  }
}
