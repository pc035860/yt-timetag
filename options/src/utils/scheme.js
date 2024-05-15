export const SCHEME = {
  DARK: 'dark',
  LIGHT: 'light',
};

export const getScheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return SCHEME.DARK;
  } else {
    return SCHEME.LIGHT;
  }
};
