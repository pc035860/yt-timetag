import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';

import LogoIcon from '_components/LogoIcon';
import TagList from '_components/TagList';
import CommentList from '_components/CommentList';
import ChapterList from '_components/ChapterList';
import Trash from '_components/Trash';
import MdSettings from 'react-icons/lib/md/settings';

import is2017NewDesign from '_util/is2017NewDesign';
import { ct } from '_util/i18n';

import * as actInfo_ from '_actions/info';

import { MSG_OPEN_OPTIONS_PAGE } from '_constants/Messages';

import styles from './App.scss';

const TAB = {
  MINE: 'MINE',
  COMMENTS: 'COMMENTS',
  CHAPTERS: 'CHAPTERS',
  TRASH: 'TRASH',
};

const App = ({
  videoId,
  keyOpsEmitter,
  tags,
  trash,
  activeTab,
  handleTabBtnClick,

  commentsTagCount,
  commentsProgress,
  commentsDone,
  handleCommentListProgress,
  handleCommentListDone,
  handleOpenOptionsPage,

  chaptersTagCount,
  chaptersAvailable,
  handleChapterListDone,
}) => (
  <div
    styleName="component"
    className={classNames({
      [styles['new-design']]: is2017NewDesign(),
    })}
  >
    <h4 styleName="title">
      <div styleName="title-ellipsis">
        <span styleName="logo-wrap">
          <LogoIcon />
        </span>
        {ct('extName')} &nbsp;
        <small styleName="title-videoId">({videoId})</small>
      </div>
      <a
        href=""
        styleName="btn-settings"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOpenOptionsPage}
      >
        <MdSettings size={16} />
      </a>
    </h4>

    <div>
      <div styleName="tab-btns">
        <div styleName="tab-btns-left">
          <tp-yt-paper-button
            class={classNames('style-scope', styles.btn, {
              [styles.active]: activeTab === TAB.MINE,
            })}
            role="option"
            tabindex="0"
            aria-disabled="false"
            data-tab={TAB.MINE}
            onClick={handleTabBtnClick}
          >
            {ct('appTabMine')}
            <small>&nbsp;({tags.length})</small>
          </tp-yt-paper-button>
          <tp-yt-paper-button
            class={classNames('style-scope', styles.btn, {
              [styles.active]: activeTab === TAB.COMMENTS,
            })}
            role="option"
            tabindex="0"
            aria-disabled="false"
            data-tab={TAB.COMMENTS}
            onClick={handleTabBtnClick}
          >
            {ct('appTabComments')}
            <small>&nbsp;({commentsTagCount})</small>
            <div
              styleName="progress-line-wrap"
              className={classNames({
                [styles.done]: commentsDone,
              })}
            >
              <div
                styleName="line"
                style={{
                  transform: `translateX(${commentsProgress * 100 - 100}%)`,
                }}
              />
            </div>
          </tp-yt-paper-button>
          {chaptersAvailable && (
            <tp-yt-paper-button
              class={classNames('style-scope', styles.btn, {
                [styles.active]: activeTab === TAB.CHAPTERS,
              })}
              role="option"
              tabindex="0"
              aria-disabled="false"
              data-tab={TAB.CHAPTERS}
              onClick={handleTabBtnClick}
            >
              {ct('appTabChapters')}
              <small>&nbsp;({chaptersTagCount})</small>
            </tp-yt-paper-button>
          )}
        </div>
        <div styleName="tab-btns-right">
          {trash.length > 0 && (
            <tp-yt-paper-button
              class={classNames(
                'style-scope',
                styles.btn,
                styles['justify-end'],
                {
                  [styles.active]: activeTab === TAB.TRASH,
                }
              )}
              role="option"
              tabindex="0"
              aria-disabled="false"
              data-tab={TAB.TRASH}
              onClick={handleTabBtnClick}
            >
              {ct('appTabTrash')}
              <small>&nbsp;({trash.length})</small>
            </tp-yt-paper-button>
          )}
        </div>
      </div>
      <div styleName="tabs">
        <div
          className={classNames({
            [styles.hide]: activeTab !== TAB.MINE,
          })}
        >
          <TagList videoId={videoId} keyOpsEmitter={keyOpsEmitter} />
        </div>
        <div
          className={classNames({
            [styles.hide]: activeTab !== TAB.COMMENTS,
          })}
        >
          <CommentList
            videoId={videoId}
            onProgress={handleCommentListProgress}
            onDone={handleCommentListDone}
          />
        </div>
        <div
          className={classNames({
            [styles.hide]: activeTab !== TAB.CHAPTERS || !chaptersAvailable,
          })}
        >
          <ChapterList videoId={videoId} onDone={handleChapterListDone} />
        </div>
        <div
          className={classNames({
            [styles.hide]: activeTab !== TAB.TRASH,
          })}
        >
          <Trash videoId={videoId} />
        </div>
      </div>
    </div>
  </div>
);
App.propTypes = {
  videoId: PropTypes.string.isRequired,
  keyOpsEmitter: PropTypes.object.isRequired,
};

const addInitInfo = lifecycle({
  componentWillMount() {
    const { actInfo, videoId } = this.props;
    actInfo.init({ videoId });
  },
});
const addTabSwitch = compose(
  withState('activeTab', 'setActiveTab', TAB.MINE),
  withHandlers({
    handleTabBtnClick:
      ({ setActiveTab }) =>
      (evt) => {
        const { currentTarget } = evt;
        setActiveTab(currentTarget.dataset.tab);
      },
  })
);
const addCommentsProgress = compose(
  withState('commentsTagCount', 'setCommentsTagCount', 0),
  withState('commentsProgress', 'setCommentsProgress', 0),
  withState('commentsDone', 'setCommentsDone', false),
  withHandlers({
    handleCommentListProgress:
      ({ setCommentsProgress, setCommentsTagCount }) =>
      (progress, tags) => {
        setCommentsTagCount(tags.length);
        setCommentsProgress(progress);
      },
    handleCommentListDone:
      ({ setCommentsDone, setCommentsTagCount, setCommentsProgress }) =>
      (tags) => {
        setCommentsTagCount(tags.length);
        setCommentsProgress(1);
        setCommentsDone(true);
      },
  })
);
const addChaptersAvailable = compose(
  withState('chaptersAvailable', 'setChaptersAvailable', false),
  withState('chaptersTagCount', 'setChaptersTagCount', 0),
  withHandlers({
    handleChapterListDone:
      ({ setChaptersAvailable, setChaptersTagCount }) =>
      (tags) => {
        setChaptersTagCount(tags.length);
        setChaptersAvailable(tags.length > 0);
      },
  })
);

const addOpenOptionsPage = withHandlers({
  handleOpenOptionsPage: () => (evt) => {
    evt.preventDefault();
    chrome.runtime.sendMessage({
      action: MSG_OPEN_OPTIONS_PAGE,
    });
  },
});

const mapStateToProps = (state) => ({
  tags: state.tags,
  trash: state.trash,
});
const mapDispatchToProps = (dispatch) => ({
  actInfo: bindActionCreators(actInfo_, dispatch),
});
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  addInitInfo,
  addTabSwitch,
  addCommentsProgress,
  addChaptersAvailable,
  addOpenOptionsPage
)(CSSModules(App, styles));
