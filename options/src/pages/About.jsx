import PropTypes from 'prop-types';
import cn from 'classnames';

import Page from '../components/Page';

import { t } from '../utils/i18n';

import logoSrc from '../assets/logo.svg';
import chromeLogoSrc from '../assets/browser_logos/chrome.svg';
import firefoxLogoSrc from '../assets/browser_logos/firefox.svg';
import githubLogoWhiteSrc from '../assets/github-mark-white.svg';
import githubLogoSrc from '../assets/github-mark.svg';

import pkg from '../../package.json';
import styles from './About.module.scss';

const LINKS = [
  [
    <>
      <img src={chromeLogoSrc} alt="Chrome" className="w-4 h-4" />
      <span>Chrome Web Store</span>
    </>,
    'https://chrome.google.com/webstore/detail/hpbmedimnlknflpbgfbllklgelbnelef',
  ],
  [
    <>
      <img src={firefoxLogoSrc} alt="Firefox" className="w-4 h-4" />
      <span>Firefox Add-ons</span>
    </>,
    'https://addons.mozilla.org/firefox/addon/timetags-for-youtube/',
  ],
];

const OutboundLink = ({ className, children, ...restProps }) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn('btn btn-sm btn-outline', className)}
      {...restProps}
    >
      {children}
    </a>
  );
};
OutboundLink.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const AboutPage = () => {
  const version = pkg.version;

  return (
    <Page className="text-sm text-center">
      <figure className="mb-6">
        <img
          src={logoSrc}
          alt={t('extName')}
          className={cn(
            'mx-auto max-w-[60px] border-2 border-accent',
            styles.logo
          )}
        />
      </figure>
      <h2 className="text-lg font-bold mb-2">{t('extName')}</h2>
      <p>{t('optionsAboutVersion', [version])}</p>
      <div className="flex flex-col justify-around items-center mx-auto mt-6">
        {LINKS.map(([text, href], index) => (
          <OutboundLink key={href} href={href} className="my-2">
            {text}
          </OutboundLink>
        ))}
        <div className="mt-6">
          {/* link for light scheme */}
          <OutboundLink
            href="https://github.com/pc035860/yt-timetag"
            className="dark:hidden"
          >
            <img src={githubLogoSrc} alt="GitHub" className="w-4 h-4" />
            <span>GitHub</span>
          </OutboundLink>
          {/* link for dark scheme */}
          <OutboundLink
            href="https://github.com/pc035860/yt-timetag"
            className="hidden dark:inline-flex"
          >
            <img src={githubLogoWhiteSrc} alt="GitHub" className="w-4 h-4" />
            <span>GitHub</span>
          </OutboundLink>
        </div>
      </div>
      <div className="mt-12">
        © 2016-{new Date().getFullYear()}{' '}
        <a href="https://github.com/pc035860" target="_blank">
          Chih-Hsuan Fan
        </a>
      </div>
    </Page>
  );
};

AboutPage.propTypes = {};

export default AboutPage;
