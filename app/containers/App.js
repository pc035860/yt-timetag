import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import styles from './App.scss';

import is2017NewDesign from '_util/is2017NewDesign';

import LogoIcon from '_components/LogoIcon';
import TagList from '_components/TagList';

const App = ({ videoId, keyOpsEmitter }) => (
  <div
    styleName="component"
    className={classNames({
      [styles['new-design']]: is2017NewDesign()
    })}
  >
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
