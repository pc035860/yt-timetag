import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import LogoIcon from '_components/LogoIcon';
import TagList from '_components/TagList';
import CommentList from '_components/CommentList';

import is2017NewDesign from '_util/is2017NewDesign';

import styles from './App.scss';

const TAB = {
  MINE: 'MINE',
  COMMENTS: 'COMMENTS',
};

const App = ({
  videoId,
  keyOpsEmitter,
  tags,
  activeTab,
  handleTabBtnClick,
  commentsTagCount,
  commentsProgress,
  commentsDone,
  handleCommentListProgress,
  handleCommentListDone,
}) => (
  <div
    styleName="component"
    className={classNames({
      [styles['new-design']]: is2017NewDesign(),
    })}
  >
    <h4 styleName="title">
      <span styleName="logo-wrap">
        <LogoIcon />
      </span>
      TimeTags for YouTube &nbsp;
      <small styleName="title-videoId">({videoId})</small>
    </h4>

    <div>
      <div styleName="tab-btns">
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
          MINE<small>&nbsp;({tags.length})</small>
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
          COMMENTS<small>&nbsp;({commentsTagCount})</small>
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
      </div>
    </div>
  </div>
);
App.propTypes = {
  videoId: PropTypes.string.isRequired,
  keyOpsEmitter: PropTypes.object.isRequired,
};

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
      ({ setCommentsDone, setCommentsTagCount }) =>
      (tags) => {
        setCommentsTagCount(tags.length);
        setCommentsDone(true);
      },
  })
);

const mapStateToProps = (state) => ({
  tags: state.tags,
});
export default compose(
  connect(mapStateToProps, null),
  addTabSwitch,
  addCommentsProgress
)(CSSModules(App, styles));
