import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Tag.scss';

import classNames from 'classnames';

import noop from '_util/noop';
import { toTag } from '_util/ytTime';
import ytPlayer from '_util/ytPlayer';

console.debug('styles', styles);

class Tag extends Component {
  static propTypes = {
    tag: PropTypes.shape({
      id: PropTypes.number.isRequired,
      seconds: PropTypes.number.isRequired,
      description: PropTypes.string
    }).isRequired,
    isActive: PropTypes.bool,

    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onSetActive: PropTypes.func,
    onClearActive: PropTypes.func
  };
  static defaultProps = {
    isActive: false,
    onEdit: noop,
    onRemove: noop,
    onSetActive: noop,
    onClearActive: noop
  };

  constructor(...args) {
    super(...args);

    [
      'handleToggleComponent',
      'handleRemoveClick',
      'handleAdd5',
      'handleSub5'
    ].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.isActive !== this.props.isActive) {
      if (nextProps.isActive) {
        ytPlayer('seekTo', nextProps.tag.seconds);
      }
    }
  }

  handleToggleComponent() {
    if (this.props.isActive) {
      this.props.onClearActive();
    }
    else {
      this.props.onSetActive(this.props.tag.id);
    }
  }

  handleAdd5(evt) {
    const { tag, onEdit, onSetActive } = this.props;
    const seconds = tag.seconds + 5;
    onEdit(tag.id, { seconds });

    ytPlayer('seekTo', seconds, true);
    onSetActive(tag.id);

    evt.stopPropagation();
  }

  handleSub5(evt) {
    const { tag, onEdit, onSetActive } = this.props;
    const seconds = tag.seconds - 5;
    onEdit(tag.id, { seconds });

    ytPlayer('seekTo', seconds, true);
    onSetActive(tag.id);

    evt.stopPropagation();
  }

  handleRemoveClick(evt) {
    this.props.onRemove(this.props.tag.id);

    evt.stopPropagation();
  }

  render() {
    const { tag, isActive } = this.props;
    return (
      <div styleName="component"
        className={classNames({
          [styles['component-is-active']]: isActive
        })}
        onClick={this.handleToggleComponent}>
        <div styleName="tag">{toTag(tag.seconds)}</div>
        <div styleName="description">{tag.description}</div>
        <div styleName="actions">
          <button type="button"
            styleName="actions-btn"
            onClick={this.handleAdd5}>+5</button>
          <button type="button"
            styleName="actions-btn"
            onClick={this.handleSub5}>-5</button>
          <button type="button"
            styleName="actions-btn"
            onClick={this.handleRemoveClick}>X</button>
        </div>
      </div>
    );
  }
}


export default CSSModules(Tag, styles);
