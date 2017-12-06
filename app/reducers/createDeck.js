const createDeck = (state = [], action) => {

  switch (action.type) {
    case 'CREATE_DECK':
      return [...action.payload];
    default:
      return state;
  }
};

export default createDeck;
