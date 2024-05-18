import { handleActions } from 'redux-actions';

import { update } from '_actions/playerInfo';

const defaultState = {
  currentTime: 0,
  state: -1,
};

export default handleActions(
  {
    [update]: (state, action) => {
      const info = action.payload;
      return info;
    },
  },
  defaultState
);
