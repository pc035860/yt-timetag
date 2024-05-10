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
import enhancePlayer from './enhancePlayer';

const loadYouTubeIframeApi = makeAsyncScript(
  'https://www.youtube.com/iframe_api',
  {
    callbackName: 'onYouTubeIframeAPIReady',
    globalName: 'YT',
  }
);

const Inner = ({ YT, children, playerClassName, defaultVideoId }) => {
  const playerIdRef = useRef(_.uniqueId('yt-player-'));

  const cPlayer = <div id={playerIdRef.current} className={playerClassName} />;

  const playerDfdRef = useLazyRef(() => pDefer());
  const getPlayer = useCallback(() => {
    return playerDfdRef.current.promise;
  }, [playerDfdRef]);
  const [player, setPlayer] = useState(null);

  const value = useMemo(() => {
    return {
      YT,
      getPlayer,
      player,
    };
  }, [YT, getPlayer, player]);

  useEffect(() => {
    if (YT) {
      playerDfdRef.current = pDefer();
      const buf = new YT.Player(playerIdRef.current, {
        videoId: defaultVideoId,
        events: {
          onReady: () => {
            const nextPlayer = enhancePlayer(buf);
            setPlayer(nextPlayer);
            playerDfdRef.current.resolve(nextPlayer);
          },
        },
      });
    }
  }, [YT, defaultVideoId, playerDfdRef]);

  return (
    <Context.Provider value={value}>
      {children({ playerElement: cPlayer, getPlayer, player })}
    </Context.Provider>
  );
};

Inner.propTypes = {
  YT: PropTypes.shape({
    Player: PropTypes.func,
  }),
  children: PropTypes.func,
  playerClassName: PropTypes.string,
  defaultVideoId: PropTypes.string,
};

const YouTubeIframePlayer = loadYouTubeIframeApi(Inner);

export default YouTubeIframePlayer;
