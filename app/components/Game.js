import React from 'react';
import { StyleSheet, Text, View, Button, PanResponder, Dimensions} from 'react-native';
import HexGrid from './HexGrid.js';
import recordPositions from './recordPositions';



const DECK = [];

for (let i = 0; i < 52; i++) {
  DECK[i] = i
}

const TILES = [];

for(let i = 0; i < 13; i++) {
  TILES[i] = i
}

const {height, width} = Dimensions.get('window');


export default class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      deck: DECK,
      tiles: null,
      startingTiles: [1, 4, 3, 4, 1],
      chosenCards:[],
      tileResponders: {},
      selectedTiles: [],
      destroy: false
    }

  }


  componentWillMount() {
    let area = recordPositions(height, width);
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder:(evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        // console.log(gestureState)
        tileResponders = this.state.tileResponders

        for(key in tileResponders) {
          // if touch gesture is between boxes...
          // console.log(gestureState)
          insideX = gestureState.moveX >= tileResponders[key].x && gestureState.moveX <= (tileResponders[key].x + 35);
          insideY = gestureState.moveY >= tileResponders[key].y && gestureState.moveY <= (tileResponders[key].y + 40);
          if (insideX && insideY) {
            if (this.state.selectedTiles.length < 5 && this.state.selectedTiles.indexOf(key) === -1) {
              this.setState({
                selectedTiles: [...this.state.selectedTiles, key]
              })
            }
          }
        }
      },
      onPanResponderTerminate: (evt) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.destroy();
      }
    });
  }

  componentDidMount() {
    // setTimeout(this.findShit.bind(this), 2000)
  }



  setLayout(pos, obj) {
    this.state.tileResponders[pos] = obj
    this.setState({tileResponders: this.state.tileResponders})
  }

  destroy() {
    // console.log(this.state.chosenCards, this.state.selectedTiles)
    // if (this.state.chosenCards.length === 5) {
    this.setState({
      destroy: true
    }, () => {
      this.setState({
        destroy: false,
        chosenCards: [],
        selectedTiles: []
      })
    })
    // console.log(this.state.selectedTiles)
  }

  addToChosenCards(card) {
    // console.log('add')
    let alreadyChosen = this.state.chosenCards.indexOf(card);
    if (alreadyChosen === -1 && this.state.chosenCards.length < 5) {
      this.setState({chosenCards: [...this.state.chosenCards, card]})
    }
  }



  render() {
    const boxes = Object.values(this.state.tileResponders);
    return (
      <View style={styles.container}>
        <View style={styles.topBanner}>
          <Text style={{fontSize: 50}}> {this.state.drag} </Text>
        </View>
        <View style={styles.gameContainer} {...this._panResponder.panHandlers} ref="mycomp">
          {this.state.startingTiles.map((tiles, i) => (
            <HexGrid
              deck={this.state.deck}
              tiles={tiles}
              add={this.addToChosenCards.bind(this)}
              chosen={this.state.chosenCards}
              destroy={this.state.destroy}
              layoutCreators={this.setLayout.bind(this)}
              selectedTiles={this.state.selectedTiles}
              x={i}
              key={i}
            />
          ))}
        </View>
        <View style={styles.botBanner}>
          <Button onPress={this.destroy.bind(this)} title="Destroy"/>
        </View>
        {/* {boxes.map((tiles, i) => {
          return (
              <View style={{width: 35, height: 40, top: tiles.y, left: tiles.x ,backgroundColor:'red', position: 'absolute'}} key={i}/>
          )
        })} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBanner: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    zIndex: 99
  },
  gameContainer: {
    flex: 3,
    flexDirection: 'row',
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
  },
  innerGameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightblue',
    width: "90%"

  },
  botBanner: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  },
});


// const mapStateToProps = (store) => {
//   return {
//     deck: store.deck,
//     selectedCards: store.selectedCards
//   }
// }
//
// const mapDispatcherToProps = (dispatch) => ({
//   saveDeck: bindActionCreators(generateDeck, dispatch)
// })
//
//
// export default connect(mapStateToProps, mapDispatcherToProps)(Game);
