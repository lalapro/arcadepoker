import React from 'react';
import { Platform, StyleSheet, Text, View, Image, PanResponder, Animated, Dimensions, TouchableWithoutFeedback, Alert } from 'react-native';
import { keyTiles } from '../helpers/tileLogic';
import CARDIMAGES from '../helpers/cardImages';
import CARDIMAGESHIGHLIGHT from '../helpers/cardImagesHighlight'
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
        zIndex: 120,
      },
      android: false
    };
  }

  componentWillMount() {
    if (this.props.x === 2) {
      this.state.cardStyle.top = (this.props.y - 1) * -130;
      // Alert.alert(JSON.stringify((this.props.y - 1) * -130))
    } else if(this.props.x !== 0 && this.props.x !== 4){
      this.state.cardStyle.top = (this.props.y - 1.5) * -130;
    }
  }



  componentWillReceiveProps(oldProps) {
    if (oldProps.selectedTiles.indexOf(this.state.hexPosition) !== -1) {
      this.setState({isHighlighted: true});
      this.props.add(this.props.card, this.state.hexPosition);
    } else {
      this.setState({isHighlighted: false});
    }
    if (oldProps.card) {
      if(oldProps.card.value === "" && keyTiles.includes(this.state.hexPosition) && oldProps.hoverHand.length > 0) {
        this.props.addEmpty(this.state.hexPosition)
      }
    }

  }


  render() {
    return (
      this.state.isHighlighted ? (
        <Animated.View style={[this.state.cardStyle, this.props.animate]}>
            {this.props.card ? (
              <Image source={CARDIMAGESHIGHLIGHT[this.props.card.value]} style={{width: 85, height: 85, resizeMode: 'contain'}}/>
            ) : (
              <Image source={require('../assets/cards/empty-highlight.png')} style={{width: 85, height: 85, resizeMode: 'contain'}}/>
            )}
        </Animated.View>
      ) : (
        <Animated.View
          style={[this.state.cardStyle, this.props.animate]} >
          {this.props.card ? (
            <Image source={CARDIMAGES[this.props.card.value]} style={{width: 85, height: 85, resizeMode: 'contain'}}/>
          ) : (
            <Image source={require('../assets/cards/empty.png')} style={{width: 85, height: 85, resizeMode: 'contain'}}/>
          )}
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
