import PropTypes from 'prop-types';
import cn from 'classnames';

import { ct } from '../utils/i18n';

import logoSrc from '../assets/logo.svg';

import styles from './Logo.module.scss';

const Logo = ({ className }) => {
  return (
    <img
      src={logoSrc}
      alt={ct('extName')}
      className={cn(styles.self, 'border-2 border-accent', className)}
    />
  );
};

Logo.propTypes = {
  className: PropTypes.string,
};

export default Logo;
