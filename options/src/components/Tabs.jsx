import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link, useRoute } from 'wouter';
import { ct } from '../utils/i18n';

const Tabs = ({ className }) => {
  const [isExplorer] = useRoute('/explorer');
  const [isShortcuts] = useRoute('/shortcuts');
  const [isData] = useRoute('/data');
  const [isAbout] = useRoute('/about');

  return (
    <div role="tablist" className={cx('tabs tabs-bordered', className)}>
      <Link
        role="tab"
        className={cx('tab', {
          'tab-active': isExplorer,
        })}
        asChild
        href="/explorer"
      >
        {ct('optionsExplorerTab')}
      </Link>
      <Link
        role="tab"
        className={cx('tab', {
          'tab-active': isShortcuts,
        })}
        asChild
        href="/shortcuts"
      >
        {ct('optionsShortcutsTab')}
      </Link>
      <Link
        role="tab"
        className={cx('tab', {
          'tab-active': isData,
        })}
        asChild
        href="/data"
      >
        {ct('optionsDataTab')}
      </Link>
      <Link
        role="tab"
        className={cx('tab', {
          'tab-active': isAbout,
        })}
        asChild
        href="/about"
      >
        {ct('optionsAboutTab')}
      </Link>
    </div>
  );
};

Tabs.propTypes = {
  className: PropTypes.string,
};

export default Tabs;
