import React from 'react';
import classNames from 'classnames';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';

import CSSModules from 'react-css-modules';
import styles from './Importer.scss';

import LogoIcon from '_components/LogoIcon';
import is2017NewDesign from '_util/is2017NewDesign';

const placeholder = `Example:

00:01 This is an apple
13:03 There is a tree
11:25 My name is Jhon
`;

const Importer = ({ handleImportBtnClick, handleTextareaRef, onClose }) => (
  <div
    styleName="importer"
    className={classNames({
      [styles['new-design']]: is2017NewDesign()
    })}
  >
    <div styleName="heading">
      <LogoIcon /> Import from text
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
        title="Cancel"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        styleName="toolbar-btn-primary"
        type="button"
        title="Import"
        onClick={handleImportBtnClick}
      >
        Import
      </button>
    </div>
  </div>
);

const addTextareaRef = compose(
  withState('textRef', 'setTextRef', null),
  withHandlers({
    handleTextareaRef: ({ setTextRef }) => ref => {
      if (ref) {
        setTextRef(ref);
      }
    }
  })
);

const addHandlers = withHandlers({
  handleImportBtnClick: ({ onImport, textRef }) => () => {
    onImport(textRef.value);
  }
});

export default compose(addTextareaRef, addHandlers)(
  CSSModules(Importer, styles)
);
