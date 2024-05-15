import PropTypes from 'prop-types';
import cn from 'classnames';

const Row = ({ buttonSlot, description, className }) => {
  return (
    <div className={cn('flex justify-start items-center', className)}>
      <div className="min-w-[150px]">{buttonSlot}</div>
      <div className="ml-6 flex-grow">
        <div className="text-sm">{description}</div>
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
