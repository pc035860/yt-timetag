import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import SetupTheme from './components/SetupTheme';
import YouTubeIframePlayer from './components/YouTubeIframePlayer';

const THEME_CONFIG = {
  [SetupTheme.SCHEME.DARK]: 'dim',
  [SetupTheme.SCHEME.LIGHT]: 'pastel',
};

const EXTENSION_ID = 'dnglncgcgihledggdehmcbnkppanjohg';

const EMPTY_PAIRS = [];

function App() {
  const [data, setData] = useState(null);

  const dataList = useMemo(() => {
    if (!data) {
      return EMPTY_PAIRS;
    }

    const list = _.keys(data).map(key => data[key]);

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

  return (
    <>
      <SetupTheme config={THEME_CONFIG} />
      <YouTubeIframePlayer
        playerClassName="w-full h-auto aspect-video"
        defaultVideoId={defaultVideoId}
      >
        {({ playerElement, player }) => {
          const load = (videoId, seconds) => {
            player.loadVideoById(videoId, seconds);
          };
          return (
            <div className="container mx-auto mt-24">
              <div className="flex justify-between items-start">
                <div className="grow">{playerElement}</div>
                <div className="grow-0 ml-8 w-[400px] h-[3000px]">
                  <div>
                    {dataList.map(d => {
                      const { info, tags } = d;
                      const key = info.videoId;
                      return (
                        <div key={key} className="mb-4">
                          <div className="card border border-accent shadow-md dark:shadow-lg">
                            <div className="card-body">
                              <h2 className="card-title">{info.title}</h2>
                              <div className="mt-4">
                                <ul>
                                  {tags.map(tag => {
                                    const { id, seconds, description } = tag;
                                    return (
                                      <li key={id} className="mb-2">
                                        <a
                                          href=""
                                          onClick={evt => {
                                            evt.preventDefault();
                                            load(info.videoId, seconds);
                                          }}
                                        >
                                          <span className="font-bold">
                                            {seconds}
                                          </span>
                                          <span className="ml-2">
                                            {description}
                                          </span>
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
