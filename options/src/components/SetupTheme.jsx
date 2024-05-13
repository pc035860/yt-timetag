import { useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { SCHEME, getScheme } from '../utils/scheme';

const SetupTheme = ({ config: themeConfig = {} }) => {
  const updateTheme = useCallback(
    scheme => {
      const theme = themeConfig[scheme];
      document.documentElement.setAttribute('data-theme', theme);
    },
    [themeConfig]
  );

  // modify data attribute on <html> element to reflect current color scheme
  useLayoutEffect(() => {
    const scheme = getScheme();
    updateTheme(scheme);

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        const nextScheme = event.matches ? SCHEME.DARK : SCHEME.LIGHT;
        updateTheme(nextScheme);
      });
  }, [updateTheme]);

  return null;
};

SetupTheme.propTypes = {
  config: PropTypes.object,
};

SetupTheme.SCHEME = SCHEME;

export default SetupTheme;
