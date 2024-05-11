import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import SetupTheme from './components/SetupTheme';
import YouTubeIframePlayer from './components/YouTubeIframePlayer';
import ExplorerVideoList from './components/ExplorerVideoList';
import ImportDataDropZone from './components/ImportDataDropZone';

import { useMeasure } from 'react-use';

import './fontAwesome';

const THEME_CONFIG = {
  [SetupTheme.SCHEME.DARK]: 'dim',
  [SetupTheme.SCHEME.LIGHT]: 'cupcake',
};

const EXTENSION_ID = 'dnglncgcgihledggdehmcbnkppanjohg';

const IN_IFRAME = window !== window.parent;

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
    window.addEventListener(
      'message',
      evt => {
        if (evt.origin.indexOf(EXTENSION_ID) === -1) {
          return;
        }
        console.log('@message in', evt.data);
        let json;
        try {
          json = JSON.parse(evt.data);
        } catch (e) {
          console.error(e);
        }
        console.log('@json', json);
        if (json.source !== 'yt-timetag') {
          return;
        }
        setData(json.data);
      },
      false
    );
  }, []);

  const defaultVideoId = _.get(dataList, '[0].info.videoId', null);

  const [ref, { width: playerWidth }] = useMeasure();
  useLayoutEffect(() => {
    const playerElm = document.getElementById('explorer-player');
    if (playerElm) {
      playerElm.style.width = `${playerWidth}px`;
    }
  }, [playerWidth]);

  return (
    <>
      <SetupTheme config={THEME_CONFIG} />
      <ImportDataDropZone
        className="fixed top-0 w-full h-full"
        onImport={handleDropZoneImport}
      />
      {(IN_IFRAME || dataList) && (
        <YouTubeIframePlayer
          id="explorer-player"
          playerClassName="h-auto aspect-video fixed"
          defaultVideoId={defaultVideoId}
        >
          {({ renderPlayer }) => {
            return (
              <>
                {/* top backdrop div */}
                <div className="fixed top-0 z-10 w-full h-24 bg-base-100/80 backdrop-blur-sm" />
                {/* main content */}
                <div className="container mx-auto mt-24 min-w-[1024px]">
                  <div className="flex justify-between items-start">
                    <div className="grow">
                      <div ref={ref} className="w-full aspect-video">
                        {renderPlayer({ style: { width: playerWidth } })}
                      </div>
                    </div>
                    <div className="grow-0 ml-8 w-[420px]">
                      <ExplorerVideoList dataList={dataList} />
                    </div>
                  </div>
                </div>
              </>
            );
          }}
        </YouTubeIframePlayer>
      )}
    </>
  );
}
App.propTypes = {
  YT: PropTypes.object,
};

export default App;
