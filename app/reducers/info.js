import { combineActions, handleActions } from 'redux-actions';

import { init, updateTick } from '_actions/info';
import * as actTag from '_actions/tag';

const defaultState = {
  videoId: '',
  title: '',
  lastUpdated: 0,
};

// timestamp in seoncds
const now = () => Math.floor(+new Date() / 1000);

export default handleActions({
  [init]: (state, { payload }) => {
    return {
      ...state,
      ...payload,
      lastUpdated: state.lastUpdated || now(),
    };
  },
  [updateTick]: (state) => {
    return {
      ...state,
      lastUpdated: now()
    };
  },
  [combineActions(
    actTag.add,
    actTag.addMulti,
    actTag.remove,
    actTag.edit
  )]: (state) => {
    return {
      ...state,
      lastUpdated: now(),
    };
  }
}, defaultState);
