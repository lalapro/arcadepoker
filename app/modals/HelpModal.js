import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Linking} from 'react-native';
import calculateScore from '../helpers/calculateScore';

export default class HelpModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hands: [
        ['Five  of  a  Kind', 3000],
        ["Royal Flush", 2500],
        ["Straight Flush", 2000],
        ["Four  of  a  Kind", 1750],
        ["Full House", 1500],
        ["Flush", 1250],
        ["Straight", 1000],
        ["Three  of  a  Kind", 750],
        ["Two  Pair", 500],
        ["Pair", 250],
        ["High  Card", 100],
      ],
      blinky: false,
      handSelected: null,
      sampleHand: []
    }
  }

  async componentWillMount() {
    this.setState({blinky: true});
    this.blinking = setInterval(this.blinky.bind(this), 750)
  }

  blinky() {
    this.setState({
      blinky: !this.state.blinky
    })
  }

  showHand(hand) {
    clearInterval(this.blinking);
    this.setState({
      handSelected: hand[0],
      sampleHand: HANDS[hand[0]]
    })
  }

  navigateToSite() {
    let url = 'https://lalapro.github.io/arcadepoker/'
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        // Alert.alert('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    })
  }

  backToGame(modal) {
    clearInterval(this.blinking);
    this.props.close(modal);
  }

  render() {
    // console.log(this.state.sampleHand)
    return (
      <View style={{flex: 1, width: "100%", height: "100%", backgroundColor: 'black', padding: 25}}>
        <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
          <Text style={[styles.font, {fontSize: 35, textDecorationLine: 'underline'}]}>
            How to play
          </Text>
        </View>
        <View style={{flex: 0.5, justifyContent:'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.backToGame('tutorial')}>
            <Text style={[styles.font, {fontSize: 20, color: 'lightgreen'}]}>
              show  tutorial
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.5, justifyContent:'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={this.navigateToSite.bind(this)}>
            <Text style={[styles.font, {fontSize: 18, color: 'gold'}]}>
              Developer  Website
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 6, justifyContent: 'center'}}>
          <View style={styles.line}>
            <Text style={[styles.font, {textDecorationLine: 'underline', fontSize: 25}]}>
              Hands
            </Text>
            <Text style={[styles.font, {textDecorationLine: 'underline', fontSize: 25}]}>
              Points
            </Text>
          </View>
          <View style={[styles.line, {flexDirection: 'column'}]}>
            {this.state.hands.map((hand, i) => (
                this.state.handSelected === hand[0] ? (
                  <View style={styles.line} key={i}>
                    <TouchableOpacity onPress={() => {this.showHand(hand)}}>
                      <Text style={[styles.font, {color: 'red'}]}>
                        {hand[0]}
                      </Text>
                    </TouchableOpacity>
                    <Text style={[styles.font, {color: 'red'}]}>
                      {hand[1]}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.line} key={i}>
                    <TouchableOpacity onPress={() => {this.showHand(hand)}}>
                      <Text style={styles.font}>
                        {hand[0]}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.font}>
                      {hand[1]}
                    </Text>
                  </View>
                )
            ))}
          </View>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {this.state.blinky && this.state.handSelected === null ? (
          <Text style={[styles.font]}>
            Tap on a hand for examples
          </Text>
        ) : (
          <View style={{flexDirection: 'row'}}>
            {this.state.sampleHand.map((card, i) => {
              if (i%2 === 0) {
                return (
                  <Image source={card.highlight}
                    style={{width: 45, height: 45, resizeMode: 'contain', marginRight: -13, zIndex: this.state.sampleHand.length - i}}
                    key={i}
                  />
                )
              } else {
                return (
                  <Image source={card.highlight}
                    style={{top: 15, width: 45, height: 45, resizeMode: 'contain', marginRight: -13, zIndex: this.state.sampleHand.length - i}}
                    key={i}
                  />
                )
              }
            })}
          </View>
        )}
      </View>
      <View style={styles.normal}>
        <TouchableOpacity onPress={this.backToGame.bind(this)}>
          <Text style={[styles.font, {fontSize: 25}]}>
            back
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
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  normal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const HANDS = {
  'Five  of  a  Kind': [
    {
      highlight: require("../assets/cards/wildBlack-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart5-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades5-highlight.png")
    },
    {
      highlight: require("../assets/cards/clubs5-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond5-highlight.png")
    },
  ],
  'Royal Flush': [
    {
      highlight: require("../assets/cards/spades10-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades11-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades12-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades13-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades1-highlight.png")
    },
  ],
  'Straight Flush': [
    {
      highlight: require("../assets/cards/heart3-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart4-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart5-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart6-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart7-highlight.png")
    }
  ],
  'Four  of  a  Kind': [
    {
      highlight: require("../assets/cards/diamond12-highlight.png")
    },
    {
      highlight: require("../assets/cards/clubs12-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart12-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades12-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond2-highlight.png")
    }
  ],
  'Full House': [
    {
      highlight: require("../assets/cards/clubs4-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades4-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart4-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades8-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond8-highlight.png")
    }
  ],
  'Flush': [
    {
      highlight: require("../assets/cards/diamond4-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond12-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond6-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond9-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond2-highlight.png")
    }
  ],
  'Straight': [
    {
      highlight: require("../assets/cards/clubs6-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades7-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond8-highlight.png")
    },
    {
      highlight: require("../assets/cards/clubs9-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart10-highlight.png")
    }
  ],
  'Three  of  a  Kind': [
    {
      highlight: require("../assets/cards/clubs4-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart4-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond4-highlight.png")
    },
    {
      highlight: require("../assets/cards/spades9.png")
    },
    {
      highlight: require("../assets/cards/clubs2.png")
    }
  ],
  'Two  Pair': [
    {
      highlight: require("../assets/cards/heart9-highlight.png")
    },
    {
      highlight: require("../assets/cards/clubs9-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond4.png")
    },
    {
      highlight: require("../assets/cards/spades7.png")
    },
    {
      highlight: require("../assets/cards/clubs2.png")
    }
  ],
  'Pair': [
    {
      highlight: require("../assets/cards/spades5-highlight.png")
    },
    {
      highlight: require("../assets/cards/diamond5-highlight.png")
    },
    {
      highlight: require("../assets/cards/clubs11.png")
    },
    {
      highlight: require("../assets/cards/spades5.png")
    },
    {
      highlight: require("../assets/cards/spades13.png")
    }
  ],
  'High  Card': [
    {
      highlight: require("../assets/cards/clubs13-highlight.png")
    },
    {
      highlight: require("../assets/cards/heart4.png")
    },
    {
      highlight: require("../assets/cards/diamond10.png")
    },
    {
      highlight: require("../assets/cards/spades4.png")
    },
    {
      highlight: require("../assets/cards/clubs8.png")
    }
  ],
}
