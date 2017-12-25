import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import { Font } from 'expo';


export default class FriendModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fontLoaded: false,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      'arcade': require('../assets/fonts/arcadeclassic.regular.ttf'),
    });
    this.setState({
      fontLoaded: true,
    })
  }



  render() {
    return(
      this.state.fontLoaded ? (
        <View>
            <Text style={styles.font}>
              Game  Over
            </Text>
            <TouchableOpacity onPress={() => this.props.close('hof')}>
              <Text style={[styles.font, {fontSize: 20}]}>
                View  Highscores
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.close('over')}>
              <Text style={[styles.font, {fontSize: 20}]}>
                Play  Again
              </Text>
            </TouchableOpacity>
        </View>
      ) : (null)
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'arcade',
    fontSize: 40,
  },
})
