import React from 'react';
import { StyleSheet, Text, View, Animated, Easing, Modal, TouchableOpacity, Image, Linking} from 'react-native';
import GameOverModal from './app/modals/GameOverModal'

export default class Splash extends React.Component {
  constructor(props){
    super(props)


  }


  render() {
    const cards = [
      [0, require('./app/assets/2.png')],
      [0, require('./app/assets/3.png')],
      [0, require('./app/assets/4.png')],
      [0, require('./app/assets/1.png')],
    ]
    return(
      <View style={styles.box}>
        <View style={[styles.box, {flex: 6}]}>
          <Text style={styles.font}>
            Contact  me!
          </Text>
          <Text style={styles.font}>
            Poker
          </Text>
          <View style={{flexDirection: 'row', left: -10}}>
            {cards.map((card, i) => {
              if (i%2 === 0) {
                return (
                  <Image source={cards[i][1]}
                    style={{top: 15, width: 60, height: 60, resizeMode: 'contain', marginRight: -15}}
                    key={i}
                  />
                )
              } else {
                return (
                  <Image source={cards[i][1]}
                    style={{top:40, width: 60, height: 60, resizeMode: 'contain', marginRight: -15}}
                    key={i}
                  />
                )
              }
            })}
          </View>
        </View>
        <Modal
          isVisible={true}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
        >
          <View style={[styles.otherModal, {height: "30%"}]}>
            <GameOverModal
            />
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'ArcadeClassic',
    fontSize: 50,
    color: 'white'
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
})
