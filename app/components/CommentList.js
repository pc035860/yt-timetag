import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';

import md5 from 'md5';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import omit from 'lodash/omit';
import sortBy from 'lodash/sortBy';

import CommentTag from './CommentTag';
import TagContainer from './TagContainer';

import fetchYTCommentThreads from '_util/fetchYTCommentThreads';
import is2017NewDesign from '_util/is2017NewDesign';
import parseTags from '_util/parseTags';

import * as actTag_ from '_actions/tag';

import styles from './TagList.scss';

const keyGen = (commentId, seconds, description) =>
  md5([commentId || '', seconds, description].join('@')).substr(0, 8);

class CommentList extends Component {
  state = {
    tags: [],
    sortByTimestamp: false,
  };

  componentWillMount() {
    const { videoId, onDone } = this.props;

    this.fetchController = new window.AbortController();
    const { signal } = this.fetchController;

    const onProgress = (progress, threads) => {
      const tags = this.parseTags(threads);
      this.setState({
        tags,
      });

      this.props.onProgress(progress, tags);
    };

    fetchYTCommentThreads(videoId, { signal, onProgress }).then(
      ({ threads, totalCount, error }) => {
        const tags = this.parseTags(threads);
        this.setState({
          tags,
        });

        onDone(tags);
      }
    );
  }

  componentWillUnmount() {
    if (this.fetchController) {
      this.fetchController.abort();
    }
  }

  threadCache = {};
  parseTags(threads) {
    const tags = [];
    threads.forEach((thread) => {
      const cache = this.threadCache[thread.id];
      if (cache) {
        cache.forEach((tag) => tags.push(tag));
        return;
      }

      const buf = parseTags(thread.text).map((tag) => ({
        ...tag,
        sourceCommentId: thread.id,
        _text: thread.text,
      }));
      buf.forEach((tag) => tags.push(tag));
      this.threadCache[thread.id] = buf;
    });
    return tags;
  }

  handleTagImport = (commentTag) => {
    const { actTag } = this.props;
    actTag.add(omit(commentTag, ['_text']));
  };

  handleTagRevertImport = (tagId) => {
    const { actTag } = this.props;
    actTag.remove(tagId);
  };

  handleToggleSortByTimestamp = () => {
    const { sortByTimestamp } = this.state;
    this.setState(
      {
        sortByTimestamp: !sortByTimestamp,
      },
      () => {
        if (this.tagContainerElm) {
          // scroll to top when toggling sort by timestamp
          this.tagContainerElm.scrollTo(0, 0);
        }
      }
    );
  };

  tagContainerElm;
  handleTagContainerMount = (elm) => {
    this.tagContainerElm = elm;
  };

  render() {
    const { videoId, addedCommentTag } = this.props;
    const { tags: _tags, sortByTimestamp } = this.state;

    const tags = sortByTimestamp ? sortBy(_tags, 'seconds') : _tags;

    return (
      <div
        className={classNames({
          [styles['new-design']]: is2017NewDesign(),
        })}
      >
        <TagContainer
          shadow
          stopProgation
          onMount={this.handleTagContainerMount}
        >
          {tags.map((tag, i) => {
            const key = keyGen(tag.sourceCommentId, tag.seconds, tag.description);
            const added = addedCommentTag[key];
            return (
              <CommentTag
                key={i}
                videoId={videoId}
                tag={tag}
                addedTagId={added ? added.id : undefined}
                onImport={this.handleTagImport}
                onRevertImport={this.handleTagRevertImport}
              />
            );
          })}
        </TagContainer>
        <div styleName="toolbar" className={styles.comment}>
          <tp-yt-paper-checkbox
            id="checkbox"
            className="style-scope ytd-playlist-add-to-option-renderer"
            role="checkbox"
            tabindex="0"
            toggles=""
            aria-disabled="false"
            style={{
              '--paper-checkbox-ink-size': '32px',
              '--paper-checkbox-size': '16px',
              '--paper-checkbox-label_-_font-size': '14px',
              '--paper-checkbox-label-spacing': '8px',
              '--paper-checkbox-label-color': 'var(--yttt-running-text-color)',
            }}
            onClick={this.handleToggleSortByTimestamp}
          >
            Sort by timestamp
          </tp-yt-paper-checkbox>
        </div>
      </div>
    );
  }
}
CommentList.propTypes = {
  videoId: PropTypes.string,
  onProgress: PropTypes.func,
  onDone: PropTypes.func,
  onImportTag: PropTypes.func,

  actTag: PropTypes.object.isRequired,
  addedCommentTag: PropTypes.object.isRequired,
};
CommentList.defaultProps = {
  onProgress: (progress, tags) => null,
  onDone: (tags) => null,
};

const addedCommentTagSelector = createSelector(
  (state) => state.tags,
  (tags) =>
    tags.reduce((o, v) => {
      if (v.sourceCommentId) {
        const key = keyGen(v.sourceCommentId, v.seconds, v.description);
        // eslint-disable-next-line no-param-reassign
        o[key] = v;
      }
      return o;
    }, {})
);
const mapStateToProps = (state) => ({
  addedCommentTag: addedCommentTagSelector(state),
  activeTag: state.activeTag,
});
const mapDispatchToProps = (dispatch) => ({
  actTag: bindActionCreators(actTag_, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CSSModules(CommentList, styles));
