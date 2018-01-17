import React from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity, Image, Linking} from 'react-native';
import Swiper from 'react-native-swiper';

export default class TutorialModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  componentWillMount() {

  }


  render() {
    return(
      <View style={[styles.box, {width: "100%"}]}>
        <View style={styles.box}>
          <Text style={[styles.font, {fontSize: 35, textDecorationLine: 'underline', color: 'white'}]}>
            Tutorial
          </Text>
          <Text style={[styles.font, {fontSize: 20, color: 'white', top: 5}]}>
            Welcome  to  arcade  poker
          </Text>
        </View>
        <View style={[styles.box, {flex: 4}]}>
          <Swiper
            showsButtons={true}
            showsPagination={false}
            loop = {false}
            nextButton={<Image source={require('../assets/icons/right.png')} style={{width:20, height: 20, resizeMode: 'contain'}}/>}
            prevButton={<Image source={require('../assets/icons/left.png')} style={{width:20, height: 20, resizeMode: 'contain'}}/>}
            >
              <View style={[styles.box]}>
                <View style={[styles.box, {flex: 4}]}>
                  <Image
                    source={require('../assets/tutorialImages/page1.png')}
                    style={{width: 250, height: 250, resizeMode: 'contain'}}
                  />
                </View>
                <View style={[styles.box, {width: "90%"}]}>
                  <Text style={[styles.font]}>
                    The  goal  of  the  game  is  to  get  as  many  points  as  possible
                  </Text>
                </View>
              </View>
              <View style={[styles.box]}>
                <View style={[styles.box, {flex: 4}]}>
                  <Image
                    source={require('../assets/tutorialImages/page2.png')}
                    style={{width: 250, height: 250, resizeMode: 'contain'}}
                  />
                </View>
                <View style={[styles.box, {width: "90%"}]}>
                  <Text style={[styles.font]}>
                    To  earn  points,  you  must  drag  5  cards  to  complete  a  hand
                  </Text>
                </View>
              </View>
              <View style={[styles.box]}>
                <View style={[styles.box, {flex: 4}]}>
                  <Image
                    source={require('../assets/tutorialImages/page3.png')}
                    style={{width: 250, height: 250, resizeMode: 'contain'}}
                  />
                </View>
                <View style={[styles.box, {width: "90%"}]}>
                  <Text style={[styles.font]}>
                    Each  hand  is  scored  differently
                  </Text>
                </View>
              </View>
              <View style={[styles.box]}>
                <View style={[styles.box, {flex: 4}]}>
                  <Image
                    source={require('../assets/cards/wildRed.png')}
                    style={{width: 100, height: 100, resizeMode: 'contain'}}
                  />
                  <Image
                    source={require('../assets/cards/wildBlack.png')}
                    style={{width: 100, height: 100, resizeMode: 'contain'}}
                  />
                </View>
                <View style={[styles.box, {width: "90%"}]}>
                  <Text style={[styles.font]}>
                    These  are  wild  cards, there  is  only  1  in  each  game, they  can  used  as  any  card  of  the  same  color
                  </Text>
                </View>
              </View>
              <View style={[styles.box]}>
                <View style={[styles.box, {flex: 4}]}>
                  <Image
                    source={require('../assets/tutorialImages/page5.png')}
                    style={{width: 250, height: 250, resizeMode: 'contain'}}
                  />
                </View>
                <View style={[styles.box, {width: "90%", justifyContent: 'space-between'}]}>
                  <Text style={[styles.font]}>
                    Compete  with  your  friends  and  Try  to  make  the  leaderboard!
                  </Text>
                  <Text style={[styles.font]}>
                    Thanks  for  playing!!
                  </Text>
                </View>
              </View>
            </Swiper>
        </View>
        <View style={[styles.box]}>
          <TouchableOpacity onPress={() => this.props.close()}>
            <Text style={[styles.font, {fontSize: 20, color: 'white'}]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'ArcadeClassic',
    fontSize: 18,
    textAlign: 'center',
    color: 'lightgreen'
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
})
