import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import styles from './TagLink.scss';

import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import { toTag } from '_util/ytTime';
import noop from '_util/noop';
import is2017NewDesign from '_util/is2017NewDesign';

const CLASS_NAME_BASE = is2017NewDesign() ? ['yt-simple-endpoint', 'yt-formatted-string'] : '';

const TagLink = ({ videoId, seconds, onClick, className }) => {
  const aElm = (
    <a href={`/watch?v=${videoId}&t=${seconds >>> 0}s`}
      styleName="component"
      className={classNames(CLASS_NAME_BASE, className)}
      onClick={onClick}>{toTag(seconds)}</a>
  );

  if (is2017NewDesign()) {
    return (
      <yt-formatted-string class="ytd-comment-renderer">
        {aElm}
      </yt-formatted-string>
    );
  }
  return aElm;
};
TagLink.propTypes = {
  videoId: PropTypes.string.isRequired,
  seconds: PropTypes.number.isRequired,
  onClick: PropTypes.func
};
TagLink.defaultProps = {
  onClick: noop
};

export default onlyUpdateForKeys(['videoId', 'seconds'])(CSSModules(TagLink, styles));
