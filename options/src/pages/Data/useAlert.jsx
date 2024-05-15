import { useCallback, useRef, useState } from 'react';
import _ from 'lodash';
import AlertModal from './AlertModal';

export default function useAlert() {
  const modalId = useRef(_.uniqueId('alert-'));

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const render = useCallback(() => {
    return <AlertModal id={modalId.current} title={title} message={message} />;
  }, [message, title]);

  const open = useCallback(({ title, message } = {}) => {
    setTitle(title);
    setMessage(message);

    const dialog = document.getElementById(modalId.current);
    if (dialog) {
      dialog.showModal();
    }
  }, []);

  const close = useCallback(() => {
    const dialog = document.getElementById(modalId.current);
    if (dialog) {
      dialog.close();
    }
  }, []);

  return {
    render,

    open,
    close,
  };
}
