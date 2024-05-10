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

function App() {
  const [data, setData] = useState(null);

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

    // requestInterval(16, () => {
    //   window.parent.postMessage(`height:${document.body.scrollHeight}`, '*');
    // });
  }, []);

  return (
    <>
      <SetupTheme config={THEME_CONFIG} />
      <YouTubeIframePlayer playerClassName="w-full h-auto aspect-video">
        {({ playerElement, getPlayer }) => {
          const load = (videoId, seconds) => {
            getPlayer().then(player => {
              player.loadVideoById(videoId, seconds);
            });
          };
          return (
            <div className="container mx-auto mt-24">
              <div className="flex justify-between items-start">
                <div className="grow">{playerElement}</div>
                <div className="grow-0 ml-6 w-[400px] h-[3000px]">
                  <div>
                    {_.keys(data).map(key => {
                      const d = data[key];
                      const { info, tags } = d;
                      return (
                        <div key={key} className="mb-4">
                          <h2 className="text-xl font-bold">{info.title}</h2>
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
