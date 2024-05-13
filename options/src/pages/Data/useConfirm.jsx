import { useCallback, useRef, useState } from 'react';

import _ from 'lodash';
import pDefer from 'p-defer';

import ConfirmModal from './ConfirmModal';

import { ct } from '../../utils/i18n';

const defaultConfig = {
  title: '',
  message: '',
  confirmText: ct('optionsConfirm'),
  cancelText: ct('optionsCancel'),
  passphrase: '',
};

export default function useConfirm() {
  const modalId = useRef(_.uniqueId('alert-'));

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [passphrase, setPassphrase] = useState('');

  const dfdRef = useRef(null);

  const close = useCallback(() => {
    const dialog = document.getElementById(modalId.current);
    if (dialog) {
      dialog.close();
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (dfdRef.current) {
      dfdRef.current.resolve(true);
    }
    close();
  }, [close]);
  const handleCancel = useCallback(() => {
    if (dfdRef.current) {
      dfdRef.current.resolve(false);
    }
    close();
  }, [close]);

  const render = useCallback(() => {
    return (
      <ConfirmModal
        id={modalId.current}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        passphrase={passphrase}
      />
    );
  }, [
    cancelText,
    confirmText,
    handleCancel,
    handleConfirm,
    message,
    passphrase,
    title,
  ]);

  const open = useCallback((optConfig = {}) => {
    const config = { ...defaultConfig, ...optConfig };

    setTitle(config.title);
    setMessage(config.message);
    setConfirmText(config.confirmText);
    setCancelText(config.cancelText);
    setPassphrase(config.passphrase);

    const dialog = document.getElementById(modalId.current);
    if (dialog) {
      dfdRef.current = pDefer();

      dialog.showModal();
    }

    return dfdRef.current.promise;
  }, []);

  return {
    render,

    open,
    close,
  };
}
