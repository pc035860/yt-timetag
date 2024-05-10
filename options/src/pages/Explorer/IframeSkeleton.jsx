import PropTypes from 'prop-types';
import cn from 'classnames';

import _ from 'lodash';

const TAG_WIDTHS = ['w-56', 'w-64', 'w-80', 'w-96'];

const IframeSkeleton = ({ className }) => {
  return (
    <div className={cn('container mx-auto mt-24', className)}>
      <div className="flex justify-between items-start">
        <div className="grow">
          <div className="skeleton w-full aspect-video" />
        </div>
        <div className="grow-0 ml-8 w-[400px]">
          {_.range(0, 3).map(i => {
            return (
              <div key={i} className="mb-12">
                <div className="skeleton w-full h-12 mb-4" />
                {_.range(0, _.random(3, 5)).map(j => {
                  const widthClassName =
                    TAG_WIDTHS[_.random(0, TAG_WIDTHS.length)];
                  return (
                    <div
                      key={j}
                      className={cn('skeleton h-6 my-1', widthClassName)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

IframeSkeleton.propTypes = {
  className: PropTypes.string,
};

export default IframeSkeleton;
