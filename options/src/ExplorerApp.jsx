import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import SetupTheme from './components/SetupTheme';
import YouTubeIframePlayer from './components/YouTubeIframePlayer';

const THEME_CONFIG = {
  [SetupTheme.SCHEME.DARK]: 'dim',
  [SetupTheme.SCHEME.LIGHT]: 'pastel',
};

function App() {
  useEffect(() => {
    console.log('@effect');
    window.parent.postMessage('ready', '*');
    window.addEventListener(
      'message',
      evt => {
        console.log('@message', evt.data);
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
        {({ playerElement }) => {
          return (
            <div className="container mx-auto mt-24">
              <div className="flex justify-between items-start">
                <div className="grow">{playerElement}</div>
                <div className="grow-0 ml-6 min-w-[400px]">
                  <div className="bg-red-400 h-[3000px]">test</div>
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
