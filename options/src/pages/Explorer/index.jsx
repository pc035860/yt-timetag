/* global chrome */

import { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import IframeSkeleton from './IframeSkeleton';

import useData from './useData';

import { LINK } from '../../constants';

const ExplorerPage = () => {
  const { data } = useData();

  const iframeSrc = useMemo(() => {
    const uiLanguage = chrome.i18n.getUILanguage();
    return `${LINK.EXPLORER}?lng=${uiLanguage}`;
  }, []);

  const [isIframeReady, setIsIframeReady] = useState(false);
  const iframeRef = useRef(null);
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage('hello', '*');
    }

    const handleMessage = evt => {
      if (evt.data === 'yt-timetag explorer ready') {
        evt.source.postMessage(
          JSON.stringify({
            source: 'yt-timetag',
            data,
          }),
          '*'
        );
        setIsIframeReady(true);
      }
    };
    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, [data]);

  return (
    <>
      <iframe
        src={iframeSrc}
        ref={iframeRef}
        className={cn('fixed w-full h-full top-0', {
          hidden: !isIframeReady,
        })}
      />
      {!isIframeReady && (
        <div className="fixed w-full top-0">
          <IframeSkeleton />
        </div>
      )}
    </>
  );
};

export default ExplorerPage;
