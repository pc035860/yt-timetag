import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link, useRoute } from 'wouter';

const Tabs = ({ className }) => {
  const [isExplorer] = useRoute('/explorer');
  const [isData] = useRoute('/data');
  const [isAbout] = useRoute('/about');

  return (
    <div
      role="tablist"
      className={cx('tabs tabs-bordered mx-auto max-w-2xl', className)}
    >
      {/* <Link
        role="tab"
        className={cx('tab', {
          'tab-active': isExplorer,
        })}
        asChild
        href="/explorer"
      >
        Explorer
      </Link> */}
      <Link
        role="tab"
        className={cx('tab', {
          'tab-active': isData,
        })}
        asChild
        href="/data"
      >
        Data
      </Link>
      <Link
        role="tab"
        className={cx('tab', {
          'tab-active': isAbout,
        })}
        asChild
        href="/about"
      >
        About
      </Link>
    </div>
  );
};

Tabs.propTypes = {
  className: PropTypes.string,
};

export default Tabs;
