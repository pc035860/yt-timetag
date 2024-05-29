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
import { ct } from '_util/i18n';

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
      <LogoIcon /> {ct('appActionTextOutput')}
    </div>
    <div>
      <div styleName="textarea-wrap">
        <YTButton
          styleName="textarea-copy-btn"
          type="button"
          title={ct('appActionCopyToClipboard')}
          onClick={handleCopy}
        >
          <CSSTransitionGroup {...transitionConfig.justCopied}>
            {justCopied && (
              <span styleName="textarea-copy-btn__hint">
                {ct('appTextCopiedToClipboard')}
              </span>
            )}
          </CSSTransitionGroup>
          <MdContentCopy size={20} />
        </YTButton>
        <textarea
          styleName="textarea"
          value={exportText}
          aria-readonly="true"
          readOnly
        />
      </div>
    </div>
    <div className={classNames(styles.toolbar, styles['toolbar--export'])}>
      <tp-yt-paper-toggle-button
        noink=""
        class="style-scope ytd-settings-switch-renderer"
        role="button"
        tabindex="0"
        toggles
        active
        onClick={handleMarkdownModeToggleClick}
      >
        <span styleName="markdown-toggle-btn-text">
          {ct('appActionMarkdownOutputToggle')}
        </span>
      </tp-yt-paper-toggle-button>
      <button
        styleName="toolbar-btn"
        type="button"
        title={ct('appActionClose')}
        onClick={onClose}
      >
        {ct('appActionClose')}
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
