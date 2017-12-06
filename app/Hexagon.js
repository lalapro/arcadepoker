import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Hexagon extends React.Component {
  render() {
    return (
      <View style={styles.hexagon}>
        <View style={styles.hexagonInner} />
        <View style={styles.hexagonBefore} />
        <View style={styles.hexagonAfter} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  hexagon: {
    width: 70,
    height: 38.5
  },
  hexagonInner: {
    width: 70,
    height: 38.5,
    backgroundColor: 'transparent'
  },
  hexagonAfter: {
    position: 'absolute',
    bottom: -17.5,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 35,
    borderLeftColor: 'transparent',
    borderRightWidth: 35,
    borderRightColor: 'transparent',
    borderTopWidth: 17.5,
    borderTopColor: 'red'
  },
  hexagonBefore: {
    position: 'absolute',
    top: -17.2,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 35,
    borderLeftColor: 'transparent',
    borderRightWidth: 35,
    borderRightColor: 'transparent',
    borderBottomWidth: 17.5,
    borderBottomColor: 'transparent'
  }
});
