/* global chrome */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import Page from '../../components/Page';

import useData from './useData';

const ExplorerPage = () => {
  const { data, loading, error } = useData();

  console.log('@data', data, loading, error);

  const iframeSrc = useMemo(() => {
    // return chrome.runtime.getURL('options/explorer.html');
    return 'http://localhost:5173/explorer';
  }, []);

  const iframeRef = useRef(null);
  useEffect(() => {
    if (iframeRef.current) {
      console.log('@send message');
      iframeRef.current.contentWindow.postMessage('hello', '*');
    }

    const handleMessage = evt => {
      if (evt.data === 'ready') {
        console.log('@ready');
        evt.source.postMessage(JSON.stringify(data), '*');
      } else if (evt.data.indexOf('height:') === 0) {
        const height = evt.data.split(':')[1];
        console.log('@height', height);
        iframeRef.current.style.height = `${height}px`;
      }
    };
    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, [data]);

  return (
    <iframe
      src={iframeSrc}
      ref={iframeRef}
      className="fixed w-full h-full top-0"
    />
  );
};

export default ExplorerPage;
