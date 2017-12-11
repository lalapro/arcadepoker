import React from 'react';
import { StyleSheet, Text, View, Image, PanResponder, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import SVG from 'react-native-svg-uri';

const {height, width} = Dimensions.get('window');

export default class HexGrid extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isHighlighted: false,
      hexPosition: `${this.props.x},${this.props.y}`,
      cardStyle: {
        position: 'relative',
        width: 95,
        height: 95,
        marginBottom: -30,
      }
    }
  }

  componentWillMount() {
    if (this.props.x === 2) {
      this.state.cardStyle.top = (this.props.y - 1) * -130
    } else if(this.props.x !== 0 && this.props.x !== 4){
      this.state.cardStyle.top = (this.props.y - 1.5) * -130
    }
  }

  componentDidMount() {
  }


  componentWillReceiveProps(oldProps) {
    if (oldProps.selectedTiles.indexOf(this.state.hexPosition) !== -1) {
      this.setState({isHighlighted: true})
      this.props.add(this.props.card)
    }
    if (oldProps.destroy) {
      // console.log('eh?')
      this.setState({isHighlighted: false})
    }
  }




  render() {
    // console.log(this.state.isHighlighted)
    return (
      this.state.isHighlighted ? (
        <Animated.View style={[this.state.cardStyle, this.props.animate]}>
          <SVG source={require('../assets/media.svg')}/>
          <Text style={styles.text}>{this.props.card}</Text>
        </Animated.View>
      ) : (
        <Animated.View style={[this.state.cardStyle, this.props.animate]} >
          <SVG source={require('../assets/hex.svg')}/>
          <Text style={styles.text}>{this.props.card}</Text>
        </Animated.View>
      )
    )
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: -10
  },
  text: {
    position: 'relative',
    left: 30,
    top: -47,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20,
    // zIndex: 20
  },
  image: {
    height: 95,
    width: 95,
    zIndex: 90
  }
});
