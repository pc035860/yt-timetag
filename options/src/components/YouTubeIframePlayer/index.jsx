import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import pDefer from 'p-defer';
import makeAsyncScript from 'react-async-script';

import Context from './Context';
import useLazyRef from '../../hooks/useLazyRef';

const loadYouTubeIframeApi = makeAsyncScript(
  'https://www.youtube.com/iframe_api',
  {
    callbackName: 'onYouTubeIframeAPIReady',
    globalName: 'YT',
  }
);

const Inner = ({ YT, children, playerClassName }) => {
  console.log('@yt', YT);

  const playerIdRef = useRef(_.uniqueId('yt-player-'));

  const cPlayer = <div id={playerIdRef.current} className={playerClassName} />;

  const playerDfdRef = useLazyRef(() => pDefer());
  const getPlayer = useCallback(() => {
    return playerDfdRef.current.promise;
  }, [playerDfdRef]);

  const value = useMemo(() => {
    return {
      YT,
      getPlayer,
    };
  }, [YT, getPlayer]);

  useEffect(() => {
    if (YT) {
      const buf = new YT.Player(playerIdRef.current, {
        videoId: 'P8jxA9t4nfQ',
        events: {
          onReady: () => {
            playerDfdRef.current.resolve(buf);
          },
        },
      });
    }
  }, [YT, playerDfdRef]);

  return (
    <Context.Provider value={value}>
      {children({ playerElement: cPlayer })}
    </Context.Provider>
  );
};

Inner.propTypes = {
  YT: PropTypes.shape({
    Player: PropTypes.func,
  }),
  children: PropTypes.func,
  playerClassName: PropTypes.string,
};

const YouTubeIframePlayer = loadYouTubeIframeApi(Inner);

export default YouTubeIframePlayer;
