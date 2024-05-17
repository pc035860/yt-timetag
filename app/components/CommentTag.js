import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';

import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';

import MdPlayListAdd from 'react-icons/lib/md/playlist-add';
import MdPlayListAddCheck from 'react-icons/lib/md/playlist-add-check';
import MdCached from 'react-icons/lib/md/cached';
import TagLink from './TagLink';
import YTButton from './YTButton';

import is2017NewDesign from '_util/is2017NewDesign';
import ytPlayer from '_util/ytPlayer';
import { toTag } from '_util/ytTime';
import { ct } from '_util/i18n';

import styles from './Tag.scss';

const getTagTextHTML = (tag) => {
  const tagStr = toTag(tag.seconds);

  const buf = tag._text;
  const tagStrIndex = buf.indexOf(tagStr);

  if (tagStrIndex >= 0) {
    let descPart = buf.substring(tagStrIndex + tagStr.length);
    descPart = descPart.replace(
      tag.description,
      `<span class="${styles.highlight}">${tag.description}</span>`
    );
    let tagPart = buf.substring(0, tagStrIndex + tagStr.length);
    tagPart = tagPart.replace(
      tagStr,
      `<span class="${styles.highlight}">${tagStr}</span>`
    );
    return `${tagPart}${descPart}`;
  }

  return buf.replace(
    tag.description,
    `<span class="${styles.highlight}">${tag.description}</span>`
  );
};

class CommentTag extends Component {
  componentDidUpdate(prevProps, prevState) {
    const { expand } = this.props;
    if (prevProps.expand && !expand) {
      if (this.compElm) {
        this.compElm.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }

  compElm;

  handleComponentMount = (elm) => {
    if (elm) {
      this.compElm = elm;
    }
  };

  renderCommentStatus = () => {
    const {
      addedTagId,
      trashMode,
      handleImportBtnClick,
      handleRevertImportBtnClick,
      handlePutBackBtnClick,
    } = this.props;

    if (trashMode) {
      return (
        <div styleName="comment-actions">
          <YTButton
            type="button"
            title={ct('appActionPutBack')}
            styleName="comment-actions-btn"
            onClick={handlePutBackBtnClick}
          >
            <MdCached size={16} />
          </YTButton>
        </div>
      );
    }

    if (addedTagId) {
      return (
        <div styleName="comment-status">
          <YTButton
            type="button"
            title={ct('appActionRemoveFromMine')}
            styleName="comment-status-btn"
            onClick={handleRevertImportBtnClick}
          >
            <MdPlayListAddCheck size={16} />
          </YTButton>
        </div>
      );
    }

    return (
      <div styleName="comment-actions">
        <YTButton
          type="button"
          title={ct('appActionAddToMine')}
          styleName="comment-actions-btn"
          onClick={handleImportBtnClick}
        >
          <MdPlayListAdd size={16} />
        </YTButton>
      </div>
    );
  };

  render() {
    const { videoId, tag, expand, handleTagClick, handleLinkClick } =
      this.props;

    return (
      <div styleName="comment-wrap">
        <div
          styleName="component"
          className={classNames(styles.comment, {
            [styles['component-is-active']]: expand,
            [styles['new-design']]: is2017NewDesign(),
          })}
          onClick={handleTagClick}
          ref={this.handleComponentMount}
        >
          <div styleName="tag">
            <TagLink
              videoId={videoId}
              seconds={tag.seconds}
              onClick={handleLinkClick}
            />
          </div>
          <div styleName="description">{tag.description}</div>
          {this.renderCommentStatus()}
        </div>
        {expand && (
          <div styleName="comment-text">
            <pre
              styleName="pre"
              dangerouslySetInnerHTML={{ __html: getTagTextHTML(tag) }}
            />
          </div>
        )}
      </div>
    );
  }
}
CommentTag.displayName = 'CommentTag';
CommentTag.propTypes = {
  videoId: PropTypes.string,
  tag: PropTypes.shape({
    seconds: PropTypes.number,
    sourceCommentId: PropTypes.string,
  }),
  addedTagId: PropTypes.string,
  trashMode: PropTypes.bool,
};

export default compose(
  pure,
  withState('expand', 'setExpand', false),
  withHandlers({
    handleTagClick:
      ({ expand, setExpand }) =>
      () => {
        setExpand(!expand);
      },
    handleLinkClick:
      ({ tag }) =>
      (evt) => {
        ytPlayer('seekTo', tag.seconds >>> 0);
        evt.preventDefault();
        evt.stopPropagation();
      },
    handleImportBtnClick:
      ({ tag, onImport }) =>
      (evt) => {
        onImport(tag);
        evt.stopPropagation();
      },
    handleRevertImportBtnClick:
      ({ addedTagId, onRevertImport }) =>
      (evt) => {
        onRevertImport(addedTagId);
        evt.stopPropagation();
      },
    handlePutBackBtnClick:
      ({ tag, onPutBack }) =>
      (evt) => {
        onPutBack(tag);
        evt.stopPropagation();
      },
  })
)(CSSModules(CommentTag, styles));
