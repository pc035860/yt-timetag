import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './App.scss';

import TagList from '_components/TagList';

const App = ({ videoId, keyOpsEmitter }) => (
  <div styleName="component">
    <h4 styleName="title">
      Time Tags <small styleName="title-videoId">({videoId})</small>
    </h4>
    <TagList videoId={videoId} keyOpsEmitter={keyOpsEmitter} />
  </div>
);
App.propTypes = {
  videoId: PropTypes.string.isRequired,
  keyOpsEmitter: PropTypes.object.isRequired
};

export default CSSModules(App, styles);
