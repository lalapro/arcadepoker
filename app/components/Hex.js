import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Svg from 'react-native-svg-uri';


export default class HexGrid extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isHighlighted: false
    }
  }

  componentWillMount() {

  }



  render() {
    return (
      <View style={styles.card}>
        <Svg source={this.props.image}/>
        <Text style={styles.text}>{this.props.card}</Text>
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
