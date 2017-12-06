import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import Game from './app/components/Game.js';
import reducer from './app/reducers/'


const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Game/>
      </Provider>
    )
  }
}
