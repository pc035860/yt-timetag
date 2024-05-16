import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './LogoIcon.scss';

import chromeURL from '_util/chromeURL';
import { ct } from '_util/i18n';

const logoSrc = chromeURL(require('_images/icon_small_no_bg.svg'));
const defaultAlt = ct('extName');

const LogoIcon = ({ alt }) => (
  <img styleName="component" src={logoSrc} alt={alt || defaultAlt} />
);
LogoIcon.propTypes = {
  alt: PropTypes.string,
};
LogoIcon.defaultProps = {
  alt: '',
};

export default CSSModules(LogoIcon, styles);
