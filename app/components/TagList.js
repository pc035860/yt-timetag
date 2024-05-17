/* eslint no-param-reassign: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import raf from 'raf';

import styles from './TagList.scss';

import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';

import debounce from 'lodash/debounce';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actTag_ from '_actions/tag';
import * as actActiveTag_ from '_actions/activeTag';

import ReactModal from 'react-modal';
import Tag from './Tag';
import Importer from './Importer';
import YTButton from './YTButton';
import TagContainer from './TagContainer';
import Export from './Export';
import MdAdd from 'react-icons/lib/md/add';
import MdPrint from 'react-icons/lib/md/print';
import MdPlayListAdd from 'react-icons/lib/md/playlist-add';

import ytPlayer from '_util/ytPlayer';
import parseTags from '_util/parseTags';
import is2017NewDesign from '_util/is2017NewDesign';
import { ct } from '_util/i18n';

const TagList = ({
  videoId,
  keyOpsEmitter,

  tags,
  activeTag,
  actTag,
  actActiveTag,

  showImportModal,
  showExportModal,

  handleTagAdd,
  handleTagEdit,
  handleTagRemove,
  handleTagActiveSet,
  handleTagActiveClear,

  handleTagImport,
  handleImportModalClose,
  handleImportModalImport,

  handleExport,
  handleExportModalClose,

  tagContainerRef,
  handleTagContainerMount,
  handleTagContainerScrollRequest,
}) => (
  <div
    className={classNames({
      [styles['new-design']]: is2017NewDesign(),
    })}
  >
    <TagContainer shadow stopPropagation onMount={handleTagContainerMount}>
      {tags.map((tag) => (
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
          containerRef={tagContainerRef}
          onContainerScrollRequest={handleTagContainerScrollRequest}
        />
      ))}
    </TagContainer>
    <div styleName="toolbar">
      <div styleName="toolbar-left">
        <YTButton
          styleName="toolbar-btn"
          type="button"
          title={ct('appActionAddTag')}
          onClick={handleTagAdd}
        >
          <MdAdd size={20} />
        </YTButton>
        <YTButton
          styleName="toolbar-btn"
          type="button"
          title={ct('appActionAddFromText')}
          onClick={handleTagImport}
        >
          <MdPlayListAdd size={20} />
        </YTButton>
      </div>
      <div styleName="toolbar-right">
        <YTButton
          styleName="toolbar-btn"
          type="button"
          title={ct('appActionTextOutput')}
          onClick={handleExport}
        >
          <MdPrint size={20} />
        </YTButton>
      </div>
    </div>

    {/* import modal*/}
    <ReactModal
      contentLabel="Modal For Importing Tags"
      isOpen={showImportModal}
      onRequestClose={handleImportModalClose}
      className={classNames('yttt-TagListImportModal', {
        'yttt-is-new-design': is2017NewDesign(),
      })}
      overlayClassName={classNames('yttt-TagListImportModalOverlay', {
        'yttt-is-new-design': is2017NewDesign(),
      })}
    >
      <Importer
        onImport={handleImportModalImport}
        onClose={handleImportModalClose}
      />
    </ReactModal>

    {/* import modal*/}
    <ReactModal
      contentLabel="Modal For Exporting Tags"
      isOpen={showExportModal}
      onRequestClose={handleExportModalClose}
      className={classNames('yttt-TagListImportModal', {
        'yttt-is-new-design': is2017NewDesign(),
      })}
      overlayClassName={classNames('yttt-TagListImportModalOverlay', {
        'yttt-is-new-design': is2017NewDesign(),
      })}
    >
      <Export tags={tags} videoId={videoId} onClose={handleExportModalClose} />
    </ReactModal>
  </div>
);
TagList.propTypes = {
  videoId: PropTypes.string.isRequired,
  keyOpsEmitter: PropTypes.object.isRequired,

  tags: PropTypes.array,
  activeTag: PropTypes.string,

  actTag: PropTypes.object,
  actActiveTag: PropTypes.object,
};

const addImportModal = compose(
  withState('showImportModal', 'setImportModal', false),
  withHandlers({
    handleTagImport:
      ({ setImportModal }) =>
      () => {
        setImportModal(true);
      },
    handleImportModalClose:
      ({ setImportModal }) =>
      () => {
        setImportModal(false);
      },
    handleImportModalImport:
      ({ actTag, setImportModal }) =>
      (text) => {
        const draftTags = parseTags(text);
        if (draftTags.length > 0) {
          actTag.addMulti(draftTags);
        }
        setImportModal(false);
      },
  })
);

const addExportModal = compose(
  withState('showExportModal', 'setExportModal', false),
  withHandlers({
    handleExport:
      ({ setExportModal }) =>
      () => {
        setExportModal(true);
      },
    handleExportModalClose:
      ({ setExportModal }) =>
      () => {
        setExportModal(false);
      },
  })
);

const addHandlers = withHandlers({
  handleTagAdd:
    ({ actTag, actActiveTag }) =>
    () => {
      ytPlayer(true, 'getCurrentTime').then((t) => {
        const draft = {
          seconds: t,
        };
        actTag.add(draft);
        actActiveTag.setLastAdded();
      });
    },
  handleTagEdit:
    ({ actTag }) =>
    (tagId, draft) => {
      actTag.edit(tagId, draft);
    },
  handleTagRemove:
    ({ actTag, actActiveTag, tags }) =>
    (tagId) => {
      const index = findIndex(tags, ['id', tagId]);
      const prevTag = tags[index - 1];
      const nextTag = tags[index + 1];

      actTag.moveToTrash(tagId);

      // delay setting next active tag with a frame
      // preventing onRemove from triggering on next active tag
      raf(() => {
        if (nextTag) {
          actActiveTag.set(nextTag.id);
        } else if (prevTag) {
          actActiveTag.set(prevTag.id);
        } else {
          actActiveTag.clear();
        }
      });
    },
  handleTagActiveSet:
    ({ actActiveTag }) =>
    (tagId) => {
      actActiveTag.set(tagId);
    },
  handleTagActiveClear:
    ({ actActiveTag }) =>
    () => {
      actActiveTag.clear();
    },
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
      ytPlayer(true, 'getCurrentTime').then((t) => {
        ytPlayer('seekTo', (t >>> 0) + 5);
      });
    }.bind(this);
    emitter.on('forward 5', onKeyAdd5);

    const onKeySub5 = function () {
      if (this.props.activeTag) {
        return;
      }
      ytPlayer(true, 'getCurrentTime').then((t) => {
        ytPlayer('seekTo', (t >>> 0) - 5);
      });
    }.bind(this);
    emitter.on('backward 5', onKeySub5);

    const onPauseOrPlay = function () {
      ytPlayer(true, 'getPlayerState').then((state) => {
        if (state === 2) {
          // state: paused
          ytPlayer('playVideo');
        } else if (state === 1) {
          // state: playing
          ytPlayer('pauseVideo');
        }
      });
    };
    emitter.on('pause or play', onPauseOrPlay);
  },
  componentWillUnmount() {
    // TODO: emitter.off here someday
  },
});

// debouncely setting scrollTop
const scrollTo = debounce((ref, scrollTop) => {
  ref.scrollTop = scrollTop;
}, 50);
const addTagContainerRef = compose(
  withState('tagContainerRef', 'setTagContainerRef', null),
  withHandlers({
    handleTagContainerMount:
      ({ setTagContainerRef }) =>
      (c) => {
        if (c) {
          setTagContainerRef(c);
        }
      },
    handleTagContainerScrollRequest:
      ({ tagContainerRef }) =>
      (scrollTop) => {
        scrollTo(tagContainerRef, scrollTop);
      },
  })
);

const mapStateToProps = (state) => ({
  tags: sortBy(state.tags, ['seconds']),
  activeTag: state.activeTag,
});
const mapDispatchToProps = (dispatch) => ({
  actTag: bindActionCreators(actTag_, dispatch),
  actActiveTag: bindActionCreators(actActiveTag_, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  addTagContainerRef,
  addImportModal,
  addExportModal,
  addHandlers,
  addLifecyle
)(CSSModules(TagList, styles));
