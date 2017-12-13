// ♦, ♣, ♥, ♠

const DECK = [
  {
    card: "1♦",
    image: require("../assets/cards/diamond1.png"),
    highlight: require("../assets/cards/diamond1-highlight.png")
  },
  {
    card: "2♦",
    image: require("../assets/cards/diamond2.png"),
    highlight: require("../assets/cards/diamond2-highlight.png")
  },
  {
    card: "3♦",
    image: require("../assets/cards/diamond3.png"),
    highlight: require("../assets/cards/diamond3-highlight.png")
  },
  {
    card: "4♦",
    image: require("../assets/cards/diamond4.png"),
    highlight: require("../assets/cards/diamond4-highlight.png")
  },
  {
    card: "5♦",
    image: require("../assets/cards/diamond5.png"),
    highlight: require("../assets/cards/diamond5-highlight.png")
  },
  {
    card: "6♦",
    image: require("../assets/cards/diamond6.png"),
    highlight: require("../assets/cards/diamond6-highlight.png")
  },
  {
    card: "7♦",
    image: require("../assets/cards/diamond7.png"),
    highlight: require("../assets/cards/diamond7-highlight.png")
  },
  {
    card: "8♦",
    image: require("../assets/cards/diamond8.png"),
    highlight: require("../assets/cards/diamond8-highlight.png")
  },
  {
    card: "9♦",
    image: require("../assets/cards/diamond9.png"),
    highlight: require("../assets/cards/diamond9-highlight.png")
  },
  {
    card: "10♦",
    image: require("../assets/cards/diamond10.png"),
    highlight: require("../assets/cards/diamond10-highlight.png")
  },
  {
    card: "J♦",
    image: require("../assets/cards/diamond11.png"),
    highlight: require("../assets/cards/diamond11-highlight.png")
  },
  {
    card: "Q♦",
    image: require("../assets/cards/diamond12.png"),
    highlight: require("../assets/cards/diamond12-highlight.png")
  },
  {
    card: "K♦",
    image: require("../assets/cards/diamond13.png"),
    highlight: require("../assets/cards/diamond13-highlight.png")
  },
  {
    card: "A♣",
    image: require("../assets/cards/clubs1.png"),
    highlight: require("../assets/cards/clubs1-highlight.png")
  },
  {
    card: "2♣",
    image: require("../assets/cards/clubs2.png"),
    highlight: require("../assets/cards/clubs2-highlight.png")
  },
  {
    card: "3♣",
    image: require("../assets/cards/clubs3.png"),
    highlight: require("../assets/cards/clubs3-highlight.png")
  },
  {
    card: "4♣",
    image: require("../assets/cards/clubs4.png"),
    highlight: require("../assets/cards/clubs4-highlight.png")
  },
  {
    card: "5♣",
    image: require("../assets/cards/clubs5.png"),
    highlight: require("../assets/cards/clubs5-highlight.png")
  },
  {
    card: "6♣",
    image: require("../assets/cards/clubs6.png"),
    highlight: require("../assets/cards/clubs6-highlight.png")
  },
  {
    card: "7♣",
    image: require("../assets/cards/clubs7.png"),
    highlight: require("../assets/cards/clubs7-highlight.png")
  },
  {
    card: "8♣",
    image: require("../assets/cards/clubs8.png"),
    highlight: require("../assets/cards/clubs8-highlight.png")
  },
  {
    card: "9♣",
    image: require("../assets/cards/clubs9.png"),
    highlight: require("../assets/cards/clubs9-highlight.png")
  },
  {
    card: "10♣",
    image: require("../assets/cards/clubs10.png"),
    highlight: require("../assets/cards/clubs10-highlight.png")
  },
  {
    card: "J♣",
    image: require("../assets/cards/clubs11.png"),
    highlight: require("../assets/cards/clubs11-highlight.png")
  },
  {
    card: "Q♣",
    image: require("../assets/cards/clubs12.png"),
    highlight: require("../assets/cards/clubs12-highlight.png")
  },
  {
    card: "K♣",
    image: require("../assets/cards/clubs13.png"),
    highlight: require("../assets/cards/clubs13-highlight.png")
  },
  {
    card: "A♥",
    image: require("../assets/cards/heart1.png"),
    highlight: require("../assets/cards/heart1-highlight.png")
  },
  {
    card: "2♥",
    image: require("../assets/cards/heart2.png"),
    highlight: require("../assets/cards/heart2-highlight.png")
  },
  {
    card: "3♥",
    image: require("../assets/cards/heart3.png"),
    highlight: require("../assets/cards/heart3-highlight.png")
  },
  {
    card: "4♥",
    image: require("../assets/cards/heart4.png"),
    highlight: require("../assets/cards/heart4-highlight.png")
  },
  {
    card: "5♥",
    image: require("../assets/cards/heart5.png"),
    highlight: require("../assets/cards/heart5-highlight.png")
  },
  {
    card: "6♥",
    image: require("../assets/cards/heart6.png"),
    highlight: require("../assets/cards/heart6-highlight.png")
  },
  {
    card: "7♥",
    image: require("../assets/cards/heart7.png"),
    highlight: require("../assets/cards/heart7-highlight.png")
  },
  {
    card: "8♥",
    image: require("../assets/cards/heart8.png"),
    highlight: require("../assets/cards/heart8-highlight.png")
  },
  {
    card: "9♥",
    image: require("../assets/cards/heart9.png"),
    highlight: require("../assets/cards/heart9-highlight.png")
  },
  {
    card: "10♥",
    image: require("../assets/cards/heart10.png"),
    highlight: require("../assets/cards/heart10-highlight.png")
  },
  {
    card: "J♥",
    image: require("../assets/cards/heart11.png"),
    highlight: require("../assets/cards/heart11-highlight.png")
  },
  {
    card: "Q♥",
    image: require("../assets/cards/heart12.png"),
    highlight: require("../assets/cards/heart12-highlight.png")
  },
  {
    card: "K♥",
    image: require("../assets/cards/heart13.png"),
    highlight: require("../assets/cards/heart13-highlight.png")
  },
  {
    card: "A♠",
    image: require("../assets/cards/spades1.png"),
    highlight: require("../assets/cards/spades1-highlight.png")
  },
  {
    card: "2♠",
    image: require("../assets/cards/spades2.png"),
    highlight: require("../assets/cards/spades2-highlight.png")
  },
  {
    card: "3♠",
    image: require("../assets/cards/spades3.png"),
    highlight: require("../assets/cards/spades3-highlight.png")
  },
  {
    card: "4♠",
    image: require("../assets/cards/spades4.png"),
    highlight: require("../assets/cards/spades4-highlight.png")
  },
  {
    card: "5♠",
    image: require("../assets/cards/spades5.png"),
    highlight: require("../assets/cards/spades5-highlight.png")
  },
  {
    card: "6♠",
    image: require("../assets/cards/spades6.png"),
    highlight: require("../assets/cards/spades6-highlight.png")
  },
  {
    card: "7♠",
    image: require("../assets/cards/spades7.png"),
    highlight: require("../assets/cards/spades7-highlight.png")
  },
  {
    card: "8♠",
    image: require("../assets/cards/spades8.png"),
    highlight: require("../assets/cards/spades8-highlight.png")
  },
  {
    card: "9♠",
    image: require("../assets/cards/spades9.png"),
    highlight: require("../assets/cards/spades9-highlight.png")
  },
  {
    card: "10♠",
    image: require("../assets/cards/spades10.png"),
    highlight: require("../assets/cards/spades10-highlight.png")
  },
  {
    card: "J♠",
    image: require("../assets/cards/spades11.png"),
    highlight: require("../assets/cards/spades11-highlight.png")
  },
  {
    card: "Q♠",
    image: require("../assets/cards/spades12.png"),
    highlight: require("../assets/cards/spades12-highlight.png")
  },
  {
    card: "K♠",
    image: require("../assets/cards/spades13.png"),
    highlight: require("../assets/cards/spades13-highlight.png")
  },


];

var shuffleDeck = function(deck) {
  let newDeck = [];
  let count = 0;

  let conjure = (deck) => {
    if (deck.length === 0) return
    let randomIndex = getRandomInt(0, deck.length)
    newDeck[count] = deck[randomIndex];
    count++;
    deck.splice(randomIndex, 1)
    conjure(deck)

  }

  conjure(deck)
  return newDeck
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

DECK = shuffleDeck(DECK)




export default DECK
