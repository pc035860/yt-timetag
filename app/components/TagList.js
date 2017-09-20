import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { CSSTransitionGroup } from 'react-transition-group';
import styles from './TagList.scss';

import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import sortBy from 'lodash/sortBy';

import * as actTag_ from '_actions/tag';
import * as actActiveTag_ from '_actions/activeTag';

import ReactModal from 'react-modal';
import Tag from './Tag';
import Importer from './Importer';
import YTButton from './YTButton';
import MdAdd from 'react-icons/lib/md/add';
import MdPrint from 'react-icons/lib/md/print';
import MdPlayListAdd from 'react-icons/lib/md/playlist-add';

import ytPlayer from '_util/ytPlayer';
import exportFromTags from '_util/exportFromTags';
import parseTags from '_util/parseTags';

const transitionConfig = {
  justCopied: {
    transitionName: 'anim',
    transitionAppear: true,
    transitionAppearTimeout: 300,
    transitionEnterTimeout: 300,
    transitionLeaveTimeout: 300
  }
};

const TagList = ({
  videoId,
  keyOpsEmitter,

  tags,
  activeTag,
  actTag,
  actActiveTag,

  justCopied,
  showImportModal,

  handleTagAdd,
  handleTagEdit,
  handleTagRemove,
  handleTagActiveSet,
  handleTagActiveClear,
  handleOutput,

  handleTagImport,
  handleImportModalClose,
  handleImportModalImport
}) => (
  <div>
    {tags.map(tag => (
      <Tag
        key={tag.id}
        videoId={videoId}
        keyOpsEmitter={keyOpsEmitter}
        tag={tag}
        isActive={tag.id === activeTag}
        onEdit={handleTagEdit}
        onRemove={handleTagRemove}
        onSetActive={handleTagActiveSet}
        onClearActive={handleTagActiveClear}
      />
    ))}
    <div styleName="toolbar">
      <div styleName="toolbar-left">
        <YTButton
          styleName="toolbar-btn"
          type="button"
          title="New Tag"
          onClick={handleTagAdd}
        >
          <MdAdd size={20} />
        </YTButton>
        <YTButton
          styleName="toolbar-btn"
          type="button"
          title="Import"
          onClick={handleTagImport}
        >
          <MdPlayListAdd size={20} />
        </YTButton>
      </div>
      <div styleName="toolbar-right">
        <YTButton
          styleName="toolbar-btn"
          type="button"
          title="Copy to Clipboard"
          onClick={handleOutput}
        >
          <CSSTransitionGroup {...transitionConfig.justCopied}>
            {justCopied &&
              <span
                className="yttt-TagList__toolbar-btn-hint"
                styleName="toolbar-btn-hint"
              >
                Copied
              </span>}
          </CSSTransitionGroup>
          <MdPrint size={20} />
        </YTButton>
      </div>
    </div>

    {/* import modal*/}
    <ReactModal
      contentLabel="Modal For Importing Tags"
      isOpen={showImportModal}
      onRequestClose={handleImportModalClose}
      className="TagListImportModal"
      overlayClassName="TagListImportModalOverlay"
    >
      <Importer onImport={handleImportModalImport} onClose={handleImportModalClose} />
    </ReactModal>
  </div>
);
TagList.propTypes = {
  videoId: PropTypes.string.isRequired,
  keyOpsEmitter: PropTypes.object.isRequired,

  tags: PropTypes.array,
  activeTag: PropTypes.string,

  actTag: PropTypes.object,
  actActiveTag: PropTypes.object
};

const addCopiedHint = compose(
  withState('justCopied', 'setJustCopied', false),
  withState('justCopiedTimeout', 'setJustCopiedTimeout', null),
  mapProps(({ setJustCopied, setJustCopiedTimeout, ...rest }) => ({
    onCopySuccess: () => {
      setJustCopied(true);
      if (rest.justCopiedTimeout) {
        clearTimeout(rest.justCopiedTimeout);
      }
      setJustCopiedTimeout(setTimeout(() => setJustCopied(false), 1500));
    },
    ...rest
  }))
);

const addImportModal = compose(
  withState('showImportModal', 'setImportModal', false),
  withHandlers({
    handleTagImport: ({ setImportModal }) => () => {
      setImportModal(true);
    },
    handleImportModalClose: ({ setImportModal }) => () => {
      setImportModal(false);
    },
    handleImportModalImport: ({ actTag, setImportModal }) => (text) => {
      const draftTags = parseTags(text);
      if (draftTags.length > 0) {
        actTag.addMulti(draftTags);
      }
      setImportModal(false);
    }
  })
);

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
  handleTagRemove: ({ actTag, actActiveTag }) => tagId => {
    actTag.remove(tagId);
    actActiveTag.clear();
  },
  handleTagActiveSet: ({ actActiveTag }) => tagId => {
    actActiveTag.set(tagId);
  },
  handleTagActiveClear: ({ actActiveTag }) => () => {
    actActiveTag.clear();
  },
  handleOutput: ({ tags, onCopySuccess }) => () => {
    const textarea = document.createElement('textarea');
    textarea.value = exportFromTags(tags, '\n');

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(textarea);

    textarea.select();

    try {
      const success = document.execCommand('cut');
      if (success) {
        onCopySuccess();
      }
    }
    catch (err) {
      /* do nothing */
    }

    body.removeChild(textarea);
  }
});

const addLifecyle = lifecycle({
  componentDidMount() {
    const emitter = this.props.keyOpsEmitter;

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
    emitter.on('forward 5', onKeyAdd5);

    const onKeySub5 = function () {
      if (this.props.activeTag) {
        return;
      }
      ytPlayer(true, 'getCurrentTime').then(t => {
        ytPlayer('seekTo', (t >>> 0) - 5);
      });
    }.bind(this);
    emitter.on('backward 5', onKeySub5);

    const onPauseOrPlay = function () {
      ytPlayer(true, 'getPlayerState').then(state => {
        if (state === 2) {
          // state: paused
          ytPlayer('playVideo');
        }
        else if (state === 1) {
          // state: playing
          ytPlayer('pauseVideo');
        }
      });
    };
    emitter.on('pause or play', onPauseOrPlay);
  },
  componentWillUnmount() {
    // TODO: emitter.off here someday
  }
});

const mapStateToProps = state => ({
  tags: sortBy(state.tags, ['seconds']),
  activeTag: state.activeTag
});
const mapDispatchToProps = dispatch => ({
  actTag: bindActionCreators(actTag_, dispatch),
  actActiveTag: bindActionCreators(actActiveTag_, dispatch)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  addCopiedHint,
  addImportModal,
  addHandlers,
  addLifecyle
)(CSSModules(TagList, styles));
