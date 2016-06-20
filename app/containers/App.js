import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './App.scss';

import TagList from '_components/TagList';

const App = () => (
  <div styleName="component">
    <h4 styleName="title">Time Tags</h4>
    <TagList />
  </div>
);

export default CSSModules(App, styles);
