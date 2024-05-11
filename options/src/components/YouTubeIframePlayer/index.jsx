import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

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

const Inner = ({ id, YT, children, playerClassName, defaultVideoId }) => {
  const playerIdRef = useRef(id || _.uniqueId('yt-player-'));

  const renderPlayer = useCallback(
    ({ className, ...restProps }) => {
      return (
        <div
          id={playerIdRef.current}
          className={cn(playerClassName, className)}
          {...restProps}
        />
      );
    },
    [playerClassName]
  );

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
        playerVars: {
          rel: 0,
        },
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
      {children({ renderPlayer, getPlayer, player })}
    </Context.Provider>
  );
};

Inner.propTypes = {
  YT: PropTypes.shape({
    Player: PropTypes.func,
  }),
  id: PropTypes.string,
  children: PropTypes.func,
  playerClassName: PropTypes.string,
  defaultVideoId: PropTypes.string,
};

const YouTubeIframePlayer = loadYouTubeIframeApi(Inner);

export default YouTubeIframePlayer;
