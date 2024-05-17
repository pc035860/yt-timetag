import { handleActions } from 'redux-actions';

import { add, remove } from '_actions/trash';

const defaultState = [];

export default handleActions(
  {
    [add]: (state, action) => {
      const tag = action.payload;

      // unshift to keep the latest trash on top
      return [tag, ...state];
    },
    [remove]: (state, action) => {
      const tagId = action.payload;

      return state.filter((tag) => tag.id !== tagId);
    },
  },
  defaultState
);
