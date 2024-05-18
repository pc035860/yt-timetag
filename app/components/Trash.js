import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CommentTag from './CommentTag';
import TagContainer from './TagContainer';

import is2017NewDesign from '_util/is2017NewDesign';

import * as actTrash_ from '_actions/trash';

import styles from './TagList.scss';

class Trash extends Component {
  handleTagPutBack = (tag) => {
    const { actTrash } = this.props;
    actTrash.putBack(tag);
  };

  render() {
    const { trash, videoId } = this.props;

    const tags = trash;

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
            return (
              <CommentTag
                key={tag.id}
                videoId={videoId}
                tag={tag}
                trashMode={true}
                onPutBack={this.handleTagPutBack}
              />
            );
          })}
        </TagContainer>
      </div>
    );
  }
}
Trash.propTypes = {
  videoId: PropTypes.string,
  trash: PropTypes.array,

  actTrash: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  trash: state.trash,
});
const mapDispatchToProps = (dispatch) => ({
  actTrash: bindActionCreators(actTrash_, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CSSModules(Trash, styles));
