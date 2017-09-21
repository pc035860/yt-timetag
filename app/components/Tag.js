import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Tag.scss';

import classNames from 'classnames';

import MdKeyboardArrowLeft from 'react-icons/lib/md/keyboard-arrow-left';
import MdKeyboardArrowRight from 'react-icons/lib/md/keyboard-arrow-right';
import MdClear from 'react-icons/lib/md/clear';

import noop from '_util/noop';
import ytPlayer from '_util/ytPlayer';
import is2017NewDesign from '_util/is2017NewDesign';

import TagLink from './TagLink';
import YTButton from './YTButton';
class Tag extends Component {
  static propTypes = {
    videoId: PropTypes.string.isRequired,
    keyOpsEmitter: PropTypes.object.isRequired,

    tag: PropTypes.shape({
      id: PropTypes.string.isRequired,
      seconds: PropTypes.number.isRequired,
      description: PropTypes.string
    }).isRequired,
    isActive: PropTypes.bool,
    containerRef: PropTypes.any,

    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onSetActive: PropTypes.func,
    onClearActive: PropTypes.func,
    onContainerScrollRequest: PropTypes.func
  };
  static defaultProps = {
    isActive: false,
    onEdit: noop,
    onRemove: noop,
    onSetActive: noop,
    onClearActive: noop,
    onContainerScrollRequest: noop
  };

  constructor(...args) {
    super(...args);

    [
      'handleToggleComponent',
      'handleRemoveClick',
      'handleDescriptionChange',
      'handleDescriptionClick',
      'handleLinkClick',

      'onKeyFocusDescription',
      'onKeyAdd5',
      'onKeySub5',
      'onKeyAdd1',
      'onKeySub1'
    ].forEach(name => {
      this[name] = this[name].bind(this);
    });

    this.handleAdd5 = this.createTimeDiffHandler(5).bind(this);
    this.handleSub5 = this.createTimeDiffHandler(-5).bind(this);
    this.handleAdd1 = this.createTimeDiffHandler(1).bind(this);
    this.handleSub1 = this.createTimeDiffHandler(-1).bind(this);
  }

  componentDidMount() {
    const emitter = this.props.keyOpsEmitter;
    emitter.on('focus description', this.onKeyFocusDescription);
    emitter.on('tag add 5', this.onKeyAdd5);
    emitter.on('tag sub 5', this.onKeySub5);
    emitter.on('tag add 1', this.onKeyAdd1);
    emitter.on('tag sub 1', this.onKeySub1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isActive !== this.props.isActive && nextProps.isActive) {
      this.scrollIntoView();
    }

    if (nextProps.tag !== this.props.tag) {
      this.scrollIntoView();
    }
  }

  componentWillUnmount() {
    const emitter = this.props.keyOpsEmitter;
    emitter.off('focus description', this.onKeyFocusDescription);
    emitter.off('tag add 5', this.onKeyAdd5);
    emitter.off('tag sub 5', this.onKeySub5);
    emitter.off('tag add 1', this.onKeyAdd1);
    emitter.off('tag sub 1', this.onKeySub1);

    this.elm = null;
  }

  onKeyFocusDescription() {
    setTimeout(() => {
      const input = this.descriptionInput;

      if (input) {
        input.focus();
        try {
          input.select();
        }
        catch (e) {
          /* nothing */
        }
      }
    }, 10);
  }

  onKeyAdd5() {
    if (this.props.isActive) {
      this.handleAdd5();
    }
  }

  onKeySub5() {
    if (this.props.isActive) {
      this.handleSub5();
    }
  }

  onKeyAdd1() {
    if (this.props.isActive) {
      this.handleAdd1();
    }
  }

  onKeySub1() {
    if (this.props.isActive) {
      this.handleSub1();
    }
  }

  elm;

  scrollIntoView() {
    const { containerRef } = this.props;
    if (this.elm && containerRef) {
      setTimeout(() => {
        // view range: container.scrollTop -> container.scrollTop + container.offsetHeight
        // elm range: elm.offsetTop -> elm.offsetTop + elm.offsetHeight

        const elm = this.elm;
        const cScrollTop = containerRef.scrollTop;
        const cOffsetHeight = containerRef.offsetHeight;
        const eOffsetTop = elm.offsetTop;
        const eOffsetHeight = elm.offsetHeight;

        let scrollTop;
        if (cScrollTop > eOffsetTop) {
          scrollTop = eOffsetTop;
        }
        else if (cScrollTop + cOffsetHeight < eOffsetTop + eOffsetHeight) {
          scrollTop = eOffsetTop + eOffsetHeight - cOffsetHeight;
        }

        if (typeof scrollTop !== 'undefined') {
          this.props.onContainerScrollRequest(scrollTop);
        }
      }, 100);
    }
  }

  createTimeDiffHandler(secDiff) {
    return (evt) => {
      const { tag, onEdit, onSetActive } = this.props;
      const seconds = Math.max(0, tag.seconds + secDiff);
      onEdit(tag.id, { seconds });

      ytPlayer('seekTo', seconds, true);
      onSetActive(tag.id);

      if (evt) {
        evt.stopPropagation();
      }
    };
  }

  handleMount = (c) => {
    if (c) {
      this.elm = c;
    }
  };

  handleToggleComponent() {
    if (this.props.isActive) {
      this.props.onClearActive();
    }
    else {
      this.props.onSetActive(this.props.tag.id);
    }
  }

  handleLinkClick(evt) {
    ytPlayer('seekTo', this.props.tag.seconds >>> 0);
    evt.preventDefault();
    evt.stopPropagation();
  }

  handleRemoveClick(evt) {
    this.props.onRemove(this.props.tag.id);

    evt.stopPropagation();
  }

  handleDescriptionChange(evt) {
    const { tag, onEdit } = this.props;
    const description = evt.target.value;
    onEdit(tag.id, { description });
  }

  handleDescriptionClick(evt) {
    evt.stopPropagation();
  }

  handleDescriptionKeyPress(evt) {
    if (evt.charCode === 13) {
      evt.target.blur();
      evt.preventDefault();
    }
  }

  renderDescription() {
    const { tag, isActive } = this.props;

    if (!isActive) {
      return tag.description;
    }

    return (
      <input
        ref={ref => {
          if (ref) {
            this.descriptionInput = ref;
          }
        }}
        type="text"
        styleName="description-input"
        value={tag.description}
        placeholder="tag description"
        onChange={this.handleDescriptionChange}
        onClick={this.handleDescriptionClick}
        onKeyPress={this.handleDescriptionKeyPress} />
    );
  }

  render() {
    const { tag, isActive, videoId } = this.props;
    return (
      <div
        styleName="component"
        className={classNames({
          [styles['component-is-active']]: isActive,
          [styles['new-design']]: is2017NewDesign()
        })}
        onClick={this.handleToggleComponent}
        ref={this.handleMount}
      >
        <div styleName="tag">
          <TagLink
            videoId={videoId}
            seconds={tag.seconds}
            onClick={this.handleLinkClick}
            />
        </div>
        <div styleName="description">
          {this.renderDescription()}
        </div>
        {isActive &&
          <div styleName="actions">
            <YTButton type="button"
              title="-5s"
              styleName="actions-btn"
              onClick={this.handleSub5}>
              <MdKeyboardArrowLeft size={16} />
            </YTButton>
            <YTButton type="button"
              title="+5s"
              styleName="actions-btn"
              onClick={this.handleAdd5}>
              <MdKeyboardArrowRight size={16} />
            </YTButton>
            <YTButton type="button"
              title="Remove"
              styleName="actions-btn-last"
              onClick={this.handleRemoveClick}>
              <MdClear size={16} />
            </YTButton>
          </div>
        }
      </div>
    );
  }
}


export default CSSModules(Tag, styles);
