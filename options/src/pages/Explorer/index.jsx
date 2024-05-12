import { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import IframeSkeleton from './IframeSkeleton';

import useData from './useData';

const ExplorerPage = () => {
  const { data, loading, error } = useData();

  console.log('@data', data, loading, error);

  const iframeSrc = useMemo(() => {
    return 'https://cloud.pymaster.tw/yt-timetag-explorer/';
  }, []);

  const [isIframeReady, setIsIframeReady] = useState(false);
  const iframeRef = useRef(null);
  useEffect(() => {
    if (iframeRef.current) {
      console.log('@send message');
      iframeRef.current.contentWindow.postMessage('hello', '*');
    }

    const handleMessage = evt => {
      console.log('@message out', evt.data);
      if (evt.data === 'yt-timetag explorer ready') {
        console.log('@post data');
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
