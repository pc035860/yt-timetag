import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './App.scss';

import LogoIcon from '_components/LogoIcon';
import TagList from '_components/TagList';

const App = ({ videoId, keyOpsEmitter }) => (
  <div styleName="component">
    <h4 styleName="title">
      <span styleName="logo-wrap">
        <LogoIcon />
      </span>
      TimeTags for YouTube &nbsp;
      <small styleName="title-videoId">({videoId})</small>
    </h4>
    <TagList videoId={videoId} keyOpsEmitter={keyOpsEmitter} />
  </div>
);
App.propTypes = {
  videoId: PropTypes.string.isRequired,
  keyOpsEmitter: PropTypes.object.isRequired
};

export default CSSModules(App, styles);
