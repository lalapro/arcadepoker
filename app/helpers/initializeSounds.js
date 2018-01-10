var Sound = require('react-native-sound');
// Sound.setCategory('Playback');

export default initializeSounds = () => {
  startGameSound = new Sound('startgame.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) {return;}
  });
  selectSound = new Sound('select.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  tileDropSound = new Sound('tiledrop.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  resetSound = new Sound('notvalid.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  winSound = new Sound('win.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  loseSound = new Sound('lose.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });
  gameLoaded = new Sound('gameloaded.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) { return;}
  });


  return {
    startGameSound,
    selectSound,
    tileDropSound,
    resetSound,
    winSound,
    loseSound,
    gameLoaded
  }
}
