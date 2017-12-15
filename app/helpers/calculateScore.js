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


  if (sameSuits && isOrdered && nums.includes(13) && nums.includes(1)) {
    return 'royalFlush'
  }
  if (sameSuits && isOrdered) {
    return 'straightFlush'
  }
  if (frequencies[0] === 4) {
    return 'fourOfAKind'
  }
  if (frequencies[0] === 3 && frequencies[1] === 2) {
    return 'fullHouse'
  }
  if (sameSuits) {
    return 'flush'
  }
  if (isOrdered) {
    return 'straight'
  }
  if (frequencies[0] === 3) {
    return 'threeOfAKind'
  }
  if (frequencies[0] === 2 && frequencies[1] === 2) {
    return 'twoPair'
  }
  if (frequencies[0] === 2) {
    return 'onePair'
  }else {
    return 'highCard'
  }

}

checkIfOrdered = (arr) => {
  for(let i = 1; i < 5; i++) {
    if (arr[i] !== arr[i - 1] + 1 ) {
      if (arr[i - 1] !== 1) return false
    }
  }
  return true
}
