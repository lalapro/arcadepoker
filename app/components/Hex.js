import React from 'react';
import { StyleSheet, Text, View, Image, PanResponder, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { keyTiles } from '../helpers/tileLogic'
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
        zIndex: 99
      },
    };
  }

  componentWillMount() {
    if (this.props.x === 2) {
      this.state.cardStyle.top = (this.props.y - 1) * -130;
    } else if(this.props.x !== 0 && this.props.x !== 4){
      this.state.cardStyle.top = (this.props.y - 1.5) * -130;
    }
  }



  componentWillReceiveProps(oldProps) {
    if (oldProps.selectedTiles.indexOf(this.state.hexPosition) !== -1) {
      this.setState({isHighlighted: true});
      this.props.add(this.props.card);
    } else {
      this.setState({isHighlighted: false});
    }
    if(oldProps.card.value === "" && keyTiles.includes(this.state.hexPosition) && oldProps.hoverHand.length > 0) {
      this.props.addEmpty(this.state.hexPosition)
    }

  }

  setTileResponders(e) {
    console.log(this.props.x, e.nativeEvent.layout)
  }

  render() {
    return (
      this.state.isHighlighted ? (
        <View onLayout={this.setTileResponders.bind(this)}>
          <Animated.View style={[this.state.cardStyle, this.props.animate]}>
            <Image source={this.props.card.highlight} style={{width: 85, height: 85, resizeMode: 'contain'}}/>
          </Animated.View>
        </View>

      ) : (
        <View onLayout={this.setTileResponders.bind(this)}>
          <Animated.View style={[this.state.cardStyle, this.props.animate]} >
            <Image source={this.props.card.image} style={{width: 85, height: 85, resizeMode: 'contain'}}/>
          </Animated.View>
        </View>
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
