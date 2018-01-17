import React from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity, Image, Linking} from 'react-native';


export default class CreditsModal extends React.Component {
  constructor(props){
    super(props)
    this.animatedValue = new Animated.Value(0)
  }

  componentWillMount() {
    this.animate();
  }

  navigateToSite() {
    let url = 'http://www.jonathanbyuen.com'
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        // Alert.alert('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    })
  }

  animate () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

  render() {
    const movingMargin = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-80, 100, -80]
    })
    return(
      <View style={[styles.box, {width: "100%"}]}>
        <View style={styles.box}>
          <Text style={[styles.font, {textDecorationLine: 'underline'}]}>
            How  to  Play
          </Text>
        </View>
        <View style={[styles.box, {flex: 5}]}>
          <Image
            source={require('../assets/icons/sample.png')}
            style={{width: 150, height: 150, resizeMode: 'contain'}}
          />
          <View style={[styles.box, {alignItems: 'flex-start'}]}>
            <Text style={[styles.font]}>
              1. Drag  5  cards
            </Text>
            <Text style={[styles.font]}>
              2.  More  cards  will  fall  down
            </Text>
            <Text style={[styles.font]}>
              3.  Accumulate  points!!
            </Text>
          </View>
        </View>
        <View style={[styles.box, {alignItems: 'center', justifyContent:'center', width: '80%'}]}>
          <Animated.View
            style={{top: -10, width: '100%', alignItems: 'center', justifyContent:'center', marginLeft: movingMargin}}
            >
              <TouchableOpacity onPress={this.navigateToSite.bind(this)} style={{zIndex: 1}}>
                <Image
                  source={require('../assets/icons/website.png')}
                  style={{width: 85, height: 85, resizeMode: 'contain', zIndex: 99}}
                />
            </TouchableOpacity>
            </Animated.View>
        </View>
        <View style={[styles.box, {backgroundColor: 'transparent'}]}>
          <TouchableOpacity onPress={() => this.props.close()}>
            <Text style={styles.font}>
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
    fontSize: 20,
    color: 'white'
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
})
