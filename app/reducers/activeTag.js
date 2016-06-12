import { handleActions } from 'redux-actions';
import { set, clear } from '_actions/activeTag';

const defaultState = -1;

export default handleActions({
  [set]: (state, action) => (action.payload),
  [clear]: (state, action) => defaultState
}, defaultState);
