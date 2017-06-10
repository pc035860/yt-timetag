import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './TagLink.scss';

import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import { toTag } from '_util/ytTime';
import noop from '_util/noop';

const TagLink = ({ videoId, seconds, onClick }) => (
  <a href={`/watch?v=${videoId}&t=${seconds >>> 0}s`}
    styleName="component"
    onClick={onClick}>{toTag(seconds)}</a>
);
TagLink.propTypes = {
  videoId: PropTypes.string.isRequired,
  seconds: PropTypes.number.isRequired,
  onClick: PropTypes.func
};
TagLink.defaultProps = {
  onClick: noop
};

export default onlyUpdateForKeys(['videoId', 'seconds'])(CSSModules(TagLink, styles));
