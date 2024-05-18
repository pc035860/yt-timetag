import { PLAYER_INFO_UPDATE } from '_constants/ActionTypes';
import { createAction } from 'redux-actions';

export const update = createAction(PLAYER_INFO_UPDATE, (info) => info);
