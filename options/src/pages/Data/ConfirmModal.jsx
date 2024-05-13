import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const defaultProps = {
  onConfirm: () => null,
  onCancel: () => null,
};
const ConfirmModal = ({
  id,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm = defaultProps.onConfirm,
  onCancel = defaultProps.onCancel,
  passphrase,
}) => {
  const [value, setValue] = useState('');
  const handleInputChange = useCallback(event => {
    setValue(event.target.value);
  }, []);
  const pass = useMemo(() => {
    if (!passphrase) return true;
    return value === passphrase;
  }, [passphrase, value]);

  const handleConfirmBtnClick = useCallback(() => {
    onConfirm();
    setTimeout(() => {
      setValue('');
    }, 200);
  }, [onConfirm]);
  const handleCancelBtnClick = useCallback(() => {
    onCancel();
    setTimeout(() => {
      setValue('');
    }, 200);
  }, [onCancel]);
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        <p className="py-4 text-sm">{message}</p>
        {passphrase && (
          <div>
            <p className="text-sm">
              請在下方輸入{' '}
              <strong className="text-warning">{passphrase}</strong> 以確認
            </p>
            <div>
              <input
                type="text"
                className={cn(
                  'input input-bordered input-sm w-full max-w-[200px]',
                  'mt-2'
                )}
                placeholder="請輸入確認詞"
                value={value}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
        <form method="dialog">
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm" onClick={handleCancelBtnClick}>
              {cancelText}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleConfirmBtnClick}
              disabled={!pass}
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

ConfirmModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  passphrase: PropTypes.string,
};

export default ConfirmModal;
