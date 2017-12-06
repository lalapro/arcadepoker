import { combineReducers } from 'redux';
import selectedCards from './selectedCards';
import drawFromDeck from './drawFromDeck';
import createDeck from './createDeck';

const reducer = combineReducers({
  deck: createDeck,
  drawFromDeck,
  selectedCards,
})

export default reducer;
