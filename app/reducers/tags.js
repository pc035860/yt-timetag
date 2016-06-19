import { handleActions } from 'redux-actions';
import { add, remove, edit } from '_actions/tag';

/**
 * A tag model
 *
 * {
 *   id: {id},
 *   seconds: {秒數},
 *   description: {描述}
 * }
 */
const baseTag = {
  id: null,
  seconds: -1,
  description: ''
};

const defaultState = [];
let _tagId = 0;

export default handleActions({
  [add]: (state, action) => {
    const tag = action.payload;
    const id = ++_tagId;
    return [...state, { ...baseTag, ...tag, id }];
  },
  [remove]: (state, action) => {
    const tagId = action.payload;
    return state.filter(tag => tag.id !== tagId);
  },
  [edit]: (state, action) => {
    const { tagId, draft } = action.payload;
    return state.map(tag => {
      if (tag.id === tagId) {
        return { ...tag, ...draft };
      }
      return tag;
    });
  }
}, defaultState);
