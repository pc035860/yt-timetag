import PropTypes from 'prop-types';
import cn from 'classnames';

const Row = ({ buttonSlot, description, className }) => {
  return (
    <div className={cn('flex justify-start items-center', className)}>
      <div>{buttonSlot}</div>
      <div className="ml-4 flex-grow">
        <div className="alert">{description}</div>
      </div>
    </div>
  );
};

Row.propTypes = {
  className: PropTypes.string,
  buttonSlot: PropTypes.node,
  description: PropTypes.node,
};

export default Row;
