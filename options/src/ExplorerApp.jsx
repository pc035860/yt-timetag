import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import SetupTheme from './components/SetupTheme';
import YouTubeIframePlayer from './components/YouTubeIframePlayer';
import ExplorerVideoList from './components/ExplorerVideoList';

import mockedData from './pages/Explorer/mockData.json';
import { useMeasure } from 'react-use';

const THEME_CONFIG = {
  [SetupTheme.SCHEME.DARK]: 'dim',
  [SetupTheme.SCHEME.LIGHT]: 'pastel',
};

const EXTENSION_ID = 'dnglncgcgihledggdehmcbnkppanjohg';

const EMPTY_PAIRS = [];

function App() {
  const [data, setData] = useState(mockedData);

  const dataList = useMemo(() => {
    if (!data) {
      return EMPTY_PAIRS;
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

  console.log('@dataList', dataList);

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
      <YouTubeIframePlayer
        id="explorer-player"
        playerClassName="h-auto aspect-video fixed"
        defaultVideoId={defaultVideoId}
      >
        {({ renderPlayer }) => {
          return (
            <div className="container mx-auto mt-24 min-w-[1024px]">
              <div className="flex justify-between items-start">
                <div className="grow">
                  <div ref={ref} className="w-full aspect-video">
                    {renderPlayer({ style: { width: playerWidth } })}
                  </div>
                </div>
                <div className="grow-0 ml-8 w-[480px]">
                  <ExplorerVideoList dataList={dataList} />
                </div>
              </div>
            </div>
          );
        }}
      </YouTubeIframePlayer>
    </>
  );
}
App.propTypes = {
  YT: PropTypes.object,
};

export default App;
