import React from 'react';
import { PanResponder } from 'react-native';

export default draggingLogic = () => {
  PanResponder.create({
    onMoveShouldSetPanResponder:(evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      // console.log(gestureState)
      tileResponders = this.state.tileResponders;
      currentTile = this.state.currentTile;
      // console.log(this.generateAvailableTiles(this.state.currentTile))

      if (currentTile === null) {
        for(key in tileResponders) {
          // if touch gesture is between boxes...
          if (gestureState.numberActiveTouches === 1) {
            insideX = gestureState.moveX >= tileResponders[key].x && gestureState.moveX <= (tileResponders[key].x + 40);
            insideY = gestureState.moveY >= tileResponders[key].y && gestureState.moveY <= (tileResponders[key].y + 55);
            if (insideX && insideY) {
              let newTileDetected = true;
              if (this.state.selectedTiles.indexOf(key) === -1) { // if not exists...
                this.selectNewTile(key);
              }
            }
          }
        }
      }
      else {
        let neighborTiles = this.state.availableTiles
        for (let i = 0; i < neighborTiles.length; i++) {
          if (gestureState.numberActiveTouches === 1) {
            key = neighborTiles[i]
            insideX = gestureState.moveX >= tileResponders[key].x && gestureState.moveX <= (tileResponders[key].x + 40);
            insideY = gestureState.moveY >= tileResponders[key].y && gestureState.moveY <= (tileResponders[key].y + 55);
            if (insideX && insideY) {
              let newTileDetected = true;
              if (this.state.selectedTiles.indexOf(key) === -1) { // if not exists...
                this.selectNewTile(key);
              }
            }
          }
        }
      }
    },
    onPanResponderTerminate: (evt) => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (this.state.chosenCards.length === 5 && this.state.selectedTiles.length === 5) {
        this.destroy();
      } else {
        this.reset();
      }
    }
  });
}
