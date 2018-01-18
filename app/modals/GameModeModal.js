import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage, Platform, Alert } from 'react-native';
import Swiper from 'react-native-swiper';


export default class GameModeModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      highscore: '',
      accepted: false,
      countdown: 5,
      fbId: null,
      gameMode: 'share',
      board1: 'black',
      board2: 'white',
      currentBoard: 'Blitz'
    }
  }

  async componentWillMount() {
    if (Platform.OS === 'android') {
      this.setState({
        OS: 'android'
      })
    } else {
      this.setState({
        OS: 'iphone'
      })
    }
    this.setState({fontLoaded: true});
    this.switchBoard(this.props.gameMode)
  }

  switchBoard(boardToSwitch) {

    if (boardToSwitch === 'Blitz' && this.state.currentBoard !== 'Blitz') {
      this.setState({
        board1: 'black',
        board2: 'white',
        currentBoard: 'Blitz'
      })
    } else if (boardToSwitch === 'Duel' && this.state.currentBoard !== 'Duel') {

      this.setState({
        board1: 'white',
        board2: 'black',
        currentBoard: 'Duel'
      })
    }
  }


  render() {
    return(
      <View style={styles.box}>
        <View style={[styles.box]}>
          <Text style={[styles.font, {fontSize: 25, textDecorationLine: 'underline'}]}>
            Choose your game mode
          </Text>
        </View>
        <View style={[styles.box, {flex: 0.8, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'black', alignItems: 'flex-start'}]}>
          <View style={[styles.box, {backgroundColor: this.state.board2, borderRadius: 4}]} onTouchEnd={() => this.switchBoard('Blitz')}>
            <Text style={[styles.font, {fontSize: 20, color: this.state.board1}]}>
              Blitz
            </Text>
          </View>
          <View style={[styles.box, {backgroundColor: this.state.board1, borderRadius: 4}]} onTouchEnd={() => this.switchBoard('Duel')}>
            <Text style={[styles.font, {fontSize: 20, color: this.state.board2}]}>
              Duel
            </Text>
          </View>
        </View>
        <View style={[styles.box, {flex: 5}]}>
          {this.state.currentBoard === 'Blitz' ? (
            <View style={styles.box}>
              <View style={[styles.box, {flex: 4, flexDirection: 'row'}]}>
                <View>
                  <Image
                    source={require('../assets/icons/blitzPlayer1.png')}
                    style={{width: 250, height: 250, resizeMode: 'contain'}}
                  />
                </View>
              </View>
              <View style={[styles.box, {width: "90%"}]}>
                <Text style={[styles.font, {fontSize: 18, textAlign: 'center', color: 'lightgreen'}]}>
                  Both  players  draw  from  the  same  deck  of  104  cards!
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.box}>
              <View style={[styles.box, {flex: 4, flexDirection: 'row'}]}>
                <View>
                  <Image
                    source={require('../assets/icons/duelSample.png')}
                    style={{width: 160, height: 160, resizeMode: 'contain'}}
                  />
                </View>
                <View>
                  <Image
                    source={require('../assets/icons/duelSample.png')}
                    style={{width: 160, height: 160, resizeMode: 'contain'}}
                  />
                </View>
              </View>
              <View style={[styles.box, {width: "90%"}]}>
                <Text style={[styles.font, {fontSize: 18, textAlign: 'center', color: 'lightgreen'}]}>
                  Both  players  start  with  the  exact  same  deck!
                </Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => this.props.close(this.state.currentBoard)}>
          <Text style={[styles.font, {fontSize: 25}]}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    width: "100%"
  },
  font: {
    fontFamily: 'ArcadeClassic',
    fontSize: 20,
    color: 'white'
  },
})
