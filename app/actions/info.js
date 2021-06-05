import {
  INFO_INIT,
  INFO_UPDATE_TICK,
} from '_constants/ActionTypes';

import { createAction } from 'redux-actions';

export const init = createAction(INFO_INIT, ({ videoId, title }) => ({ videoId, title }));

export const updateTick = createAction(INFO_UPDATE_TICK);
