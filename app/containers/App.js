import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './App.scss';

import TagList from '_components/TagList';

const App = ({ videoId }) => (
  <div styleName="component">
    <h4 styleName="title">
      Time Tags <small styleName="title-videoId">({videoId})</small>
    </h4>
    <TagList videoId={videoId} />
  </div>
);
App.propTypes = {
  videoId: PropTypes.string.isRequired
};

export default CSSModules(App, styles);
