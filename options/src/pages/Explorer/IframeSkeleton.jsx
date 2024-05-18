import PropTypes from 'prop-types';
import cn from 'classnames';

import _ from 'lodash';

const TAG_WIDTHS = ['w-56', 'w-64', 'w-80', 'w-96'];

const IframeSkeleton = ({ className }) => {
  return (
    <div className={cn('px-20 mx-auto mt-24 min-w-[1024px]', className)}>
      <div className="flex justify-between items-start">
        <div className="grow">
          <div className="skeleton w-full aspect-video" />
        </div>
        <div className="grow-0 ml-12 w-[420px]">
          <div className="px-2 mb-7">
            <div className="skeleton w-full h-[48px] mb-2" />
            <div className="skeleton w-48 h-4 mb-4" />
          </div>
          {_.range(0, 3).map(i => {
            return (
              <div
                key={i}
                className="card mb-6 border border-neutral-200 dark:border-neutral-600/50"
              >
                <div className="card-body">
                  <div className="card-title">
                    <div className="skeleton w-full h-12 mb-4" />
                  </div>
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
