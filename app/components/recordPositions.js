// hex height ~ 65
const recordPositions = (windowHeight, windowWidth) => {
  let hexHeight = 60;
  let positions = {
    // 0: {
    //   top: (windowHeight / 2 - hexHeight / 2),
    //   bot: (windowHeight / 2 - hexHeight / 2 + 65),
    //   left: (windowWidth / 2 - hexHeight * 2),
    //   right: (windowWidth / 2 - hexHeight * 2 + 40)
    // },
    1: {
      top: (windowHeight / 2 - hexHeight / 2),
      bot: (windowHeight / 2 - hexHeight / 2 + 65),
      left: (windowWidth / 2 - hexHeight * 2),
      right: (windowWidth / 2 - hexHeight * 2 + 40)
    }
  }

  return positions
}

// width: 40, height: 65, top: height/2 - 30, left: width/2 - 135

export default recordPositions
