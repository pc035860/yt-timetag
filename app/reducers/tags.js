import { handleActions } from 'redux-actions';
import { add, addMulti, remove, edit } from '_actions/tag';

import getYTVideoId from '_util/getYTVideoId';

/**
 * A tag model
 *
 * {
 *   id: {id},
 *   seconds: {秒數},
 *   description: {描述},
 *   sourceCommentId: {留言ID(帶入來源)}
 * }
 */
const baseTag = {
  id: null,
  seconds: -1,
  description: '',
  sourceCommentId: undefined,
};

const defaultState = [];

/**
 * Create uniq tag id
 * @param {number} no  (optional) index as tag id affix
 */
function createTagId(no = null) {
  const videoId = getYTVideoId();
  const now = +new Date();

  if (no === null) {
    return `${videoId}@${now}`;
  }
  return `${videoId}@${now}-${no}`;
}

export default handleActions(
  {
    [add]: (state, action) => {
      const tag = action.payload;
      const id = tag.id ? tag.id : createTagId();
      return [...state, { ...baseTag, ...tag, id }];
    },
    [addMulti]: (state, action) => {
      const tags = action.payload.map((tag, i) => ({
        ...baseTag,
        ...tag,
        id: createTagId(i),
      }));
      return [...state, ...tags];
    },
    [remove]: (state, action) => {
      const tagId = action.payload;
      return state.filter((tag) => tag.id !== tagId);
    },
    [edit]: (state, action) => {
      const { tagId, draft } = action.payload;
      return state.map((tag) => {
        if (tag.id === tagId) {
          return { ...tag, ...draft };
        }
        return tag;
      });
    },
  },
  defaultState
);
