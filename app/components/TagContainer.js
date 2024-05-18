import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import normalizeWheel from 'normalize-wheel';

import noop from '_util/noop';

import styles from './TagContainer.scss';

class TagContainer extends Component {
  static propTypes = {
    children: PropTypes.any,
    stopPropagation: PropTypes.bool,
    shadow: PropTypes.bool,
    onMount: PropTypes.func,
  };

  static defaultProps = {
    stopPropagation: false,
    shadow: false,
    onMount: noop,
  };

  componentDidMount() {
    if (this.elm) {
      this.elm.addEventListener('wheel', this.onWheel, false);
    }
  }

  componentWillUnmount() {
    if (this.elm) {
      this.elm.removeEventListener('wheel', this.onWheel, false);
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
        evt.stopPropagation();
      } else if (
        pixelY > 0 &&
        Math.abs(t.scrollHeight - (t.scrollTop + t.clientHeight)) < 1
      ) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
  };

  elm;

  handleMount = (c) => {
    if (c) {
      this.elm = c;
      this.props.onMount(this.elm, this);
    }
  };

  render() {
    const { children, shadow } = this.props;
    return (
      <div
        styleName="component"
        className={classNames({
          [styles.withShadow]: shadow,
        })}
        ref={this.handleMount}
      >
        {children}
      </div>
    );
  }
}

export default CSSModules(TagContainer, styles);
