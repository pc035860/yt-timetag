import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import normalizeWheel from 'normalize-wheel';

import styles from './TagContainer.scss';

class TagContainer extends Component {
  static propTypes = {
    children: PropTypes.any,
    stopPropagation: PropTypes.bool,
    shadow: PropTypes.bool
  };

  static defaultProps = {
    stopPropagation: false,
    shadow: false
  };

  componentDidMount() {
    if (this.elm) {
      this.elm.addEventListener('wheel', this.onWheel);
    }
  }

  componentWillUnmount() {
    if (this.elm) {
      this.elm.removeEventListener('whee', this.onWheel);
      this.elm = null;
    }
  }

  onWheel = (evt) => {
    if (this.props.stopPropagation) {
      const { pixelY } = normalizeWheel(evt);
      const { currentTarget: t } = evt;

      if (t.scrollHeight <= t.clientHeight) {
        return;
      }

      if (pixelY < 0 && t.scrollTop === 0) {
        evt.preventDefault();
      }
      else if (pixelY > 0 && t.scrollHeight === t.scrollTop + t.clientHeight) {
        evt.preventDefault();
      }
    }
  }

  elm;

  handleMount = (c) => {
    if (c) {
      this.elm = c;
    }
  };

  render() {
    const { children, shadow } = this.props;
    return (
      <div styleName="component"
        className={classNames({
          [styles.withShadow]: shadow
        })}
        ref={this.handleMount}
      >{children}</div>
    );
  }
}

export default CSSModules(TagContainer, styles);
