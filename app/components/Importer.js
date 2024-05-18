import React from 'react';
import classNames from 'classnames';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';

import CSSModules from 'react-css-modules';

import LogoIcon from '_components/LogoIcon';

import is2017NewDesign from '_util/is2017NewDesign';
import { ct } from '_util/i18n';

import styles from './dialog.scss';

const placeholder = ct('appTextPlaceholderImport');

const Importer = ({ handleImportBtnClick, handleTextareaRef, onClose }) => (
  <div
    styleName="dialog"
    className={classNames({
      [styles['new-design']]: is2017NewDesign(),
    })}
  >
    <div styleName="heading">
      <LogoIcon /> {ct('appActionAddFromText')}
    </div>
    <div>
      <textarea
        ref={handleTextareaRef}
        styleName="textarea"
        placeholder={placeholder}
      />
    </div>
    <div styleName="toolbar">
      <button
        styleName="toolbar-btn"
        type="button"
        title={ct('appActionCancel')}
        onClick={onClose}
      >
        {ct('appActionCancel')}
      </button>
      <button
        styleName="toolbar-btn-primary"
        type="button"
        title={ct('appActionAdd')}
        onClick={handleImportBtnClick}
      >
        {ct('appActionAdd')}
      </button>
    </div>
  </div>
);

const addTextareaRef = compose(
  withState('textRef', 'setTextRef', null),
  withHandlers({
    handleTextareaRef:
      ({ setTextRef }) =>
      (ref) => {
        if (ref) {
          setTextRef(ref);
        }
      },
  })
);

const addHandlers = withHandlers({
  handleImportBtnClick:
    ({ onImport, textRef }) =>
    () => {
      onImport(textRef.value);
    },
});

export default compose(
  addTextareaRef,
  addHandlers
)(CSSModules(Importer, styles));
