export function generateDeck(newArr) {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_DECK',
      payload: newArr
    });
  }
}


export function addSelected(card) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_CURRENTLY_SELECTED',
      payload: card
    });
  }
}


export function drawFromDeck(newArr) {
  return (dispatch) => {
    dispatch({
      type: 'DRAW_FROM_DECK',
      payload: newArr
    });
  }
}
