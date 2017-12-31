import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import { Font } from 'expo';
import database from '../firebase/db'


export default class EndBlitzModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fontLoaded: false,
      status: props.status,
      friendBestHand: [],
      friendCompletedHands: 0
    }
  }

  async componentWillMount() {
    this.getFriendHandInfo();
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
    })
  }

  getFriendHandInfo() {
    let roomKey = this.props.roomKey;
    let player = this.props.player;
    if (player === 'playerOne') {
      database.blitzGame.child(roomKey).child('playerTwo').once('value', snap => {
        let friendData = snap.val();
        let friendCompletedHands = friendData.handsMade;
        let friendBestHand = friendData.bestHand;
        this.setState({friendCompletedHands, friendBestHand})
      })
    } else {
      database.blitzGame.child(roomKey).child('playerOne').once('value', snap => {
        let friendData = snap.val();
        let friendCompletedHands = friendData.handsMade;
        let friendBestHand = friendData.bestHand;
        this.setState({friendCompletedHands, friendBestHand})
      })
    }
  }



  endStatus(status) {
    if(status === 'win') {
      return (
        <Text style={[styles.font, {fontSize: 40}]}>
          Winner
        </Text>
      )
    } else if (status === 'lose') {
      return (
        <Text style={[styles.font, {fontSize: 40}]}>
          Loser
        </Text>
      )
    } else {
      return (
        <Text style={[styles.font, {fontSize: 40}]}>
          Tie
        </Text>
      )
    }
  }

  render() {
    return(
      this.state.fontLoaded ? (
        <View style={styles.box}>
          <View style={[styles.box, {flex: 5 ,flexDirection: 'row'}]}>
            <View style={[styles.box, {height: "100%"}]}>
              <View style={[styles.box, {flex: 4}]}>
                <Image
                  source={{uri: this.props.fbPic}}
                  style={{width: 100, height: 100, resizeMode: 'contain'}}
                />
                <Text style={[styles.font, {fontSize: 25}]}>
                  {this.props.fbName}
                </Text>
              </View>
              <View style={[styles.box]}>
                {this.endStatus(this.props.status)}
              </View>
              <View style={[styles.box, {flexDirection: 'column'}]}>
                <Text style={[styles.font, {fontSize: 30}]}>
                  {this.props.playerScore}  pts
                </Text>
              </View>
              <View style={[styles.box, {flexDirection: 'column'}]}>
                <Text style={[styles.font]}>
                  Hands  Made :
                </Text>
                <Text style={[styles.font, {fontSize: 25}]}>
                  {this.props.completedHands.length}
                </Text>
              </View>
              <View style={[styles.box, {flexDirection: 'column'}]}>
                <Text style={[styles.font, {textDecorationLine: 'underline'}]}>
                  Best  Hand
                </Text>
                <View style={[styles.box, {flexDirection: 'row', top: 5}]}>
                  {this.props.bestHand ? (
                    this.props.bestHand.map((card, i) => {
                      if (i%2 === 0) {
                        return (
                          <Image source={card.highlight}
                            style={{width: 35, height: 35, resizeMode: 'contain', marginRight: -13, zIndex: this.props.bestHand.length - i}}
                            key={i}
                          />
                        )
                      } else {
                        return (
                          <Image source={card.highlight}
                            style={{top: 15, width: 35, height: 35, resizeMode: 'contain', marginRight: -13, zIndex: this.props.bestHand.length - i}}
                            key={i}
                          />
                        )
                      }
                    })
                  ) : (
                    <View style={styles.box}>
                      <Text style={styles.font}>
                        None
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={[styles.box, {flex: 1, height: "100%"}]}>
              <View style={[styles.box, {flex: 4}]}>
                <Image
                  source={{uri: this.props.friendFbPic}}
                  style={{width: 100, height: 100, resizeMode: 'contain'}}
                />
                <Text style={[styles.font, {fontSize: 25}]}>
                  {this.props.friendFbName}
                </Text>
              </View>
              <View style={[styles.box]}>
                {this.endStatus(this.props.friendStatus)}
              </View>
              <View style={[styles.box, {flexDirection: 'column'}]}>
                <Text style={[styles.font, {fontSize: 30}]}>
                  {this.props.friendScore}  pts
                </Text>
              </View>
              <View style={[styles.box, {flexDirection: 'column'}]}>
                <Text style={[styles.font]}>
                  Hands  Made :
                </Text>
                <Text style={[styles.font, {fontSize: 25}]}>
                  {this.state.friendCompletedHands}
                </Text>
              </View>
              <View style={[styles.box, {flexDirection: 'column'}]}>
                <Text style={[styles.font, {textDecorationLine: 'underline'}]}>
                  Best  Hand
                </Text>
                <View style={[styles.box, {flexDirection: 'row', top: 5}]}>
                  {this.state.friendBestHand ? (
                    this.state.friendBestHand.map((card, i) => {
                      if (i%2 === 0) {
                        return (
                          <Image source={card.highlight}
                            style={{width: 35, height: 35, resizeMode: 'contain', marginRight: -13, zIndex: this.state.friendBestHand.length - i}}
                            key={i}
                          />
                        )
                      } else {
                        return (
                          <Image source={card.highlight}
                            style={{top: 15, width: 35, height: 35, resizeMode: 'contain', marginRight: -13, zIndex: this.state.friendBestHand.length - i}}
                            key={i}
                          />
                        )
                      }
                    })
                  ) : (
                    <View style={styles.box}>
                      <Text style={styles.font}>
                        None
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.box}>
            <TouchableOpacity onPress={this.props.close}>
              <Text style={styles.font}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (null)
    )
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    height: "100%"
  },
  font: {
    fontFamily: 'arcade',
    fontSize: 20,
    color: 'white'
  },
})
