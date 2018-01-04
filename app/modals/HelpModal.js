import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import calculateScore from '../helpers/calculateScore';

export default class HelpModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fontLoaded: false,
      hands: [
        ["Royal Flush", 2000],
        ["Straight Flush", 1000],
        ["Four  of  a  Kind", 500],
        ["Full House", 250],
        ["Flush", 100],
        ["Straight", 50],
        ["Three  of  a  Kind", 25],
        ["Two  Pair", 20],
        ["Pair", 10],
        ["High  Card", 5],
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

  backToGame() {
    clearInterval(this.blinking);
    this.props.close();
  }

  render() {
    // console.log(this.state.sampleHand)
    return (
      <View style={{width: "80%", height: "100%"}}>
        <View style={{flex: 2, justifyContent:'center', alignItems: 'center'}}>
          <Text style={[styles.font, {fontSize: 25}]}>
            How to play:
          </Text>
          <Text style={[styles.font, {fontSize: 18}]}>
            Drag  5 cards
          </Text>
        </View>
        <View style={{flex: 5, justifyContent: 'space-around'}}>
          <View style={styles.line}>
            <Text style={[styles.font, {textDecorationLine: 'underline'}]}>
              Hands
            </Text>
            <Text style={[styles.font, {textDecorationLine: 'underline'}]}>
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
          <Text style={[styles.font]}>
            Go  back
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
