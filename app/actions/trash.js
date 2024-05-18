import { TRASH_ADD, TRASH_REMOVE } from '_constants/ActionTypes';
import { createAction } from 'redux-actions';

import * as tagActions from '_actions/tag';

export const add = createAction(TRASH_ADD, (tag) => tag);

export const remove = createAction(TRASH_REMOVE, (tagId) => tagId);

export const putBack = (tag) => (dispatch) => {
  // add to tag and remove from trash
  dispatch(tagActions.add(tag));
  dispatch(remove(tag.id));
};
