import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import _ from 'lodash';

import SetupTheme from './components/SetupTheme';
import YouTubeIframePlayer from './components/YouTubeIframePlayer';
import ExplorerVideoList from './components/ExplorerVideoList';
import ImportDataDropZone from './components/ImportDataDropZone';
import PlaybackInfo from './components/PlaybackInfo';
import Logo from './components/Logo';
import PlaybackCurrentTime from './components/PlaybackCurrentTime';

import { useMeasure } from 'react-use';

import { LINK } from './constants';

const THEME_CONFIG = {
  [SetupTheme.SCHEME.DARK]: 'dim',
  [SetupTheme.SCHEME.LIGHT]: 'light',
};

const EXTENSION_ID = 'dnglncgcgihledggdehmcbnkppanjohg';

const IN_IFRAME = window !== window.parent;
const STANDALONE_MODE = !IN_IFRAME;

function App() {
  const [data, setData] = useState(null);

  const handleDropZoneImport = useCallback(data => {
    setData(data);
  }, []);

  const dataList = useMemo(() => {
    if (!data) {
      return null;
    }

    const list = _.filter(
      _.keys(data).map(key => data[key]),
      d => d.tags.length > 0
    );

    return _.orderBy(
      list.map(d => {
        return {
          ...d,
          tags: _.orderBy(d.tags, 'seconds', 'asc'),
        };
      }),
      'info.lastUpdated',
      'desc'
    );
  }, [data]);

  useEffect(() => {
    window.parent.postMessage('yt-timetag explorer ready', '*');

    const handleMesage = evt => {
      if (evt.origin.indexOf(EXTENSION_ID) === -1) {
        return;
      }
      let json;
      try {
        json = JSON.parse(evt.data);
      } catch (e) {
        console.error(e);
      }
      if (json.source !== 'yt-timetag') {
        return;
      }
      setData(json.data);
    };
    window.addEventListener('message', handleMesage, false);
    return () => {
      window.removeEventListener('message', handleMesage, false);
    };
  }, []);

  const defaultVideoId = _.get(dataList, '[0].info.videoId', null);

  const [ref, { width: playerWidth }] = useMeasure();
  useLayoutEffect(() => {
    const playerElm = document.getElementById('explorer-player');
    if (playerElm) {
      playerElm.style.width = `${playerWidth}px`;
    }
  }, [playerWidth]);

  const renderContent = useCallback(
    ({ getDropRootProps } = {}) => {
      if (!dataList) {
        return null;
      }

      // if dropRootProps is provided, make top backdrop div also a drop zone for import file
      const dropRootProps = getDropRootProps ? getDropRootProps() : {};

      return (
        <YouTubeIframePlayer
          id="explorer-player"
          playerClassName="h-auto aspect-video fixed"
          defaultVideoId={defaultVideoId}
        >
          {({ renderPlayer }) => {
            return (
              <PlaybackInfo>
                {/* main content */}
                <div className="px-20 mx-auto mt-24 min-w-[1024px]">
                  <div className="flex justify-between items-start">
                    <div className="grow">
                      <div ref={ref} className="w-full aspect-video">
                        {renderPlayer({ style: { width: playerWidth } })}
                      </div>
                      <div
                        className="fixed text-right"
                        style={{ width: playerWidth }}
                      >
                        <PlaybackCurrentTime className="mt-1 font-mono text-2xl font-bold text-secondary" />
                      </div>
                    </div>
                    <div className="grow-0 ml-12 w-[420px]">
                      <ExplorerVideoList dataList={dataList} />
                    </div>
                  </div>
                </div>
                {/* top backdrop div */}
                <div
                  className="fixed top-0 w-full h-24 bg-base-100/80 backdrop-blur-sm"
                  {...dropRootProps}
                />
              </PlaybackInfo>
            );
          }}
        </YouTubeIframePlayer>
      );
    },
    [dataList, defaultVideoId, playerWidth, ref]
  );

  return (
    <>
      <SetupTheme config={THEME_CONFIG} />
      {STANDALONE_MODE ? (
        <ImportDataDropZone
          className="fixed top-0 w-full h-full"
          backgroundMode={!!dataList}
          onImport={handleDropZoneImport}
        >
          {({ isDragAccept, isDragReject, getRootProps }) => {
            return (
              <>
                {renderContent({ getDropRootProps: getRootProps })}
                <div
                  className={cn(
                    'fixed top-0 z-20 w-full h-full pointer-events-none',
                    {
                      hidden: !isDragAccept && !isDragReject,
                      'border-4 border-success bg-success/10': isDragAccept,
                      'border-4 border-error bg-error/10': isDragReject,
                    }
                  )}
                >
                  &nbsp;
                </div>
              </>
            );
          }}
        </ImportDataDropZone>
      ) : (
        <>{renderContent()}</>
      )}
      {STANDALONE_MODE && dataList && (
        <a
          href={LINK.GITHUB_REPOSITORY}
          target="_blank"
          className="fixed bottom-6 left-6 dark:opacity-70"
        >
          <Logo className="w-12 h-12" />
        </a>
      )}
    </>
  );
}
App.propTypes = {
  YT: PropTypes.object,
};

export default App;
