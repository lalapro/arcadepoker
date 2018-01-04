import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import Swiper from 'react-native-swiper';


export default class HereComesANewChallengerModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      highscore: '',
      accepted: false,
      countdown: 5,
      fbId: null
    }
  }

  async componentWillMount() {
    this.setState({fontLoaded: true})
  }


  render() {
    // console.log(this.state.friendsOnline)
    return(
      <View style={styles.box}>
        <Swiper
          showsButtons={true}
          showsPagination={false}
          loop = {false}
          nextButton={<Image source={require('../assets/right.png')} style={{width:20, height: 20, resizeMode: 'contain'}}/>}
          prevButton={<Image source={require('../assets/left.png')} style={{width:20, height: 20, resizeMode: 'contain'}}/>}
        >
          <View style={[styles.box]}>
            <View style={[styles.box, {flex: 4}]}>
              <Image
                source={require('../assets/blitzSample1.png')}
                style={{width: 250, height: 250, resizeMode: 'contain'}}
              />
            </View>
            <View style={[styles.box]}>
              <Text style={[styles.font, {fontSize: 15, textAlign: 'center'}]}>
                Players  draw  from  a  deck  of  104  cards.
              </Text>
            </View>
          </View>
          <View style={[styles.box]}>
            <View style={[styles.box, {flex: 4}]}>
              <Image
                source={require('../assets/blitzSample2.png')}
                style={{width: 250, height: 250, resizeMode: 'contain'}}
              />
            </View>
            <View style={[styles.box]}>
              <Text style={[styles.font, {fontSize: 15, textAlign: 'center'}]}>
                The  player  with  the  most  points  wins!
              </Text>
            </View>
          </View>
          <View style={[styles.box]}>
            <View style={[styles.box, {flex: 4}]}>
                <Image
                  source={require('../assets/blitzSample4.png')}
                  style={{width: 300, height: 300, resizeMode: 'contain'}}
                />
            </View>
            <View style={[styles.box]}>
              <Text style={[styles.font, {fontSize: 15, textAlign: 'center'}]}>
                More  combinations  than  classic   mode!!
              </Text>
            </View>
          </View>
        </Swiper>
        <TouchableOpacity onPress={this.props.close}>
          <Text style={styles.font}>
            Back
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
