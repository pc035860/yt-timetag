import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import omit from 'lodash/omit';

import CommentTag from './CommentTag';
import TagContainer from './TagContainer';

import { fetchYTVideoInfo } from '_util/ytDataApi';
import is2017NewDesign from '_util/is2017NewDesign';
import parseTags from '_util/parseTags';
import { keyGen as commentKeyGen } from './CommentList';

import * as actTag_ from '_actions/tag';
import * as actInfo_ from '_actions/info';

import styles from './TagList.scss';

const keyGen = (videoId, seconds, description) =>
  commentKeyGen(videoId, seconds, description);

class ChapterList extends Component {
  state = {
    tags: [],
  };

  componentWillMount() {
    const { videoId, actInfo, onDone } = this.props;

    this.fetchController = new window.AbortController();
    const { signal } = this.fetchController;

    fetchYTVideoInfo(videoId, { signal }).then(
      ({ id, title, description, totalCount, error }) => {
        const tags = this.parseTags(description);
        this.setState({
          tags,
        });

        actInfo.init({
          videoId,
          title,
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

  parseTags(description) {
    const { videoId } = this.props;
    return parseTags(description, { chapterMode: true }).map((tag) => ({
      ...tag,
      sourceCommentId: videoId,
      _text: description,
    }));
  }

  handleTagImport = (commentTag) => {
    const { actTag } = this.props;
    actTag.add(omit(commentTag, ['_text']));
  };

  handleTagRevertImport = (tagId) => {
    const { actTag } = this.props;
    actTag.remove(tagId);
  };

  tagContainerElm;
  handleTagContainerMount = (elm) => {
    this.tagContainerElm = elm;
  };

  render() {
    const { videoId, addedCommentTag } = this.props;
    const { tags: _tags } = this.state;

    const tags = _tags;

    return (
      <div
        className={classNames({
          [styles['new-design']]: is2017NewDesign(),
        })}
      >
        <TagContainer
          shadow
          stopPropagation
          onMount={this.handleTagContainerMount}
        >
          {tags.map((tag, i) => {
            const key = keyGen(videoId, tag.seconds, tag.description);
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
      </div>
    );
  }
}
ChapterList.propTypes = {
  videoId: PropTypes.string,
  onDone: PropTypes.func,

  actTag: PropTypes.object.isRequired,
  actInfo: PropTypes.object.isRequired,
  addedCommentTag: PropTypes.object.isRequired,
};
ChapterList.defaultProps = {
  onDone: (tags) => null,
};

const addedCommentTagSelector = createSelector(
  (state) => state.tags,
  (tags) =>
    tags.reduce((o, v) => {
      if (v.sourceCommentId) {
        const videoId = v.sourceCommentId;
        const key = keyGen(videoId, v.seconds, v.description);
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
  actInfo: bindActionCreators(actInfo_, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CSSModules(ChapterList, styles));
