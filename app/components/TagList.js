import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './TagList.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actTag_ from '_actions/tag';
import * as actActiveTag_ from '_actions/activeTag';

const TagList = (tags, activeTag, actTag, actActiveTag) => (
  <div styleName="taglist">
    Oh ya
  </div>
);
TagList.propTypes = {
  tags: PropTypes.array,
  activeTag: PropTypes.number,

  actTag: PropTypes.object,
  actActiveTag: PropTypes.object
};

const mapStateToProps = (state) => ({
  tags: state.tags,
  activeTag: state.activeTag
});
const mapDispatchToProps = (dispatch) => ({
  actTag: bindActionCreators(actTag_, dispatch),
  actActiveTag: bindActionCreators(actActiveTag_, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
  CSSModules(TagList, styles)
);
