import React from 'react';
import { StyleSheet, Text, View, Image, PanResponder, Animated} from 'react-native';
import Svg from 'react-native-svg-uri';


export default class HexGrid extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isHighlighted: false,
      cardStyle: {
        position: 'relative',
        width: 75,
        height: 75,
        marginTop: -10,
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

  componentWillReceiveProps(oldProps) {
    if (oldProps.destroy) {
      this.setState({isHighlighted: false})
    }
  }


  highlight() {
    if (this.props.chosen.length < 5) {
      this.props.add(this.props.card)
      this.setState({isHighlighted: !this.state.isHighlighted})
    }
  }


  render() {
    return (
      this.state.isHighlighted ? (
        <Animated.View style={[this.state.cardStyle, this.props.animate]} onTouchStart={this.highlight.bind(this)}>
          <Svg source={require('../assets/media.svg')}/>
          <Text style={styles.text}>{this.props.card}</Text>
        </Animated.View>
      ) : (
        <Animated.View style={[this.state.cardStyle, this.props.animate]} onTouchStart={this.highlight.bind(this)}>
          <Svg source={require('../assets/hex.svg')}/>
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
  card: {
    position: 'relative',
    width: 75,
    height: 75,
    marginTop: -10,
    // top: 75
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
