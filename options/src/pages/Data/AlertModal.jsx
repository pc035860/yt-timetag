import PropTypes from 'prop-types';

const AlertModal = ({ id, title, message }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

AlertModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
};

export default AlertModal;
