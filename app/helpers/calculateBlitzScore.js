export default calculateScore = (array) => {
  let output = '';
  let suits = array.map(card => card.value.length === 3 ? card.value[2] : card.value[1]);
  let nums = array.map(card => card.value.length === 3 ? Number(card.value[0] + card.value[1]) : Number(card.value[0])).sort((a,b) => a-b)

  suits = new Set(suits)
  let sameSuits = suits.size === 1;
  let isOrdered = checkIfOrdered(nums);

  let numSet = nums.reduce((acc, x) => {
    acc[x] ? acc[x]++ : acc[x] = 1;
    return acc
  }, {})

  let frequencies = Object.values(numSet).sort((a,b) => b - a);

  if (frequencies[0] === 5 ) {
    return ['fiveOfAKind', 5000]
  }
  if (sameSuits && isOrdered && nums.includes(13) && nums.includes(1)) {
    return ['royalFlush', 2000]
  }
  if (sameSuits && isOrdered) {
    return ['straightFlush', 1000]
  }
  if (frequencies[0] === 4) {
    return ['fourOfAKind', 500]
  }
  if (frequencies[0] === 3 && frequencies[1] === 2) {
    return ['fullHouse', 250]
  }
  if (sameSuits) {
    return ['flush', 100]
  }
  if (isOrdered) {
    return ['straight', 50]
  }
  if (frequencies[0] === 3) {
    return ['threeOfAKind', 25]
  }
  if (frequencies[0] === 2 && frequencies[1] === 2) {
    return ['twoPair', 20]
  }
  if (frequencies[0] === 2) {
    return ['onePair', 10]
  } else {
    return ['highCard', 5]
  }

}

checkIfOrdered = (arr) => {
  for(let i = 1; i < 5; i++) {
    // these can be in the same if statement because it will short out before
    // it reaches the statement after &&
    if (arr[i] !== arr[i - 1] + 1 ) {
      if (arr[i - 1] !== 1) return false
    }
  }
  return true
}
