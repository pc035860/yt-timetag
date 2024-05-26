import PropTypes from 'prop-types';
import cn from 'classnames';

import { useTranslation } from 'react-i18next';

import { ct } from '../utils/i18n';

import logoSrc from '../assets/logo.svg';

import styles from './Logo.module.scss';

const Logo = ({ className }) => {
  const { t } = useTranslation();

  const extName = ct('extName');
  const alt = extName === 'extName' ? t('extName') : extName;

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={cn(styles.self, 'border-2 border-accent', className)}
    />
  );
};

Logo.propTypes = {
  className: PropTypes.string,
};

export default Logo;
