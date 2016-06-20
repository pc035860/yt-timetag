import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './TagList.scss';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import sortBy from 'lodash/sortBy';

import * as actTag_ from '_actions/tag';
import * as actActiveTag_ from '_actions/activeTag';

import Tag from './Tag';

import ytPlayer from '_util/ytPlayer';

const TagList = ({
  tags, activeTag, actTag, actActiveTag,

  handleTagAdd, handleTagEdit, handleTagRemove,
  handleTagActiveSet, handleTagActiveClear
}) => (
  <div>
    {tags.map(tag => (
      <Tag
        key={tag.id}
        tag={tag}
        isActive={tag.id === activeTag}
        onEdit={handleTagEdit}
        onRemove={handleTagRemove}
        onSetActive={handleTagActiveSet}
        onClearActive={handleTagActiveClear} />
    ))}
    <div styleName="toolbar">
      <button type="button" onClick={handleTagAdd}>+</button>
    </div>
  </div>
);
TagList.propTypes = {
  tags: PropTypes.array,
  activeTag: PropTypes.number,

  actTag: PropTypes.object,
  actActiveTag: PropTypes.object
};

const addHandlers = withHandlers({
  handleTagAdd: ({ actTag }) => () => {
    ytPlayer(true, 'getCurrentTime').then(t => {
      const draft = {
        seconds: t
      };
      actTag.add(draft);
    });
  },
  handleTagEdit: ({ actTag }) => (tagId, draft) => {
    actTag.edit(tagId, draft);
  },
  handleTagRemove: ({ actTag }) => tagId => {
    actTag.remove(tagId);
  },
  handleTagActiveSet: ({ actActiveTag }) => tagId => {
    actActiveTag.set(tagId);
  },
  handleTagActiveClear: ({ actActiveTag }) => () => {
    actActiveTag.clear();
  }
});

const mapStateToProps = (state) => ({
  tags: sortBy(state.tags, ['seconds']),
  activeTag: state.activeTag
});
const mapDispatchToProps = (dispatch) => ({
  actTag: bindActionCreators(actTag_, dispatch),
  actActiveTag: bindActionCreators(actActiveTag_, dispatch)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  addHandlers
)(CSSModules(TagList, styles));
