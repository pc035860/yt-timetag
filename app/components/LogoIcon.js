import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './LogoIcon.scss';

import chromeURL from '_util/chromeURL';

const logoSrc = chromeURL(require('_images/icon-16.png'));
const defaultAlt = 'TimeTags for YouTube';

const LogoIcon = ({ alt }) => (
  <img styleName="component" src={logoSrc} alt={alt || defaultAlt} />
);
LogoIcon.propTypes = {
  alt: PropTypes.string
};
LogoIcon.defaultProps = {
  alt: ''
};

export default CSSModules(LogoIcon, styles);
