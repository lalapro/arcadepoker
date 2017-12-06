const selectedCards = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_CURRENTLY_SELECTED':
      return [...action.payload];
    default:
      return state;
  }
};

export default selectedCards;
