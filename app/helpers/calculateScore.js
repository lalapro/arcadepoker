export default calculateScore = (array) => {
  let output = '';

  let suits = array.map(card => card.value.length === 3 ? card.value[2] : card.value[1]);
  let nums = array.map(card => card.value.length === 3 ? Number(card.value[0] + card.value[1]) : Number(card.value[0])).sort((a,b) => a-b)

  let isOrdered, sameSuits, frequencies;

  if (includesWildCard(array)) {
    isOrdered = wildOrderCheck(nums);
    sameSuits = wildSuitcheck(suits);
    frequencies = Object.values(wildFrequencyCheck(nums)).sort((a,b) => b - a);
  } else {
    suits = new Set(suits);
    let copy = nums.slice();
    if (copy.indexOf(1) !== -1) { copy[copy.indexOf(1)] = 14 }
    copy.sort((a,b) => a-b);
    let numSet = nums.reduce((acc, x) => {
      acc[x] ? acc[x]++ : acc[x] = 1;
      return acc
    }, {})

    isOrdered = checkOrdered(nums) || checkOrdered(copy);
    sameSuits = suits.size === 1;
    frequencies = Object.values(numSet).sort((a,b) => b - a);
  }
  let noZeroesOrOnes = nums.slice(nums.lastIndexOf(0) + 1).slice(nums.lastIndexOf(1) + 1);
  let minNum = Math.min(...noZeroesOrOnes)



  // console.log(frequencies)

  if (frequencies[0] === 5) {
    return ['fiveOfAKind', 3000]
  }
  if (sameSuits && isOrdered && (minNum >= 10 || minNum === 1)) {
    return ['royalFlush', 2500]
  }
  if (sameSuits && isOrdered) {
    return ['straightFlush', 2000]
  }
  if (frequencies[0] === 4) {
    return ['fourOfAKind', 1750]
  }
  if (frequencies[0] === 3 && frequencies[1] >= 2 && frequencies.length <= 2) {
    return ['fullHouse', 1500]
  }
  if (sameSuits) {
    return ['flush', 1250]
  }
  if (isOrdered) {
    return ['straight', 1000]
  }
  if (frequencies[0] === 3) {
    return ['threeOfAKind', 750]
  }
  if (frequencies[0] === 2 && frequencies[1] >= 2 && frequencies.length <= 3) {
    return ['twoPair', 500]
  }
  if (frequencies[0] === 2) {
    return ['onePair', 250]
  } else {
    return ['highCard', 100]
  }

}

includesWildCard = (array) => {

  for (let i = 0; i < array.length; i++) {
    if (array[i].value.slice(0,1) === '0') {
      return true
    }
  }
  return false
}


wildSuitcheck = (suits) => {
  let newSuits = {};
  suits.forEach(suit => {
   if(suit === '★') {
     newSuits['♠'] ? newSuits['♠']++ : newSuits['♠'] = 1;
     newSuits['♣'] ? newSuits['♣']++ : newSuits['♣'] = 1;
   } else if (suit === '☆') {
     newSuits['♥'] ? newSuits['♥']++ : newSuits['♥'] = 1;
     newSuits['♦'] ? newSuits['♦']++ : newSuits['♦'] = 1;
   } else {
     newSuits[suit] ? newSuits[suit]++ : newSuits[suit] = 1;
   }
  })
  newSuits = Object.entries(newSuits);
  let sameSuits = false;
  newSuits.forEach(suit => {
    if (suit[1] === 5) {
      sameSuits = true
    }
  })
  return sameSuits
}

wildOrderCheck = (nums) => {

  let numWilds = nums.reduce((acc, num) => {
    if (num === 0) acc++;
    return acc
  }, 0)

  noZeroes = nums.slice(nums.lastIndexOf(0) + 1);
  copy = noZeroes.slice();
  if (copy.indexOf(1) !== -1) {
    copy[copy.indexOf(1)] = 14
  }
  copy.sort((a,b) => a-b);
  // console.log(copy)
  // console.log(noZeroes)
  let wildsNeeded = noZeroes[noZeroes.length - 1] - noZeroes[0] - 1 - (noZeroes.length - 2);
  let wildsNeededWithAce = (copy[copy.length - 1] - copy[0] - 1) - (copy.length - 2);
  // console.log(wildsNeeded)
  // console.log(wildsNeededWithAce)
  // console.log(numWilds)
  // console.log(copy.length)
  return numWilds >= wildsNeededWithAce || numWilds >= wildsNeeded || checkOrdered(noZeroes)
}

checkOrdered = (array) => {
  for(let i = 1; i < array.length; i++) {
    if (array[i] !== array[i - 1] + 1) {
      return false
    }
  }
  return true
}


wildFrequencyCheck = (nums) => {
 let numSet = nums.slice().reverse().reduce((acc, x) => {
   if (x === 0 ) {
     for (let y in acc) {
       acc[y] = acc[y] + 1
     }
   } else {
     acc[x] ? acc[x]++ : acc[x] = 1;
   }
  return acc
  }, {})

  return numSet
}
