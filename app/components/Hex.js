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
        width: 85,
        height: 85,
        marginBottom: -27,
      },
      cardStyle2: {
        position: 'relative',
        width: 85,
        height: 85,
        marginBottom: -27,
      },
      suite: 0
    }
  }

  componentWillMount() {
    if (this.props.x === 2) {
      this.state.cardStyle.top = (this.props.y - 1) * -130
      this.state.cardStyle2.top = (this.props.y - 1) * -130
    } else if(this.props.x !== 0 && this.props.x !== 4){
      this.state.cardStyle.top = (this.props.y - 1.5) * -130
      this.state.cardStyle2.top = (this.props.y - 1.5) * -130
    }

    let suite = this.getRandomIntInclusive(0, 3);
    this.setState({suite})
  }

  componentDidMount() {

  }


  componentWillReceiveProps(oldProps) {
    if (oldProps.selectedTiles.indexOf(this.state.hexPosition) !== -1) {
      this.setState({isHighlighted: true})
      this.props.add(this.props.card)
    } else {
      this.setState({isHighlighted: false})
    }

  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }


  render() {
    if (this.props.x === 3 && this.props.y === 3) {
      console.log(this.props.card)
    }
    return (
      this.state.isHighlighted ? (
        <Animated.View style={[this.state.cardStyle, this.props.animate]}>
          <Image source={this.props.card.highlight} style={{width: 85, height: 85, resizeMode: 'contain'}}/>
        </Animated.View>
      ) : (
        <Animated.View style={[this.state.cardStyle, this.props.animate]} >
          <Image source={this.props.card.image} style={{width: 85, height: 85, resizeMode: 'contain'}}/>
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
    left: 35,
    top: -47,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20,
  },
  image: {
    height: 95,
    width: 95,
    zIndex: 90
  }
});
