import {
  TAG_ADD,
  TAG_REMOVE,
  TAG_EDIT
} from '_constants/ActionTypes';

import { createAction } from 'redux-actions';

export const add = createAction(TAG_ADD, tag => tag);

export const remove = createAction(TAG_REMOVE, tagId => tagId);

export const edit = createAction(TAG_EDIT, (tagId, draft) => ({ tagId, draft }));
