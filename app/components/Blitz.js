import React from 'react';
import { StyleSheet, Text, View, Button, PanResponder, Dimensions, Image, Animated, TouchableOpacity, AsyncStorage, AppState } from 'react-native';
import { Font } from 'expo';
import HexGrid from './HexGrid.js';
import Swiper from 'react-native-swiper';
import Modal from 'react-native-modal';
import { adjacentTiles, keyTiles } from '../helpers/tileLogic';
import shuffledDeck from '../helpers/shuffledDeck';
import calculateScore from '../helpers/calculateScore';
import handAnimations from '../helpers/handAnimations';
import cardImages from '../helpers/cardImages';
import database from '../firebase/db';
import ChallengeModal from '../modals/ChallengeModal';
import HereComesANewChallengerModal from '../modals/HereComesANewChallengerModal';


export default class Blitz extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fbId: null,
      fontLoaded: false,
      blinky: false,
      challengeModal: false,
      hereComesANewChallenger: false,
      totalscore: 0,
      highscore: 0,
      newChallenger: 0,
      appState: AppState.currentState,
      online: false
    }
  }


  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    let fbId = await AsyncStorage.getItem('fbId');
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
      fbId: fbId
    }, () => {
      this.resetRequestStatus();
      this.setOnlineStatus(true);
      this.listenForChallenges();
    })
  }



  closeModal(type, roomKey) {
    console.log(roomKey, 'in close modal')
    this.setState({
      challengeModal: false,
      hereComesANewChallenger: false
    })

    if (type === 'cancelChallenge') {
      this.resetRequestStatus();
    } else if (type === 'startGame') {
      setTimeout(() => this.props.navigation.navigate('BlitzJoin'), 500)
    }
  }

  async showModal(modal, challenger) {
    if (modal === 'challenge') {
      if (this.state.fbId === null) {
        facebookLogin().then(resObj => {
          this.setState({
            fbId: resObj.user.user.id,
            challengeModal: true
          })
        })
      } else {
        this.setState({challengeModal: true})
      }
    } else if (modal === "challengeRecieved") {
      setTimeout(() => {
        this.setState({
          hereComesANewChallenger: true,
          challenger: challenger
        })
      }, 450)
    }
  }

  goBack() {
    this.props.navigation.goBack();
  }

  componentWillUnmount() {
    console.log('unmounting?');
    this.setOnlineStatus(false);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  setOnlineStatus(bool) {
    if (this.state.fbId !== null) {
      database.gameRooms.child(this.state.fbId).child('online').set(bool);
      this.setState({online: bool})
    }
  }

  resetRequestStatus(friendId) {
    if (friendId) {
      database.gameRooms.child(friendId).child('requesting').set(false);
    } else {
      database.gameRooms.child(this.state.fbId).child('requesting').set(false);
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('online true')
      this.setOnlineStatus(true);
    } else {
      this.setOnlineStatus(false);
      this.resetRequestStatus();
    }
    this.setState({appState: nextAppState});
  }

  listenForChallenges() {
      database.gameRooms.child(this.state.fbId).child('requesting').on('value', data => {
        // console.log('daya........', data, this.state.online, this.state.fbId)
        let challenger = data.val();
        if (this.state.online && this.state.fbId !== null && this.state.hereComesANewChallenger === false) {
          if (typeof challenger === 'string') {
            console.log('am i setting state outside of component???')
            this.closeModal()
            this.showModal("challengeRecieved", challenger);
          }
        }
      })
  }




  render() {
    return(
      <View style={styles.container}>
        <View style={[styles.topBanner]}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', top: 15}}>
            {this.state.fontLoaded ? (
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'arcade', fontSize: 65, color: 'white'}}>
                    BLITZ
                  </Text>
                </View>
                <Text style={{fontFamily: 'arcade', fontSize: 65, color: 'white'}}>
                  Mode
                </Text>
              </View>
            ) : (null)}
          </View>
        </View>
        <Modal
          isVisible={this.state.challengeModal}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
        >
          <View style={styles.otherModal}>
            <ChallengeModal
              close={this.closeModal.bind(this)}
              fbId={this.state.fbId}
            />
          </View>
        </Modal>
        <Modal
          isVisible={this.state.hereComesANewChallenger}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
        >
          <View style={styles.otherModal}>
            <HereComesANewChallengerModal
              close={this.closeModal.bind(this)}
              fbId={this.state.fbId}
              challenger={this.state.challenger}
            />
          </View>
        </Modal>
        <View style={styles.gameContainer}>
          {this.state.pressed ? (
            <View style={{position: 'absolute', zIndex: 2}}>
              <Image source={this.state.animatedHand[this.state.lastCompletedHand]} style={{width: 300, height: 100, resizeMode: 'contain'}}/>
            </View>
          ) : null}
          <Swiper
            showsButtons={true}
            showsPagination={false}
            nextButton={<Image source={require('../assets/next.png')} style={{width:20, height: 20, resizeMode: 'contain'}}/>}
            prevButton={<Image source={require('../assets/prev.png')} style={{width:20, height: 20, resizeMode: 'contain'}}/>}
          >
            <View style={[styles.box]}>
              <Text style={styles.font}>
                1
              </Text>
            </View>
            <View style={[styles.box]}>
              <Text style={styles.font}>
                2
              </Text>
            </View>
            <View style={[styles.box]}>
              <Text style={styles.font}>
                3
              </Text>
            </View>
          </Swiper>
        </View>
        <View style={[styles.box, {flex: 1.5}]}>
          <View style={{flex: 1, flexDirection:'row', width: "100%", backgroundColor: 'lightblue'}}>
            <View style={styles.box}>
              <TouchableOpacity onPress={() => this.showModal('challenge')}>
                <Text style={[styles.font, {fontSize: 20}]}>
                  Challenge
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.box}>
              <TouchableOpacity>
                <Text style={[styles.font, {fontSize: 20}]}>
                  Random
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={this.goBack.bind(this)}>
              <Text style={styles.font}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    width: "100%"
  },
  font: {
    fontSize: 40,
    fontFamily: 'arcade',
    color: 'white'
  },
  topBanner: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    zIndex: 80
  },
  showCase: {
    flex: 3.5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    flexDirection: 'column',
    zIndex: 99
  },
  gameContainer: {
    flex: 4,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
    zIndex: 99
  },
  botBanner: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  },
  otherModal: {
    backgroundColor: 'white',
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: "60%"
  },
})
