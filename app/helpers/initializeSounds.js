var Sound = require('react-native-sound');
import { Alert } from 'react-native';
// Sound.setCategory('Playback');

export default initializeSounds = () => {
  startGameSound = new Sound('startGame.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) {return;}
  });
  selectSound = new Sound('select.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  tileDropSound = new Sound('tileDrop.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  resetSound = new Sound('notValid.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  resetSound.setVolume(0.5);
  winSound = new Sound('win.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  loseSound = new Sound('lose.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });


  return {
    startGameSound,
    selectSound,
    tileDropSound,
    resetSound,
    winSound,
    loseSound
  }
}
