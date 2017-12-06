const drawFromDeck = (state = [], action) => {
  switch (action.type) {
    case 'DRAW_FROM_DECK':
      return [...action.payload];
    default:
      return state;
  }
};

export default drawFromDeck;
