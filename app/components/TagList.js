import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './TagList.scss';

import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import sortBy from 'lodash/sortBy';

import * as actTag_ from '_actions/tag';
import * as actActiveTag_ from '_actions/activeTag';

import Tag from './Tag';
import MdAdd from 'react-icons/lib/md/add';
import MdPrint from 'react-icons/lib/md/print';

import ytPlayer from '_util/ytPlayer';
import { getEmitter } from '_util/keyOps';
import exportFromTags from '_util/exportFromTags';

const TagList = ({
  videoId,

  tags, activeTag, actTag, actActiveTag,

  handleTagAdd, handleTagEdit, handleTagRemove,
  handleTagActiveSet, handleTagActiveClear,
  handleOutput
}) => (
  <div>
    {tags.map(tag => (
      <Tag
        key={tag.id}
        videoId={videoId}
        tag={tag}
        isActive={tag.id === activeTag}
        onEdit={handleTagEdit}
        onRemove={handleTagRemove}
        onSetActive={handleTagActiveSet}
        onClearActive={handleTagActiveClear} />
    ))}
    <div styleName="toolbar">
      <div styleName="toolbar-left">
        <button styleName="toolbar-btn" type="button"
          title="New Tag"
          onClick={handleTagAdd}>
          <MdAdd size={20} />
        </button>
      </div>
      <div styleName="toolbar-right">
        <button styleName="toolbar-btn" type="button"
          title="Output"
          onClick={handleOutput}>
          <MdPrint size={20} />
        </button>
      </div>
    </div>
  </div>
);
TagList.propTypes = {
  videoId: PropTypes.string.isRequired,

  tags: PropTypes.array,
  activeTag: PropTypes.string,

  actTag: PropTypes.object,
  actActiveTag: PropTypes.object
};

const addHandlers = withHandlers({
  handleTagAdd: ({ actTag, actActiveTag }) => () => {
    ytPlayer(true, 'getCurrentTime').then(t => {
      const draft = {
        seconds: t
      };
      actTag.add(draft);
      actActiveTag.setLastAdded();
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
  },
  handleOutput: ({ tags }) => () => {
    const textarea = document.createElement('textarea');
    textarea.value = exportFromTags(tags, '｜');

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(textarea);

    textarea.select();

    try {
      document.execCommand('cut');
    }
    catch (err) {
      /* do nothing */
    }

    body.removeChild(textarea);
  }
});

const addLifecyle = lifecycle({
  componentDidMount() {
    const emitter = getEmitter(this.props.videoId);

    const onAddTag = function () {
      this.props.handleTagAdd();
    }.bind(this);
    emitter.on('add tag', onAddTag);

    const onClearActive = function () {
      this.props.handleTagActiveClear();
    }.bind(this);
    emitter.on('clear active', onClearActive);

    const onKeyAdd5 = function () {
      if (this.props.activeTag) {
        return;
      }
      ytPlayer(true, 'getCurrentTime').then(t => {
        ytPlayer('seekTo', (t >>> 0) + 5);
      });
    }.bind(this);
    emitter.on('add 5', onKeyAdd5);

    const onKeySub5 = function () {
      if (this.props.activeTag) {
        return;
      }
      ytPlayer(true, 'getCurrentTime').then(t => {
        ytPlayer('seekTo', (t >>> 0) - 5);
      });
    }.bind(this);
    emitter.on('sub 5', onKeySub5);

    const onPauseOrPlay = function () {
      if (this.props.activeTag) {
        return;
      }
      ytPlayer(true, 'getPlayerState').then(state => {
        if (state === 2) {  // state: paused
          ytPlayer('playVideo');
        }
        else if (state === 1) {  // state: playing
          ytPlayer('pauseVideo');
        }
      });
    }.bind(this);
    emitter.on('pause or play', onPauseOrPlay);
  },
  componentWillUnmount() {
    const emitter = getEmitter(this.props.videoId);
    emitter.allOff();
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
  addHandlers,
  addLifecyle
)(CSSModules(TagList, styles));
