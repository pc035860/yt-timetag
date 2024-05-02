import React from 'react';
import classNames from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';

import CSSModules from 'react-css-modules';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import withPropsOnChange from 'recompose/withPropsOnChange';
import mapProps from 'recompose/mapProps';

import LogoIcon from '_components/LogoIcon';
import YTButton from './YTButton';
import MdContentCopy from 'react-icons/lib/md/content-copy';

import is2017NewDesign from '_util/is2017NewDesign';
import exportFromTags, { asMarkdown } from '_util/exportFromTags';

import styles from './dialog.scss';

const transitionConfig = {
  justCopied: {
    transitionName: 'anim',
    transitionAppear: true,
    transitionAppearTimeout: 300,
    transitionEnterTimeout: 300,
    transitionLeaveTimeout: 300,
  },
};

const Export = ({
  tags,
  videoId,

  onClose,

  handleMarkdownModeToggleClick,

  exportText,

  justCopied,
  handleCopy,
}) => (
  <div
    styleName="dialog"
    className={classNames({
      [styles['new-design']]: is2017NewDesign(),
    })}
  >
    <div styleName="heading">
      <LogoIcon /> Export
    </div>
    <div>
      <div styleName="textarea-wrap">
        <YTButton
          styleName="textarea-copy-btn"
          type="button"
          title="Copy"
          onClick={handleCopy}
        >
          <CSSTransitionGroup {...transitionConfig.justCopied}>
            {justCopied && (
              <span styleName="textarea-copy-btn__hint">Copied</span>
            )}
          </CSSTransitionGroup>
          <MdContentCopy size={20} />
        </YTButton>
        <textarea
          styleName="textarea"
          defaultValue={exportText}
          aria-readonly="true"
        />
      </div>
    </div>
    <div className={classNames(styles.toolbar, styles['toolbar--export'])}>
      <tp-yt-paper-toggle-button
        noink=""
        className="style-scope ytd-settings-switch-renderer"
        role="button"
        tabindex="0"
        toggles
        active
        onClick={handleMarkdownModeToggleClick}
      >
        <span styleName="markdown-toggle-btn-text">
          Markdown fromat (with timestamp link)
        </span>
      </tp-yt-paper-toggle-button>
      <button
        styleName="toolbar-btn"
        type="button"
        title="Cancel"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

const addMarkdownToggle = compose(
  withState('markdownMode', 'setMarkdownMode', false),
  withHandlers({
    handleMarkdownModeToggleClick:
      ({ markdownMode, setMarkdownMode }) =>
      () => {
        setMarkdownMode(!markdownMode);
      },
  })
);

const exportTextProps = compose(
  withPropsOnChange(
    ['videoId', 'markdownMode', 'tags'],
    ({ videoId, markdownMode, tags }) => {
      let exportText;
      if (markdownMode) {
        exportText = asMarkdown(tags, videoId);
      } else {
        exportText = exportFromTags(tags);
      }
      return { exportText };
    }
  )
);

const addCopiedHint = compose(
  withState('justCopied', 'setJustCopied', false),
  withState('justCopiedTimeout', 'setJustCopiedTimeout', null),
  mapProps(({ setJustCopied, setJustCopiedTimeout, ...rest }) => ({
    onCopySuccess: () => {
      setJustCopied(true);
      if (rest.justCopiedTimeout) {
        clearTimeout(rest.justCopiedTimeout);
      }
      setJustCopiedTimeout(setTimeout(() => setJustCopied(false), 1500));
    },
    ...rest,
  }))
);
const addCopyHandler = withHandlers({
  handleCopy:
    ({ exportText, onCopySuccess }) =>
    () => {
      const textarea = document.createElement('textarea');
      textarea.value = exportText;

      const body = document.getElementsByTagName('body')[0];
      body.appendChild(textarea);

      textarea.select();

      try {
        const success = document.execCommand('cut');
        if (success) {
          onCopySuccess();
        }
      } catch (err) {
        /* do nothing */
      }

      body.removeChild(textarea);
    },
});

export default compose(
  addMarkdownToggle,
  exportTextProps,
  addCopiedHint,
  addCopyHandler
)(CSSModules(Export, styles));
