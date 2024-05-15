import PropTypes from 'prop-types';
import cn from 'classnames';

const Page = ({ className, children, ...restProps }) => {
  return (
    <div className={cn('container mx-auto py-12', className)} {...restProps}>
      {children}
    </div>
  );
};

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Page;
